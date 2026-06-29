import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// Suraskim VISUS Exclusion SKU (per WC API)
const base='https://dev.avesa.lt/wp-json/wc/v3';
const user=process.env.WP_USER, pass=process.env.WP_APP_PASS.replace(/\s+/g,'');
// Visi brand'ai - paimam tax 'product_brand' (ar pwb_brand) ir filtruojam pagal "exclusion"
// Per JSON paimam visus produktus, kuriu name yra "Exclusion"
let all=[]; 
for(let pg=1; pg<=10; pg++){
  try{
    const r=execSync(`curl -sk -u "${user}:${pass}" "${base}/products?per_page=100&search=Exclusion&page=${pg}&_fields=id,name,status,sku" --max-time 60`,{encoding:'utf8',maxBuffer:200000000});
    const arr=JSON.parse(r);
    if(!arr.length)break;
    all=all.concat(arr);
    if(arr.length<100)break;
  }catch(e){console.log("ERR pg",pg);break;}
}
const out={total:all.length,publish:all.filter(x=>x.status==='publish').length,draft:all.filter(x=>x.status==='draft').length,
  items:all.map(x=>({id:x.id,name:x.name,status:x.status,sku:x.sku}))};
commit('exclusion_recon.json',JSON.stringify(out,null,1));
console.log("DONE",out.total,'publish',out.publish);
