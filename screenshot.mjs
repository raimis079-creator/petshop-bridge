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
const TS="1782147818";
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:25000000})); }
const out={};
const all=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&_fields=id,name,slug,parent,count');
function info(id){ const c=all.find(x=>x.id===id); return c?(c.id+' '+c.name+' ('+c.slug+') parent='+c.parent+' count='+c.count):id+' NOT FOUND'; }
out.c91=info(91); out.c94=info(94); out.c100=info(100); out.c103=info(103);
// 91 medis (visi vaikai)
const ch91=all.filter(c=>c.parent===91);
out.under_91=ch91.map(c=>c.id+' '+c.name+' ('+c.slug+') count='+c.count);
// 94 ir 100 tevai
const p94=all.find(x=>x.id===94), p100=all.find(x=>x.id===100);
out.c94_parent=p94?info(p94.parent):'?'; out.c100_parent=p100?info(p100.parent):'?';
out.fin=putResult('zuv_cats_'+TS+'.txt', out);
