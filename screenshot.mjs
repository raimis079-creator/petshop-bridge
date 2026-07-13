import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';
const h=execSync('curl -s -k -L --max-time 45 "'+BASE+'/product/susidek-konservu-rinkini-sunims/"',{encoding:'utf8',maxBuffer:30000000});
putText('boxhtml.txt', h);
let out='HTML len='+h.length+'\n\n';
// find all elements with message/quantity classes + english message text
for(const kw of ['quantity_message','mnm_message','to continue','Please select','class="quantity"','mnm_add_to_cart','mnm_cart','single_add_to_cart']){
  let i=0,hits=[];
  while((i=h.indexOf(kw,i))>-1 && hits.length<3){hits.push(h.slice(Math.max(0,i-90),i+60).replace(/\s+/g,' '));i+=kw.length;}
  out+='=== "'+kw+'" ('+hits.length+'+) ===\n'+hits.map(x=>'  ...'+x+'...').join('\n')+'\n\n';
}
putText('_boxhtml.txt', out);
console.log('done');
