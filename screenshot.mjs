import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s385',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run385-valymas'};
// visi snippetai su ps_b2 — palikti TIK naujausia
try{
  const ls=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out);
  const rasti=arr.filter(x=>x.name && x.name.indexOf('B2 Creds Form')>=0).map(x=>({id:x.id,name:x.name,active:x.active}));
  O.rasti=rasti;
  const naujausias=Math.max(...rasti.map(x=>x.id));
  O.paliekam=naujausias;
  for(const s0 of rasti){
    if(s0.id!==naujausias && s0.active){
      fs.writeFileSync('/tmp/o.json',JSON.stringify({active:false}));
      const c=sh('curl -sSk --max-time 30 -o /dev/null -w "%{http_code}" '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/o.json "'+API+'/'+s0.id+'"');
      O['isjungtas_'+s0.id]=c.out.trim();
    }
  }
  // patikra po
  const ls2=sh('curl -sSk --max-time 40 '+AUTH+' "'+API+'?per_page=100"');
  O.po=JSON.parse(ls2.out).filter(x=>x.name&&x.name.indexOf('B2 Creds Form')>=0).map(x=>({id:x.id,active:x.active}));
}catch(e){O.klaida=String(e).slice(0,200);}
// ar forma dabar rodo NAUJA versija
const h=sh('curl -sSk --max-time 40 "'+SITE+'/?ps_b2=B2setup-9fK3xQ7mZp"');
O.http=h.out.length;
O.nauja_versija = /atrodo netinkamas|B2 raktų įvedimas/.test(h.out) ? 'forma atsidaro' : 'NEATSIDARO';
O.senas_tekstas = /formatas neatpažintas/.test(h.out) ? 'SENA VERSIJA VIS DAR' : 'senos nebėra';
O.svetaine=sh('curl -sSk -o /dev/null -w "%{http_code}" --max-time 25 "'+SITE+'/"').out.trim();
putResult('s385.json', JSON.stringify(O,null,1));
console.log('OK');
