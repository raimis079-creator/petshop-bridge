import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function putResult(name,obj){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`;let s='';
 try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'snip2',content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:40*1024*1024});}
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U); fs.writeFileSync('/tmp/wpp',P);
function wp(p){ try{ return execSync(`curl -sk -m 40 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:60*1024*1024}).toString(); }catch(e){ return ''; } }
const o={all:[]};
for(let page=1;page<=6;page++){
  const raw=wp(`code-snippets/v1/snippets?per_page=100&page=${page}`);
  let arr; try{arr=JSON.parse(raw);}catch(e){ break; }
  if(!Array.isArray(arr)||!arr.length) break;
  for(const s of arr) o.all.push({id:s.id,name:s.name,active:s.active,scope:s.scope,len:(s.code||'').length});
  if(arr.length<100) break;
}
o.count=o.all.length;
o.feeding=o.all.filter(s=>/feeding|serim|exclusion|quattro/i.test(s.name||''));
o.active=o.all.filter(s=>s.active).map(s=>({id:s.id,name:s.name}));
o.temp=o.all.filter(s=>/temp|probe|dry|test/i.test(s.name||'')).map(s=>({id:s.id,name:s.name,active:s.active}));
// paimam Exclusion HY Feeding pilna koda
const t=o.feeding.find(s=>/Exclusion HY Feeding/i.test(s.name));
if(t){ const raw=wp(`code-snippets/v1/snippets/${t.id}`); try{ o.sample=JSON.parse(raw).code; }catch(e){ o.sample_err=raw.slice(0,200); } }
putResult('snip2.json',o);
console.log('DONE '+o.count);
