"""Local-only review server with byte-range support for audio/video seeking."""
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
import os,re,argparse
class Handler(SimpleHTTPRequestHandler):
 protocol_version='HTTP/1.1'
 def log_message(self,*args): pass
 def send_head(self):
  p=Path(self.translate_path(self.path))
  if not p.is_file():
   self.remaining=None
   return super().send_head()
  f=open(p,'rb');size=os.fstat(f.fileno()).st_size;start=0;end=size-1
  spec=self.headers.get('Range')
  if spec:
   m=re.fullmatch(r'bytes=(\d*)-(\d*)',spec.strip())
   if not m or not any(m.groups()):f.close();self.send_error(416);return None
   if m[1]:start=int(m[1]);end=min(int(m[2]) if m[2] else end,end)
   else:start=max(0,size-int(m[2]))
   if start>end or start>=size:
    f.close();self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.send_header('Content-Length','0');self.end_headers();return None
  self.send_response(206 if spec else 200);self.send_header('Content-Type',self.guess_type(str(p)));self.send_header('Accept-Ranges','bytes');self.send_header('Content-Length',str(end-start+1));self.send_header('Last-Modified',self.date_time_string(os.fstat(f.fileno()).st_mtime));self.send_header('Cache-Control','no-cache')
  if spec:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
  self.end_headers();f.seek(start);self.remaining=end-start+1;return f
 def copyfile(self,source,outputfile):
  remaining=getattr(self,'remaining',None)
  try:
   if remaining is None:return super().copyfile(source,outputfile)
   while remaining>0:
    data=source.read(min(256*1024,remaining))
    if not data:break
    outputfile.write(data);remaining-=len(data)
  except (BrokenPipeError,ConnectionResetError):pass
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--port',type=int,default=8765);p.add_argument('--directory',type=Path,required=True);a=p.parse_args();os.chdir(a.directory);print('Local course review on',a.port,flush=True);ThreadingHTTPServer(('127.0.0.1',a.port),Handler).serve_forever()
