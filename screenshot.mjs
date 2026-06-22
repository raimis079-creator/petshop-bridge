import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const content=(typeof obj==='string')?obj:JSON.stringify(obj,null,1);
  const b64=Buffer.from(content,'utf8').toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'res '+name,content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/put.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();
}
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } try{ return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }catch(e){ return {error:String(e).slice(0,60)}; } }
const out={targets:{}};
// rasti tikslines kategorijas
function find(q,pred){ const r=wc('GET','products/categories?per_page=100&search='+q+'&_fields=id,name,slug'); if(Array.isArray(r)){ const m=r.find(pred); return m?{id:m.id,name:m.name,slug:m.slug}:null; } return null; }
const t_vit=find('papildai',c=>/vitamin|papild/i.test(c.slug)&&/sunim/i.test(c.slug));
const t_dub=find('dubenel',c=>/dubenel/i.test(c.slug)&&/sunim/i.test(c.slug));
const t_vasara=find('vasar',c=>/vasar|vesin|komfort/i.test(c.slug)) || find('vesinam',c=>/vesin/i.test(c.slug));
const t_pagalba=find('pagalb',c=>/pagalb|pirmoj/i.test(c.slug));
const t_samp={id:76};
out.targets={vit:t_vit,dub:t_dub,vasara:t_vasara,pagalba:t_pagalba,samp:76};
// grupiu -> prekiu ID + tikslas
const groups={
  vit:{ids:[24828,24820,24814,24806,24804,23607,20589,20587], tgt:t_vit},
  dub:{ids:[27822,27816,27810], tgt:t_dub},
  vasara:{ids:[27837,27832,27804,27799,27059,27053,25962,24245,15754,27448], tgt:t_vasara},
  samp:{ids:[23605,22910,22906], tgt:t_samp},
  pagalba:{ids:[23609,22275], tgt:t_pagalba},
};
const upd=[]; const report={};
for(const [k,g] of Object.entries(groups)){
  if(!g.tgt||!g.tgt.id){ report[k]='NO TARGET - praleista'; continue; }
  report[k]='-> cat '+g.tgt.id+' ('+g.ids.length+')';
  for(const id of g.ids){
    const pr=wc('GET','products/'+id+'?_fields=id,categories');
    if(pr&&pr.categories){ let ids=pr.categories.map(c=>c.id).filter(x=>x!==82); if(!ids.includes(g.tgt.id)) ids.push(g.tgt.id); upd.push({id,categories:ids.map(x=>({id:x}))}); }
  }
}
out.report=report;
if(upd.length){ const r=wc('POST','products/batch',{update:upd}); out.moved=r&&Array.isArray(r.update)?r.update.length:r; }
const c82=wc('GET','products/categories/82?_fields=count'); out.higiena_count=c82&&c82.count;
out.put=putResult('higiena_moves.txt', out);
