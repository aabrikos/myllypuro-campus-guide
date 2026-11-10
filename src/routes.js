// Coordinates refer to route-map.png, a 1500 by 801 crop of the 2015 drawing.
// Each branch follows a shared corridor. Endpoints indicate approaches estimated
// from the drawing. They are not surveyed door positions.
const startPoint=[327,312];
const spines={
  lobby:[startPoint],
  west:[startPoint,[325,264],[309,190]],
  south:[startPoint,[383,317],[425,344],[419,412]],
  bridge:[startPoint,[471,319],[584,319]],
  middle:[startPoint,[471,319],[584,319],[735,321]],
  north:[startPoint,[471,319],[584,319],[735,321],[737,222]],
  clinic:[startPoint,[471,319],[584,319],[735,321],[821,331],[843,404]],
  dining:[startPoint,[471,319],[584,319],[735,321],[821,331],[940,314],[1080,314],[1194,312]]
};
const approaches={
  'Auditorium · 200 seats':[['west',[342,159],[354,103]]],
  'Corridor':[['lobby',[467,312]],['bridge'],['middle',[780,323]],['dining',[1180,376],[1179,500]],['dining',[1185,363],[1134,366]]],
  'Demo classroom':[['lobby',[409,320],[436,345]]],
  'Dental teaching clinic':[['clinic',[866,487],[906,612]]],
  'Dining area':[['dining',[1270,318],[1281,400]],['middle',[821,331],[942,314],[1045,330]]],
  'Food service':[['dining',[1242,309]]],
  'Group study room':[['clinic',[827,426],[756,426],[717,423]]],
  'Info stand':[['lobby',[370,322],[374,340]]],
  'Innovation space':[['bridge',[589,344]]],
  'Kotikulma':[['middle',[821,331],[863,347],[891,364]]],
  'Large auditorium':[['dining',[1270,318],[1287,240],[1260,191]]],
  'Lecture hall':[['north',[720,214]]],
  'Library':[['west',[280,185]]],
  'Lift':[['west',[315,138],[315,96]],['west',[315,138],[337,96]],['middle',[679,340]],['middle',[659,340]],['dining',[1194,319],[1171,319]],['dining',[1194,319],[1143,319]],['dining',[1194,319],[1115,319]]],
  'Megora café':[['west',[270,113],[241,86]]],
  'Movement laboratory':[['clinic',[867,484],[912,617],[932,637]]],
  'Open study area':[['lobby',[474,311],[482,264]],['south',[472,442]],['west',[351,198]],['west',[346,129]],['north',[760,232]]],
  'Optical shop':[['middle',[821,331],[856,311]],['middle',[821,331],[838,305]]],
  'Podiatry teaching space':[['clinic',[866,487],[880,491]]],
  'Positia therapy space':[['clinic',[824,425],[765,434]]],
  'Public lobby':[['west',[314,171]],['lobby',[328,259]],['south',[406,446]]],
  'Rehabilitation gym':[['north',[749,192],[768,183]]],
  'Sensory room':[['north',[765,212],[789,202]]],
  'Stairs':[['middle',[688,309],[676,286]],['dining',[1181,376],[1135,393]],['west',[311,126],[314,95]],['south',[387,415],[373,432]],null,['clinic',[867,484],[913,620],[956,735]],null],
  'Toilet':[['south',[450,443],[478,470]],['middle',[740,345],[735,388],[695,390]],['dining',[1182,378],[1180,497],[1154,501]]],
  'Waiting area and reception':[['clinic',[813,405]]]
};
const counts=new Map(), totals=new Map();
for(const room of planRooms)totals.set(room.name,(totals.get(room.name)||0)+1);
const destinations=planRooms.map((room,index)=>{
  const occurrence=counts.get(room.name)||0;
  counts.set(room.name,occurrence+1);
  const spec=approaches[room.name]?.[occurrence];
  const points=spec?[...spines[spec[0]],...spec.slice(1)]:null;
  const name=room.name+(totals.get(room.name)>1?' · '+(occurrence+1):'');
  const pin=[(room.x/100*2382-204)*1500/1906,(room.y/100*1684-344)*801/1018];
  return {key:'plan-'+index,name,fi:room.fi,pin,points};
}).filter(place=>place.points);
const reception=destinations.find(p=>p.name==='Info stand');
destinations.push({key:'showroom',name:'MPC1001 · Showroom',fi:'showroom reception',pin:reception.pin,points:reception.points,nearby:true});
// Local X is camera-right, local -Z is forward (towards the drawing's right).
const metresPerPixel=0.112;
for(const place of destinations){
  place.route=place.points?.slice(1).map(([x,y])=>[(y-startPoint[1])*metresPerPixel,-(x-startPoint[0])*metresPerPixel]);
}

