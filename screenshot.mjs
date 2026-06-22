import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782151309";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:25000000})); }
const out={};
// 1) rename 371
const ren=wc('PUT','products/categories/371',{ name:"Akvarium\u0173 \u012franga" });
out.rename={id:ren.id,name:ren.name,slug:ren.slug};
// 2) audit DAUGIAU=PIGIAU dp kategorijos
const DP=[91,92,99,103,110,113];
function dump(cid){ let page=1,acc=[]; while(true){ const p=wc('GET','products?category='+cid+'&per_page=100&page='+page+'&status=any&_fields=id,name,status,categories'); if(!Array.isArray(p)||p.length===0)break; acc=acc.concat(p); if(p.length<100)break; page++; } return acc; }
const seen={};
for(const cid of [92,99,103,110,113]){ for(const p of dump(cid)){ seen[p.id]=p; } }
const prods=Object.values(seen);
out.total_dp_products=prods.length;
// orphan check: kuriu kategorijos VISOS yra dp (liktu be kategorijos)
const orphans=[]; const dist={};
for(const p of prods){ const ids=(p.categories||[]).map(c=>c.id); const real=ids.filter(x=>!DP.includes(x)); for(const cid of ids){ if(DP.includes(cid)) dist[cid]=(dist[cid]||0)+1; } if(real.length===0){ orphans.push(p.id+' ['+p.status[0]+'] '+p.name.slice(0,50)+' cat={'+ids.join(',')+'}'); } }
out.dp_membership_counts=dist;
out.orphan_count=orphans.length;
out.orphans=orphans.slice(0,40);
out.fin=putResult('dp_audit_'+TS+'.txt', out);
