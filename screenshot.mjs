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
const TS=process.env.RUN_TS||String(Date.now());
const out={ts:TS, checks:{}};

// 1. wc/v3 atsako? (tik skaitymas, 1 preke)
try{
  const r=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?per_page=1&_fields=id,name,status"`,{encoding:'utf8',env,maxBuffer:20000000});
  const j=JSON.parse(r);
  out.checks.wc_v3 = Array.isArray(j) ? {ok:true, sample_id:(j[0]&&j[0].id)||null, sample_name:(j[0]&&j[0].name||'').slice(0,40)} : {ok:false, raw:r.slice(0,120)};
}catch(e){ out.checks.wc_v3={ok:false, err:e.message.slice(0,120)}; }

// 2. code-snippets/v1 atsako? (tik list)
try{
  const r=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?_fields=id,name,active"`,{encoding:'utf8',env,maxBuffer:20000000});
  const j=JSON.parse(r);
  out.checks.code_snippets = Array.isArray(j) ? {ok:true, count:j.length, snippet_512:(j.find(s=>s.id===512)||null)} : {ok:false, raw:r.slice(0,120)};
}catch(e){ out.checks.code_snippets={ok:false, err:e.message.slice(0,120)}; }

// 3. wp/v2 raw (context=edit) atsako? (lossless metodo patikra, 1 preke read-only)
try{
  const sid=out.checks.wc_v3 && out.checks.wc_v3.sample_id;
  if(sid){
    const r=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${sid}?context=edit&_fields=id,content"`,{encoding:'utf8',env,maxBuffer:20000000});
    const j=JSON.parse(r);
    out.checks.wp_v2_raw = (j && j.content) ? {ok:true, has_raw:(typeof j.content.raw==='string'), raw_len:(j.content.raw||'').length} : {ok:false, raw:r.slice(0,120)};
  } else { out.checks.wp_v2_raw={ok:false, err:'no sample id from wc'}; }
}catch(e){ out.checks.wp_v2_raw={ok:false, err:e.message.slice(0,120)}; }

putResult('sanity_'+TS+'.json', JSON.stringify(out,null,2));
console.log(JSON.stringify(out));
