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
const TS="1782125172";
function gj(u){ return JSON.parse(execSync(`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" "${u}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
out.cat=gj('https://dev.avesa.lt/wp-json/wc/v3/products/categories/117?_fields=id,name,slug,parent,count');
const prods=gj('https://dev.avesa.lt/wp-json/wc/v3/products?category=117&per_page=100&status=any&_fields=id,name,status,attributes');
out.total=prods.length;
out.list=prods.map(p=>p.id+' ['+p.status+'] '+p.name);
// ar pa_tipas jau naudojamas
let tagged=0; prods.forEach(p=>{ const t=(p.attributes||[]).find(a=>a.name==='Tipas'||a.slug==='pa_tipas'); if(t&&t.options&&t.options.length) tagged++; });
out.already_tagged=tagged;
out.fin=putResult('antk_recon_'+TS+'.txt', out);
