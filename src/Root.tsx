import React from 'react';
import {Composition} from 'remotion';
import {BRTAFullPresentation} from './BRTAFullPresentation';
import {CorridorMapScene} from './CorridorMapScene';
import {corridors} from './corridors';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="BRTAFourCorridors"
      component={BRTAFullPresentation}
      durationInFrames={sharedDuration(false)}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{includeAlternative: false}}
    />
    <Composition
      id="BRTAWithAlternative"
      component={BRTAFullPresentation}
      durationInFrames={sharedDuration(true)}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{includeAlternative: true}}
    />
    {corridors.map((corridor) => (
      <Composition
        key={corridor.id}
        id={`${corridor.id}Route`}
        component={CorridorMapScene}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{corridorId: corridor.id}}
      />
    ))}
  </>
);

function sharedDuration(includeAlternative: boolean): number {
  const intro = 180 * 3;
  const corridorScenes = includeAlternative ? 300 * 5 : 300 * 4;
  const technology = 240 + 210 + 210 + 240 + 210 + 210 + 180;
  const alternativeRouteNote = includeAlternative ? 150 : 0;
  const alternativeClosing = includeAlternative ? 180 : 0;
  const commonClosing = 210;
  const finalTitle = 150;
  return intro + corridorScenes + alternativeRouteNote + technology + alternativeClosing + commonClosing + finalTitle;
}
