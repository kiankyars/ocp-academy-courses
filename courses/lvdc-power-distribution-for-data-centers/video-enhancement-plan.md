# LVDC course: video enhancement plan

Prepared 25 September 2026 for the current narrated Slides course, using [DCF Power Distribution LVDC white paper v1.1.0](https://www.opencompute.org/documents/dcf-power-distribution-lvdc-white-paper-version-1-1-0-pdf).

**Recommendation: replace nine existing animations with narrated, synchronized technical sequences, and replace Module 9’s animation with a worked evidence matrix.** Keep the existing slide locations and module structure. Aim for 90–120 seconds per replacement, with one central question and a visible engineering consequence in each.

**Implemented 25 September 2026.** All nine replacement videos and the Module 9 evidence matrix are available in the [updated review hub](animations/enhanced/README.md). The finished videos run approximately 109–119 seconds each; total course narration is 105.2 minutes. The targets and original-course observations below are retained as the planning record. See [the verification report](QA.md) for final measurements and checks.

## What needs to improve

The current course has ten teaching videos: eight run for 20 seconds, one for 24 seconds and one for 25 seconds. They are finite animations that the course player repeats. Their associated narration runs for approximately 78–90 seconds per slide. Most visuals change among four diagram states; the storage video highlights three role cards, and the operations video highlights a chain of state boxes.

These are useful introductions, but the learner often hears an explanation that is richer than the picture. A longer video alone would not resolve that. Each replacement should connect **what changes in the equipment, what changes electrically, and what that means for service or a design decision**.

Use a consistent visual setting: a simplified source, DC distribution, two racks, storage and a coolant distribution unit (CDU). Reveal only the parts needed for the current lesson. Move from the facility view into a rack or circuit detail while retaining a small orientation cue. The viewer should recognize the same system across modules without having to interpret a large diagram repeatedly.

Use circuit paths, aligned traces, close-ups and clearly announced comparison cases. Equipment silhouettes can establish physical context; the teaching should remain in legible technical diagrams. Motion should show causality, a changing quantity or a changing state. Preserve the Academy palette, compact framing and readable labels.

## Recommended coverage

Times are storyboard targets, to be finalized against the recorded narration. “First” identifies the initial production group, not a change in teaching order.

| Module and location | Proposed video or treatment | Main improvement | Target | Production group |
|---|---|---|---:|---|
| M1S6 · Architecture | **Where redundancy actually works** | Compare a source failure, a feeder failure and an explicitly different path arrangement | 90 s | Second |
| M2S5 · Compatibility | **What voltage reaches the rack?** | Link the real distribution path to voltage margin, current limitation and load tolerance | 100 s | Second |
| M3S4 · Polarity and earthing | **Follow the midpoint current** | Show complete current loops and changing conductor loading | 90 s | Second |
| M4S4 · Protection | **One fault, two load outcomes** | Synchronize fault contributions, interruption and healthy-load tolerance | 110 s | First |
| M5S5 · Components and storage | **Who supplies the load step?** | Connect storage location, overlapping power contributions, energy use and recharge | 105 s | First |
| M6S6 · Rack interface | **Inside a controlled rack connection** | Distinguish initial connection charging from controlled bulk-capacitor charging | 100 s | First; production pilot |
| M7S5 · Operations | **Permission to energize** | Show conditional startup, blocked admission and coordinated recovery | 110 s | Second |
| M8S4 · EMC | **Noise always has a return path** | Trace differential and common mode currents through the same physical layout | 95 s | Second |
| M9S7 · Verification | **What does this evidence actually prove?** | A readable worked matrix connecting claims, methods and missing evidence | Static; retain narrated explanation | Second |
| M10S5 · Integrated review | **Follow the fault through the whole system** | Combine electrical, storage, cooling and recovery consequences in one review | 120 s | Last, using completed earlier assets |

The nine videos total approximately **15 minutes 20 seconds**, replacing slides that currently contain about **12 minutes 29 seconds of narration**. If these targets become the final narration lengths and other slides stay unchanged, total narration would grow by about **2 minutes 51 seconds**, from roughly 100.5 to 103.3 minutes. This is an estimate, not an additional 15 minutes of course content. Remove duplicated explanation where a visual now makes the point clearly.

## Module storyboards

### M1S6 — Where redundancy actually works

**Current limitation:** the feeder opens, but the proposed alternate route is described only in words. The visual does not compare which failure boundary each form of redundancy covers.

**Sequence**

1. **0–15 s:** Establish the existing two-source, common-bus arrangement and two single-fed racks. Trace the source-to-load routes. State that remaining source capacity is assumed adequate for this example.
2. **15–35 s:** Remove one source. Show the remaining source and intact distribution paths. Identify the capacity and equipment-response conditions that still need evidence.
3. **35–55 s:** Announce a separate case, restore the baseline visibly, then open Rack B’s only feeder. The source capacity remains available, but its route to that rack ends at the interruption.
4. **55–75 s:** Introduce a labeled **design alternative** with a second feeder around that failure boundary. Trace the new route and its required switching/input functions. Do not silently add it to the original design.
5. **75–90 s:** Expose the remaining shared bus. End with a compact comparison of the failure boundaries addressed by spare source capacity and by the extra feeder. Two feeders on that bus still share the bus dependency.

**Learning result:** the learner can trace a claimed recovery route and identify its common dependencies. This teaches topology; M4 will teach transient survival and M10 will integrate the conditions.

**Source and integration:** paper pp. 34–48; retain the M1S6 paper pill. Retain Open Data Center for AI on M1S7 and the SST course on M1S5. Keep the adoption-stage material on M1S4, including the corrected whitespace/CDU explanation.

### M2S5 — What voltage reaches the rack?

**Current limitation:** a dot moves through an abstract operating region without showing why it moves or where the voltage is measured.

**Sequence**

1. **0–20 s:** Show source terminals, the outgoing and return conductors, and rack input terminals. Distinguish source voltage from delivered voltage with two labeled measurements.
2. **20–45 s:** Compare a short sidecar interconnect with a longer distribution path. Use the paper’s Figure 5.16 example to show how conductor drop consumes operating-band margin. A small margin bar connects the physical path to the available control range.
3. **45–70 s:** Move to an explicitly qualitative load-change case. Raise demand and animate current and the delivered-voltage trace together. Introduce the selected source’s current limit and show why a nominal voltage match does not establish available power at the load.
4. **70–90 s:** Align the load-input voltage trace with its illustrative voltage/time tolerance. Compare an excursion that stays within the assumed tolerance with one that lasts too long. Announce each comparison case.
5. **90–100 s:** Hold the interface review: source behavior, distribution effects, load requirement and recovery behavior must agree.

**Learning result:** the learner can explain why a connection that works over a short interconnect needs another compatibility review over a longer path.

**Source and integration:** paper pp. 64–69 and 75–79, especially p. 76, Figure 5.16. Its example has 20 V of lower-side margin reduced to 12.4 V after the illustrated long-run resistive drop; retain the stated 200 kW/250 A, conductor and distance assumptions if these numbers appear. Identify it as the paper’s resistive-drop example, not a cable-sizing recommendation or dynamic simulation. Do not apply its values to the later qualitative transient. Update the slide’s reference range to include p. 75 if that explanation is used. Keep M2S4’s seven-band figure as the reference view.

### M3S4 — Follow the midpoint current

**Current limitation:** unequal bars explain imbalance but do not show the electrical circuit or the current in the midpoint conductor.

**Sequence**

1. **0–20 s:** Establish one declared bipolar example with distributed L+, M and L−, and a separately drawn PE. Connect one load from each pole to M. Label conventional current directions.
2. **20–40 s:** Show equal pole-load currents. Trace both complete loops and show cancellation in the shared midpoint segment at the selected measurement boundary.
3. **40–60 s:** Increase one load. Animate conductor-current indicators together; the midpoint indicator now displays the signed difference under the shown direction convention.
4. **60–75 s:** Introduce another ordinary operating case, such as one load being removed. Then demonstrate the opposite imbalance so the midpoint-current direction visibly reverses.
5. **75–90 s:** Hold the most demanding illustrated operating condition and identify the midpoint thermal, switching and protection questions it creates. Keep PE visually separate from normal load return.

**Learning result:** the learner can predict midpoint current from the connected loads and explain why balanced operation is insufficient as a design assumption.

**Source and integration:** paper pp. 83–85 and 99–101. Use normalized, internally consistent currents unless a fully specified worked example is added. Do not infer a universal conductor rating from the animation. Keep TN-S versus IT fault behavior on M3S5; adding an earth-fault sequence here would mix two different lessons.

### M4S4 — One fault, two load outcomes

**Current limitation:** the bus dips and recovers, but protection operation is not visibly compared with load tolerance. The fault-current contributors introduced on M4S3 are absent from the animation.

**Sequence**

1. **0–15 s:** Establish the source converter, bus capacitance, branch protection and two rack inputs. Identify the faulted branch and the branch whose service is meant to survive.
2. **15–40 s:** Apply the fault. Trace possible contributions from source-side stored energy, the converter and connected load-side energy where reverse paths exist. Show current direction, not just a red fault symbol.
3. **40–65 s:** Advance a shared event cursor across fault current, healthy-load input voltage and protection state. Open the selected branch, then show the conditions for bus recovery. Place the illustrative healthy-load tolerance alongside the voltage trace.
4. **65–90 s:** Replay a clearly labeled comparison with a longer disturbance. The fault is eventually cleared in both cases, but the second case exceeds the assumed healthy-load tolerance.
5. **90–110 s:** Hold the two outcomes. Identify the evidence required to decide which applies to a real installation, including reverse-current behavior and coordination of healthy-branch protection.

**Learning result:** the learner can explain how successful fault interruption can still fail the service requirement.

**Source and integration:** paper pp. 111–123, including the healthy-branch contribution discussion on pp. 118–119. Expand M4S4’s reference range accordingly. Preserve the paper’s circuit assumptions if any specific waveform is reused; otherwise label the traces illustrative and omit numerical fault-current and clearing-time claims. Do not turn one blocking-device example into a universal prescription. M4S3 still introduces the contributors; M4S4 makes their consequences visible. Personnel safety and verified safe states remain on M4S6.

### M5S5 — Who supplies the load step?

**Current limitation:** sequentially highlighted storage cards can suggest that only one resource acts at a time. Power, energy and placement are described but not visibly connected.

**Sequence**

1. **0–15 s:** Locate a rack buffer, converter-connected bus storage and upstream supply in the shared architecture. Show the CDU on its own electrical branch so its supply boundary is clear.
2. **15–40 s:** Apply an illustrative IT load increase. A common timeline shows load demand and overlapping source/storage power contributions. Keep their sum consistent with the demand and any explicitly depicted bus-energy change.
3. **40–65 s:** Accumulate the energy delivered by storage as the area under its power contribution. Compare a short high-power event with a longer event to distinguish power capability from energy capacity.
4. **65–90 s:** Reduce the IT demand and show the transition toward recharge. The upstream supply now serves the continuing load plus the chosen recharge demand. Identify capacity and ramp constraints without assigning universal limits.
5. **90–105 s:** Trace which loads each storage location can reach. A rack buffer cannot support the separately drawn upstream CDU branch through a path that does not exist.

**Learning result:** the learner can distinguish power from energy, explain overlapping response roles and identify an unsupported cooling dependency.

**Source and integration:** paper pp. 151–159, 165 and 196; add the latter two pages if their cooling/recharge teaching is incorporated on this slide. Keep the OCP Ready ESS cross-reference here and the Deschutes CDU reference on M5S7. Use converter-interfaced storage consistent with the course baseline. Treat the timing and division of contributions as a declared example, not a fixed local-buffer → bus-storage → utility sequence.

### M6S6 — Inside a controlled rack connection

**Current limitation:** the generic precharge/main-path drawing compresses several different rack-input functions into one process.

**Sequence**

1. **0–15 s:** Move from the rack exterior into the paper’s generalized input architecture: connector, relevant input capacitances, hot-swap controller, bulk capacitance and downstream conversion. Retain the physical orientation through the transition.
2. **15–35 s:** Identify the initial connection/precharge stage associated with parasitic capacitances and the connector’s presence function. Redraw from the source’s actual sequence; avoid inventing pin geometry or a universal contact order.
3. **35–60 s:** Show the hot-swap controller’s controlled charging of downstream bulk capacitance. Align the input-current and capacitor-voltage traces with the active part of the circuit. Distinguish this from the initial connection event.
4. **60–80 s:** Advance to downstream converter enable and load application. The trace now shows operating current as a separate event, following the source’s staged explanation.
5. **80–100 s:** Announce an alternative failed-readiness or detected-fault case. Show the specified inhibit/turn-off responsibility and the remaining stored-energy question. Finish on the interface evidence needed to define thresholds, timing and reset behavior.

**Learning result:** the learner can distinguish initial inrush mitigation, bulk-capacitor charging and load enable, and identify which function controls each.

**Source and integration:** paper pp. 175–182, particularly Figures 9.6–9.10. The source’s event sequence takes precedence over a generic contactor-and-resistor animation. Show separate time windows where event scales differ; playback seconds are not electrical time. Keep the isolation and protective-earth functions explicit, without presenting the video as a connection or maintenance procedure. Retain Diablo 400 at M6S3 and ESS at M6S7.

**Why make this first:** it is a bounded sequence with strong source figures, visible physical change and two useful synchronized traces. It establishes the visual and narration standard before attempting the more complex system fault case.

### M7S5 — Permission to energize

**Current limitation:** highlighting a single chain from de-energized through energized to fault lockout can visually suggest that fault and discharge are inevitable steps in every normal startup.

**Sequence**

1. **0–20 s:** Establish a branching state diagram with separate rows for system conditions, automated actions and operator responsibilities. Show a small set of readiness conditions: capacity, protection, storage availability and cooling.
2. **20–45 s:** Follow the successful admission path through checks, controlled precharge and energized operation. Conditions remain visible as the state changes.
3. **45–65 s:** Announce a separate blocked-start example: electrical supply is available but required CDU flow/readiness is absent. Rack admission remains inhibited. This is a control dependency, not a simulated thermal trip.
4. **65–90 s:** Show a post-disturbance recovery branch. Admit rack groups in stages while storage recharge and source headroom are tracked. Compare the aggregate demand with an explicitly illustrative simultaneous-restart case.
5. **90–110 s:** Show distinct fault-lockout and maintenance routes. A reset has prerequisites; a controller-reported de-energized state does not establish verified absence of hazardous energy. End with named owners for the required conditions and verification.

**Learning result:** the learner can state why a transition is permitted, blocked or diverted, and who owns the condition.

**Source and integration:** paper pp. 194–200. Expand the existing M7S5 range through p. 200 if recovery and maintenance branches are included. Keep Grid Disturbance Performance here and point to the existing Deschutes reference when discussing CDU readiness. The paper leaves startup/black-start material open on p. 194: do not animate a supposedly complete site sequence or invent delays, setpoints or reset authority. M7S6 retains the detailed recovery and maintenance discussion.

### M8S4 — Noise always has a return path

**Current limitation:** the current paths change color, but the relation between the electrical sketch, physical arrangement and filter return route remains abstract.

**Sequence**

1. **0–15 s:** Establish the converter, paired power conductors, load and bonded enclosures in a compact physical view. Transition to the equivalent circuit while preserving their positions.
2. **15–40 s:** Trace differential mode noise around the complete outgoing-and-return loop. Use directional phase cues that distinguish an instantaneous current direction from net power flow.
3. **40–65 s:** On the same layout, trace common mode current on the power conductors with its return through capacitance, chassis and bonding paths. Make parasitic paths visible rather than allowing an arrow to disappear into an earth symbol.
4. **65–85 s:** Add an illustrative filter/bonding arrangement and trace the changed high-frequency route. Compare the loop geometry before and after. Mark frequency-dependent impedance without inventing an attenuation curve.
5. **85–95 s:** Hold the review question: where does the unwanted current return, and what installation and testing evidence confirms the intended behavior?

**Learning result:** the learner can trace both modes and explain why filter selection, bonding and physical layout must be reviewed together.

**Source and integration:** paper pp. 203–207 and 211–214. Replace the broad existing M8S4 range with the pages supporting the final script. Retain converter-interaction/stability teaching on M8S6, including its p. 198 reference; it concerns another behavior and should not be presented as synonymous with common mode EMI. Avoid universal bonding prescriptions or unsourced noise-reduction values.

### M9S7 — What does this evidence actually prove?

**Recommendation: replace the animated category cards with a static worked matrix.** The learner needs to inspect and compare claims and evidence at their own pace; timing the appearance of three categories adds little.

Use one declared sample proposal and four rows:

| Claim to review | Evidence needed | What that evidence does not establish by itself |
|---|---|---|
| A protective device is suitable for its intended role | Applicable product scope, ratings and demonstrated functions | Coordination and service continuity in this assembled system |
| The healthy rack survives a branch fault | Representative system behavior aligned with load tolerance | Every operating configuration or untested source/load combination |
| Cooling and storage permit a controlled restart | Sequence tests, exception handling and acceptance records | Installed wiring, site configuration and field performance without corresponding checks |
| The deployment meets its local installation and utility obligations | Applicable requirements and the relevant installation/utility evidence | Automatic acceptance based only on a product report or a pilot elsewhere |

Narration follows one claim across the row, then asks the learner to identify the unresolved evidence in another. Retain M9S9’s knowledge check; do not add a new completion gate. If evidence status is illustrated, label it as a fictional worked case rather than implying an actual product or site was tested.

**Source and integration:** paper pp. 201–202, 215–230; use narrower page links for the final row wording. Retain the OCP Ready ESS reference. Record Module 9 as the intentional exception to the usual per-module video coverage, consistent with the user’s instruction to prioritize learning value.

### M10S5 — Follow the fault through the whole system

**Current limitation:** the existing capstone largely repeats M1’s feeder diagram with additional labels. It does not visibly integrate the dependencies learned in the intervening modules.

**Sequence**

1. **0–20 s:** Restate the actual M10S3 scenario and its assumptions: source capacity, common bus, rack feeders, storage location and the separately supplied CDU. Do not import M1’s alternate-feeder design variant unless M10’s scenario is explicitly revised.
2. **20–45 s:** Apply the branch fault. Reuse M4’s event language to show possible fault contributions, voltage disturbance and intended isolation. Separate the fate of the faulted rack from the healthy rack.
3. **45–70 s:** Hold the event while a concise review panel tracks healthy-rack voltage tolerance, viable power paths and cooling availability. Use **demonstrated / assumed / unknown** where appropriate; a green path alone does not prove uninterrupted service.
4. **70–95 s:** Advance into recovery. Reuse M5’s source/storage view and M7’s admission logic to show recharge demand, cooling permissives and staged load return. Identify the remaining lockout or inspection condition for the affected branch.
5. **95–120 s:** End on a review disposition: what the proposed design intends, what the supplied evidence establishes, and what remains unresolved. Carry those unresolved items directly into M10S6’s decision list.

**Learning result:** the learner can defend a qualified design-review conclusion across multiple system boundaries.

**Source and integration:** paper pp. 34–48, 118–123, 165 and 194–200; link the relevant ranges on the slide. Preserve the existing conclusion that continuity of the faulted single-fed rack has not been established. Maintain Open Data Center for AI on M10S6 and the six-course collection on M10S7. This video applies earlier lessons; it should spend little time re-defining their vocabulary.

## Narration, playback and layout

- **Make the narration the timeline.** Draft each sequence with sentence-level visual cues, record with the course’s existing voice and pacing, then time the animation to the actual WAV. Keep the embedded video silent and use one audible narration track.
- **Play one pass and hold the conclusion.** These are longer explanations with comparison cases, so use non-looping playback. Pause, resume, replay and narration seeking must keep picture and narration aligned. A replay resets both; revisiting a slide must have a defined starting state. Preserve the current review mode behavior.
- **Distinguish playback time from engineering time.** A five-second presentation segment may represent a much faster electrical event. Use event labels or clearly marked changes of time scale. Do not draw fault clearing and slow recovery on an apparently uniform numerical axis unless a model or source supports it.
- **Keep the compact presentation.** Reuse the current tightly framed aspect ratios and slide margins. Design each shot around one diagram and, at most, two necessary traces; replace or zoom the view instead of stacking more panels vertically. Keep references and glossary pills at the slide’s left margin.
- **Make the paused frame useful.** Keep the necessary labels visible, hold important comparisons long enough to read, and finish on a self-contained result. Use direction, line style and text as well as color. Preserve transcripts and provide a concise static summary/description of any new visual-only teaching.
- **Keep navigation familiar.** Use the existing narration controls and optional replay. No extra quiz gates or required companion-course visits. Check keyboard operation, reduced-motion/static presentation and media zoom during implementation.
- **Keep delivery practical.** Measure the pilot’s encoded size and playback behavior before choosing the final resolution for the series. Preserve crisp zoomed labels with an efficient encode; do not assume every longer sequence needs the largest available frame size. Load only the media needed for the current slide and check the finished course’s local playback and target-LMS delivery before release.

## Source and production rules

The LVDC v1.1.0 paper remains the primary learner reference. Each storyboard above identifies its supporting PDF pages. Show page-specific links beneath the slide using the existing pattern: `Paper · pp. 175–182`, opening the bundled paper at its first cited PDF page. Where a source figure is redrawn or reused, identify the figure and page in the caption or source record.

Use original explanatory diagrams or suitable paper figures. The public EMEA Summit presentation may provide cited context where it adds something, but these replacements do not need Summit footage. The development webinar recording, its slides and transcript remain internal authoring input: no learner-facing links, attributions, screenshots, clips or audio from those materials.

Keep the six related Academy courses in their established teaching locations. Their role is to offer depth: Open Data Center for AI for facility compatibility; SST for converter architecture; Grid Disturbance Performance for the utility interface and recovery; ESS for storage deployment and evidence; Diablo 400 for the rack/sidecar product boundary; and Deschutes for the CDU’s electrical, control and service dependencies. Earlier companion-course LVDC examples do not supersede the v1.1.0 paper.

For technical graphics, produce editable diagrams and deterministic animation. Physically meaningful motion must follow a defined circuit, state model or explicit illustrative calculation. Current paths must close; energy and power indicators must agree; quantities must not jump backward without an announced event or comparison reset. Attractive waveforms cannot stand in for validation data. No generic success checkmark should imply certification, personnel safety or proven continuity.

## Production order and acceptance

1. **Pilot M6S6.** Complete the source-based circuit redraw, timed script, finished animation and course playback synchronization together. Check it in the actual compact slide layout before scaling the visual system.
2. **Build M4S4 and M5S5.** Establish the reusable fault timeline, tolerance comparison, storage contributions and recharge views. These provide the largest increase in explanatory depth and become inputs to the capstone.
3. **Build M1S6, M2S5, M3S4, M7S5 and M8S4.** Reuse shared equipment and visual conventions where appropriate, while preserving each module’s distinct question. Replace M9S7 with its worked matrix in this group.
4. **Build M10S5 last.** Assemble the completed electrical, storage and operations views against the course’s declared scenario. Check that all unresolved conclusions flow into M10S6.
5. **Review the course as a whole.** Reconcile repeated explanations, module transitions, references, glossary usage and updated narration duration. Deliver the editable course for manual review, stopping before ZIP creation and a PR as already requested.

Each finished sequence should include its timed script, editable visual source, silent video, useful poster/final summary, updated narration and transcript, page references and reviewed visible-text inventory. Preserve existing edited content outside the affected slides and any explicitly necessary adjacent-slide adjustment.

Acceptance checks should cover:

- The learner can answer the stated review question from the sequence; every major movement contributes to that answer.
- Each circuit/state transition agrees with the declared topology, source and narration. Failure cases and design alternatives are explicitly distinguished.
- First, quarter, midpoint, three-quarter and final frames, plus all important transitions, remain legible and geometrically correct. Watch the complete pass for misleading resets or abrupt quantity changes.
- The encoded video matches the source at full resolution and in zoom view; inspect fine text, arrows and traces as well as quality metrics.
- Narration and picture remain aligned on play, pause, seek, replay, slide return and module navigation. Updated narration passes the course’s audio quality checks.
- Compact desktop and mobile layouts preserve readable text, reachable controls and left-aligned learner aids. Taller media or accumulated empty space must not undo the recent layout improvements.
- Updated references open the correct bundled-paper pages; no internal webinar material is exposed. Terminology consistently uses **coolant distribution unit (CDU)**.
- Course validation and media-coverage checks pass with Module 9 recorded as an intentional static exception. No change to the course’s SCORM version or module tracking is required.

The intended result is a coherent set of technical explanations: enough detail to expose the real relationships, with a single review question guiding each video.
