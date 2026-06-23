import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS=String(Date.now());
function wc(path){return execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${path}"`,{encoding:'utf8',env,maxBuffer:80000000});}

// 1. Surandu maisto+konservu kategorijas
let cats=[];
for(let page=1;page<=3;page++){
  try{
    const r=JSON.parse(wc(`products/categories?per_page=100&page=${page}&_fields=id,name,slug,count`));
    if(!Array.isArray(r)||r.length===0)break;
    cats=cats.concat(r);
    if(r.length<100)break;
  }catch(e){break;}
}
// filtruoju maisto/konservu kategorijas pagal pavadinima
const foodRe=/maist|pašar|pasar|konserv|sausas|šlapias|slapias|food|skanest|skanėst/i;
const foodCats=cats.filter(c=>foodRe.test(c.name)||foodRe.test(c.slug));
const out={ts:TS, food_categories:foodCats.map(c=>({id:c.id,name:c.name,count:c.count})), summary:{}, items:[]};

// 2. Surandu prekiu ID is tu kategoriju (tik publish)
const catIds=foodCats.map(c=>c.id);
let prodIds=new Set();
for(const cid of catIds){
  for(let page=1;page<=10;page++){
    try{
      const r=JSON.parse(wc(`products?category=${cid}&status=publish&per_page=100&page=${page}&_fields=id`));
      if(!Array.isArray(r)||r.length===0)break;
      r.forEach(p=>prodIds.add(p.id));
      if(r.length<100)break;
    }catch(e){break;}
  }
}
out.summary.total_food_products = prodIds.size;
putResult('foodaudit_cats_'+TS+'.json', JSON.stringify(out,null,2));
console.log('cats:'+foodCats.length+' products:'+prodIds.size);
// issaugau ID sarasa kitam zingsniui
fs.writeFileSync('/tmp/foodids.json', JSON.stringify([...prodIds]));
putResult('foodids_'+TS+'.json', JSON.stringify([...prodIds]));
