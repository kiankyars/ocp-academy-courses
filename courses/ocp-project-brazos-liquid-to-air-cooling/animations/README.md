# Narration-synchronized Brazos media

Four finite sequences explain heat flow, fan airflow/power tradeoffs, service interlocks, and control states. Every video follows the paired narration clock, shares playback/seek/rate/enlarged-view controls, and holds its final state. Reduced motion initially shows the conclusion until explicitly started.

`storyboards.json` records the exact measured chapter times, narration text, duration, and WAV SHA-256. `engine.js` renders a deterministic SVG at any time; `prepare_previews.py` refreshes the four HTML previews. M1S4 includes continuous coolant markers, air streaks, and fan rotation; its final second holds still. Marker speeds and spacing are illustrative.

After regenerating chaptered narration with `../scripts/generate_narration.py`, refresh and export:

```bash
python3 animations/prepare_previews.py
node animations/render_videos.cjs heat_path
```

Run from this course folder in a Node environment with Playwright, Chromium, and ffmpeg. Omit the asset argument to export all four. Optional environment settings: `NODE_PATH`, `CHROMIUM_PATH`, `FFMPEG_BIN`, and `VIDEO_QA_DIR`. Export checks the WAV digest against the storyboard before encoding. The result is silent H.264, 2880×1350, 24 fps, from lossless PNG frames, and within one frame of measured narration.

Inspect decoded start, quarter, half, three-quarter, final, and transition-adjacent frames, then scrub the full video. Check within-scene motion, final hold, pause, replay, seeking, speed, enlarged view, and reduced motion in the built player over a range-enabled HTTP server. Review text at native resolution; update `figure.text_inventory` and its final media digest only after visual review. Run source QA and package validation before packaging.

Narration, generated frame evidence, and exports of the learner pages are build artifacts. Only the reviewed course-owned videos and posters belong in source control.
