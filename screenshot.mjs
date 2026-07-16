import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'snip',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
function wp(path){ try{ return execSync(`curl -sk -m 40 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/${path}"`,{maxBuffer:60*1024*1024}).toString(); }catch(e){ return 'ERR:'+e.message.slice(0,120); } }
const o={};
// 1. ar Code Snippets REST prieinamas
const raw = wp('code-snippets/v1/snippets?per_page=100');
o.head = raw.slice(0,200);
try{
  const arr=JSON.parse(raw);
  if(Array.isArray(arr)){
    o.count=arr.length;
    o.list=arr.map(s=>({id:s.id,name:s.name,active:s.active,scope:s.scope,len:(s.code||'').length}));
    const hit=arr.filter(s=>/feeding|serim|exclusion/i.test(s.name||''));
    o.feeding=hit.map(s=>({id:s.id,name:s.name,active:s.active}));
    // paimam Exclusion HY Feeding koda
    const t=arr.find(s=>/Exclusion HY Feeding/i.test(s.name||'')) || hit[0];
    if(t) o.sample={id:t.id,name:t.name,code:(t.code||'').slice(0,6000)};
  }
}catch(e){ o.parse_err=String(e.message).slice(0,200); }
putResult('snip.json',o);
console.log('DONE');
