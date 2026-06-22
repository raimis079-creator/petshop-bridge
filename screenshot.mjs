import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const content = (typeof obj==='string')?obj:JSON.stringify(obj,null,1);
  const b64 = Buffer.from(content,'utf8').toString('base64');
  const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
  const url = 'https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try { sha = JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main"',{encoding:'utf8'})).sha || ''; } catch(e){}
  const body = {message:'res '+name, content:b64, branch:'main'}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/put.json', JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();
}
const out = {};
// testas: ar katems grooming meniu rodosi nav HTML po PRIEZIURA IR AKSESUARAI
try {
  const html = execSync('curl -sk --max-time 45 "https://dev.avesa.lt/"', {encoding:"utf8", env, maxBuffer:15000000});
  out.has_grooming_link = /sukos-sepeciai-zirkles-katems/.test(html);
  out.prieziura_aksesuarai = /PRIE\u017dI\u016aRA IR AKSESUARAI|PRIEŽIŪRA IR AKSESUARAI/.test(html);
} catch(e){ out.err = String(e).slice(0,80); }
out.put_http = putResult('test_fast.txt', out);
fs.writeFileSync('screenshots/test_fast.txt', JSON.stringify(out,null,1));
