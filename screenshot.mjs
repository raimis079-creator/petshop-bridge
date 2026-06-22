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
const TS="1782147570";
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:25000000})); }
const out={};
const all=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&_fields=id,name,slug,parent,count');
const zuv=all.find(c=>c.slug==='zuvims'||/\u017duvims/i.test(c.name)||c.slug==='zuvitems'||c.slug==='akvariumui');
out.zuv_top=zuv?{id:zuv.id,name:zuv.name,slug:zuv.slug}:'NOT FOUND';
if(zuv){
  out.tree=all.filter(c=>c.id===zuv.id||c.parent===zuv.id).map(c=>c.id+' '+c.name+' ('+c.slug+') parent='+c.parent+' count='+c.count);
  // antro lygio vaikai
  const childIds=all.filter(c=>c.parent===zuv.id).map(c=>c.id);
  out.grandchildren=all.filter(c=>childIds.includes(c.parent)).map(c=>c.id+' '+c.name+' ('+c.slug+') parent='+c.parent+' count='+c.count);
  function dump(cid){ const p=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category='+cid+'&per_page=100&status=any&_fields=id,name,status,categories'); return p.map(x=>x.id+' ['+x.status[0]+'] '+x.name.slice(0,52)+' {'+(x.categories||[]).map(c=>c.id).join(',')+'}'); }
  out.parent_direct=dump(zuv.id);
}
out.fin=putResult('zuv_audit_'+TS+'.txt', out);
