import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'sn',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function wg(p){try{return execSync(`curl -sk -m 60 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const r=wg('code-snippets/v1/snippets?per_page=100');
let arr=[]; try{arr=JSON.parse(r);}catch(e){o.err=r.slice(0,200);}
// sesijos snippetai (id >= 1018) + bet kas aktyvus is musu darbo
const mine=arr.filter(s=>s.id>=1018);
o.mine=mine.map(s=>({id:s.id,name:(s.name||'').slice(0,52),active:s.active}));
const strays=mine.filter(s=>s.active);
o.strays_before=strays.map(s=>s.id);
for(const s of strays){ wj('POST',`code-snippets/v1/snippets/${s.id}`,{active:false}); }
// perskaitom is naujo
const r2=wg('code-snippets/v1/snippets?per_page=100');
let arr2=[]; try{arr2=JSON.parse(r2);}catch(e){}
o.still_active=arr2.filter(s=>s.id>=1018 && s.active).map(s=>({id:s.id,name:(s.name||'').slice(0,40)}));
o.all_active_count=arr2.filter(s=>s.active).length;
pr('sn.json',o); console.log('DONE');
