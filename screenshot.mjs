import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'c614 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const r=sh('curl -s -k -u "'+U+':'+P+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/614"');
  let code='';try{code=JSON.parse(r).code||'';}catch(e){L('parse: '+r.slice(0,200));}
  L('#614 code_len: '+code.length);
  // Ieskom event pavadinimu
  for(const ev of ['view_item','add_to_cart','view_cart','begin_checkout','add_shipping_info','add_payment_info','purchase','remove_from_cart']){
    const has = code.includes(ev);
    L('  '+ev+': '+(has?'✅ YRA':'❌ NERA'));
  }
  L('DONE');
}catch(e){L('!!! '+e);}finally{putText('_check614_log.txt',out);}})();
