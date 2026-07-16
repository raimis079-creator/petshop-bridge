import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'s2',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function wg(p){try{return execSync(`curl -sk -m 60 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const r=wg('code-snippets/v1/snippets?per_page=100');
let arr=[]; try{arr=JSON.parse(r);}catch(e){o.parse_err=r.slice(0,200);}
o.n=Array.isArray(arr)?arr.length:0;
if(Array.isArray(arr)){
  o.ids=arr.map(s=>s.id).sort((a,b)=>a-b);
  o.max_id=Math.max(...arr.map(s=>s.id));
  o.active=arr.filter(s=>s.active).map(s=>({id:s.id,name:(s.name||'').slice(0,50)}));
  o.recent=arr.filter(s=>s.id>=1000).map(s=>({id:s.id,name:(s.name||'').slice(0,50),active:s.active}));
}
// ar #1044 dar egzistuoja
const one=wg('code-snippets/v1/snippets/1044');
o.snippet_1044=one.slice(0,220);
pr('s2.json',o); console.log('DONE');
