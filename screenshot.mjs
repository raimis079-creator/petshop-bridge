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
const TS="1782122571";
const out={};
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
// rasti "Sunims" top kategorija
try{ const r=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&search=sunims&_fields=id,name,slug,parent,count'); out.sunims_hits=r.filter(c=>/^sunims$/i.test(c.slug)||c.name==='\u0160unims').map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count})); }catch(e){ out.sunims_err=String(e).slice(0,60); }
// "aksesuarai" paieska
try{ const r=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&search=aksesuar&_fields=id,name,slug,parent,count'); out.aksesuarai=r.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count})); }catch(e){ out.aks_err=String(e).slice(0,60); }
// "guoli" paieska
try{ const r=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories?per_page=100&search=guol&_fields=id,name,slug,parent,count'); out.guoliai=r.map(c=>({id:c.id,name:c.name,slug:c.slug,parent:c.parent,count:c.count})); }catch(e){ out.guol_err=String(e).slice(0,60); }
out.fin=putResult('treechk_'+TS+'.txt', out);
