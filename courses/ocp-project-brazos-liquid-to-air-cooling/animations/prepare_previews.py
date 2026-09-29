from pathlib import Path
import json,html
O=Path(__file__).resolve().parents[1];A=O/'animations'
data=json.loads((A/'storyboards.json').read_text());timed=all(d.get('duration')for d in data)
for d in data:
 if not d.get('duration'):
  cursor=0
  for ch in d['chapters']:
   ch['start']=cursor;cursor+=len(ch['narration'].split())/2.75+.5;ch['end']=cursor
  d['duration']=cursor;d['timing_status']='provisional authoring preview; replace with measured audio before encode'
 page='''<!doctype html><meta charset="utf-8"><link rel="stylesheet" href="../assets/fonts/open-sans.css"><style>html,body{margin:0;background:white;width:1920px;height:900px;overflow:hidden}#stage{width:1920px;height:900px}</style><div id="stage"></div><script src="engine.js"></script><script>const storyboard=DATA;window.animationDuration=storyboard.duration;window.renderAtTime=function(ms){document.getElementById('stage').innerHTML=BrazosVideo.render(storyboard,Math.min(storyboard.duration-.001,Math.max(0,ms/1000)))};renderAtTime(0);</script>'''
 (A/(d['asset']+'.html')).write_text(page.replace('DATA',json.dumps(d,ensure_ascii=False)))
print('Measured timing' if timed else 'Provisional visual previews; no video encoding performed')
