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
let products=[];
for(let page=1;page<=4;page++){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Eukanuba&per_page=50&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));
    if(!Array.isArray(r)||r.length===0)break;
    products=products.concat(r); if(r.length<50)break;
  }catch(e){break;}
}
const seen={}; products=products.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});

function readRaw(id){try{const r=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return 'ERR';}}

const out={ts:TS, total:products.length, items:[]};
for(const p of products){
  const h=readRaw(p.id);
  const l=h.toLowerCase();
  out.items.push({
    id:p.id, name:p.name.slice(0,50), len:h.length,
    empty: h.length<30,
    has_sudetis: /sud\u0117tis\s*:|sudedamosios\s+dalys/i.test(l),
    has_analitines: /analitin|\u017eali\s+baltym|\u017ealieji\s+riebal/i.test(l),
    has_serimas: /\u0161\u0117rim|maitinimo\s+norma|paros\s+norma|rekomenduojamas\s+kiekis|\u0161uns\s+svoris|kat\u0117s\s+svoris/i.test(l),
    has_table: /<table/i.test(h),
    broken_imgs: (h.match(/src="image\/(?:png|jpe?g|gif|webp);base64/gi)||[]).length
  });
  execSync('sleep 0.25');
}
out.summary={
  total:out.items.length,
  empty:out.items.filter(i=>i.empty).length,
  no_sudetis:out.items.filter(i=>!i.has_sudetis&&!i.empty).length,
  no_analitines:out.items.filter(i=>!i.has_analitines&&!i.empty).length,
  no_serimas:out.items.filter(i=>!i.has_serimas&&!i.empty).length,
  broken_imgs_products:out.items.filter(i=>i.broken_imgs>0).length
};
putResult('eukscan_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out.summary));
