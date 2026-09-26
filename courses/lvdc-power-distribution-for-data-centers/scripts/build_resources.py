#!/usr/bin/env python3
"""Stage editable resource templates, local fonts and the exact cited paper.
Set LVDC_PAPER_PATH to the supplied v1.1.0 PDF. Original research is not in Git.
"""
import hashlib
import os
from pathlib import Path
import shutil
import sys

SOURCE = Path(__file__).resolve().parents[1]
PAPER_SHA256 = 'bf540bad775551dc48c8119f2a23eea193a3ec4e4bf45576b7bf369337326c07'

def main():
    destination = Path(sys.argv[1]).resolve().parent
    resources = destination / 'resources'
    resources.mkdir(parents=True, exist_ok=True)
    paper = resources / 'lvdc_whitepaper_v1_1_0.pdf'
    supplied = Path(os.environ.get('LVDC_PAPER_PATH') or paper)
    if not supplied.is_file():
        raise SystemExit('Set LVDC_PAPER_PATH to DCF Power Distribution LVDC white paper version 1.1.0.pdf before building; page references require this exact edition.')
    if hashlib.sha256(supplied.read_bytes()).hexdigest() != PAPER_SHA256:
        raise SystemExit('LVDC_PAPER_PATH does not match the reviewed v1.1.0 PDF; verify the edition before changing page references.')
    if supplied.resolve() != paper.resolve():
        shutil.copy2(supplied, paper)
    for template in (SOURCE / 'resources/templates').glob('*.html.template'):
        (resources / template.name.removesuffix('.template')).write_text(template.read_text(encoding='utf-8'), encoding='utf-8')
    for font in (SOURCE / 'resources').glob('*.woff'):
        shutil.copy2(font, resources / font.name)
    shutil.copytree(SOURCE / 'assets', destination / 'assets', dirs_exist_ok=True)
    shutil.copy2(SOURCE / 'thumbnail.png', destination / 'thumbnail.png')
    print('Staged LVDC resources, licensed local fonts and verified v1.1.0 paper.')

if __name__ == '__main__':
    main()
