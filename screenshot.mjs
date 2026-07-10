import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<5;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'diag '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 3'); }
  return false;
}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
function sh(c){ try{ return execSync(c,{encoding:'utf8',stdio:['pipe','pipe','pipe']}); }catch(e){ return 'EXIT='+e.status+' ERR='+String(e.stderr||e.message).slice(0,200); } }
L('--- DNS ---'); L(sh('getent hosts dev.avesa.lt || echo NO_DNS'));
L('--- https root ---'); L(sh('curl -sS -o /dev/null -m 20 -w "%{http_code} %{ssl_verify_result}\n" https://dev.avesa.lt/'));
L('--- https -k ---'); L(sh('curl -sS -k -o /dev/null -m 20 -w "%{http_code}\n" https://dev.avesa.lt/'));
L('--- http ---'); L(sh('curl -sS -o /dev/null -m 20 -w "%{http_code} %{redirect_url}\n" http://dev.avesa.lt/'));
L('--- avesa.lt ---'); L(sh('curl -sS -o /dev/null -m 20 -w "%{http_code}\n" https://avesa.lt/'));
const HOSTS=['https://dev.avesa.lt','http://dev.avesa.lt'];
const paths=JSON.parse(fs.readFileSync('analize/_top_paths.json','utf8'));
let best=null;
for(const h of HOSTS){ const r=sh('curl -sS -k -o /dev/null -m 20 -w "%{http_code}" -A "Mozilla/5.0" "'+h+'/"'); L('probe '+h+' -> '+r); if(/^(200|30\d|40[13])/.test(r)) { best=h; break; } }
L('BEST='+best);
if(best){
  const res=[];
  for(const p of paths){
    const r=sh('curl -sS -k -o /dev/null -m 25 -L -A "Mozilla/5.0" -w "%{http_code}|%{url_effective}|%{num_redirects}" "'+best+p+'"');
    res.push({p,r});
  }
  putFile('url_audit_dev.json',JSON.stringify(res));
  L('audit rows='+res.length);
}
putFile('_diag_log.txt',out);
