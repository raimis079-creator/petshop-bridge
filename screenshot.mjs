import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const env2={...process.env,WP_PASS_CLEAN:(process.env.WP_APP_PASS||'').replace(/\s+/g,'')};

// Test diferentes endpoints
const tests=[
  'https://dev.avesa.lt/wp-json/wc/v3/products?per_page=2&status=publish',
  'https://dev.avesa.lt/wp-json/wc/v3/products?per_page=2&status=publish&_fields=id,name',
  'https://dev.avesa.lt/wp-json/wc/v3/products?per_page=2&status=publish&_fields=id,name,brands,categories',
  'https://dev.avesa.lt/wp-json/wp/v2/product?per_page=2',
];
const out={};
for(const url of tests){
  try{
    const r=execSync(`curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "${url}"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
    const parsed=JSON.parse(r);
    const len=Array.isArray(parsed)?parsed.length:0;
    out[url]={len,first:Array.isArray(parsed)&&parsed.length?Object.keys(parsed[0]):parsed.code||'?'};
  }catch(e){out[url]={err:String(e).slice(0,200)};}
}
commit('diag_test.json',JSON.stringify(out,null,1));
console.log("done");
