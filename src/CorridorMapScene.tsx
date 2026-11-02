import React, {useEffect, useMemo, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame} from 'remotion';
import Map, {Layer, Source} from 'react-map-gl/mapbox';
import type {Feature, FeatureCollection, LineString, Position} from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import {corridors} from './corridors';

type Props = {corridorId:string};
type RouteFC = FeatureCollection<LineString>;
const token = process.env.REMOTION_MAPBOX_TOKEN ?? '';
const clamp = {extrapolateLeft:'clamp' as const, extrapolateRight:'clamp' as const};

function haversine(a:Position,b:Position):number {
  const rad=(n:number)=>n*Math.PI/180, R=6371000;
  const dLat=rad(b[1]-a[1]), dLon=rad(b[0]-a[0]);
  const q=Math.sin(dLat/2)**2+Math.cos(rad(a[1]))*Math.cos(rad(b[1]))*Math.sin(dLon/2)**2;
  return 2*R*Math.asin(Math.sqrt(q));
}
function cumulativeDistances(coords:Position[]):number[] {
  const result=[0];
  for(let i=1;i<coords.length;i++) result.push(result[i-1]+haversine(coords[i-1],coords[i]));
  return result;
}
function atDistance(coords:Position[],cum:number[],d:number):Position {
  const total=cum[cum.length-1];
  if(d<=0)return coords[0];
  if(d>=total)return coords[coords.length-1];
  let i=1; while(i<cum.length&&cum[i]<d)i++;
  const t=(d-cum[i-1])/(cum[i]-cum[i-1]);
  return [coords[i-1][0]+(coords[i][0]-coords[i-1][0])*t,coords[i-1][1]+(coords[i][1]-coords[i-1][1])*t];
}
function lineToProgress(coords:Position[],cum:number[],progress:number):Position[] {
  const target=cum[cum.length-1]*Math.max(0,Math.min(1,progress));
  const out:Position[]=[coords[0]];
  for(let i=1;i<coords.length;i++){if(cum[i]<target)out.push(coords[i]);else break;}
  const head=atDistance(coords,cum,target),last=out[out.length-1];
  if(last[0]!==head[0]||last[1]!==head[1])out.push(head);
  if(out.length===1)out.push(head);
  return out;
}

const MonitoringCameraIcon: React.FC<{color:string}> = ({color}) => (
  <svg width="25" height="25" viewBox="0 0 32 32" fill="none" aria-hidden="true">
    <path d="M5 12.5h13.8a2.2 2.2 0 0 1 2.2 2.2v7.1a2.2 2.2 0 0 1-2.2 2.2H5a2.2 2.2 0 0 1-2.2-2.2v-7.1A2.2 2.2 0 0 1 5 12.5Z" stroke={color} strokeWidth="1.8"/>
    <path d="m21 16 7-3.5v11L21 20" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
    <circle cx="11.8" cy="18.4" r="3.1" stroke={color} strokeWidth="1.8"/>
    <path d="M8 9.2h7.5M11.8 6.8v2.4" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
  </svg>
);

export const CorridorMapScene:React.FC<Props>=({corridorId})=>{
  const frame=useCurrentFrame();
  const corridor=corridors.find(c=>c.id===corridorId);
  const [routeHandle]=useState(()=>delayRender(`Load route ${corridorId}`));
  const [mapHandle]=useState(()=>delayRender(`Load Mapbox tiles ${corridorId}`));
  const [route,setRoute]=useState<RouteFC|null>(null);

  useEffect(()=>{
    if(!corridor){cancelRender(new Error(`Unknown corridor ${corridorId}`));return;}
    if(!token){cancelRender(new Error('Missing REMOTION_MAPBOX_TOKEN. Copy .env.example to .env and add a Mapbox public token.'));return;}
    let active=true;
    fetch(staticFile(`routes/${corridor.routeFile}.geojson`))
      .then(async r=>{if(!r.ok)throw new Error(`Missing route file ${corridor.routeFile}. Run npm run prepare-routes.`);return await r.json() as RouteFC;})
      .then(data=>{
        const f=data.features?.[0];
        if(!f||f.geometry.type!=='LineString'||f.geometry.coordinates.length<2)throw new Error(`Invalid route GeoJSON: ${corridor.routeFile}`);
        if(active){setRoute(data);continueRender(routeHandle);}
      })
      .catch(e=>cancelRender(e instanceof Error?e:new Error(String(e))));
    return ()=>{active=false;};
  },[corridor,corridorId,routeHandle]);

  const coords=route?.features[0]?.geometry.coordinates??[];
  const cumulative=useMemo(()=>coords.length>1?cumulativeDistances(coords):[0],[coords]);
  const total=cumulative[cumulative.length-1]??0;
  const progress=interpolate(frame,[42,255],[0,1],clamp);
  const cameraProgress=interpolate(frame,[0,42,255,299],[0,0,1,1],clamp);
  const center=coords.length>1?atDistance(coords,cumulative,total*cameraProgress):([90.4,23.8] as Position);
  const zoom=interpolate(cameraProgress,[0,.12,.85,1],[10.4,13.6,13.8,11.4],clamp);
  const pitch=interpolate(cameraProgress,[0,.2,.85,1],[25,48,48,28],clamp);
  const visible=useMemo<Feature<LineString>|null>(()=>coords.length>1?({
    type:'Feature',properties:{},geometry:{type:'LineString',coordinates:lineToProgress(coords,cumulative,progress)}
  }):null,[coords,cumulative,progress]);
  const collection=useMemo(()=>({type:'FeatureCollection' as const,features:visible?[visible]:[]}),[visible]);

  if(!corridor)return null;
  const pointItems = Array.from({length: 5}, (_, i) => i + 1);

  return <AbsoluteFill style={{background:'#09131c'}}>
    <Map
      longitude={center[0]} latitude={center[1]} zoom={zoom} pitch={pitch} bearing={-7}
      mapboxAccessToken={token} mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
      attributionControl={false} interactive={false} preserveDrawingBuffer
      onLoad={e=>e.target.once('idle',()=>continueRender(mapHandle))}
      onError={e=>{if(e.error?.message?.toLowerCase().includes('token'))cancelRender(e.error);}}
      style={{width:'100%',height:'100%'}}
    >
      <Source id={`route-${corridorId}`} type="geojson" data={collection}>
        <Layer id={`halo-${corridorId}`} type="line" layout={{'line-cap':'round','line-join':'round'}} paint={{'line-color':'#ff2028','line-width':28,'line-blur':15,'line-opacity':.38}}/>
        <Layer id={`glow-${corridorId}`} type="line" layout={{'line-cap':'round','line-join':'round'}} paint={{'line-color':'#ff252d','line-width':11,'line-blur':4,'line-opacity':.92}}/>
        <Layer id={`core-${corridorId}`} type="line" layout={{'line-cap':'round','line-join':'round'}} paint={{'line-color':'#ff555b','line-width':4,'line-opacity':1}}/>
      </Source>
    </Map>
    <AbsoluteFill style={{padding:'52px 72px',justifyContent:'space-between',pointerEvents:'none',fontFamily:'Arial, sans-serif',background:'linear-gradient(180deg,rgba(2,10,18,.7),transparent 37%,transparent 65%,rgba(2,10,18,.72))'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:34}}>
        <div style={{maxWidth:1120}}>
          <div style={{fontSize:16,fontWeight:800,letterSpacing:4,color:'#ffb8b8',textShadow:'0 2px 8px #000'}}>AI-INTEGRATED HIGHWAY SPEED MANAGEMENT</div>
          <div style={{fontSize:43,fontWeight:900,color:'#fff',marginTop:12,textShadow:'0 3px 14px #000'}}>{corridor.title}</div>
          <div style={{fontSize:19,fontWeight:700,letterSpacing:2,color:'#fff',marginTop:10,textShadow:'0 2px 9px #000'}}>{corridor.routeLabel}</div>
        </div>
        {corridor.showDirectionalCounts&&(
          <div style={{width:430,flexShrink:0,padding:'16px 18px 14px',background:'rgba(5,17,28,.9)',border:'1px solid rgba(255,255,255,.38)',borderRadius:12,color:'#fff',boxShadow:'0 10px 30px rgba(0,0,0,.25)'}}>
            <div style={{fontSize:12,letterSpacing:2.5,color:'#e5edf4',fontWeight:800}}>PROPOSED MONITORING NETWORK · 10 POINTS</div>
            <div style={{marginTop:13}}>
              {[
                {label:'ঢাকামুখী / INBOUND', color:'#55dfff', start:0},
                {label:'বহির্মুখী / OUTBOUND', color:'#ff7777', start:5},
              ].map((group)=>(
                <div key={group.label} style={{marginTop:group.start===0?0:13}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',fontSize:13,fontWeight:800,color:group.color,marginBottom:8}}>
                    <span>{group.label}</span><span>05</span>
                  </div>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(5, 1fr)',gap:7}}>
                    {pointItems.map((pointIndex)=>{
                      const order=group.start+pointIndex-1;
                      const appearAt=58+order*9;
                      const t=interpolate(frame,[appearAt,appearAt+12],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
                      const scale=interpolate(t,[0,1],[0.55,1]);
                      return (
                        <div key={`${group.label}-${pointIndex}`} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,opacity:t,transform:`translateY(${(1-t)*10}px) scale(${scale})`}}>
                          <div style={{width:39,height:39,borderRadius:11,border:`1px solid ${group.color}88`,background:`${group.color}18`,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:`0 0 15px ${group.color}33`}}>
                            <MonitoringCameraIcon color={group.color}/>
                          </div>
                          <span style={{fontSize:10,fontWeight:800,letterSpacing:.7,color:'#f3f7fa'}}>MP-{String(pointIndex).padStart(2,'0')}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            <div style={{fontSize:10,color:'#c7d5df',marginTop:10,letterSpacing:.5}}>CONCEPTUAL ICONS ONLY · SITE LOCATIONS NOT SPECIFIED</div>
          </div>
        )}
      </div>
      <div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:14,fontWeight:800,letterSpacing:2,color:'#fff',textShadow:'0 2px 8px #000',marginBottom:12}}>
          <span>{corridor.startLabel}</span><span>{Math.round(progress*100)}% ROUTE REVEALED</span><span>{corridor.endLabel}</span>
        </div>
        <div style={{height:5,background:'rgba(255,255,255,.5)',borderRadius:8,overflow:'hidden'}}><div style={{height:'100%',width:`${progress*100}%`,background:'#ff343b',boxShadow:'0 0 18px #ff343b'}}/></div>
        <div style={{display:'flex',justifyContent:'space-between',marginTop:12,fontSize:12,letterSpacing:2,color:'#fff',textShadow:'0 2px 8px #000'}}><span>BRTA HIGHWAY SAFETY PROPOSAL</span><span>SATELLITE HYBRID ROUTE VISUALIZATION</span></div>
      </div>
    </AbsoluteFill>
  </AbsoluteFill>;
};
