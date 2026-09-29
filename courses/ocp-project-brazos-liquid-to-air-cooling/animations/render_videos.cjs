/* Finite PNG-to-H.264 export, using the approved LVDC production settings.
   Run only after measured narration and source geometry review are complete.
   This script never renders course pages or creates a ZIP. */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const {pathToFileURL}=require('url'),{spawn}=require('child_process'),{once}=require('events');
const pw=require('playwright');
const root=path.resolve(__dirname,'..');
const data=JSON.parse(fs.readFileSync(root+'/animations/storyboards.json'));
const names=process.argv.slice(2),queue=data.filter(d=>!names.length||names.includes(d.asset));
const qa=process.env.VIDEO_QA_DIR||path.resolve(root,'../../..','build/brazos-video-qa');fs.mkdirSync(qa,{recursive:true});
const ff=process.env.FFMPEG_BIN||'ffmpeg';
const fps=24,scale=1.5;
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const d of queue){
 if(!d.duration||d.timing_status!=='Measured final narration; one finite pass')throw Error(d.asset+': measured narration is required');
 if(!d.narration_wav||hash(root+'/'+d.narration_wav)!==d.narration_sha256)throw Error(d.asset+': narration changed since scene timing');
 if(Math.abs(d.chapters.at(-1).end-d.duration)>.0001)throw Error(d.asset+': invalid final timing');
}
(async()=>{
 const browser=await pw.chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
 const report=[];
 async function worker(){for(;;){
  const d=queue.shift();if(!d)return;
  const page=await browser.newPage({viewport:{width:1920,height:900},deviceScaleFactor:scale});
  await page.goto(pathToFileURL(root+'/animations/'+d.asset+'.html').href);
  await page.evaluate(()=>document.fonts.ready);
  const master=await page.evaluate(()=>animationDuration);
  if(Math.abs(master-d.duration)>.0001)throw Error('Refresh the HTML from measured storyboards before export: '+d.asset);
  const output=root+'/figures/'+d.asset+'.mp4',temp=output+'.pending.mp4';
  const enc=spawn(ff,['-hide_banner','-y','-f','image2pipe','-vcodec','png','-framerate',String(fps),'-i','pipe:0','-an','-vf','scale=in_range=full:out_range=limited:out_color_matrix=bt709,format=yuv420p','-color_range','tv','-c:v','libx264','-preset','medium','-tune','animation','-crf','8','-pix_fmt','yuv420p','-color_primaries','bt709','-color_trc','bt709','-colorspace','bt709','-movflags','+faststart',temp],{stdio:['pipe','ignore','pipe']});
  let error='';enc.stderr.on('data',s=>{error=(error+s).slice(-5000)});
  const closed=once(enc,'close'),count=Math.ceil(d.duration*fps);
  let old='',buffer=null,unique=0;
  for(let i=0;i<count;i++){
   const svg=await page.evaluate(ms=>{renderAtTime(ms);return document.querySelector('svg').outerHTML},i/fps*1000);
   if(svg!==old){buffer=await page.screenshot({type:'png'});old=svg;unique++;}
   if(!enc.stdin.write(buffer))await once(enc.stdin,'drain');
   if(i&&i%720===0)console.log(d.asset,Math.round(i/count*100)+'%');
  }
  enc.stdin.end();let [code]=await closed;if(code)throw Error(error);fs.renameSync(temp,output);
  const rawTimes=[0,d.duration*.25,d.duration*.5,d.duration*.75,(count-1)/fps,...d.chapters.slice(1).flatMap(c=>[c.start-1/fps,c.start+1/fps])];
  const frames=rawTimes.map(t=>Math.max(0,Math.min(count-1,Math.floor(t*fps))));
  const folder=qa+'/'+d.asset;fs.mkdirSync(folder,{recursive:true});
  for(let j=0;j<frames.length;j++){
   await page.evaluate(ms=>renderAtTime(ms),frames[j]/fps*1000);
   await page.screenshot({path:folder+'/source_'+j+'.png'});
  }
  // Poster retains the final explanatory state when reduced motion is requested.
  const poster=(count-1)/fps;await page.evaluate(ms=>renderAtTime(ms),poster*1000);
  await page.screenshot({path:root+'/figures/'+d.asset+'_poster.png'});
  await page.close();
  const item={asset:d.asset,duration:count/fps,narration:d.duration,fps,width:2880,height:1350,frames:count,uniqueFrames:unique,poster,qaFrames:frames,qaTimes:frames.map(x=>x/fps),bytes:fs.statSync(output).size,sha256:hash(output),narration_sha256:d.narration_sha256};
  fs.writeFileSync(folder+'/encoding.json',JSON.stringify(item,null,2));report.push(item);
  console.log('COMPLETE',d.asset,(count/fps).toFixed(3)+'s',unique+' distinct frames');
 }}
 try{await Promise.all([worker(),worker()]);}finally{await browser.close();}
 fs.writeFileSync(qa+'/encoding_latest.json',JSON.stringify(report,null,2));
})().catch(e=>{console.error(e.message);process.exitCode=1});
