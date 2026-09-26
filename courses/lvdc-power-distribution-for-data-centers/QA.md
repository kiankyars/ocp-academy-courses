# LVDC validation record

Validated 26 September 2026. This is local authoring and player evidence, not target-LMS acceptance.

## Player compatibility

The new finite-video mode requires the literal boolean `figure.sync_to_narration: true`. Missing or false flags retain the old player. New buffering, metadata, end-of-audio and enlarged-view synchronization handlers operate only on explicitly marked figures. In particular, old loops retain their previous behavior at narration end and their enlarged views remain independent.

- **720 assertions** compare the old event policy with the new player for unmarked and false-marked videos: looping/finite media, narration on/off, reduced motion, missing video and unknown duration. They also check the opted-in timing policy.
- **85 real-media browser assertions** pass across rebuilt SST, Open Data Center for AI, Grid Disturbance, High Bandwidth Flash and LVDC pages. These exercise real video and paired WAV files, narration-only slides, seek, speed, enlarged view, pause and completion. LVDC also covers replay and explicit reduced-motion playback.
- **12 additional LVDC playback checks** pass: review entry, video/footer controls, seeking, enlargement, end/replay, leaving/returning to the slide and reduced motion.
- **235 slide-resume, control and review-isolation assertions** pass, including local and mock-LMS bookmarks and separate module completion.
- **37 control assertions** and **82 quiz/resume assertions** pass in Chromium using isolated local/mock-SCORM state.
- **52 rendered layout checks** pass across 1440, 1366, 1280 and 390 pixel widths, with no overflow, alignment or runtime flags.
- **62 Python tests** pass for the maintained renderers, narration/video opt-in validation, home placement, portability, glossary, quiz, and SCORM compatibility helpers. The separate loop/finite seek regression passes.
- AcademyWizard skill validation passes. Its new workflow recommends synchronized video when the teaching benefits, requires recorded course/slide approval, and preserves legacy defaults and existing media on a rebuild.

Reproduction with Python, Node, Playwright and Chromium installed:

```sh
python3 -m unittest discover -s skills/academy-wizard/scripts -p 'test_*.py'
node skills/academy-wizard/scripts/test_video_seek.mjs
node skills/academy-wizard/scripts/test_video_playback_compatibility.mjs
node skills/academy-wizard/scripts/test_video_modes_browser.mjs synced build/lvdc-power-distribution-for-data-centers
# Use a rebuilt legacy package with its real media:
node skills/academy-wizard/scripts/test_video_modes_browser.mjs legacy /path/to/legacy-package
node skills/academy-wizard/scripts/test_slide_resume_browser.mjs build/lvdc-power-distribution-for-data-centers
node skills/academy-wizard/scripts/test_slide_controls_browser.mjs
node skills/academy-wizard/scripts/test_quiz_resume_browser.mjs build/lvdc-power-distribution-for-data-centers
```

## Content, media and packaging

The source audit passes with no flags, with the explicitly approved Module 9 static-video exception. It checks nine teaching videos and 36 glossary placements against slide text, narration and reviewed media inventories. Fifty teaching slides retain page-specific v1.1.0 paper references. The six companion Academy courses remain available in context and in the related-learning guide. The home resource list contains the external paper, related-learning guide and review worksheet.

The source rebuild reuses the reviewed 100 WAV files. The audio-tail report and package validation pass. Both the source build and refreshed editorial delivery produce 167-file SCORM ZIPs containing 100 WAVs and nine MP4s. Archive integrity, manifest coverage and byte-for-byte agreement with staged runtime files pass. Research materials, generated WAVs, rendered course pages and ZIPs are excluded from this source contribution; the exact paper is a verified local build dependency.

Earlier editorial media checks include all nine complete playback runs (maximum measured timing drift 0.061 seconds), all 45 source-scene geometry checks, encoded-frame comparisons, 100 narration-tail checks, and revised-clip transcription review. Videos are silent 2880 × 1350 H.264 at 24 fps; narration is the only audible track. This compatibility revision does not re-encode or regenerate media.

```sh
python3 skills/academy-wizard/scripts/slides_course_qa.py \
  courses/lvdc-power-distribution-for-data-centers/course.json \
  --repo-root . --allow-missing-module-video 9 --fail-on-flags
python3 skills/academy-wizard/scripts/audio_tail_report.py \
  build/lvdc-power-distribution-for-data-centers/course.json --fail-on-flags
python3 skills/academy-wizard/scripts/validate_package.py \
  build/lvdc-power-distribution-for-data-centers
```

## Remaining release check

SCORM 1.2 multi-SCO and syllabus entries are preserved. Test actual LMS launch, navigation, resume, quiz persistence and separate module completion before deployment. Local Chromium and mock-SCORM checks cannot establish those server/LMS behaviors. PDF page-anchor behavior also depends on the learner's PDF viewer. No live LMS upload is part of this validation.
