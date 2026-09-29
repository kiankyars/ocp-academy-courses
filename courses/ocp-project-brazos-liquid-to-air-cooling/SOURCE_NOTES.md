# Brazos source analysis and editorial notes

Reviewed September 26, 2026 for an OCP Academy course proposal. Page references below are both PDF page positions and the document's printed page numbers.

## Source authority and chronology

- Primary technical source: local `OCP-Specification-Project Brazos v 0.75.4-FINAL.pdf`, 100 pages, effective September 11, 2026. Its version history identifies June 30, 2026 as initial release and September 11 as the fifth release. Do not rename it v1.0 or infer certification/approval status from `FINAL` in the filename.
- Official reference: https://www.opencompute.org/documents/ocp-specification-project-brazos-v-0-75-4-final-pdf . The browser could not render this URL; the local copy was read directly.
- Launch context: Google's June 16, 2026 blog by Jorge Padilla and Madhusudan Iyengar. It explains why a liquid-to-air system can support deployment in existing air-cooled sites and describes a future open specification contribution. The supplied September specification is the later technical basis.
- Scope is specification literacy and deployment evaluation. Detailed field SOPs, supplier implementation choices, and site-specific acceptance decisions need their own evidence.

## Coverage record

All 100 pages of the supplied specification were read through extracted text. The following section map preserves topics that are intentionally referenced rather than fully taught.

| Source pages | Content | Proposed treatment |
|---|---|---|
| 1–9 | Version history, contents, license | Version and provenance; retain source attribution. |
| 10–18 | Motivation, architecture, ratings, components, hydraulic diagram | Core Module 1; ratings begin Module 2. |
| 19–21 | Thermal, air, hydraulic performance; expansion tank; environmental conditions | Core Module 2 with condition-specific values. |
| 21–44 | Weight, finishes, rack geometry, connectors, volume, slides, interlocks | Selected deployment constraints in Module 3; detailed drawings as references. |
| 44–51 | Handling, vibration, transportation, seismic tests | Supplier evidence in Module 4; not operating instructions. |
| 52–57 | Manifolds, coolant, materials, electrical design | Modules 2 and 3. |
| 58–66 | Serviceability, leak mitigation, acoustics, safety, EMC | Modules 3 and 4. |
| 67–84 | Controls, network interfaces, operating modes, firmware, telemetry | Core Module 4; API syntax retained as optional reference. |
| 84–91 | Manufacturing, shipping, sourcing, documentation, acceptance tests | Module 4 evidence map; sourcing boundary in Module 3. |
| 91–100 | Reliability, qualification, manufacturing capability, glossary | Referenced evidence categories; avoid turning test requirements into field procedures. |

Visual checks covered Figures 3.0–3.4, Tables 4.1–4.2, Figures 4.1–4.2, Figures 8.2-1/8.2-2, Figure 12.1, and Figure 21.1. Other catalogued mechanical drawings still need full-resolution visual review if selected for production.

## Technical fact register

| Topic | Source-grounded statement | Source |
|---|---|---|
| Architecture | Brazos is rack-mounted air-assisted liquid cooling with a closed, single-phase IT liquid loop; heat transfers through a radiator to data-center air and exhausts into the hot aisle. | §3.1, p.12 |
| Assembly | Three modular units and integrated manifolds form the sidecar; each unit is 11 OU. Figure 3.0 labels each chassis with nominal 20 kW capacity and the assembly with 60 kW. | pp.12–13 |
| Headline rack data | 60 kW thermal load; 19 GPM DI-water IT flow; 25 psi liquid differential pressure; 8 °C approach; 7,700 CFM at maximum fan speed and zero hot-aisle back pressure. These are source design targets, not universal site guarantees. | Table 3.0, pp.13–14 |
| Pressure | Table 3.0 lists maximum liquid pressure as 130 psig. The expansion tank has a separately stated 150 psi maximum operating pressure. Qualification test pressures are a third category. | pp.13, 21, 91–97 |
| Chassis fan data | At 54% speed: 1,222 SCFM and 306 W; at 100%: 2,622 SCFM and 1,982 W. These are chassis fan values, not total rack airflow or total chassis electrical power. | Table 4.2, p.19 |
| Hydraulic plots | Rack curves describe three chassis, each with two pumps operating in parallel; separate plots show external available pressure head and pump power. Do not infer failed-unit capacity from full-population curves. | Figures 4.1–4.2, p.20 |
| Approach | Approach temperature = cold liquid supply temperature minus cold inlet/supply air temperature. It is distinct from liquid return-minus-supply temperature rise. | §19, p.69 |
| Environment | Nominal ambient: 29 °C at 0–1,700 ft. Modeling conditions: 15–40 °C at 0–1,700 ft and 15–32 °C at 7,600 ft. Relative humidity: 8–80%. Do not call modeling ranges guaranteed full-capacity ratings. | §6, p.21 |
| Coolant | Wetted materials must support DI water and PG25; §10 gives treated-water/PG25 formulation examples. The system must not contain nickel-plated brass. Plain DI water is not a complete chemical-maintenance prescription. | §10, p.55 |
| Electrical | Summary input is 40–60 V DC. Detailed busbar values: nominal +54.5 V, minimum +40 V, maximum +59.5 V; up to 120 seconds at non-nominal voltage. ORV2-compatible input connector with sense pin. | pp.12, 14, 27–28, 55 |
| Cooling power | Electrical design supports 5,000 W maximum per chassis; consumption is limited to approximately 4,000 W per chassis and approximately 12 kW per three-chassis rack. Neither value is the thermal cooling rating. | §11.1, p.55 |
| Example budget | A hypothetical 60 kW liquid load plus 12 kW of cooling electrical input gives about 72 kW for initial site heat/power budgeting, before other loads. This is an illustrative derived upper-budget case, not measured typical use or a new Brazos rating. | Derived from §11.1 and Table 3.0 |
| Envelope | 11 OU; nominal main chassis height 525 mm, width 565.5 mm, depth 609.6 mm. Keep-in exclusions and protrusion allowances apply; p.31 states actual total depth of 813.7 mm including specified exceptions. | §7.5, pp.28–31 |
| Weight | Table values: 248 lb dry, 261 lb wet; design requirements: dry below 250 lb and full below 264 lb. Preserve distinction between tabulated values and requirement limits. | pp.13, 21–22 |
| Manifolds | Front view: supply on right, return on left; each combines three chassis connections into a top connection to the neighboring IT rack and includes a passive air vent. Named FD83 couplers are examples, not a blanket sole-source mandate. | §§8–9, pp.52–55 |
| Service envelope | Maintenance, repair, field replacement, and lift-assist use must fit within 48 inches horizontally in front of the rack; fans have rear service provisions. Review the complete applicable service method. | §12, pp.58–59 |
| Whole-chassis removal | A complete CDU may be hot-swapped only when the cooled IT load is below the capability of the other connected units sharing the manifold; otherwise IT may need to be powered down. | §12.1, p.59 |
| Interlock | Multiple units on slides require an interlock preventing more than one chassis extending at a time. It is additional to transportation/securing features. | §7.8.2, pp.39–44 |
| Leaks | Internal and external detection, controlled drainage of minor leaks, and individual independent detection per chassis. The external cable is 17 ft (+6/−0 inches). Do not invent an automatic shutdown sequence. | §13, pp.63–64 |
| Normal control | Default pumps: fixed supply-to-return differential pressure. Default fans: fixed approach temperature. Sensor discrepancy rules use the lower pressure differential for pumps and greater approach temperature for fans. | §19, pp.68–69 |
| Protective limits | Maximum liquid return temperature default 55 °C; maximum exhaust-air temperature default 50 °C. Both are configurable, enabled by default, and override other automatic modes when triggered. They are not the approach-temperature setpoint. | §19, pp.69–70 |
| Startup and reboot | Verify liquid presence before pump enable. Initial defaults are manual mode, 25% pump speed and 25% fan speed, configurable. Reboot restores the preceding state. These are distinct cases. | §§18.4, 19, pp.68, 71 |
| Failure response | PLC/pump/fan failsafe descriptions use default 100% speed in specified failure cases. Manual mode is stated to override failsafe conditions. Teach state-specific behavior and do not promise one universal response to every fault. | §19, p.71 |
| T2 supervision | Provision for future supervisory optimization with min/max speed bounds and a positive timeout decremented each second; expiry exits T2 with a smooth handover. A provision is not evidence of a deployed optimization service. | §19, pp.70–72 |
| Management | RJ45 10/100BASE-T; dedicated HMI UART; disable-capable USB service port; concurrent IPv4/IPv6; DHCP Option 60 `Brazos v1`; Modbus TCP telemetry and Redfish management requirements. | §18, pp.67–68 |
| Firmware | Dual a/b images and update checks are required. §21 describes a separate HTTP update interface, including unauthenticated requests. A checksum is not evidence of image authenticity or access control. | §§18.3, 21, pp.68, 72–79 |
| Sourcing | Components should be second sourced, with exceptions proposed when necessary. Component-source mixing within an assembly differs from cross-vendor FRU interchange: FRUs are keyed against incorrect cross-vendor insertion and the three chassis in one rack must come from one vendor. | §§12.3, 24, pp.63, 84 |
| Acceptance | Required evidence spans thermal/hydraulic response, failure cases, telemetry accuracy, service trials, safety/EMC, reliability, and manufacturing qualification. Detailed customer/vendor test plans remain necessary. | §26, pp.85–100 |

## Ambiguities to preserve and resolve before detailed teaching

1. **Table 4.1 flow conditions:** the caption says nominal 12.8 GPM and 24 psi. At 60 kW, the listed 0.325/0.322/0.321 GPM per kW implies 19.5/19.32/19.26 GPM, with 25 psi listed. Other load columns imply approximately 12.8 GPM. Flag the condition change/inconsistency; do not imply all columns were collected at constant flow. The rendered table confirms these values.
2. **Headline and detailed constraints:** preserve 40–60 V summary versus detailed +59.5 V upper value, tabulated versus maximum weights, main chassis depth versus protrusions, and system pressure versus tank rating/test pressures. Cite the relevant clause whenever using a number.
3. **Redundancy:** §19 calls for remaining units to meet demand after a failure, but that does not establish a demonstrated 60 kW N+1 rating. §12.1 makes whole-unit hot swap explicitly conditional. Request degraded-operation data rather than assigning a two-unit rating by assumption.
4. **Update flow:** Figure 21.1's final path appears as `/api/system/event/reset`, while the surrounding interface text defines `/api/system/reset`. The erase subsection also repeats the write path. Keep the core course at the update-concept level; verify implementation-specific endpoints before any hands-on appendix.
5. **Checksum wording:** the claimed numerical random-corruption guarantee and the generic 16-bit CRC reference should not be treated as an independently verified reliability/security statement. A uniform 16-bit residual space gives approximately 1/65,536 (0.00153%) undetected probability under that model; actual guarantees depend on algorithm and error model. Avoid making that number a quiz fact.
6. **Validation tables:** pressure-cycle descriptions include inconsistent or incomplete entries, and manufacturing Cpk/FPY stage targets vary between tables. Present the required evidence categories; resolve exact acceptance criteria with the approved supplier/customer plan before using them as normative test instructions.
7. **Certification:** teach required certification evidence for the delivered implementation. Do not infer every supplier implementation is certified from a general announcement or summary statement.

## Vocabulary plan

Introduce CDU (coolant distribution unit), aCDU (air-assisted coolant distribution unit), AALC (air-assisted liquid cooling), OU (Open Unit), FRU (field-replaceable unit), HMI (human-machine interface), PLC (programmable logic controller), differential pressure, approach temperature, quick disconnect, PG25, and T2 when actually used. Distinguish actual CFM from standard CFM and identify units on all plots.

Use the Brazos specification as the authoritative link for its terms. General-protocol definitions should link to the appropriate primary standards body during script development. This is a vocabulary inventory, not a completed glossary: create `term_refs` only after first substantive usage is verified in the approved slide/script/figure. Keep all title, objectives, overview, quiz, and module-boundary slides glossary-free.

## Recorded course decisions

The reviewed course uses narrated Slides, four modules, 40 slides, and a 45–60-minute learner-time target. The role-specific plan is 53 minutes (12, 14, 13, and 14 minutes per module). Module 2 is titled **Cooling Performance**. Narration keeps the maintained Leo v2 / Multilingual v2 voice and model at speed 1.18; shorter scripts provide the tighter pacing on non-teaching slides.

The four finite teaching videos use the approved LVDC synchronization approach: measured narration chapters, one audible track, narration as the master clock, linked transport/enlarged-view controls, and a held conclusion. M1S4 was revised after review to include visible circulation, airflow, and fan motion within each scene. The reviewed design and source references are recorded in `course.json` and `animations/storyboards.json`.

Production and reviewer corrections are complete. The user subsequently authorized ZIP creation and source PR preparation. SCORM 1.2 multi-SCO is retained; actual target-LMS navigation and tracking still require acceptance before learner release. Credentials, generated narration, the SCORM ZIP, and the original research PDF are excluded from source control. The PDF is supplied and verified at build time.

## User-supplied Academy cross-references

The user explicitly requested relevant links to the following courses:

- [Cooling Fluids in Direct Liquid Cooling (DLC)](https://academy.opencompute.org/learn/courses/52/cooling-fluids-in-direct-liquid-cooling-dlc): place at M3S4 for compatible fluids/materials, and again at M4S10 for continuing study.
- [OCP Project Deschutes — Coolant Distribution Unit (CDU) v1.0](https://academy.opencompute.org/learn/courses/48/ocp-project-deschutes-coolant-distribution-unit-cdu-v10): place at M1S7 for the facility-interface comparison, and again at M4S10 for continuing study.

These URLs are the user-provided learner destinations. The relevance assessment is grounded in the local readable course sources inspected during intake, rather than inferred solely from the web addresses. Preserve them as optional resource links; they do not establish prerequisite completion, series membership, or Brazos-specific operating requirements.
