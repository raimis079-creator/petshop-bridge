import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fs2',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let out='';

// Detali diagnostika: HTTP kodas + response body
fs.writeFileSync('/tmp/body.json', JSON.stringify({ page_on_front: 34543 }));
const cmd = 'curl -sk -u "'+WPU+':'+WPP+'" -H "Content-Type: application/json" -X POST -d @/tmp/body.json -w "\\n---STATUS:%{http_code}---" --max-time 120 "'+DEV+'/wp-json/wp/v2/settings"';
try{
  const res = execSync(cmd, {encoding:'utf8', maxBuffer:20000000, timeout:125000});
  out += '=== POST rezultatas ===\n';
  out += res+'\n';
}catch(e){
  out += 'EXC su detalizacija:\n';
  out += 'stdout: '+(e.stdout ? e.stdout.slice(0,500) : '-')+'\n';
  out += 'stderr: '+(e.stderr ? e.stderr.slice(0,500) : '-')+'\n';
  out += 'msg: '+e.message+'\n';
  out += 'code: '+e.code+'\n';
}

// Alternatyva - PUT vs POST
try{
  const cmd2 = 'curl -sk -u "'+WPU+':'+WPP+'" -H "Content-Type: application/json" -X POST -d "{\\"show_on_front\\":\\"page\\",\\"page_on_front\\":34543}" -w "\\n---STATUS:%{http_code}---" --max-time 60 "'+DEV+'/wp-json/wp/v2/settings"';
  out += '\n=== Alternatyva (POST inline body) ===\n';
  const res2 = execSync(cmd2, {encoding:'utf8', maxBuffer:20000000, timeout:65000});
  out += res2+'\n';
}catch(e){ out += 'ALT EXC: '+e.message+'\n'; }

// GET dabartinis state
try{
  const g = execSync('curl -sk -u "'+WPU+':'+WPP+'" -w "\\n---STATUS:%{http_code}---" --max-time 30 "'+DEV+'/wp-json/wp/v2/settings"', {encoding:'utf8', maxBuffer:20000000, timeout:35000});
  const m = g.match(/"page_on_front":\s*(\d+)/);
  const s = g.match(/"show_on_front":\s*"([^"]+)"/);
  const status = g.match(/STATUS:(\d+)/);
  out += '\n=== Dabartinis state ===\n';
  out += 'HTTP: '+(status?status[1]:'?')+'\n';
  out += 'page_on_front: '+(m?m[1]:'?')+'\n';
  out += 'show_on_front: '+(s?s[1]:'?')+'\n';
}catch(e){ out += 'GET ERR: '+e.message+'\n'; }

putFile('frontswitch2.txt', out);
