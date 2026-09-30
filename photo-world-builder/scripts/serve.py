#!/usr/bin/env python3
"""Serve only the selected world on loopback; keep the port stable for saves."""
import argparse,webbrowser
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control','no-store')
        super().end_headers()
ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('directory');ap.add_argument('--port',type=int,default=5197);ap.add_argument('--open',action='store_true');a=ap.parse_args();root=Path(a.directory).expanduser().resolve()
if not (root/'index.html').is_file():ap.exit(1,'目录没有 index.html\n')
try:server=ThreadingHTTPServer(('127.0.0.1',a.port),partial(Handler,directory=str(root)))
except OSError as e:ap.exit(1,f'端口不可用：{e}。使用现有预览或换端口；换端口会使用新存档。\n')
print(f'http://127.0.0.1:{a.port}/',flush=True)
if a.open:webbrowser.open(f'http://127.0.0.1:{a.port}/')
try:server.serve_forever()
except KeyboardInterrupt:server.server_close()
