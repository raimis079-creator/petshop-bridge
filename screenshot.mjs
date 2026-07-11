import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'del '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  // 1. Trinam #34601 galutinai (force=true = permanent, ne trash)
  const del=sh('curl -s -k -u "'+U+':'+P+'" -X DELETE "'+BASE+'/wp-json/wc/v3/orders/34601?force=true"');
  try{const o=JSON.parse(del);L('DELETE #34601 -> status po trynimo: '+(o.status||'?')+' id='+(o.id||'?'));}catch(e){L('delete resp: '+del.slice(0,300));}
  // 2. Patikra - ar tikrai istrintas
  execSync('sleep 2');
  const check=sh('curl -s -k -u "'+U+':'+P+'" "'+BASE+'/wp-json/wc/v3/orders?per_page=20&status=any"');
  try{const arr=JSON.parse(check);L('uzsakymu LIKO: '+arr.length);for(const o of arr)L('  #'+o.id+' '+o.status);}catch(e){L('check resp: '+check.slice(0,200));}
  // 3. Ar #34601 tikrai nebeegzistuoja
  const g=sh('curl -s -k -u "'+U+':'+P+'" -w "|HTTP:%{http_code}" "'+BASE+'/wp-json/wc/v3/orders/34601"');
  L('GET #34601 po trynimo: '+(g.match(/HTTP:(\d+)/)||[])[1]+' (404 = puiku, istrintas)');
  L('DONE');
}catch(e){L('!!! '+e);}finally{putText('_run20_log.txt',out);}})();
