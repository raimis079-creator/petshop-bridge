import { execSync } from "child_process";
import fs from "fs";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(method,url,body){
  let cmd='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+method+' ';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  cmd+='"'+url+'" 2>/dev/null || echo ERR';
  const code=execSync(cmd,{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}
const CODE=fs.readFileSync('petshop_cmplz_probe2.php','utf8');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
try{
  const list=api('GET',API+'?per_page=100'); const arr=JSON.parse(list.body);
  const ex=arr.find(s=>s.name&&s.name.includes('Complianz integracijos probe'));
  const payload={name:'TEMP — Complianz integracijos probe v2 (token)',desc:'Recon.',code:CODE,scope:'front-end',active:true,priority:6,tags:['temp']};
  let id;
  if(ex){ api('POST',API+'/'+ex.id,payload); id=ex.id; } else { const r=api('POST',API,payload); id=JSON.parse(r.body).id; }
  L('probe2 snippet id='+id);
  const chk=api('GET',API+'/'+id); if(chk.code==='200'){const j=JSON.parse(chk.body); L('active='+j.active+' code_error='+JSON.stringify(j.code_error||null));}
  L('');
  await new Promise(r=>setTimeout(r,3000));
  const p=get('https://dev.avesa.lt/?cmplz_probe2=1&token='+TOKEN);
  L('HTTP '+p.code);
  L(p.body.slice(0,6000));
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('cmplz_integrations.txt', out); console.log(out);
