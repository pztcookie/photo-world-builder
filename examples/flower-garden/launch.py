#!/usr/bin/env python3
import hashlib,json,webbrowser
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from urllib.request import urlopen
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
root=Path(__file__).resolve().parent
config=json.loads((root/'world.json').read_text())
port=5300+int(hashlib.sha256(config['id'].encode()).hexdigest()[:5],16)%1500
url=f'http://127.0.0.1:{port}/'
try:server=ThreadingHTTPServer(('127.0.0.1',port),partial(Handler,directory=str(root)))
except OSError:
    try:
        with urlopen(url+'world.json',timeout=2) as r:existing=json.load(r)
        if existing['id']!=config['id']:raise ValueError()
        print('世界已经打开：'+url);webbrowser.open(url);raise SystemExit(0)
    except (OSError,ValueError,KeyError):raise SystemExit(f'端口 {port} 被占用。把这条提示发给 Codex；没有关闭任何现有服务。')
print('打开 '+url+'；关闭此终端会停止预览。');webbrowser.open(url)
try:server.serve_forever()
except KeyboardInterrupt:server.server_close()
