import 'dotenv/config';

const token=process.env.REMOTION_MAPBOX_TOKEN;
if(!token||!token.startsWith('pk.')){
  console.error('Add your Mapbox public token to .env as REMOTION_MAPBOX_TOKEN=pk...');
  process.exit(1);
}
const corridors=[
 {file:'abdullahpur-gazipur',places:['Abdullahpur, Dhaka, Bangladesh','Uttara, Dhaka, Bangladesh','Tongi, Gazipur, Bangladesh','Gazipur, Bangladesh']},
 {file:'jatrabari-sanarpar',places:['Jatrabari, Dhaka, Bangladesh','Kajla, Dhaka, Bangladesh','Sanarpar, Narayanganj, Bangladesh']},
 {file:'jatrabari-ekuria',places:['Jatrabari, Dhaka, Bangladesh','Dholairpar, Dhaka, Bangladesh','Ekuria, South Keraniganj, Bangladesh']},
 {file:'gabtoli-hemayetpur',places:['Gabtoli, Dhaka, Bangladesh','Aminbazar, Savar, Bangladesh','Hemayetpur, Savar, Bangladesh']},
 {file:'airport-jamuna-bridge',places:['Hazrat Shahjalal International Airport, Dhaka, Bangladesh','Jamuna Bridge, Bangladesh']}
];
async function geocode(place){
 const u=new URL('https://api.mapbox.com/search/geocode/v6/forward');
 u.searchParams.set('q',place);u.searchParams.set('country','BD');u.searchParams.set('limit','1');u.searchParams.set('access_token',token);
 const r=await fetch(u);if(!r.ok)throw new Error(`Geocoding ${place}: ${r.status} ${await r.text()}`);
 const j=await r.json();const c=j.features?.[0]?.geometry?.coordinates;
 if(!c)throw new Error(`No result for ${place}`);console.log(`${place}: ${c.join(', ')}`);return c;
}
for(const c of corridors){
 console.log(`\\nGetting route: ${c.file}`);
 const coords=[];for(const p of c.places)coords.push(await geocode(p));
 const u=new URL(`https://api.mapbox.com/directions/v5/mapbox/driving/${coords.map(c=>c.join(',')).join(';')}`);
 u.searchParams.set('geometries','geojson');u.searchParams.set('overview','full');u.searchParams.set('steps','false');u.searchParams.set('access_token',token);
 const r=await fetch(u);if(!r.ok)throw new Error(`Directions ${c.file}: ${r.status} ${await r.text()}`);
 const j=await r.json();const route=j.routes?.[0];if(!route?.geometry?.coordinates?.length)throw new Error(`No driving route: ${c.file}`);
 const out={type:'FeatureCollection',features:[{type:'Feature',properties:{distanceMeters:route.distance,durationSeconds:route.duration,waypoints:c.places},geometry:route.geometry}]};
 const fs=await import('node:fs/promises');const path=await import('node:path');
 const dir=path.resolve('public/routes');await fs.mkdir(dir,{recursive:true});
 await fs.writeFile(path.join(dir,`${c.file}.geojson`),JSON.stringify(out),'utf8');
 console.log(`Saved ${c.file}.geojson — ${(route.distance/1000).toFixed(1)} km`);
}
console.log('\\nAll five road geometries generated. Review them in Remotion Studio before final render.');
