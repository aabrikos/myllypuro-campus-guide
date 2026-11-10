// The iPhone prototype estimates distance from walking motion and a nominal stride.
if (/iPhone/i.test(navigator.userAgent)) {
  const video=$('camera');
  let stream,firstHeading=null,heading=null,lastPeak=0,armed=true,started=false;
  function orientation(e){
    if(![e.alpha,e.beta,e.gamma].every(Number.isFinite))return;
    const rad=Math.PI/180,a=e.alpha*rad,b=e.beta*rad,g=e.gamma*rad;
    const east=-Math.cos(a)*Math.sin(g)-Math.sin(a)*Math.sin(b)*Math.cos(g);
    const north=-Math.sin(a)*Math.sin(g)+Math.cos(a)*Math.sin(b)*Math.cos(g);
    if(Math.hypot(east,north)<.25){heading=null;$('pointer').hidden=true;$('notice').textContent='Hold phone upright';return}
    const current=Math.atan2(east,north);
    if(firstHeading===null)firstHeading=current;
    heading=current-firstHeading;
    showPose(x,z,heading);
  }
  function motion(e){
    if(heading===null||walk.next>=walk.route.length)return;
    const a=e.acceleration;
    if(!a||![a.x,a.y,a.z].every(Number.isFinite))return;
    const strength=Math.hypot(a.x,a.y,a.z),now=performance.now();
    if(strength<1.1)armed=true;
    if(!armed||strength<2.1||now-lastPeak<330)return;
    armed=false;lastPeak=now;
    // Limit travel to the next checkpoint so a nominal stride cannot skip the bend.
    const [tx,tz]=walk.route[walk.next];
    const stride=Math.min(.65,Math.hypot(tx-x,tz-z));
    x+=Math.sin(heading)*stride;z-=Math.cos(heading)*stride;
    showPose(x,z,heading);
  }
  function stop(){
    started=false;
    window.removeEventListener('deviceorientation',orientation);
    window.removeEventListener('devicemotion',motion);
    if(stream)stream.getTracks().forEach(track=>track.stop());
    stream=null;video.srcObject=null;video.hidden=true;reset();
  }
  $('end').addEventListener('click',()=>{if(started)stop()});
  document.addEventListener('visibilitychange',()=>{if(document.hidden&&started)stop()});
  $('live').onclick=async()=>{
    const key=selection();$('live').disabled=true;$('preview').disabled=true;
    try{
      if(!isSecureContext||!navigator.mediaDevices)throw Error('Open the HTTPS website in Safari to use the camera.');
      const permissions=await Promise.all([window.DeviceOrientationEvent,window.DeviceMotionEvent].map(type=>
        type?.requestPermission?type.requestPermission():Promise.resolve(type?'granted':'unavailable')));
      if(permissions.some(p=>p!=='granted'))throw Error('Allow motion and orientation access, then retry.');
      stream=await navigator.mediaDevices.getUserMedia({audio:false,video:{facingMode:{ideal:'environment'}}});
      video.srcObject=stream;enter(false,key);started=true;video.hidden=false;
      await video.play();firstHeading=heading=null;armed=true;lastPeak=0;
      $('mode').textContent='CAMERA · ESTIMATED ROUTE';
      $('notice').textContent='Hold phone upright and face forward';
      window.addEventListener('deviceorientation',orientation);window.addEventListener('devicemotion',motion);
    }catch(e){stop();(card.open?el('routeError'):el('message')).textContent=e.name==='NotAllowedError'?'Camera or motion access was declined. Allow access in Safari and retry.':e.message}
    finally{$('live').disabled=false;$('preview').disabled=false}
  };
}

