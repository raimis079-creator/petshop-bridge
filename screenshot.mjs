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
const TS="1782201621";
const feed=fs.readFileSync('serimo_lamb_salmon.html','utf8');
const out={writes:[]};
for(const pid of ['19751','19747']){
  const rec={id:pid};
  try{
    const before=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/${pid}?_fields=id,name,description"`,{encoding:'utf8',env,maxBuffer:20000000}));
    rec.name=(before.name||'').slice(0,40);
    rec.before=(before.description||'').length;
    rec.has_serimo_already=/\u0161\u0117rim|paros\s+norm/i.test(before.description||'');
    const newdesc=(before.description||'')+"\n"+feed;
    fs.writeFileSync('/tmp/upd.json',JSON.stringify({description:newdesc}));
    const u=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X PUT -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wc/v3/products/${pid}"`,{encoding:'utf8',env,maxBuffer:20000000}));
    rec.after=(u.description||'').length; rec.ok=true;
  }catch(e){ rec.err=e.message.slice(0,80); }
  out.writes.push(rec); execSync('sleep 1');
}
putResult('amb_'+TS+'.json', JSON.stringify(out));
