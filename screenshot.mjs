import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
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
const out={ts:TS,checks:{}};

// 1. wc/v3 skaitymas - zinoma preke 19751 (Ambrosia, ka taisem)
try{
  const p=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/19751?_fields=id,name,status,sku"`,{encoding:'utf8',env,maxBuffer:20000000}));
  out.checks.wc_v3_read={ok:!!p.id, id:p.id, sku:p.sku, status:p.status, name:(p.name||"").slice(0,50)};
}catch(e){out.checks.wc_v3_read={ok:false,err:String(e).slice(0,120)};}

// 2. wc/v3 rasymas (saugiai - perskaitau ir parasau ta pacia reiksme, jokio realaus pakeitimo)
try{
  const before=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/19751?_fields=catalog_visibility"`,{encoding:'utf8',env,maxBuffer:20000000}));
  const vis=before.catalog_visibility||"visible";
  const w=execSync(`curl -sk --max-time 30 -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d '{"catalog_visibility":"${vis}"}' "https://dev.avesa.lt/wp-json/wc/v3/products/19751?_fields=id,catalog_visibility"`,{encoding:'utf8',env,maxBuffer:20000000});
  const wj=JSON.parse(w);
  out.checks.wc_v3_write={ok:wj.id===19751, wrote_back:wj.catalog_visibility, note:"ta pati reiksme, jokio pakeitimo"};
}catch(e){out.checks.wc_v3_write={ok:false,err:String(e).slice(0,120)};}

// 3. code-snippets/v1 - snippet 512 (v5 accordion)
try{
  const s=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?k=ps2026"`,{encoding:'utf8',env,maxBuffer:20000000}));
  out.checks.snippet_512={ok:!!s.id, id:s.id, name:(s.name||"").slice(0,50), active:s.active};
}catch(e){out.checks.snippet_512={ok:false,err:String(e).slice(0,120)};}

// 4. wp/v2 raw lossless skaitymas + ar Ambrosia zymekliai vietoje
try{
  const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/19751?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));
  const raw=(r.content&&r.content.raw)||"";
  out.checks.wp_v2_raw={ok:raw.length>0, len:raw.length, md5:crypto.createHash('md5').update(raw,'utf8').digest('hex'),
    has_analitines: raw.indexOf("Analitin")>-1, has_serimo: raw.indexOf("\u0160\u0117rimo")>-1, has_sudetis: raw.indexOf("Sud\u0117tis")>-1,
    broken_base64: (raw.match(/src="image\/png;base64/g)||[]).length};
}catch(e){out.checks.wp_v2_raw={ok:false,err:String(e).slice(0,120)};}

putResult("sanity_"+TS+".json", JSON.stringify(out,null,2));
console.log("SANITY DONE "+TS);
