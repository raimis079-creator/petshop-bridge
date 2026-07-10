import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 45 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}
const CODE=fs.readFileSync('petshop_paysera_probe.php','utf8');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
try{
  const payload={name:'TEMP — Paysera recon v1 (token)',desc:'Recon.',code:CODE,scope:'front-end',active:true,priority:6,tags:['temp']};
  const chk=api('GET',API+'/624');
  let id;
  if(chk.code==='200'){ api('POST',API+'/624',payload); id=624; } else { const r=api('POST',API,payload); id=JSON.parse(r.body).id; }
  L('snippet id='+id);
  const v=api('GET',API+'/'+id); if(v.code==='200'){ const j=JSON.parse(v.body); L('code_error='+JSON.stringify(j.code_error||null)); }
  L('');
  await new Promise(r=>setTimeout(r,3000));
  const p=get('https://dev.avesa.lt/?ps_probe=1&token='+TOKEN);
  L('HTTP '+p.code); L('');
  L(p.body.slice(0,6000));
  L('');
  const dz=api('POST',API+'/'+id,{active:false});
  L('TEMP '+id+' deaktyvuota: HTTP '+dz.code);
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('paysera_recon.txt', out); console.log(out);
