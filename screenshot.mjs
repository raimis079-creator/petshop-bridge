import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString().trim();}catch(e){return '';}}
function spfOf(name){
  const r=sh('curl -sS -H "accept: application/dns-json" "https://dns.google/resolve?name='+name+'&type=TXT"');
  try{ const j=JSON.parse(r);
    const recs=(j.Answer||[]).map(a=>a.data.replace(/^"|"$/g,'').replace(/" "/g,''));
    return recs.filter(x=>/^v=spf1/i.test(x))[0] || null;
  }catch(e){ return null; }
}
const O={tree:[]};
function walk(name, depth){
  const rec=spfOf(name);
  O.tree.push({depth, name, spf: rec || '<<< SPF IRASO NERA >>>'});
  if(!rec) return;
  const inc=(rec.match(/include:[^\s]+/g)||[]).map(x=>x.slice(8));
  for(const i of inc){ if(depth<4) walk(i, depth+1); }
}
walk('petshop.lt',0);
putB64('spf.json', Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
