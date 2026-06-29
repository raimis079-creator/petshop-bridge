import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const base='https://dev.avesa.lt/wp-json';
const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};

// Surask Animonda brand
let brands=[];
try{
  const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wc/v3/products/brands?per_page=100&search=Animonda"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
  brands=JSON.parse(r);
}catch(e){}

const skus=[];
for(const b of brands){
  for(let p=1;p<=5;p++){
    try{
      const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wc/v3/products?per_page=100&page=${p}&brand=${b.id}&_fields=id,name,status,sku,categories"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
      const arr=JSON.parse(r);
      if(!arr||!arr.length)break;
      skus.push(...arr);
      if(arr.length<100)break;
    }catch(e){break;}
  }
}

commit('animonda_recon.json',JSON.stringify({brands,skus},null,1));
console.log("done");
