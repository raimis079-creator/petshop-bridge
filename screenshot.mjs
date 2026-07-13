import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';
let h=execSync('curl -s -k -L --max-time 45 "'+BASE+'/product/susidek-konservu-rinkini-sunims/"',{encoding:'utf8',maxBuffer:30000000});
let out='';const L=s=>out+=s+'\n';
// body class
const bm=h.match(/<body[^>]*class="([^"]*)"/);
L('BODY class: '+(bm?bm[1]:'?'));
L('product-type-mix-and-match: '+(h.indexOf('product-type-mix-and-match')>-1));
// mnm_message
L('.mnm_message yra: '+(h.indexOf('mnm_message')>-1));
const mi=h.indexOf('mnm_message');
if(mi>-1) L('mnm_message ctx: '+h.slice(mi-60,mi+160).replace(/\s+/g,' '));
// plain form.cart vs mnm_form
L('form class="cart" (plain): '+((h.match(/<form[^>]*class="cart"/g)||[]).length));
L('form mnm_form: '+((h.match(/class="[^"]*mnm_form/g)||[]).length));
// the container quantity context (find "produkto kiekis" input.qty near bottom)
const qi=h.lastIndexOf('input');
// find the single_add_to_cart form area
const sac=h.indexOf('single_add_to_cart_button');
if(sac>-1) L('single_add_to_cart ctx: '+h.slice(sac-200,sac+40).replace(/\s+/g,' '));
putText('_curlbox.txt', out);
console.log('done');
