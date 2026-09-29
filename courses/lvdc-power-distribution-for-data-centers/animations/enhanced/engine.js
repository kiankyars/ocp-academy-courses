/* Deterministic technical scenes. renderAtTime(seconds) is the sole master clock.
   All physical values are normalized illustrative examples unless labeled otherwise. */
(function(global){
'use strict';
const C={ink:'#242B35',blue:'#343895',green:'#73AF25',light:'#F0F6E5',gray:'#75808A',line:'#CAD2D9',pale:'#F3F5F7',red:'#AA3546',redbg:'#FBEFF1',amber:'#A66612',white:'#FFFFFF',teal:'#087F8C'};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));const lerp=(a,b,p)=>a+(b-a)*clamp(p);const ease=p=>{p=clamp(p);return p*p*(3-2*p)};
let O=[];
function raw(s){O.push(s)}
function text(x,y,s,size=32,color=C.ink,anchor='start',weight=400){raw(`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${esc(s)}</text>`)}
function lines(x,y,arr,size=30,color=C.ink,dy=43,anchor='start',weight=400){arr.forEach((s,i)=>text(x,y+i*dy,s,size,color,anchor,weight))}
function rect(x,y,w,h,fill=C.pale,stroke='none',r=16){raw(`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" stroke="${stroke}" stroke-width="2"/>`)}
function line(x1,y1,x2,y2,color=C.line,width=4,dash=''){raw(`<path d="M${x1},${y1} L${x2},${y2}" fill="none" stroke="${color}" stroke-width="${width}"${dash?` stroke-dasharray="${dash}"`:''}/>`)}
function poly(points,color=C.blue,width=5,dash=''){raw(`<path d="M${points.map(p=>p.join(',')).join(' L')}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"${dash?` stroke-dasharray="${dash}"`:''}/>`)}
function arrow(points,color=C.green,width=5){let q=points.map(p=>p.slice()),tip=q.pop(),a=q[q.length-1],dx=tip[0]-a[0],dy=tip[1]-a[1],len=Math.hypot(dx,dy);if(len<1)return;const ux=dx/len,uy=dy/len,head=14;let b=[tip[0]-ux*head,tip[1]-uy*head];q.push(b);poly(q,color,width);raw(`<polygon class="arrowhead" points="${b[0]-uy*6},${b[1]+ux*6} ${b[0]+uy*6},${b[1]-ux*6} ${tip.join(',')}" fill="${color}"/>`)}
function dot(x,y,color=C.green,r=7){raw(`<circle cx="${x}" cy="${y}" r="${r}" fill="${color}"/>`)}
function box(x,y,w,h,label,sub='',color=C.blue,fill=C.pale){rect(x,y,w,h,fill,color);const a=Array.isArray(label)?label:[label];lines(x+w/2,y+(sub?45:h/2-(a.length-1)*20+10),a,31,C.ink,41,'middle',600);if(sub)text(x+w/2,y+h-28,sub,25,color,'middle')}
function chip(x,y,w,label,color=C.blue,fill=C.pale){rect(x,y,w,54,fill);text(x+w/2,y+37,label,27,color,'middle',600)}
function note(title,body,color=C.blue,x=1330,y=440,w=535,h=330){rect(x,y,w,h,C.pale);text(x+28,y+52,title,Math.min(33,(w-56)/(title.length*.57)),color,'start',600);lines(x+28,y+104,body,28,C.ink,43)}
function footer(t,sub='Illustrative response · event spacing is not an engineering time scale'){text(55,811,t,32,C.blue,'start',600);text(55,869,sub,24,C.gray)}
function chart(x,y,w,h,title,ylabel='Relative level',xlabel='Event sequence →'){text(x,y-20,title,30,C.blue,'start',600);line(x,y,x,y+h,C.gray,3);line(x,y+h,x+w,y+h,C.gray,3);text(x+w,y-20,ylabel,24,C.gray,'end');text(x+w,y+h+39,xlabel,24,C.gray,'end');return{X:t=>x+t*w,Y:v=>y+h-v*h,x,y,w,h}}
function curve(ch,points,color=C.blue,progress=1,width=5){if(!points.length)return;const cutoff=clamp(progress);let v=[];for(let i=0;i<points.length;i++){const pt=points[i];if(pt[0]<=cutoff)v.push([ch.X(pt[0]),ch.Y(pt[1])]);else{if(i){let a=points[i-1];let f=(cutoff-a[0])/(pt[0]-a[0]);if(f>=0)v.push([ch.X(cutoff),ch.Y(lerp(a[1],pt[1],f))]);}break;}}if(v.length>1)poly(v,color,width);if(v.length)dot(...v[v.length-1],color,6)}
function cursor(ch,t){line(ch.X(t),ch.y,ch.X(t),ch.y+ch.h,C.gray,2,'5 7')}
function legend(x,y,items){for(const [label,color]of items){line(x,y-9,x+30,y-9,color,5);text(x+43,y,label,25);x+=label.length*15+90}}
function meter(x,y,w,label,val,color=C.green,display){text(x,y,label,27,C.ink);rect(x,y+16,w,20,C.line,'none',6);rect(x,y+16,Math.max(1,w*clamp(val)),20,color,'none',6);text(x+w,y,display===undefined?Math.round(val*100)+'%':display,27,color,'end',600)}
function network({fault=false,sourceOff=false,alternate=false,busOff=false,storage=false,cooling=false,p=0,flow=false}={}){
 const active=busOff?C.gray:C.green;box(65,173,290,138,'Source A',sourceOff?'Unavailable':'Available',sourceOff?C.red:C.blue,sourceOff?C.redbg:C.pale);box(65,423,290,138,'Source B','Capacity assumed',C.blue);
 arrow([[355,242],[650,242]],sourceOff||busOff?C.gray:active);arrow([[355,492],[650,492]],busOff?C.gray:active);line(650,195,650,595,active,12);text(650,142,'Shared DC bus',29,C.blue,'middle',600);
 box(1450,173,375,138,'Rack A','Healthy branch',C.blue,busOff?C.pale:C.light);box(1450,423,375,138,'Rack B',fault?'Feeder unavailable':'Single feeder',fault?C.red:C.blue,fault?C.redbg:C.light);
 arrow([[650,242],[1450,242]],active);if(!fault)arrow([[650,492],[1450,492]],active);else{line(650,492,980,492,C.gray,5);line(1090,492,1450,492,C.gray,5);line(980,492,1080,432,C.red,6);dot(980,492,C.red);dot(1090,492,C.red);text(1020,567,'Open feeder',28,C.red,'middle')}
 if(alternate){arrow([[650,595],[650,650],[1390,650],[1390,532],[1450,532]],active,5);text(990,700,'DESIGN ALTERNATIVE · additional feeder',28,C.blue,'middle',600)}
 if(storage){box(800,355,350,96,'Local buffering','',C.teal);line(1150,403,1400,403,C.teal,4,'8 7');line(1400,403,1400,282,C.teal,4,'8 7');line(1400,282,1450,282,C.teal,4,'8 7')}
 if(cooling){box(825,640,430,95,'CDU · separate branch','',C.teal);poly([[650,575],[740,575],[740,687],[825,687]],active,5)}
 if(flow&&!fault){const k=clamp(p);dot(650+780*k,242,active,8);dot(650+780*k,492,active,8)}
 if(busOff){line(630,325,670,365,C.red,6);line(670,325,630,365,C.red,6);chip(785,325,490,'Shared bus unavailable',C.red,C.redbg)}
}
function paths(k,p){network({sourceOff:k===1, fault:k>=2,alternate:k>=3,busOff:k===4&&p>.35,p:p*1.4,flow:k===0});
 if(k===0)chip(780,333,480,'N+1 capacity ≠ two rack paths');
 if(k===1)chip(810,340,530,'Topology permits supply · verify response',C.green,C.light);
 if(k===2)chip(770,333,570,'Capacity remains upstream of the break',C.red,C.redbg);
 footer(['Trace capacity and the complete source-to-load route.','Case A: the remaining source has intact paths.','Case B: a spare source cannot bridge an open feeder.','The new route bypasses this feeder boundary only.','Two feeders can still share one bus dependency.'][k],'Topology illustration · continuity depends on equipment behavior and evidence');
}
function precharge(k,p){
 const titles=[['Connector','Presence + precharge'],['Input filter','Parasitic capacitance'],['Hot-swap control','Controlled current'],['Bulk capacitance','Stored energy'],['DC/DC + load','Enable separately']];const xs=[65,425,785,1145,1505];
 titles.forEach((a,i)=>box(xs[i],180,310,150,a[0],a[1],(k===1&&i<2)||(k===2&&i===2)||(k===3&&i===4)?C.green:C.blue));for(let i=0;i<4;i++)arrow([[xs[i]+310,255],[xs[i+1],255]],k===4?C.gray:C.green);
 text(70,135,'FUNCTIONAL POWER PATH · rack input',27,C.gray);text(1750,382,'Isolation and PE have separate functions',25,C.gray,'end');
 const ch=chart(80,468,1120,239,'Input current across distinct events','Relative current','Connection       Bulk charging       Load enable →');
 const pts=[[0,.05],[.12,.05],[.15,.79],[.19,.79],[.23,.08],[.36,.08],[.40,.23],[.58,.23],[.62,.10],[.74,.10],[.80,.9],[1,.9]];
 const end=k===0?0:k===1?lerp(.1,.31,ease(p*1.9)):k===2?lerp(.35,.69,ease(p*1.8)):k===3?lerp(.73,1,ease(p*1.8)):.70;
 if(k!==4){curve(ch,pts,C.blue,end);cursor(ch,end)}else{curve(ch,pts.slice(0,8),C.gray,1);line(ch.X(.69),ch.y+10,ch.X(.69),ch.y+ch.h,C.red,4,'8 7');text(ch.X(.72),ch.y+100,'Enable inhibited',28,C.red)}
 const v=k<2?0:k===2?ease(p*1.6):k===3?1:.45;
 note(k===4?'Alternative fault case':k===2?'Controlled bulk charging':k===3?'Operating load':k===1?'Initial inrush mitigation':'Identify the responsibilities',k===4?['Charging/readiness not accepted','Defined inhibit or turn-off','Stored energy may remain']:k===2?['Input current is controlled','Capacitor voltage rises','Limits set by implementer']:k===3?['Charging readiness accepted','Converter enable is separate','Current follows the load']:k===1?['Brief connection event','Parasitics charge first','Connector design sets sequence']:['Connection ≠ bulk charging','Bulk charging ≠ load enable','Each needs acceptance evidence']);
 meter(1390,716,415,'Bulk voltage',v,k===4?C.amber:C.teal,k===4?'Unverified':k<2?'Not charged':Math.round(v*100)+'% relative');
 footer(['Separate the initial connection, bulk charging and load enable.','Precharge contacts address the initial connection event.','The hot-swap controller charges downstream bulk capacitance.','Only the required conditions permit downstream load enable.','Switching off does not prove absence of stored energy.'][k],'Functional redraw: paper Figures 9.6–9.10 · illustrative levels and expanded event spacing');
}
function midpoint(k,p){
 const q=ease(p*1.6);let ip=k<2?1:k===2?lerp(1,1.6,q):k===3?lerp(1.6,.6,q):.6,im=k<3?1:k===3?lerp(1,1.4,q):1.4;if(k===0){ip=im=1}const diff=ip-im;
 box(60,165,300,450,['Bipolar','source'],'L+ / M / L−',C.blue);box(1060,185,260,150,['Positive-pole','load'],'',C.blue,C.light);box(1060,445,260,150,['Negative-pole','load'],'',C.blue,C.light);
 poly([[360,210],[890,210],[1060,210]],C.blue,5);poly([[1320,260],[1400,260],[1400,390],[360,390]],C.teal,5);poly([[360,570],[890,570],[1060,570]],C.amber,5);poly([[1320,515],[1440,515],[1440,390],[1400,390]],C.teal,5);
 // Explicit conventional current loops: positive pole outward; negative pole return.
 arrow([[520,210],[730,210]],C.blue,6);arrow([[1400,282],[1400,370]],C.teal,6);dot(1400,390,C.teal,5);arrow([[730,570],[520,570]],C.amber,6);arrow([[1380,390],[1440,390],[1440,515],[1320,515]],C.amber,5);
 if(Math.abs(diff)>.02){if(diff>0)arrow([[740,390],[535,390]],C.teal,6);else arrow([[535,390],[740,390]],C.teal,6)}
 text(390,185,'L+',30,C.blue);text(390,370,'M',30,C.teal);text(390,616,'L−',30,C.amber);
 text(810,272,'I+ = '+ip.toFixed(2),30,C.blue,'middle',600);text(810,520,'I− = '+im.toFixed(2),30,C.amber,'middle',600);
 chip(480,310,460,Math.abs(diff)<.02?'Shared M: currents cancel':'Shared M: '+(diff>0?'← ':'→ ')+Math.abs(diff).toFixed(2),C.teal,C.pale);
 line(85,694,1440,694,C.gray,4,'10 8');text(85,746,'PE · protective function, separate from the normal load return',29,C.gray);
 note('Normalized currents',['I+ / I−: pole currents','M: current difference','Direction follows','the imbalance'],C.blue,1500,175,365,358);
 meter(1530,576,290,'I+',ip/1.8,C.blue,ip.toFixed(2));meter(1530,668,290,'I−',im/1.8,C.amber,im.toFixed(2));
 footer(['Declare the load connections and current directions.','Equal pole loads cancel in the shared midpoint segment.','Unequal demand creates normal midpoint current.','The opposite imbalance reverses midpoint-current direction.','Include unequal operating states in sizing and protection.'][k],'Conventional current · normalized magnitudes · no conductor rating is prescribed');
}
function faultNetwork(k,p){
 const t=k===0?0:k===1?.3:(k===2||k===3)?ease(p*1.7):1,clear=k===3?.76:.49;
 const fault=t>=.18,opened=(k>=2&&t>=clear),lost=k===3&&t>.64;
 box(60,180,260,120,'Converter','Response varies',C.blue);box(60,385,260,130,['Bus stored','energy'],'',C.teal);line(540,195,540,485,fault&&!opened?C.amber:C.blue,10);arrow([[320,240],[540,240]],C.green);arrow([[320,450],[540,450]],C.teal);
 box(1180,180,360,120,'Healthy rack',lost?'Tolerance exceeded':'Input storage',lost?C.red:C.blue,lost?C.redbg:C.light);box(1180,390,360,120,fault?'Faulted rack':'Rack B',fault?'Branch fault':'Selected branch',fault?C.red:C.blue,fault?C.redbg:C.pale);arrow([[540,240],[1180,240]],fault&&!opened?C.amber:C.green);
 if(!opened){arrow([[540,450],[1180,450]],fault?C.red:C.green);if(fault){arrow([[1180,280],[950,280],[950,450],[1180,450]],C.teal);text(915,343,'Possible reverse contribution',26,C.teal,'middle');}}
 else{line(540,450,810,450,C.gray,5);line(915,450,1180,450,C.gray,5);line(810,450,902,392,C.red,6);text(860,514,'Branch open',26,C.red,'middle')}
 if(fault&&!opened){dot(580+480*ease(p*1.8),450,C.red,10);chip(1590,197,265,'Fault active',C.red,C.redbg)}
 if(opened)chip(1590,197,265,'Fault cleared',C.blue);
}
function selectivity(k,p){faultNetwork(k,p);const ch=chart(80,602,1130,115,'Healthy-load input voltage','Relative voltage','');const A=[[0,.92],[.17,.92],[.22,.27],[.49,.27],[.57,.92],[1,.92]],B=[[0,.92],[.17,.92],[.22,.27],[.76,.27],[.86,.92],[1,.92]];
 rect(ch.X(.64),ch.Y(.64),ch.w*.36,ch.h*.64,C.redbg,'none',0);text(ch.x,ch.y+ch.h+39,'Event sequence →',24,C.gray);text(ch.X(.65),ch.y+ch.h+39,'Shaded: beyond tolerance',23,C.red);
 const t=k===0?0:k===1?Math.min(.29,ease(p)*.29):k===2?ease(p*1.7):k===3?ease(p*1.7):1;
 curve(ch,k===3?B:A,k===3?C.red:C.blue,t);if(k===4)curve(ch,B,C.red,1,4);cursor(ch,t);line(ch.X(.64),ch.y,ch.X(.64),ch.y+ch.h,C.red,2,'5 6');
 note(k===3?'Case B · service lost':k===4?'Same final breaker state':k===2?'Case A · tolerance retained':'Coordinate the system',k===3?['Longer voltage disturbance','Load tolerance exceeded first','Later clearing is insufficient']:k===4?['A: assumed tolerance retained','B: assumed tolerance exceeded','Real waveforms decide']:k===2?['Branch interrupts in time','Bus recovery also required','Tolerance is case-specific']:['Multiple current contributions','Healthy branch can back-feed','Verify each interface'],k===3?C.red:C.blue,1280,553,575,225);
 footer(['Protect the intended service as well as interrupting the fault.','A healthy branch can contribute current toward another branch’s fault.','Case A: recovery occurs within the assumed load tolerance.','Case B: interruption succeeds, but the healthy load drops out first.','Compare validated waveforms, protection actions and load tolerance.'][k]);
}
function envelope(k,p){
 box(65,165,310,165,'Source terminals','Vs',C.blue);box(1430,165,400,165,'Rack input terminals','Vload',C.blue,C.light);arrow([[375,210],[1430,210]],C.green);arrow([[1430,300],[375,300]],C.blue);text(900,173,'Outgoing conductor',28,C.gray,'middle');text(900,349,'Return conductor',28,C.gray,'middle');
 if(k<2){chip(610,244,590,k===0?'Vload = Vs − distribution drop':'Paper example · 200 kW / 250 A');const q=k===0?0:ease(p*1.5);meter(80,438,1120,'Lower-side margin in the paper example',1,C.blue,'20 V');rect(80,510,1120*(7.6/20)*q,55,C.amber);rect(80+1120*(7.6/20)*q,510,1120*(1-7.6/20*q),55,C.green);text(90,611,'Resistive drop: '+(7.6*q).toFixed(1)+' V',30,C.amber);text(1180,611,'Remaining: '+(20-7.6*q).toFixed(1)+' V',30,C.green,'end');note('Figure 5.16 · p. 76',['Short interconnect: 1 m','Distribution example: 200 m','120 mm² copper assumption','Resistive effect only'],C.blue,1290,410,565,322);}
 else{const ch=chart(80,455,1120,238,k===2?'Separate qualitative load-change case':'Delivered voltage versus load tolerance','Relative voltage');const pts=[[0,.90],[.15,.90],[.3,.76],[.48,.63],[.61,.38],[.80,.38],[.95,.86],[1,.86]];let t=k===2?ease(p*1.5):1;curve(ch,pts,C.blue,t);if(k>=3){rect(ch.X(.8),ch.Y(.53),ch.w*.2,ch.h*.53,C.redbg,'none',0);curve(ch,pts,C.blue,1);const good=[[0,.9],[.15,.9],[.3,.76],[.48,.63],[.61,.38],[.67,.38],[.74,.86],[1,.86]];curve(ch,good,C.green,k===3?ease(p*1.8):1,4);line(ch.X(.8),ch.y,ch.X(.8),ch.y+ch.h,C.red,3,'5 6');text(ch.X(.805),ch.Y(.13),'Too long',24,C.red);legend(150,753,[['Longer excursion',C.blue],['Earlier recovery',C.green]])}else{cursor(ch,t);text(ch.X(.63),ch.y+65,'Current limit',26,C.amber)}
 note(k===4?'Required interface evidence':k===3?'Magnitude + duration':'Demand rises',k===4?['Validated source envelope','Actual distribution effects','Load voltage / time / power','Recovery operating states']:k===3?['Compare actual load tolerance','Stored energy matters','Nominal voltage is insufficient']:['Current and cable drop rise','Delivered voltage falls','Available power can be limited'],C.blue,1290,415,565,325);}
 footer(['Measure voltage at the connected load boundary.','Distribution can consume operating-band margin.','The numerical cable example is not this transient.','Two excursions can have different compatibility outcomes.','Agree the source, distribution and load envelopes together.'][k],k===1?'Paper Figure 5.16 · stated example assumptions retained; not a sizing prescription':'Illustrative transient · not a universal voltage-time or current-limit curve');
}
function storage(k,p){
 box(55,155,320,135,'Upstream supply','Sustained power',C.blue);box(570,155,370,135,'DC distribution','Shared bus',C.blue);box(1400,155,430,135,'IT rack + buffer','Local support',C.teal);arrow([[375,223],[570,223]],C.blue);arrow([[940,223],[1400,223]],C.green);box(570,342,370,100,'Bus storage','',C.teal);line(755,290,755,342,C.teal,5);box(1400,342,430,100,'CDU · separate branch','',C.blue);poly([[1080,223],[1080,392],[1400,392]],k===4?C.amber:C.green,5);
 if(k===0||k===4){note(k===4?'Local buffer boundary':'Three response roles',k===4?['Rack buffer supports the rack','No return route to this CDU','Cooling needs its own evidence']:['Local buffer: rapid mismatch','Bus storage: wider support','Source: sustained demand'],C.blue,70,500,960,248);note('Useful service needs cooling',['Electrical path + controls','Readiness and flow conditions','Deschutes: CDU interfaces'],C.teal,1100,500,730,248);if(k===4){line(1340,318,1400,318,C.red,5);text(1295,320,'×',45,C.red,'middle')}}
 else{const ch=chart(70,525,1140,181,k===3?'Separate recovery time window':'Normalized incremental power at the load boundary','Relative power');
 if(k===1){let ptsL=[],ptsB=[],ptsS=[];for(let i=0;i<=60;i++){let x=i/60,s=x<.12?0:clamp((x-.12)/.72),l=x<.12?0:Math.max(0,.55*(1-s*2)),b=x<.12?0:(1-s-l);ptsL.push([x,l*.85]);ptsB.push([x,b*.85]);ptsS.push([x,(x<.12?0:s)*.85]);}curve(ch,[[0,0],[.12,0],[.12,.85],[1,.85]],C.ink,1,3);curve(ch,ptsL,C.teal,ease(p*1.8));curve(ch,ptsB,C.green,ease(p*1.8));curve(ch,ptsS,C.blue,ease(p*1.8));legend(110,754,[['Local',C.teal],['Bus storage',C.green],['Upstream',C.blue]]);note('Contributions overlap',['Illustrative normalized model','Local + bus + source = load','Sharing is equipment-specific'],C.blue,1300,500,560,248);}
 if(k===2){const t=ease(p*1.5);rect(ch.X(.15),ch.Y(.65),ch.w*.70*t,ch.h*.65,C.light,'none',0);curve(ch,[[0,0],[.15,0],[.15,.65],[.85,.65],[.85,0],[1,0]],C.green,Math.max(.15,.15+.85*t));text(ch.X(.48),ch.Y(.25),'Energy = area under power',28,C.teal,'middle');note('Rate and amount differ',['Power: how fast','Energy: how much over time','Both can limit the support'],C.blue,1300,500,560,248);}
 if(k===3){curve(ch,[[0,.45],[1,.45]],C.blue);curve(ch,[[0,.45],[.15,.45],[.4,.78],[.7,.78],[.95,.45],[1,.45]],C.amber,ease(p*1.8));legend(130,754,[['Continuing load',C.blue],['Load + recharge',C.amber]]);note('Recharging is another load',['Recover the energy deliberately','Respect source headroom','Coordinate the recovery ramp'],C.blue,1300,500,560,248);}}
 footer(['Locate storage and the equipment it can actually support.','Power contributions can overlap; they are not exclusive handoffs.','Energy accumulates while storage delivers power.','Recovery must allow for the continuing load plus recharge.','A rack buffer cannot energize the separately drawn CDU branch.'][k]);
}
function states(k,p){
 const nodes=[['Readiness',70,175],['Precharge',580,175],['Energized',1090,175]];nodes.forEach(([t,x,y],i)=>box(x,y,350,120,t,'',k===1&&p>(i/4)?C.green:C.blue));arrow([[420,235],[580,235]],k===2?C.gray:C.green);arrow([[930,235],[1090,235]],k===2?C.gray:C.green);text(500,146,k===2?'Inhibited':'Permitted',25,k===2?C.red:C.green,'middle');text(1010,146,k===2?'Not admitted':'Confirmed',25,k===2?C.gray:C.green,'middle');
 const labels=['Capacity','Protection','Storage','Cooling'];labels.forEach((s,i)=>chip(60+i*335,360,300,s+(k===2&&i===3?' · absent':' · required'),k===2&&i===3?C.red:C.blue,k===2&&i===3?C.redbg:C.pale));
 if(k===0){note('Condition → action → owner',['Define the signal and responsibility','Specify false or missing conditions','Retain transition evidence'],C.blue,80,480,1100,264);note('Example owner roles',['Equipment controls','Facility coordination','Operator verification'],C.blue,1250,470,605,274)}
 if(k===1){const ch=chart(90,515,1000,175,'Admission sequence','Relative input voltage');curve(ch,[[0,0],[.25,0],[.65,.88],[1,.88]],C.teal,ease(p*1.7));note('Normal operation is a state',['Checks permit precharge','Readiness permits load enable','No mandatory fault follows'],C.blue,1250,460,605,284)}
 if(k===2){arrow([[240,295],[240,500]],C.red);box(80,500,950,150,'Admission remains blocked','Supply voltage does not establish cooling readiness',C.red,C.redbg);note('Defined cooling permissive',['Required CDU readiness / flow','Signal validity and ownership','Approved exception response'],C.blue,1120,480,735,264)}
 if(k===3){const ch=chart(90,505,1060,195,'Separate recovery case','Aggregate demand');curve(ch,[[0,.2],[.2,.2],[.22,.95],[.7,.95],[1,.68]],C.red,ease(p*1.6));curve(ch,[[0,.2],[.2,.2],[.25,.35],[.45,.35],[.5,.5],[.7,.5],[.75,.68],[1,.68]],C.green,ease(p*1.6));legend(150,756,[['Simultaneous return',C.red],['Staged return',C.green]]);note('Include recharge demand',['Check source headroom','Confirm cooling + protection','Coordinate utility recovery'],C.blue,1250,470,605,274)}
 if(k===4){arrow([[1280,295],[1280,325],[1415,325],[1415,457],[880,457],[880,525]],C.red);box(670,525,420,140,'Fault lockout','Reset has prerequisites',C.red,C.redbg);arrow([[1420,295],[1550,295],[1550,525]],C.gray);box(1180,525,675,140,'Maintenance route','Isolation · discharge · verification',C.gray);text(935,436,'Detected fault',27,C.red,'middle');text(1550,466,'Maintenance request',27,C.gray,'middle');box(65,525,470,140,'Owner + acceptance record','For every transition',C.blue)}
 footer(['A transition needs conditions, ownership and evidence.','Readiness and precharge lead to permitted operation.','Alternative case: cooling unavailable, so admission is inhibited.','Recovery coordinates rack return and storage recharge.','Fault lockout and maintenance are separate conditional branches.'][k],'Conceptual sequence · actual site thresholds, delays and verification remain defined requirements');
}
function noise_paths(k,p){
 rect(70,170,330,395,C.pale,C.blue);rect(1460,170,360,395,C.pale,C.blue);
 lines(235,488,['Converter','enclosure'],30,C.ink,40,'middle',600);lines(1640,488,['Load','enclosure'],30,C.ink,40,'middle',600);
 line(400,235,1460,235,C.blue,5);line(400,375,1460,375,C.blue,5);line(230,665,1640,665,C.gray,6);line(230,565,230,665,C.gray,5);line(1640,565,1640,665,C.gray,5);
 text(970,178,'Power conductors',29,C.blue,'middle');
 // Noise-source equivalent and load impedance close the differential-mode circuit.
 poly([[400,235],[235,235],[235,266]],C.blue,4);poly([[235,346],[235,375],[400,375]],C.blue,4);
 raw('<circle cx="235" cy="306" r="40" fill="white" stroke="'+C.blue+'" stroke-width="3"/>');text(235,320,'~',42,C.blue,'middle');
 poly([[1460,235],[1640,235],[1640,262],[1624,274],[1656,290],[1624,306],[1656,322],[1640,338],[1640,375],[1460,375]],C.blue,4);
 if(k===1){arrow([[480,235],[1370,235]],C.teal,7);arrow([[1370,375],[480,375]],C.teal,7);dot(480+850*ease(p*1.6),235,C.teal,9);dot(1330-850*ease(p*1.6),375,C.teal,9);chip(585,562,770,'Differential mode · one complete outgoing / return loop',C.teal,C.light)}
 if(k>=2){
 arrow([[480,235],[1350,235]],C.amber,6);arrow([[480,375],[1350,375]],C.amber,6);
 // Separate coupling capacitors; crossings without dots are not conductor junctions.
 for(const [x,y]of [[1175,235],[1340,375]]){poly([[x,y],[x,485]],C.amber,4);dot(x,y,C.amber,5);line(x-24,485,x+24,485,C.amber,5);line(x-24,501,x+24,501,C.amber,5);line(x,501,x,665,C.amber,4);dot(x,665,C.amber,5)}
 arrow([[1320,665],[505,665]],C.amber,6);
 poly([[480,665],[480,522]],C.amber,4);line(455,522,505,522,C.amber,5);line(455,506,505,506,C.amber,5);poly([[480,506],[480,442],[440,442],[440,235]],C.amber,4);text(1260,582,'Coupling C',25,C.amber,'middle');text(515,556,'Source coupling',27,C.amber);dot(505+790*(1-ease(p*1.6)),665,C.amber,8);
 chip(560,706,810,'Common mode · return through capacitance and bonding',C.amber,C.pale);
 }
 if(k>=3){rect(690,207,130,56,C.white,C.teal,7);rect(690,347,130,56,C.white,C.teal,7);text(755,136,'Illustrative filter',27,C.teal,'middle');line(755,403,755,486,C.teal,4);line(730,486,780,486,C.teal,5);line(730,502,780,502,C.teal,5);arrow([[755,502],[755,665]],C.teal,5);text(800,596,'Changed HF return',26,C.teal);}
 footer(['High-frequency current uses a complete circuit.','Differential mode: current returns on the other power conductor.','Common mode: trace capacitance, enclosure and bonding paths.','Filtering redirects high-frequency current; it does not erase it.','Review actual paths and representative system behavior.'][k],'Representative directions · crossings without dots are not connections · conceptual filter');
}
function scenario_fault(k,p){
 if(k<2){network({fault:k===1&&p>.45,storage:true,cooling:true,p,flow:k===0});if(k===1&&p<=.45)chip(800,325,560,'Branch fault · bus disturbance',C.red,C.redbg)}
 else if(k===2||k===4){const rows=k===2?[['Healthy-rack route','Present after isolation','Topology'],['Rack A ride-through','Tolerance evidence missing','Unknown'],['Rack buffer energy','Availability not established','Unknown'],['CDU continuity','Own supply and controls','Unknown']]:[['Rack B continuity','Only feeder unavailable','Not established'],['Rack A service','Path exists; behavior unproven','Conditional'],['Cooling + storage','Representative evidence needed','Open action'],['Recovery sequence','Owner + acceptance criterion','Open action']];
 const widths=[560,880,380],xx=[55,615,1495];['Review boundary','Finding in this proposal','Evidence status'].forEach((s,i)=>{rect(xx[i],155,widths[i]-15,64,C.blue);text(xx[i]+22,198,s,29,C.white,'start',600)});rows.forEach((r,i)=>{r.forEach((s,j)=>{rect(xx[j],245+i*115,widths[j]-15,95,i%2?C.pale:'#FAFBFC');text(xx[j]+23,302+i*115,s,29,j===2?C.amber:C.ink,'start',j===2?600:400)})})}
 else{states(3,p);return}
 footer(['Keep the declared single-feeder scenario and its assumptions.','Isolate the intended faulted branch; assess both rack outcomes.','A viable route is necessary, but service still needs evidence.','Recovery must include cooling readiness and storage recharge.','State what is established, conditional and still unresolved.'][k],'Design-review scenario · no simulated or certified service-continuity result is claimed');
}
const renderers={paths,precharge,midpoint,selectivity,envelope,storage,states,noise_paths,scenario_fault};
function render(data,seconds){O=[];const chapters=data.chapters;let k=chapters.findIndex(c=>seconds<c.end);if(k<0)k=chapters.length-1;const c=chapters[k];const p=clamp((seconds-c.start)/Math.max(1,c.end-c.start));
raw(`<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="900" viewBox="0 0 1920 900" role="img" aria-label="${esc(data.title)}"><rect width="1920" height="900" fill="white"/><g font-family="Open Sans,Arial,sans-serif">`);
text(55,57,c.title,40,C.blue,'start',600);text(1865,55,`${k+1} / ${chapters.length}`,27,C.gray,'end');line(55,92,1865,92,C.line,2);
if(renderers[data.asset])renderers[data.asset](k,p);raw('</g></svg>');return O.join('');}
global.LVDCVideo={render,colors:C};if(typeof module!=='undefined')module.exports=global.LVDCVideo;
})(typeof window!=='undefined'?window:globalThis);
