/**
 * Visual sequence is derived from BRTA_Revised_Marked_Script.pdf.
 * No timecodes are assumed. Scene durations are editorial estimates and can
 * be adjusted after the final voiceover recording is available.
 */
export type ScenePlan = { id: string; heading: string; visual: string; duration: number };

export const sharedIntro: ScenePlan[] = [
  {id:'national-progress', heading:'A MODERN, SAFE & CONNECTED BANGLADESH', visual:'Satellite overview of Bangladesh/Dhaka with restrained corporate typography.', duration:180},
  {id:'speed-challenge', heading:'A MAJOR CHALLENGE: EXCESSIVE SPEED', visual:'Highway traffic aerial with a clear road-safety message; no fabricated accident imagery.', duration:180},
  {id:'speed-management', heading:'AI-INTEGRATED HIGHWAY SPEED MANAGEMENT', visual:'Introduce the proposed solution and transition into corridor maps.', duration:180},
];

export const technologyScenes: ScenePlan[] = [
  {id:'equipment', heading:'INTELLIGENT HIGHWAY MONITORING', visual:'Radar Speed Detector, AI Enforcement Camera, ANPR and Illuminator as clean technical cards.', duration:240},
  {id:'data-capture', heading:'AUTOMATED DATA CAPTURE', visual:'Speed, number plate, image, video, time and location flow into a central server.', duration:210},
  {id:'average-speed', heading:'POINT-TO-POINT / AVERAGE SPEED', visual:'Two or more checkpoint labels connected by a corridor graphic; do not show invented physical sites.', duration:210},
  {id:'violation-management', heading:'VIOLATION MANAGEMENT SOFTWARE', visual:'Over Speed, Wrong Lane, Wrong Way Driving, Seat Belt and Mobile Phone Use as text categories.', duration:240},
  {id:'command-center', heading:'CENTRAL COMMAND CENTER', visual:'BRTA, Highway Police and RHD monitoring dashboard concept.', duration:210},
  {id:'sms-payment', heading:'DIGITAL NOTIFICATION & PAYMENT', visual:'SMS notification and digital payment flow, presented as a proposed workflow.', duration:210},
  {id:'safety-outcome', heading:'SAFER ROADS. FEWER CRASHES. BETTER JOURNEYS.', visual:'Return to highway aerial and show the stated project objectives.', duration:180},
];

export const closingScene: ScenePlan = {
  id:'safe-road-safe-nation',
  heading:'SAFE ROAD, SAFE NATION.',
  visual:'Clean final title over satellite highway background.',
  duration:150,
};
