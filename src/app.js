const $=id=>document.getElementById(id);
let session=null, frame=0, walk, x,z,yaw,last,action='', active=false;
const names=Object.fromEntries(destinations.map(place=>[place.key,place.name]));
function enter(practice,key){
  if(card.open)card.close(); walk=newWalk(key); x=z=yaw=0;last=0;action='';active=true;
  $('home').hidden=true;$('guide').hidden=false;$('scene').hidden=!practice;
  $('controls').hidden=!practice;$('mode').textContent=practice?'PRACTICE WALK':'CAMERA · ESTIMATED ROUTE';
  $('dest').textContent=names[key];$('notice').textContent='';$('message').textContent='';
  $('pointer').hidden=true;
}
function reset(){
  active=false;cancelAnimationFrame(frame);action='';session=null;
  $('guide').hidden=true;$('home').hidden=false;$('live').disabled=false;
}
function showPose(px,pz,heading){
  const g=guidance(walk,px,pz,heading),ptr=$('pointer');
  ptr.hidden=false;ptr.textContent=g.arrived?'✓':'↑';
  ptr.style.transform='translate(-50%,-50%) rotate('+g.angle+'rad)';
  $('notice').textContent=g.arrived?'Near destination · '+$('dest').textContent:'';
  if(g.arrived)$('controls').hidden=true;
}
function selection(){return selectedKey}
function practice(t){
  if(!active)return;
  const dt=last?Math.min((t-last)/1000,.08):0;last=t;
  if(action==='left')yaw-=dt*1.45;
  if(action==='right')yaw+=dt*1.45;
  if(action==='walk'){x+=Math.sin(yaw)*dt;z-=Math.cos(yaw)*dt}
  const c=$('scene'),ctx=c.getContext('2d'),w=c.width=c.clientWidth,h=c.height=c.clientHeight;
  ctx.fillStyle='#292c32';ctx.fillRect(0,0,w,h/2);
  ctx.fillStyle='#17191d';ctx.fillRect(0,h/2,w,h/2);
  // Project a world-fixed floor grid into the simulated camera view.
  function project(wx,wz){
    const dx=wx-x,dz=wz-z,depth=dx*Math.sin(yaw)-dz*Math.cos(yaw);
    if(depth<.15)return null;
    return [w/2+(dx*Math.cos(yaw)+dz*Math.sin(yaw))*w*.7/depth,h/2+1.4*w*.7/depth];
  }
  ctx.strokeStyle='#454950';ctx.lineWidth=1;ctx.beginPath();
  for(let i=-12;i<=12;i++)for(let j=-12;j<=12;j++){
    const a=project(i,j);if(!a)continue;
    for(const b of [project(i+1,j),project(i,j+1)])if(b){ctx.moveTo(...a);ctx.lineTo(...b)}
  }
  ctx.stroke();showPose(x,z,yaw);frame=requestAnimationFrame(practice);
}
$('preview').onclick=()=>{enter(true,selection());frame=requestAnimationFrame(practice)};
for(const btn of document.querySelectorAll('[data-action]')){
  btn.onpointerdown=e=>{btn.setPointerCapture(e.pointerId);action=btn.dataset.action};
  btn.onlostpointercapture=()=>action='';
}
const keys={ArrowLeft:'left',ArrowRight:'right',ArrowUp:'walk'};
window.onkeydown=e=>{if(active&&!session&&!$('controls').hidden&&keys[e.key]){e.preventDefault();action=keys[e.key]}};
window.onkeyup=()=>action='';window.onblur=()=>action='';
$('end').onclick=()=>{if(session)session.end();else reset()};
$('live').onclick=async()=>{
  const key=selection();$('live').disabled=true;$('preview').disabled=true;
  try{
    if(!navigator.xr)throw Error('Camera AR needs a compatible phone browser and HTTPS. Practice walk is available here.');
    session=await navigator.xr.requestSession('immersive-ar',{requiredFeatures:['local','dom-overlay'],domOverlay:{root:$('guide')}});
    session.addEventListener('end',reset,{once:true});
    const gl=document.createElement('canvas').getContext('webgl',{xrCompatible:true,alpha:true});
    if(!gl)throw Error('Camera graphics are unavailable on this device.');
    await gl.makeXRCompatible();
    const layer=new XRWebGLLayer(session,gl);
    session.updateRenderState({baseLayer:layer});
    const space=await session.requestReferenceSpace('local');
    enter(false,key);let origin=null;
    function draw(t,f){
      f.session.requestAnimationFrame(draw);
      gl.bindFramebuffer(gl.FRAMEBUFFER,layer.framebuffer);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
      const pose=f.getViewerPose(space);
      if(!pose||pose.emulatedPosition){$('pointer').hidden=true;$('notice').textContent='Finding position…';return}
      const m=pose.transform.matrix, heading=bearing(-m[8],-m[10]);
      if(!origin)origin={x:m[12],z:m[14],heading};
      const dx=m[12]-origin.x,dz=m[14]-origin.z,c=Math.cos(origin.heading),s=Math.sin(origin.heading);
      showPose(dx*c+dz*s,-dx*s+dz*c,heading-origin.heading);
    }
    session.requestAnimationFrame(draw);
  }catch(e){
    if(session)await session.end().catch(()=>{});
    reset();(card.open?el('routeError'):el('message')).textContent=e.name==='NotAllowedError'?'Camera AR was declined. Retry or choose practice walk.':e.message;
  }finally{$('preview').disabled=false;$('live').disabled=false}
};




