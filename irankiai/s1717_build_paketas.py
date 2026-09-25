# -*- coding: utf-8 -*-
"""S1717 — deploy paketo surinkimas (paleisti, kai Raimis sako „daryk"):
   python3 build_paketas.py  →  t.php (2.14 gyvi pakeitimai) ir v.php (tekstai) šalia šio failo.
   t.php: fazės 1 sausas / 2 failai / 3 RM opcijos+meta / 4 patikra / 9 atstatyti.
   v.php: fazės 1 sausas / 2 tekstai į term description / 3 patikra / 9 atstatyti.
   Paleidimas iš VM: cd ~/mnt/ps-bridge && ./br_c.sh s1717/t.php 1 analize/s1717_t1.json ps_s1717t  (po vieną fazę, timeout 178)
"""
import base64, hashlib, json, os, sys
D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(D, 'tekstai'))
from hubai import HUBAI
from gamintojai_1 import GAMINTOJAI_1
from gamintojai_2 import GAMINTOJAI_2

t = open(os.path.join(D, 't_template.php'), encoding='utf-8').read()
for key, fn in [('SCHEMA', 'petshop-schema-prekes.php'), ('GSC', 'petshop-gsc-tvarka.php'), ('SEO', 'petshop-seo-sablonai.php')]:
    d = open(os.path.join(D, 'deploy', fn), 'rb').read()
    t = t.replace('__B64_' + key + '__', base64.b64encode(d).decode()).replace('__MD5_' + key + '__', hashlib.md5(d).hexdigest())
open(os.path.join(D, 't.php'), 'w', encoding='utf-8').write(t)

T = [dict(tax='product_cat', slug=h['slug'], id=h['id'], html=h['tekstas']) for h in HUBAI] + \
    [dict(tax='product_brand', slug=g['slug'], html=g['tekstas']) for g in GAMINTOJAI_1 + GAMINTOJAI_2]
v = open(os.path.join(D, 'v_template.php'), encoding='utf-8').read().replace('__TEKSTAI_B64__', base64.b64encode(json.dumps(T, ensure_ascii=False).encode('utf-8')).decode())
open(os.path.join(D, 'v.php'), 'w', encoding='utf-8').write(v)
print('t.php', len(t), 'v.php', len(v), 'tekstu', len(T))
