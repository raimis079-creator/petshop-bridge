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
// Surandu VISAS Ambrosia prekes
let products=[];
for(let page=1;page<=3;page++){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?search=Ambrosia&per_page=50&page=${page}&status=publish&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:50000000}));
    if(!Array.isArray(r)||r.length===0)break;
    products=products.concat(r); if(r.length<50)break;
  }catch(e){break;}
}
const seen={}; products=products.filter(p=>{if(seen[p.id])return false;seen[p.id]=1;return true;});

function readRaw(id){
  try{const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));return (r.content&&r.content.raw)||'';}catch(e){return '';}
}
const out={ts:TS, total:products.length, items:[]};
for(const p of products){
  const h=readRaw(p.id);
  out.items.push({
    id:p.id, name:p.name.slice(0,55), len:h.length,
    // ka v5 JAU atpazista
    has_sudetis: /Sud\u0117tis\s*:/i.test(h),
    has_analitines_final: /Analitin\u0117s\s+sudedamosios/i.test(h),
    has_serimo_final: /\u0160\u0117rimo\s+instrukcija/i.test(h),
    // alternatyvus zymekliai (ko reikia keisti)
    has_sudedamosios: /Sudedamosios\s+dalys\s*:/i.test(h),
    has_maitinimo: /Maitinimo\s+norma\s*:/i.test(h),
    has_table: /<table/i.test(h),
    // sugede paveiksliukai
    broken_imgs: (h.match(/src="image\/(?:png|jpe?g|gif|webp);base64/gi)||[]).length
  });
  execSync('sleep 0.3');
}
putResult('ambscan_'+TS+'.json', JSON.stringify(out,null,2));
console.log('total:'+products.length);
