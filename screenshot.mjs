import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'oc2 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const r=sh('curl -s -k -u "'+U+':'+P+'" "'+BASE+'/wp-json/wc/v3/orders?per_page=20&status=any"');
  let arr=[];
  try{ arr=JSON.parse(r); }catch(e){ L('parse err: '+r.slice(0,300)); }
  L('uzsakymu rasta: '+arr.length);
  const details=[];
  for(const o of arr){
    L('  #'+o.id+' status='+o.status+' total='+o.total+' '+o.currency+' | '+o.billing.first_name+' '+o.billing.last_name+' <'+o.billing.email+'> | '+o.date_created+' | '+o.payment_method_title);
    // renkam transaction id / meta GA4 patikrai pries trynima
    details.push({id:o.id, status:o.status, total:o.total, tax:o.total_tax, shipping:o.shipping_total, email:o.billing.email, items:(o.line_items||[]).map(li=>({name:li.name.slice(0,40), qty:li.quantity, total:li.total})), shipping_lines:(o.shipping_lines||[]).map(s=>s.method_title), payment:o.payment_method});
  }
  putText('order_before_delete.json', JSON.stringify(details,null,2));
  L('DETALES issaugotos order_before_delete.json');
  L('DONE (tik peržiūra, NEtrina)');
}catch(e){L('!!! '+e);}finally{putText('_run19_log.txt',out);}})();
