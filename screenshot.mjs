import { execSync } from "child_process";
import fs from "fs";
const env={...process.env};
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

// 1. Surask Real brand termin'a per WC API
const base='https://dev.avesa.lt/wp-json';
const pass=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const env2={...process.env,WP_PASS_CLEAN:pass};

// Surask Real brand'us
let brands=[];
try {
  const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wc/v3/products/brands?per_page=100&search=Real"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
  brands=JSON.parse(r);
} catch(e){brands=[{err:String(e).slice(0,100)}];}

// Visi brands trumpas:
const brandSummary=brands.map(b=>({id:b.id,name:b.name,slug:b.slug,count:b.count}));

// Real Nature - surinkim visus SKU iš jo
const realBrands=brands.filter(b=>b.name&&(b.name.toLowerCase().includes('real')||b.slug&&b.slug.includes('real')));
const skuByBrand={};
for(const b of realBrands){
  try {
    const skus=[];
    for(let page=1;page<=10;page++){
      const r=execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "${base}/wc/v3/products?per_page=100&page=${page}&brand=${b.id}&_fields=id,name,status,sku"`,{env:env2,encoding:'utf8',maxBuffer:50000000});
      const arr=JSON.parse(r);
      if(!arr||!arr.length)break;
      skus.push(...arr);
      if(arr.length<100)break;
    }
    skuByBrand[b.name]={count:skus.length,publish:skus.filter(s=>s.status==='publish').length,draft:skus.filter(s=>s.status==='draft').length,sample:skus.slice(0,15).map(s=>({id:s.id,name:s.name,status:s.status,sku:s.sku}))};
  } catch(e){skuByBrand[b.name]={err:String(e).slice(0,100)};}
}

commit('real_recon.json',JSON.stringify({brandSummary,realBrands:realBrands.map(b=>({id:b.id,name:b.name,slug:b.slug,count:b.count})),skuByBrand},null,1));
console.log("done");
