import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

const base: React.CSSProperties = {
  fontFamily: 'Arial, Helvetica, sans-serif',
  color: '#f6f8fb',
};

export const IntroScene: React.FC<{heading: string; index: number}> = ({heading, index}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 18, 150, 179], [0, 1, 1, 0.9], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  const y = interpolate(frame, [0, 32], [38, 0], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{...base, justifyContent:'center', padding:'110px 130px', background:'radial-gradient(circle at 70% 35%, #17435b 0%, #0a1c2c 42%, #06101b 100%)'}}>
      <div style={{position:'absolute', right:100, top:80, fontSize:16, letterSpacing:5, color:'#69d5ee'}}>BRTA · HIGHWAY SAFETY INITIATIVE</div>
      <div style={{opacity, transform:`translateY(${y}px)`, maxWidth:1450}}>
        <div style={{fontSize:20, letterSpacing:6, fontWeight:700, color:'#ef5555', marginBottom:25}}>PROJECT OVERVIEW / 0{index}</div>
        <div style={{fontSize:68, lineHeight:1.13, fontWeight:900, letterSpacing:1, textShadow:'0 8px 30px rgba(0,0,0,.4)'}}>{heading}</div>
        <div style={{width:170, height:7, background:'#ee3d43', marginTop:40, boxShadow:'0 0 24px #ee3d43'}}/>
      </div>
      <div style={{position:'absolute', bottom:70, left:130, fontSize:15, letterSpacing:4, color:'#a8c1d1'}}>AI-INTEGRATED HIGHWAY SPEED MANAGEMENT SOLUTION</div>
    </AbsoluteFill>
  );
};

export const InfoScene: React.FC<{heading:string; lines:string[]; eyebrow:string}> = ({heading, lines, eyebrow}) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 16, 190, 239], [0, 1, 1, 0.96], {extrapolateLeft:'clamp', extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{...base, opacity, background:'linear-gradient(135deg,#071522 0%,#102d40 55%,#07111d 100%)', padding:'100px 125px', justifyContent:'center'}}>
      <div style={{fontSize:17, letterSpacing:5, color:'#64cde7', fontWeight:800, marginBottom:24}}>{eyebrow}</div>
      <div style={{fontSize:51, fontWeight:900, lineHeight:1.15, maxWidth:1450, marginBottom:55}}>{heading}</div>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:22, maxWidth:1500}}>
        {lines.map((line,i)=>(
          <div key={`${line}-${i}`} style={{
            padding:'24px 28px', border:'1px solid rgba(120,207,229,.35)',
            borderLeft:'5px solid #ef454b', background:'rgba(255,255,255,.055)',
            borderRadius:8, fontSize:24, fontWeight:800, letterSpacing:.5,
            opacity:interpolate(frame,[10+i*9,28+i*9],[0,1],{extrapolateLeft:'clamp',extrapolateRight:'clamp'}),
            transform:`translateY(${interpolate(frame,[10+i*9,28+i*9],[22,0],{extrapolateLeft:'clamp',extrapolateRight:'clamp'})}px)`
          }}>{line}</div>
        ))}
      </div>
      <div style={{position:'absolute',bottom:62,left:125,fontSize:14,letterSpacing:4,color:'#93adbd'}}>PROPOSED TECHNOLOGY & OPERATING FRAMEWORK</div>
    </AbsoluteFill>
  );
};

export const ClosingScene: React.FC<{heading:string}> = ({heading}) => {
  const frame = useCurrentFrame();
  const scale = interpolate(frame,[0,80,149],[0.92,1,1.02],{extrapolateLeft:'clamp',extrapolateRight:'clamp'});
  return (
    <AbsoluteFill style={{...base,alignItems:'center',justifyContent:'center',background:'radial-gradient(circle at center,#17435a 0%,#071522 68%,#030911 100%)'}}>
      <div style={{fontSize:19,letterSpacing:7,color:'#69d5ee',fontWeight:800,marginBottom:28}}>BRTA · SMART HIGHWAY INITIATIVE</div>
      <div style={{fontSize:82,fontWeight:900,letterSpacing:2,transform:`scale(${scale})`,textAlign:'center',textShadow:'0 0 34px rgba(80,200,230,.22)'}}>{heading}</div>
      <div style={{width:260,height:6,background:'#ef454b',marginTop:40,boxShadow:'0 0 25px #ef454b'}}/>
    </AbsoluteFill>
  );
};
