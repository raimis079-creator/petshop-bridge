import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';
let h=execSync('curl -s -k --max-time 45 "'+BASE+'/kategorija/sunims/"',{encoding:'utf8',maxBuffer:30000000});
const cnt=(s,t)=>s.split(t).length-1;
let r='';
r+='h2_ps-atr-h(modulio): '+cnt(h,'class="ps-atr-h"')+'\n';
r+='pcl-h2 elementu: '+(h.match(/<h2 class="pcl-h2"/g)||[]).length+'\n';
r+='Atrinktos prekes sunims TEXT kartu: '+cnt(h,'Atrinktos prekės šunims')+'\n';
r+='toolbar-hide CSS: '+(h.indexOf('.shop-page-title .category-filtering')>-1)+'\n';
r+='result-count DOM (paslepta CSS): '+cnt(h,'woocommerce-result-count')+'\n';
putText('_htmlcheck.txt', r);
console.log(r);
