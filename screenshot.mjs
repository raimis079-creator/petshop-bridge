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
const TS="1782128717";
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:25000000})); }
const out={};
// visos kategorijos su parent 87 (grauzikams) ir 89 (pauksciams) + patys
const all=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&_fields=id,name,slug,parent,count');
out.grauzikams=all.filter(c=>c.id===87||c.parent===87).map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count}));
out.pauksciams=all.filter(c=>c.id===89||c.parent===89).map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count}));
// sample produktu is kiekvienos vaikines kategorijos
function sample(cid){ try{ const p=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category='+cid+'&per_page=12&status=any&_fields=id,name,attributes'); return {n:p.length, names:p.map(x=>x.name.slice(0,55)), attrs:[...new Set(p.flatMap(x=>(x.attributes||[]).map(a=>a.name)))]}; }catch(e){ return {err:1}; } }
out.samples={};
for(const c of [...out.grauzikams,...out.pauksciams]){ if(c.parent!==0 && c.count>0){ out.samples[c.id+' '+c.name]=sample(c.id); } }
out.fin=putResult('gp_recon_'+TS+'.txt', out);
