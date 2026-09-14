#!/bin/bash
# run.sh <payload.php> <PHASE1[,PHASE2]> <result.json> [get_key] [browser]
set -e
PAY="$1"; PHASES="$2"; OUT="$3"; GKEY="${4:-ps_x}"; BR="${5:-0}"
TOK=$(cat /tmp/.ghtok)
REPO="raimis079-creator/petshop-bridge"
API="https://api.github.com/repos/$REPO"
H="Authorization: Bearer $TOK"
VER="dep-$(date +%H%M%S)"

php -l "$PAY" >/dev/null || { echo "LINT FAIL"; exit 1; }

python3 - "$PAY" "$PHASES" "$OUT" "$GKEY" "$VER" <<'PYEOF'
import sys,base64,json,re
pay,phases,out,gkey,ver=sys.argv[1:6]
b64=base64.b64encode(open(pay,'rb').read()).decode()
tpl=open('/home/claude/ps/mjs_template.mjs').read()
tpl=re.sub(r"const B64='[^']*'","const B64='%s'"%b64,tpl)
tpl=re.sub(r"const VER='[^']*'","const VER='%s'"%ver,tpl)
tpl=re.sub(r"const GKEY='[^']*'","const GKEY='%s'"%gkey,tpl)
tpl=re.sub(r"const PHASES=\[[^\]]*\]","const PHASES=%s"%json.dumps(phases.split(',')),tpl)
tpl=re.sub(r"const OUT='[^']*'","const OUT='%s'"%out,tpl)
import os
tpl=re.sub(r"const DATA=\[[^\]]*\]","const DATA=%s"%json.dumps([x for x in os.environ.get("DATA","").split(",") if x]),tpl)
open('/tmp/mjs_out.mjs','w').write(tpl)
PYEOF

SHA=$(curl -s -H "$H" "$API/contents/screenshot.mjs" | python3 -c "import json,sys;print(json.load(sys.stdin)['sha'])")
python3 - "$SHA" "$VER" <<'PYEOF'
import sys,base64,json
sha,ver=sys.argv[1:3]
json.dump({"message":ver,"content":base64.b64encode(open('/tmp/mjs_out.mjs','rb').read()).decode(),"sha":sha},open('/tmp/put.json','w'))
PYEOF
PS=$(curl -s -o /tmp/putres.json -w "%{http_code}" -X PUT -H "$H" -d @/tmp/put.json "$API/contents/screenshot.mjs")
[ "$PS" = "200" ] || { echo "PUT FAIL $PS"; cat /tmp/putres.json; exit 1; }
echo "PUT ok ($VER), 25s pauze..."
sleep 25

DS=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "$H" -d "{\"ref\":\"main\",\"inputs\":{\"url\":\"x\",\"browser\":\"$BR\"}}" "$API/actions/workflows/298960963/dispatches")
[ "$DS" = "204" ] || { echo "DISPATCH FAIL $DS"; exit 1; }
sleep 15

RID=$(curl -s -H "$H" "$API/actions/runs?per_page=1" | python3 -c "import json,sys;print(json.load(sys.stdin)['workflow_runs'][0]['id'])")
echo "RUN $RID"
LIMIT=40; [ "$BR" = "1" ] && LIMIT=100
for i in $(seq 1 $LIMIT); do
  ST=$(curl -s -H "$H" "$API/actions/runs/$RID" | python3 -c "import json,sys;r=json.load(sys.stdin);print(r['status'],r['conclusion'])")
  echo "[$i] $ST"
  case "$ST" in "completed success") break;; "completed"*) echo "RUN FAIL"; exit 1;; esac
  sleep 8
done

CSHA=$(curl -s -H "$H" "$API/commits?per_page=1" | python3 -c "import json,sys;print(json.load(sys.stdin)[0]['sha'])")
curl -s -H "$H" "https://raw.githubusercontent.com/$REPO/$CSHA/$OUT"
echo
