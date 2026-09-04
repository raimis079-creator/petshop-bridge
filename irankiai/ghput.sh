#!/bin/bash
# ghput.sh <local> <repo_path> <msg>
T=$(cat /tmp/.ghtok); R=raimis079-creator/petshop-bridge; L="$1"; P="$2"; M="$3"
SHA=$(curl -s -H "Authorization: Bearer $T" "https://api.github.com/repos/$R/contents/$P" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('sha',''))")
python3 - "$L" "$M" "$SHA" <<'PY' > /tmp/ghput.json
import sys,base64,json
l,m,sha=sys.argv[1:4]; b={"message":m,"content":base64.b64encode(open(l,'rb').read()).decode()}
if sha: b["sha"]=sha
json.dump(b,open('/tmp/ghput.json','w'))
PY
C=$(curl -s -o /tmp/ghput_res.json -w "%{http_code}" -X PUT -H "Authorization: Bearer $T" -d @/tmp/ghput.json "https://api.github.com/repos/$R/contents/$P"); echo "$P $C"
