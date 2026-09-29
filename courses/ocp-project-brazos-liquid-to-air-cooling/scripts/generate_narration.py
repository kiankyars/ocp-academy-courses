"""Generate the approved Leo v2 narration; never store the credential.

Run with --credential-file PATH, --keychain-service NAME, an existing
ELEVENLABS_API_KEY environment variable, or an interactive hidden prompt.
No course rendering or ZIP creation is performed here.
"""
from pathlib import Path
import argparse, getpass, hashlib, json, os, re, subprocess, sys, wave

OUT = Path(__file__).resolve().parents[1]
REPO = Path(__file__).resolve().parents[3]
WORK = REPO / 'build' / 'brazos-production' / 'narration'
SKILL = Path(os.environ.get('ACADEMY_WIZARD_SKILL_DIR', REPO / 'skills' / 'academy-wizard')) / 'scripts'
sys.path.insert(0, str(SKILL))
from gen_audio import synth_elevenlabs
from elevenlabs_model_support import validate_model_language, primary_language_code


def script_body(path):
    return '\n'.join(x for x in path.read_text().splitlines()
                     if not x.lstrip().startswith('#')).strip()


def read_credential(args):
    if args.credential_file:
        raw = Path(args.credential_file).expanduser().read_text().strip()
        if raw.startswith('{'):
            data = json.loads(raw)
            raw = data.get('ELEVENLABS_API_KEY') or data.get('api_key') or ''
        elif '\n' in raw or raw.startswith(('ELEVENLABS_API_KEY=', 'export ')):
            match = re.search(r'(?m)^(?:export\s+)?ELEVENLABS_API_KEY\s*=\s*(.+)$', raw)
            if not match:
                raise ValueError('Credential file has no ELEVENLABS_API_KEY assignment.')
            raw = match.group(1).strip().strip('"\'')
        return raw
    if args.keychain_service:
        return subprocess.check_output(
            ['security', 'find-generic-password', '-s', args.keychain_service, '-w'],
            text=True, stderr=subprocess.DEVNULL).strip()
    return os.environ.get('ELEVENLABS_API_KEY') or getpass.getpass('ElevenLabs credential (not retained): ')


def atomic_json(path, data):
    temp = path.with_suffix(path.suffix + '.pending')
    temp.write_text(json.dumps(data, indent=2, ensure_ascii=False) + '\n')
    temp.replace(path)


def signature(text, settings):
    return hashlib.sha256(json.dumps({'text': text, 'settings': settings},
                                    sort_keys=True).encode()).hexdigest()


def synth_cached(text, target, settings, language):
    target.parent.mkdir(parents=True, exist_ok=True)
    stamp = target.with_suffix('.sha256')
    digest = signature(text, settings)
    if target.exists() and stamp.exists() and stamp.read_text() == digest:
        return
    if target.exists():
        raise RuntimeError(f'Existing narration differs from script/settings: {target.name}. Review before replacing.')
    temp = target.with_suffix('.pending.wav')
    synth_elevenlabs(text, temp, settings['voice_id'], settings['model_id'],
                    language, settings['speed'])
    with wave.open(str(temp)) as w:
        assert w.getnchannels() == 1 and w.getsampwidth() == 2 and w.getframerate() == 22050
        assert w.getnframes() > 1000, 'Empty narration response'
    temp.replace(target)
    stamp.write_text(digest)


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    group = ap.add_mutually_exclusive_group()
    group.add_argument('--credential-file')
    group.add_argument('--keychain-service')
    ap.add_argument('--module', type=int, choices=range(1, 5))
    ap.add_argument('--preflight', action='store_true', help='Check inputs without reading a key or calling TTS')
    args = ap.parse_args()
    c = json.loads((OUT / 'course.json').read_text())
    board_path = OUT / 'animations/storyboards.json'
    boards = json.loads(board_path.read_text())
    by_slide = {(d['module'], d['slide']): d for d in boards}
    n = c['narration']
    assert n['engine'] == 'elevenlabs' and n['speed'] == 1.18
    assert n['voice_id'] == 'bbGtsRRKUfYO634UxSjz'
    slides = [(m['id'], s) for m in c['modules'] for s in m['slides']
              if not args.module or m['id'] == args.module]
    for module, slide in slides:
        audio = slide['audio']
        assert audio['approved'], f'M{module}S{slide["id"]}: script not approved'
        body = script_body(OUT / audio['script_file'])
        assert body
        board = by_slide.get((module, slide['id']))
        if board:
            assert ' '.join(body.split()) == ' '.join(
                ' '.join(ch['narration'] for ch in board['chapters']).split()), 'Storyboard/script mismatch'
    if args.preflight:
        print(f'PASS: {len(slides)} approved scripts; paired video scripts match; voice and speed preserved.')
        return
    os.environ['ELEVENLABS_API_KEY'] = read_credential(args)
    if not os.environ['ELEVENLABS_API_KEY']:
        raise RuntimeError('No narration credential supplied.')
    language = primary_language_code(c['language'])
    WORK.mkdir(parents=True, exist_ok=True)
    support = validate_model_language(n['model_id'], c['language'], api_key=os.environ['ELEVENLABS_API_KEY'])
    atomic_json(WORK / 'preflight.json', {'language': language, 'settings': n, 'validation_source': support})
    print('Model/language preflight passed.', flush=True)
    for module, slide in slides:
        target = OUT / slide['audio']['wav_file']
        board = by_slide.get((module, slide['id']))
        if board:
            chunks = WORK / board['asset']
            frames, cursor, rate = [], 0, 22050
            for i, chapter in enumerate(board['chapters']):
                clip = chunks / f'{i+1:02}.wav'
                synth_cached(chapter['narration'], clip, n, language)
                with wave.open(str(clip)) as w:
                    raw = w.readframes(w.getnframes())
                chapter['start'] = cursor / rate
                chapter['speech_duration'] = len(raw) / 2 / rate
                frames.append(raw)
                cursor += len(raw) // 2
                pause = .38 if i < len(board['chapters']) - 1 else .65
                silence = b'\0\0' * round(rate * pause)
                frames.append(silence)
                cursor += len(silence) // 2
                chapter['end'] = cursor / rate
                print(f'M{module}S{slide["id"]} scene {i+1}: {chapter["speech_duration"]:.2f}s', flush=True)
            temp = target.with_suffix('.pending.wav')
            with wave.open(str(temp), 'wb') as w:
                w.setnchannels(1); w.setsampwidth(2); w.setframerate(rate)
                w.writeframes(b''.join(frames))
            temp.replace(target)
            board['duration'] = cursor / rate
            board['narration_wav'] = slide['audio']['wav_file']
            board['narration_sha256'] = hashlib.sha256(target.read_bytes()).hexdigest()
            board['timing_status'] = 'Measured final narration; one finite pass'
            atomic_json(board_path, boards)
            atomic_json(chunks / 'timing.json', board)
        else:
            synth_cached(script_body(OUT / slide['audio']['script_file']), target, n, language)
        with wave.open(str(target)) as w:
            duration = w.getnframes() / w.getframerate()
        print(f'COMPLETE M{module}S{slide["id"]}: {duration:.2f}s', flush=True)
    os.environ.pop('ELEVENLABS_API_KEY', None)
    print('Narration generation finished. Audio quality review remains required.', flush=True)


if __name__ == '__main__':
    main()
