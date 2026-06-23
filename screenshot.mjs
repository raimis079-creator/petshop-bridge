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
const r=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/14772?context=edit&_fields=content"`,{encoding:'utf8',env,maxBuffer:20000000}));
const h=(r.content&&r.content.raw)||'';
const out={ts:TS, len:h.length};
// randu serimo zona
const idx=h.search(/\u0160\u0117rimo\s+instrukcija|\u0161\u0117rimo|maitinimo\s+norma/i);
out.serimo_pos=idx;
out.serimo_context = idx>0 ? h.slice(idx-30, idx+400).replace(/\s+/g,' ') : 'NERASTA';
out.has_table_already = /<table/i.test(h);
out.full = h; // visa, kad galeciau apdoroti lokaliai
putResult('read14772_'+TS+'.json', JSON.stringify(out));
console.log('len:'+h.length+' serimo_pos:'+idx);
