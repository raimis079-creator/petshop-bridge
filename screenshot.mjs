import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'oc '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  // WC REST v3 orders sarasas (visi statusai)
  const r=sh('curl -s -k -u "'+U+':'+P+'" "'+BASE+'/wp-json/wc/v3/orders?per_page=20&status=any"');
  try{
    const arr=JSON.parse(r);
    L('viso uzsakymu (paskutiniai 20): '+arr.length);
    for(const o of arr){
      L('  #'+o.id+' status='+o.status+' total='+o.total+' '+o.currency+' | '+o.billing.first_name+' '+o.billing.last_name+' | '+o.date_created+' | payment='+o.payment_method_title);
    }
  }catch(e){L('parse err: '+r.slice(0,400));}
}catch(e){L('!!! '+e);}finally{putText('_orders_check.txt',out);}})();
