import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return 'ERR '+String(e).slice(0,200);}}
const O={};
O.dig_installed = sh('which dig || echo NO');
if(!/NO/.test(O.dig_installed)){
  O.ns = sh("dig +short NS petshop.lt");
  const nss=(O.ns||'').split('\n').filter(Boolean);
  O.authoritative={};
  for(const n of nss.slice(0,3)){
    O.authoritative[n]=sh('dig +short TXT petshop.lt @'+n.replace(/\.$/,''));
  }
  O.ttl = sh("dig TXT petshop.lt +noall +answer | head -5");
  O.google = sh("dig +short TXT petshop.lt @8.8.8.8");
  O.cloudflare = sh("dig +short TXT petshop.lt @1.1.1.1");
} else {
  O.note='dig nera, naudojam DoH';
  const doh=(n,srv)=>sh('curl -sS -H "accept: application/dns-json" "'+srv+'?name='+n+'&type=TXT"');
  O.google_doh=doh('petshop.lt','https://dns.google/resolve');
  O.cf_doh=doh('petshop.lt','https://cloudflare-dns.com/dns-query');
}
putB64('ns.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
