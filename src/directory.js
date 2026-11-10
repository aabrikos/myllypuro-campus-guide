let selectedKey=null,expanded=false;
const el=id=>document.getElementById(id);
const card=el('routecard'),search=el('search');
function openPlace(place){
  selectedKey=place.key;
  el('title').textContent=place.name;
  el('quality').textContent=place.nearby?'Estimated path to reception. The showroom is next to it; its exact door is unverified.':'Estimated walk from the info stand · 2015 plan';
  el('line').setAttribute('points',(place.points||[]).map(p=>p.join(',')).join(' '));
  const target=place.points?.at(-1)||place.pin;
  el('target').setAttribute('cx',target[0]);el('target').setAttribute('cy',target[1]);

  el('setup').hidden=!place.points;el('live').disabled=el('preview').disabled=!place.points;
  el('routeError').textContent='';
  el('mapview').classList.remove('zoom');el('zoom').textContent='Zoom map';
  card.showModal();
}
function renderPlaces(){
  const q=search.value.trim().toLowerCase();
  const priority=['Info stand','MPC1001 · Showroom','Demo classroom','Lecture hall','Dining area · 1','Library'];
  const sorted=[...destinations].sort((a,b)=>(priority.includes(a.name)?priority.indexOf(a.name):99)-(priority.includes(b.name)?priority.indexOf(b.name):99));
  const matches=sorted.filter(p=>(p.name+' '+p.fi+(p.name.startsWith('Dining area')?' cafeteria':'')).toLowerCase().includes(q));
  const list=q||expanded?matches:matches.slice(0,6);
  el('listhead').textContent=q?'Search results':expanded?'All destinations':'Destinations';
  el('places').replaceChildren(...list.map(p=>{
    const b=document.createElement('button');b.className='room';const label=document.createElement('span');label.textContent=p.name;
    const distance=document.createElement('small');
    const length=p.points.slice(1).reduce((sum,point,i)=>sum+Math.hypot(point[0]-p.points[i][0],point[1]-p.points[i][1]),0);
    distance.textContent='~'+Math.round(length*metresPerPixel)+' m';
    b.append(label,distance);b.onclick=()=>openPlace(p);return b;
  }));
  el('empty').hidden=matches.length>0;el('more').hidden=!!q;el('more').textContent=expanded?'Show fewer':'Show all '+destinations.length+' locations';
}
el('more').onclick=()=>{expanded=!expanded;renderPlaces()};
el('close').onclick=()=>card.close();
el('zoom').onclick=()=>{const zoom=el('mapview').classList.toggle('zoom');el('zoom').textContent=zoom?'Fit map':'Zoom map'};
el('clear').onclick=()=>{search.value='';renderPlaces();search.focus()};
search.oninput=renderPlaces;renderPlaces();


for(const marker of document.querySelectorAll('[data-origin]'))marker.setAttribute('transform','translate('+startPoint.join(' ')+')');
