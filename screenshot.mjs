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
// Skenuoju Ambrosia 15 prekiu - kiek turi sugadinta base64 (src="image/png;base64 be data:)
const ids=[19785,19780,19775,19770,19765,19760,19756,19751,19747,19740,19735,19730,19725,19720,19715];
const out={ts:TS, items:[]};
for(const id of ids){
  try{
    const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));
    const h=(r.content&&r.content.raw)||'';
    const broken=(h.match(/src="image\/(png|jpe?g|gif|webp);base64/gi)||[]).length;
    const good=(h.match(/src="data:image\//gi)||[]).length;
    out.items.push({id, broken_base64:broken, good_base64:good});
  }catch(e){ out.items.push({id, err:e.message.slice(0,50)}); }
  execSync('sleep 0.3');
}
out.total_broken = out.items.reduce((s,i)=>s+(i.broken_base64||0),0);
out.products_affected = out.items.filter(i=>i.broken_base64>0).length;
putResult('imgscan_'+TS+'.json', JSON.stringify(out,null,2));
console.log('affected:'+out.products_affected+' total_broken:'+out.total_broken);
