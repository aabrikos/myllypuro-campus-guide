const paths=Object.fromEntries(destinations.map(place=>[place.key,place.route]));
function bearing(dx,dz){return Math.atan2(dx,-dz)}
function newWalk(key){return {route:paths[key],next:0}}
function guidance(walk,x,z,yaw){
  while(walk.next<walk.route.length){
    const [tx,tz]=walk.route[walk.next];
    const radius=walk.next===walk.route.length-1?1.5:1.0;
    if(Math.hypot(tx-x,tz-z)>radius){
      const offset=bearing(tx-x,tz-z)-yaw;
      return {angle:Math.atan2(Math.sin(offset),Math.cos(offset)),arrived:false};
    }
    walk.next++;
  }
  return {angle:0,arrived:true};
}
if(typeof module!=='undefined')module.exports={newWalk,guidance,bearing};



