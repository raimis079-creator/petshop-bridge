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
const TS="1782154919";
function wc(p){ return JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/${p}"`,{encoding:'utf8',env,maxBuffer:60000000})); }
const out={legacy:[],vf:[],zb:[],other:0};
function classify(p){
  const m={}; (p.meta_data||[]).forEach(x=>{ m[x.key]=x.value; });
  const lm=(m['_legacy_manufacturer']||'').toString().trim();
  const vf=(m['_vf_supplier_sku']||'').toString().trim();
  const zb=(m['_zb_cost']!==undefined)||(m['_zb_price_initialized']!==undefined)||(m['_zb_price']!==undefined);
  if(lm) return 'legacy';
  if(vf) return 'vf';
  if(zb) return 'zb';
  return 'other';
}
for(let page=1; page<=3; page++){
  const ps=wc('products?status=publish&per_page=100&page='+page+'&_fields=id,name,permalink,categories,meta_data');
  if(!Array.isArray(ps)||ps.length===0) break;
  for(const p of ps){
    const src=classify(p);
    if(src==='other'){ out.other++; continue; }
    const cat=(p.categories||[]).map(c=>c.name).filter(n=>!/^(MAISTAS|SKANES|AKSESUAR|SUNIMS|KATEMS|GRAUZIK|PAUKSC|ZUVIMS)/i.test(n))[0] || (p.categories||[])[0]?.name || '-';
    if(out[src].length<14) out[src].push({id:p.id,name:p.name.slice(0,42),cat,url:p.permalink});
  }
}
out.counts={legacy:out.legacy.length,vf:out.vf.length,zb:out.zb.length,other:out.other};
out.fin=putResult('desc_recon_'+TS+'.txt', out);
