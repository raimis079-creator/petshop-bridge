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
const TS="1782147013";
const out={};
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:20000000})); }
// APPLY
const html=execSync(`curl -sk --max-time 90 "https://dev.avesa.lt/?petshop_attr_pauksrusis=apply&confirm=APPLY&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const m=html.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.apply=m?{viso:+m[1],parsed:+m[2],review:+m[3]}:'no';
out.mode_apply=/APPLY<\/h2>/.test(html);
// verify
out.verify=[];
for(const id of [12796,14448,18999,18927,13525]){ try{ const p=wc('products/'+id+'?_fields=id,name,attributes'); const pa=(p.attributes||[]).find(a=>a.slug==='pa_paukscio_rusis'||a.name==='Paukščio rūšis'); out.verify.push(id+' '+p.name.slice(0,32)+' => '+(pa?pa.options.join(', '):'NONE')); }catch(e){ out.verify.push(id+' ERR'); } }
const terms=wc('products/attributes/23/terms?per_page=50&_fields=name,count');
out.terms=Array.isArray(terms)?terms.map(t=>t.name+': '+t.count):terms;
out.fin=putResult('pauksapply_'+TS+'.txt', out);
