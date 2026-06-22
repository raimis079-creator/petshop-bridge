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
const TS="1782120750";
// SENTINEL pirma - patvirtina kad putResult+token gyvas
const sent=putResult('hsent_'+TS+'.txt','START ok');
const out={sentinel:sent};
try{
  const sn=JSON.parse(execSync(`curl -sk --max-time 20 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/502?_fields=id,name,active"`,{encoding:'utf8',env}));
  out.snippet502={found:!!sn.id,name:sn.name||null,active:sn.active};
}catch(e){ out.snippet502='ERR '+String(e).slice(0,50); }
try{
  // lengvai: tik ID+name (be attributes)
  const ids=JSON.parse(execSync(`curl -sk --max-time 25 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products?category=82&per_page=100&status=any&_fields=id,name"`,{encoding:'utf8',env,maxBuffer:8000000}));
  out.cat82_total=ids.length;
  out.cat82_first5=ids.slice(0,5).map(p=>p.id+': '+(p.name||'').slice(0,34));
  // pa_tipas tik pirmom 5 - individualiai (lengva)
  const tcheck=[];
  for(const p of ids.slice(0,5)){
    try{ const d=JSON.parse(execSync(`curl -sk --max-time 15 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/${p.id}?_fields=id,attributes"`,{encoding:'utf8',env})); const t=(d.attributes||[]).find(a=>a.name==='Tipas'||a.slug==='pa_tipas'); tcheck.push(p.id+': '+(t&&t.options?t.options.join(','):'<none>')); }catch(e){ tcheck.push(p.id+': ERR'); }
  }
  out.pa_tipas_sample=tcheck;
}catch(e){ out.cat82='ERR '+String(e).slice(0,60); }
out.fin=putResult('hcheck_'+TS+'.txt', out);
