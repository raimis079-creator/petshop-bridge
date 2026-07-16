import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'s3',content:Buffer.from(JSON.stringify(o,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function wg(p){try{return execSync(`curl -sk -m 60 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 60 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={pages:{}};
// 1. puslapiuojam
let all=[];
for(let p=1;p<=6;p++){
  const r=wg(`code-snippets/v1/snippets?per_page=100&page=${p}`);
  let a=[]; try{a=JSON.parse(r);}catch(e){ o.pages['p'+p]='parse err'; break; }
  if(!Array.isArray(a)||!a.length){ o.pages['p'+p]=0; break; }
  o.pages['p'+p]=a.length;
  all=all.concat(a);
  if(a.length<100) break;
}
const uniq=new Map(); for(const s of all) uniq.set(s.id,s);
const A=[...uniq.values()];
o.total=A.length;
o.max_id=A.length?Math.max(...A.map(s=>s.id)):0;
// 2. sesijos snippetai
const mine=A.filter(s=>s.id>=1018).sort((a,b)=>a.id-b.id);
o.session=mine.map(s=>({id:s.id,name:(s.name||'').slice(0,54),active:s.active}));
// 3. isjungiam likusius aktyvius
const strays=mine.filter(s=>s.active);
o.strays=strays.map(s=>s.id);
for(const s of strays){ wj('POST',`code-snippets/v1/snippets/${s.id}`,{active:false}); }
// 4. patikra is naujo
let all2=[];
for(let p=1;p<=6;p++){
  const r=wg(`code-snippets/v1/snippets?per_page=100&page=${p}`);
  let a=[]; try{a=JSON.parse(r);}catch(e){ break; }
  if(!Array.isArray(a)||!a.length) break;
  all2=all2.concat(a); if(a.length<100) break;
}
const u2=new Map(); for(const s of all2) u2.set(s.id,s);
o.session_still_active=[...u2.values()].filter(s=>s.id>=1018 && s.active).map(s=>s.id);
o.all_active=[...u2.values()].filter(s=>s.active).map(s=>({id:s.id,name:(s.name||'').slice(0,46)}));
pr('s3.json',o); console.log('DONE');
