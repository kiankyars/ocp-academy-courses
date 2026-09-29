/* Editable deterministic teaching diagrams. Narration owns the finite timeline. */
const C={navy:'#343895',green:'#8DC63F',gray:'#5F6062',light:'#F3F5F7',blue:'#3779A5',warm:'#B06B23',red:'#A74343'};
const esc=s=>String(s).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
function txt(x,y,s,size=34,c=C.navy,weight=600,anchor='middle'){return `<text x="${x}" y="${y}" font-size="${size}" fill="${c}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`}
function box(x,y,w,h,title,sub='',fill=C.light){return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="${fill}" stroke="${C.navy}" stroke-width="3"/>`+txt(x+w/2,y+(sub?(h<150?48:60):h/2+12),title,34)+ (sub?txt(x+w/2,y+(h<150?89:108),sub,26,C.gray,400):'')}
function arr(x1,y1,x2,y2,c=C.green,width=6){let dx=x2-x1,dy=y2-y1,d=Math.hypot(dx,dy),ux=dx/d,uy=dy/d,bx=x2-18*ux,by=y2-18*uy;return `<path d="M${x1} ${y1}L${bx} ${by}" stroke="${c}" stroke-width="${width}" fill="none"/><polygon class="arrowhead" points="${bx-10*uy},${by+10*ux} ${bx+10*uy},${by-10*ux} ${x2},${y2}" fill="${c}"/>`}
function path(d,c=C.navy,w=5){return `<path d="${d}" stroke="${c}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`}
function tag(x,y,s,c=C.navy){return txt(x,y,s,28,c,700)}
function visible(k,n,s){return `<g opacity="${k>=n?1:.16}">${s}</g>`}
// Moving markers indicate direction only; spacing and speed are illustrative.
// Sample deterministic paths at the narration time so seeking gives the exact frame.
function flow(points,t,c,air=false){
 const legs=points.slice(1).map((b,i)=>({a:points[i],b,length:Math.hypot(b[0]-points[i][0],b[1]-points[i][1])}));
 const length=legs.reduce((n,l)=>n+l.length,0),spacing=air?68:112,speed=air?108:84;
 let s='';
 for(let d=(t*speed)%spacing;d<length;d+=spacing){
  let at=d,leg=legs[0];for(const next of legs){leg=next;if(at<=leg.length)break;at-=leg.length}
  const u=at/leg.length,x=leg.a[0]+(leg.b[0]-leg.a[0])*u,y=leg.a[1]+(leg.b[1]-leg.a[1])*u;
  const opacity=Math.min(1,d/16,(length-d)/16).toFixed(3);
  if(air){const dx=(leg.b[0]-leg.a[0])/leg.length,dy=(leg.b[1]-leg.a[1])/leg.length;s+=`<path d="M${(x-dx*21).toFixed(2)} ${(y-dy*21).toFixed(2)}L${x.toFixed(2)} ${y.toFixed(2)}" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round" opacity="${opacity}"/>`}
  else s+=`<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="9" fill="${c}" stroke="white" stroke-width="3" opacity="${opacity}"/>`;
 }
 return s;
}
function heat(k,p,t){
 let s=box(80,250,370,220,'IT equipment','Heat enters coolant')+box(730,250,390,220,'Radiator','Separate air / liquid paths')+box(1380,250,430,220,'Facility air system','Receives the exhaust heat');
 s+=visible(k,0,path('M450 300H555V175H925V220',C.warm)+arr(925,220,925,250,C.warm)+tag(610,130,'Warm return',C.warm));
 s+=visible(k,2,path('M925 470V655H730',C.blue)+arr(730,655,550,655,C.blue)+box(390,585,160,140,'Pumps')+path('M390 655H265V525',C.blue)+arr(265,525,265,470,C.blue)+tag(730,720,'Cooled supply',C.blue));
 s+=visible(k,1,arr(1035,95,1035,250,C.blue)+tag(1035,85,'Inlet air',C.blue)+arr(1120,360,1380,360,C.warm)+tag(1250,290,'Hot aisle',C.warm));
 if(k>=3)s+=arr(1810,360,1870,360,C.warm);
 if(k===4)s+=box(1080,600,730,135,'Verify both paths','Liquid performance + facility air capacity','#eff7e6');
 s+=flow([[450,300],[555,300],[555,175],[925,175],[925,247]],t,C.warm);
 if(k>=1)s+=flow([[1035,112],[1035,247]],t,C.blue,true)+flow([[1125,360],[1376,360]],t,C.warm,true);
 if(k>=2)s+=flow([[925,475],[925,655],[554,655]],t,C.blue)+flow([[385,655],[265,655],[265,475]],t,C.blue);
 if(k>=3){
  s+=flow([[1812,360],[1868,360]],t,C.warm,true);
  s+=`<circle cx="1250" cy="452" r="34" fill="#f3f5f7" stroke="${C.navy}" stroke-width="3"/><g transform="translate(1250 452) rotate(${(t*150%360).toFixed(2)})">`;
  for(let j=0;j<3;j++)s+=`<path transform="rotate(${j*120})" d="M0-5C-14-10-16-25-4-27C8-29 15-16 4-4Z" fill="${C.navy}"/>`;
  s+=`<circle r="5" fill="${C.green}"/></g>`+txt(1250,512,'Chassis fans',24,C.gray,400);
 }
 let phase=['IT adds heat to the closed liquid loop','Heat crosses the radiator surfaces','Pumps maintain circulation to the IT load','Fans carry heat toward facility air handling','The complete heat-removal path matters'][k];
 s+=txt(960,830,phase,30,C.gray,500);
 return s;
}
const fanPoints=[{s:54,q:1222,w:306},{s:65,q:1555,w:566},{s:76,q:1877,w:884},{s:88,q:2213,w:1327},{s:100,q:2622,w:1982}];
function fans(k,p){
 let n=k===0?0:k===1?1:k===2?3:4;
 let s=txt(420,100,'CHASSIS AIRFLOW',32)+txt(1370,100,'CHASSIS FAN POWER',32)+txt(420,145,'SCFM · published points',25,C.gray)+txt(1370,145,'Watts · published points',25,C.gray);
 for(let side=0;side<2;side++){
  let baseX=side?1010:60,max=side?2200:2800,label=side?'w':'q';
  s+=path(`M${baseX+40} 220V650H${baseX+790}`,C.gray,3);
  for(let j=0;j<5;j++){
   let d=fanPoints[j],h=d[label]/max*360,x=baseX+110+j*135,active=k>=1&&j<=n;
   s+=`<rect x="${x}" y="${650-h}" width="78" height="${h}" rx="5" fill="${side?C.navy:C.green}" opacity="${active?1:.13}"/>`;
   s+=txt(x+39,695,d.s+'%',27,C.gray)+txt(x+39,625-h,active?String(d[label]):'—',28,side?C.navy:C.gray);
  }
 }
 if(k>=3)s+=box(460,755,1000,100,k===3?'54% → 100%: ≈2.15× airflow; ≈6.48× fan power':'Verify the thermal need and air-path resistance','', '#eff7e6');
 else s+=txt(960,812,k===0?'Each point is a stated test result, not a fitted curve.':'Compare the cost of the additional airflow.',30,C.gray,500);
 return s;
}
function lock(x,y,c=C.red){return `<rect x="${x}" y="${y+35}" width="58" height="52" rx="8" fill="${c}"/>`+path(`M${x+12} ${y+35}V${y+20}Q${x+29} ${y-5} ${x+46} ${y+20}V${y+35}`,c,7)}
function service(k,p){
 let s=`<rect x="670" y="120" width="620" height="600" rx="14" fill="#f3f5f7" stroke="${C.navy}" stroke-width="5"/>`+path('M600 735H1360',C.gray,12);
 for(let i=0;i<3;i++){
  let extended=i===1&&k>=1,shift=extended?220*(k===1?Math.min(1,p*3):1):0,x=735-shift,y=170+i*170;
  s+=path(`M${x} ${y+140}H1200`,C.gray,6)+box(x,y,470,135,'Chassis '+(i+1),extended?'Extended on slides':'In rack',extended?'#eff7e6':'#fff');
  if(k>=1&&i!==1)s+=lock(1225,y+22);
  if(k>=3)s+=path(`M${x+20} ${y+117}H${x+430}`,C.green,7);
 }
 if(k>=1)s+=box(70,270,385,170,'One chassis out','Interlock engaged','#eff7e6');
 if(k>=2)s+=box(1390,200,450,170,'Second extension','Blocked by interlock','#fbefef');
 if(k>=3)s+=box(1390,440,450,170,'Leak detection','Independent per chassis');
 if(k===4)s+=box(220,775,1480,95,'Stability + leak coverage + remaining cooling capacity','', '#eff7e6');
 else s+=txt(960,825,'Conceptual service arrangement · follow the qualified procedure',28,C.gray,400);
 return s;
}
function states(k,p){
 let s='';
 if(k===0){s=box(95,275,440,190,'Power-board insertion','Does not permit dry running')+box(730,275,440,190,'Verify liquid','Specified sensor evidence')+box(1370,275,440,190,'Pump drive enable','Only after liquid verification','#eff7e6')+arr(535,370,730,370)+arr(1170,370,1370,370);s+=txt(960,640,'Liquid presence is an enable condition.',38,C.gray)}
 if(k===1){s=box(170,200,690,300,'Initial startup','Configurable defaults')+box(1060,200,690,300,'Reboot','Restore preceding controller state','#eff7e6')+txt(515,395,'Manual · pumps 25% · fans 25%',31)+txt(1405,395,'After power interruption or update',29)+txt(960,680,'Two different cases; do not collapse them into one reset rule.',32,C.gray)}
 if(k===2||k===3){
  s=box(80,200,470,230,'Local automatic control','Pump dP · fan approach')+box(735,200,470,230,'T2 supervisory bounds','Minimum / maximum speeds')+box(1390,200,450,230,'Timeout','Positive value enables T2');
  s+=arr(550,315,735,315)+arr(1205,315,1390,315);
  if(k===2)s+=box(440,580,1040,150,'Controller decrements timeout once per second','Maintain speeds within the specified bounds','#eff7e6');
  else{s+=path('M1615 430V595H315V485',C.green,7)+arr(315,485,315,430);s+=box(615,540,750,170,'Timeout reaches zero','Smooth return to local control','#eff7e6')}
 }
 if(k===4){
  for(let i=0;i<3;i++){let x=100+i*610;s+=box(x,150,500,180,['Sensor failure','Communication loss','Pump / fan failure'][i],'Validate the specified case')+arr(x+250,330,x+250,490)+box(x,490,500,150,'Defined failsafe response','Default 100% where specified','#eff7e6')}
  s+=txt(960,790,'Manual-mode behavior and control priorities need explicit validation.',31,C.gray);
 }
 return s;
}
window.BrazosVideo={render(d,t){let k=0;for(let i=0;i<d.chapters.length;i++){if(t>=d.chapters[i].start)k=i}k=Math.min(k,d.chapters.length-1);let ch=d.chapters[k],p=Math.max(0,Math.min(1,(t-ch.start)/(ch.end-ch.start)));let motionTime=Math.min(t,d.duration-1);let body=({heat_path:heat,fan_tradeoff:fans,service_interlock:service,control_states:states}[d.asset])(k,p,motionTime);return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 900" width="1920" height="900"><rect width="1920" height="900" fill="white"/><g font-family="Open Sans,Arial,sans-serif">${body}</g></svg>`}};
