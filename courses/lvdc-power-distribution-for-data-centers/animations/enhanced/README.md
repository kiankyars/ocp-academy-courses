# Narration-synchronized LVDC videos

Nine finite technical sequences replace the original short loops. Module 9 uses `figures/evidence_matrix.svg` as a static worked comparison.

- `storyboards.json`: source pages, five scene narratives, measured chapter boundaries and total narration duration.
- `engine.js`: deterministic SVG diagrams and continuous illustrative quantities. `LVDCVideo.render(storyboard, seconds)` returns a complete frame.
- `../<asset>.html`: standalone authoring previews. Each declares its duration and exposes `renderAtTime(milliseconds)` for deterministic export.
- `render_videos.cjs`: lossless PNG sampling and high-quality H.264 export at 24 frames per second, 2880 × 1350. Unchanged frames are cached; the encoded video still has a constant frame rate. The exporter is adapted from the AcademyWizard animation recorder to support a deterministic SVG timeline.

Run from a Node environment with Playwright, Chromium and a full ffmpeg build:

```
node animations/enhanced/render_videos.cjs precharge
```

Optional environment settings: `NODE_PATH`, `CHROMIUM_PATH`, `FFMPEG_BIN`, `VIDEO_QA_DIR`. The defaults use Playwright’s installed Chromium and `ffmpeg` on PATH; set these variables for other locations.

The player uses `figure.sync_to_narration: true`, `autoplay: false`, `loop: false`, `muted: true`. Narration is the single audible track and master clock. Video controls also control narration. Reduced-motion presentation holds the static conclusion until the learner explicitly starts the narrated video.

For edits, update the paired narration TXT and the matching chapter text. Regenerate only the affected narration using the course’s recorded ElevenLabs voice, model and speed. Record the actual chapter boundaries, then re-export that video. Do not stretch audio to match an old animation duration. Update the figure’s reviewed text inventory and media hash before rebuilding.

Source precedence remains LVDC paper v1.1.0. Diagrams marked illustrative do not supply validated equipment ratings or installation procedures. The webinar materials are internal authoring inputs and are not learner references.
