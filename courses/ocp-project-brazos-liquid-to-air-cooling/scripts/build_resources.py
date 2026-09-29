#!/usr/bin/env python3
"""Stage the exact cited PDF and local fonts; verify the paired video narration.

Set BRAZOS_SPEC_PATH to the reviewed v0.75.4 PDF. Research PDFs are not in Git.
"""
from pathlib import Path
import hashlib
import json
import os
import shutil
import sys

SOURCE = Path(__file__).resolve().parents[1]
SPEC_SHA256 = "ae0f339816a6fbe416d1b6478bfe434216805b39081eb0b292c406a2af5cfbfb"


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    destination = Path(sys.argv[1]).resolve().parent
    spec = destination / "resources/brazos_spec_v0_75_4.pdf"
    supplied = Path(os.environ.get("BRAZOS_SPEC_PATH") or spec).expanduser()
    if not supplied.is_file():
        raise SystemExit(
            "Set BRAZOS_SPEC_PATH to the reviewed OCP Project Brazos v0.75.4 PDF. "
            "Its public source URL is recorded in course.json and README.md."
        )
    if digest(supplied) != SPEC_SHA256:
        raise SystemExit("BRAZOS_SPEC_PATH does not match the reviewed v0.75.4 PDF; verify the edition before changing page links.")

    for board in json.loads((SOURCE / "animations/storyboards.json").read_text()):
        audio = destination / board["narration_wav"]
        if not audio.exists() and os.environ.get("SKIP_AUDIO") == "1":
            continue
        if not audio.is_file() or digest(audio) != board["narration_sha256"]:
            raise SystemExit(
                f"{board['asset']}: audio differs from the measured video narration. "
                "Use the approved EXISTING_AUDIO_DIR, or regenerate chaptered narration "
                "and videos as described in animations/README.md."
            )

    spec.parent.mkdir(parents=True, exist_ok=True)
    if supplied.resolve() != spec.resolve():
        shutil.copy2(supplied, spec)
    shutil.copytree(SOURCE / "assets", destination / "assets", dirs_exist_ok=True)
    shutil.copy2(SOURCE / "thumbnail.png", destination / "thumbnail.png")
    print("Staged verified Brazos v0.75.4 PDF and licensed fonts; paired video narration matches.")


if __name__ == "__main__":
    main()
