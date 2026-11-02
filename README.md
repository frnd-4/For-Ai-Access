# BRTA Highway Speed Management — Remotion Project

This project is structured from the supplied `BRTA_Revised_Marked_Script.pdf`. It contains two complete video compositions matching the two script versions:

- `BRTAFourCorridors`: Version 1 — sections ক + খ + ঘ + চ + ছ.
- `BRTAWithAlternative`: Version 2 — sections ক + খ + গ + ঘ + ঙ + চ + ছ.
- Five individual 10-second route compositions are also included for separate corridor exports.

The script does not contain timestamps or a recorded narration file. The composition follows the exact script section order and uses estimated editorial scene durations; it is not sample-accurately synchronized to spoken audio. The full supplied script and its visual mapping are included in `VOICEOVER_SCRIPT.md`.

## Visual treatment

- Mapbox Satellite Streets hybrid imagery.
- Real road route geometry fetched from Mapbox Geocoding + Directions APIs.
- Frame-driven route drawing and camera position using Remotion `useCurrentFrame()` and `interpolate()`.
- Each of the four primary corridor scenes now shows 10 stagger-animated Monitoring Point camera icons (5 inbound + 5 outbound), labelled MP-01 to MP-05 in each direction. These are conceptual information graphics in a panel, not map pins or surveyed site locations. The script does not provide exact installation coordinates.
- Technology scenes cover Radar Speed Detector, AI Enforcement Camera, ANPR, Illuminator, data capture, average-speed monitoring, violation management, command center, SMS and digital payment.
- Full HD 1920×1080, 30 FPS.

## Setup on Windows

1. Install Node.js LTS: https://nodejs.org/
2. Extract the ZIP and open the `BRTA-Voiceover-Synced-Remotion` folder in VS Code.
3. Copy `.env.example` and rename the copy to `.env`.
4. Put your Mapbox public token (`pk...`) in `.env`:
   `REMOTION_MAPBOX_TOKEN=pk.your_token_here`
5. In the VS Code terminal, run:

```bash
npm install
npm run prepare-routes
npm run studio
```

The route preparation script geocodes the named locations and requests road-following driving GeoJSON. Inspect each route in Remotion Studio: place-name geocoding can select a nearby locality point, not an officially surveyed roadside installation point.

## Render

```bash
npm run render:version1
npm run render:version2
```

MP4 outputs:
- `out/brta-four-corridors.mp4`
- `out/brta-with-alternative.mp4`

## Voiceover sync

No recorded voiceover audio was included with the PDF. The compositions follow the script's section order, but their timings are estimates. Once the final narration is recorded, add it as an audio asset and adjust the scene durations to its actual pacing. Do not claim frame-accurate sync until this is done.

## Token safety

Only use a Mapbox public token (`pk...`). Never put a secret token (`sk...`) in the browser project. `.env` is excluded from Git.
