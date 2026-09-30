import importlib.util,json,tempfile,unittest,base64
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
def module(name):
    spec=importlib.util.spec_from_file_location(name,ROOT/'photo-world-builder/scripts'/f'{name}.py');m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
create=module('create_world').create_world
validate=module('validate_world').validate
class TemplateTest(unittest.TestCase):
    def test_create_distinct_portable_worlds_and_refuse_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            a=create(Path(tmp)/'a','一个世界','coast');b=create(Path(tmp)/'b','另一个世界','tea')
            ac=json.loads((a/'world.json').read_text());bc=json.loads((b/'world.json').read_text())
            self.assertNotEqual(ac['id'],bc['id']);self.assertNotIn('name',ac['i18n']['en']);self.assertNotIn('name',ac['i18n']['ja']);self.assertEqual(ac['name'],'一个世界');self.assertEqual(validate(a)[0],[]);self.assertEqual(validate(b)[0],[])
            before=(a/'world.json').read_bytes()
            with self.assertRaises(ValueError):create(a,'覆盖尝试')
            self.assertEqual((a/'world.json').read_bytes(),before)
    def test_photo_copy_is_pending_and_invalid_config_is_rejected(self):
        with tempfile.TemporaryDirectory() as tmp:
            source=Path(tmp)/'reference.png';source.write_bytes(base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII='));out=create(Path(tmp)/'photo-world','照片世界','garden',[source])
            ref=json.loads((out/'references.json').read_text())['items'][0]
            self.assertEqual(ref['status'],'pending-review');self.assertEqual((out/ref['file']).read_bytes(),source.read_bytes());self.assertTrue(validate(out)[1])
            c=json.loads((out/'world.json').read_text());c['decor'][0]['x']=float('nan');(out/'world.json').write_text(json.dumps(c));self.assertTrue(validate(out)[0])
if __name__=='__main__':unittest.main()
