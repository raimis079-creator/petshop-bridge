import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return 'ERR: '+String(e).slice(0,200);}}
const O={};
// dig per Google DoH (nereikia dig binario)
function doh(name,type){
  const r=sh('curl -sS -H "accept: application/dns-json" "https://dns.google/resolve?name='+name+'&type='+type+'"');
  try{ const j=JSON.parse(r); return (j.Answer||[]).map(a=>a.data); }catch(e){ return ['PARSE_ERR '+r.slice(0,120)]; }
}
O.spf_petshop   = doh('petshop.lt','TXT').filter(x=>/spf1/i.test(x));
O.txt_petshop   = doh('petshop.lt','TXT');
O.dmarc         = doh('_dmarc.petshop.lt','TXT');
O.mx            = doh('petshop.lt','MX');
// DKIM selektoriai — Sender ir kiti daznai naudojami
for (const sel of ['sender','sendersrv','s1','s2','default','mail','google','k1','dkim']) {
  const v=doh(sel+'._domainkey.petshop.lt','TXT');
  if (v.length) O['dkim_'+sel]=v.map(x=>x.slice(0,90));
}
// kiek DNS lookup'u SPF isvedziojas (riba 10)
O.spf_includes = (O.spf_petshop[0]||'').match(/include:[^\s"]+/g) || [];
putB64('dns.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
