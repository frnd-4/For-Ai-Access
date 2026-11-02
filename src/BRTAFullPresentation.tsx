import React from 'react';
import {AbsoluteFill, Sequence, interpolate, useCurrentFrame} from 'remotion';
import {corridors} from './corridors';
import {sharedIntro, technologyScenes, closingScene} from './scriptPlan';
import {CorridorMapScene} from './CorridorMapScene';
import {InfoScene, IntroScene, ClosingScene} from './GraphicScenes';

type Props = {includeAlternative: boolean};

const corridorDuration = 300;

export const BRTAFullPresentation: React.FC<Props> = ({includeAlternative}) => {
  let cursor = 0;
  const sequences: React.ReactNode[] = [];

  for (const scene of sharedIntro) {
    sequences.push(
      <Sequence key={scene.id} from={cursor} durationInFrames={scene.duration}>
        <IntroScene heading={scene.heading} index={sequences.length + 1} />
      </Sequence>
    );
    cursor += scene.duration;
  }

  const selectedCorridors = includeAlternative ? corridors : corridors.slice(0, 4);
  for (const corridor of selectedCorridors) {
    sequences.push(
      <Sequence key={corridor.id} from={cursor} durationInFrames={corridorDuration}>
        <CorridorMapScene corridorId={corridor.id} />
      </Sequence>
    );
    cursor += corridorDuration;
  }

  if (includeAlternative) {
    sequences.push(
      <Sequence key="alternative-note" from={cursor} durationInFrames={150}>
        <InfoScene
          heading="ALTERNATIVE CORRIDOR PROPOSAL"
          lines={['HAZRAT SHAHJALAL INTERNATIONAL AIRPORT → JAMUNA BRIDGE', 'APPROXIMATELY 98 KILOMETRES — AS STATED IN THE SCRIPT']}
          eyebrow="OPTIONAL PROPOSAL"
        />
      </Sequence>
    );
    cursor += 150;
  }

  for (const scene of technologyScenes) {
    sequences.push(
      <Sequence key={scene.id} from={cursor} durationInFrames={scene.duration}>
        <InfoScene heading={scene.heading} lines={technologyLines(scene.id)} eyebrow="AI-INTEGRATED HIGHWAY SPEED MANAGEMENT" />
      </Sequence>
    );
    cursor += scene.duration;
  }

  if (includeAlternative) {
    sequences.push(
      <Sequence key="alternative-closing" from={cursor} durationInFrames={180}>
        <InfoScene
          heading="EXPANDING SMART HIGHWAY TECHNOLOGY"
          lines={['SUCCESSFUL IMPLEMENTATION ON THE AIRPORT–JAMUNA BRIDGE CORRIDOR', 'POTENTIAL PHASED EXPANSION TO OTHER EXPRESSWAYS & NATIONAL HIGHWAYS']}
          eyebrow="ALTERNATIVE CORRIDOR · SCRIPT SECTION ঙ"
        />
      </Sequence>
    );
    cursor += 180;
  }

  sequences.push(
    <Sequence key="common-closing" from={cursor} durationInFrames={210}>
      <InfoScene
        heading="BETTER JOURNEYS DURING PEAK TRAVEL PERIODS"
        lines={['EID JOURNEYS', 'PUJA & PUBLIC HOLIDAYS', 'MONITOR LONG VEHICLE QUEUES', 'SUPPORT FASTER TRAFFIC DECISIONS']}
        eyebrow="FOUR-CORRIDOR CLOSING · SCRIPT SECTION চ"
      />
    </Sequence>
  );
  cursor += 210;

  sequences.push(
    <Sequence key={closingScene.id} from={cursor} durationInFrames={closingScene.duration}>
      <ClosingScene heading={closingScene.heading} />
    </Sequence>
  );

  return <AbsoluteFill style={{backgroundColor:'#07111b'}}>{sequences}</AbsoluteFill>;
};

function technologyLines(id: string): string[] {
  const map: Record<string, string[]> = {
    equipment: ['RADAR SPEED DETECTOR', 'AI ENFORCEMENT CAMERA', 'AUTOMATIC NUMBER PLATE RECOGNITION', 'ILLUMINATOR'],
    'data-capture': ['VEHICLE SPEED', 'NUMBER PLATE', 'IMAGE & VIDEO EVIDENCE', 'TIME & LOCATION', 'CENTRAL SERVER'],
    'average-speed': ['POINT-TO-POINT CHECKPOINTS', 'AVERAGE SPEED ANALYSIS', 'CORRIDOR-WIDE SPEED MANAGEMENT'],
    'violation-management': ['OVER SPEED', 'WRONG LANE', 'WRONG WAY DRIVING', 'SEAT BELT', 'MOBILE PHONE USE'],
    'command-center': ['BRTA', 'HIGHWAY POLICE', 'ROADS AND HIGHWAYS DEPARTMENT', 'REAL-TIME MONITORING'],
    'sms-payment': ['AUTOMATED SMS NOTIFICATION', 'VIOLATION DETAILS & EVIDENCE', 'GOVERNMENT-APPROVED DIGITAL PAYMENT'],
    'safety-outcome': ['SPEED CONTROL', 'ROAD DISCIPLINE', 'FEWER CRASHES & FATALITIES', 'SAFER HIGHWAY JOURNEYS'],
  };
  return map[id] ?? [];
}
