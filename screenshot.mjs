import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
let out='';const L=s=>{out+=s+'\n';};
// 1. Tiesioginis home (be auth)
L('home noauth: '+sh('curl -s -k --max-time 20 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" "'+BASE+'/?x='+Date.now()+'"'));
// 2. REST su auth
L('rest auth: '+sh('curl -s -k --max-time 20 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -u "'+U+':'+P+'" "'+BASE+'/wp-json/?x='+Date.now()+'"'));
// 3. wp-admin su auth
L('wp-admin: '+sh('curl -s -k --max-time 20 -o /dev/null -w "%{http_code}" -A "Mozilla/5.0" -u "'+U+':'+P+'" "'+BASE+'/wp-login.php?x='+Date.now()+'"'));
// 4. Body pirmi 300 simboliu (kad matytume kas 403)
const body = sh('curl -s -k --max-time 20 -A "Mozilla/5.0" "'+BASE+'/?x='+Date.now()+'"');
L('body first 300: '+body.slice(0,300));
putText('site_403.txt', out);
console.log(out);
