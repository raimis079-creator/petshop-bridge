import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const r=execSync('curl -s -k --max-time 60 -u "'+U+':'+P+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/547"',{encoding:'utf8',maxBuffer:30000000});
let code='';try{code=JSON.parse(r).code;}catch(e){code='PARSE_ERR '+r.slice(0,150);}
putText('snippet547_code.txt', code);
// extract relevant bits: quantity + message markup
let out='len='+code.length+'\n\n';
for(const kw of ['Pasirinkote','tęstumėte','kad tęstum','quantity','class="psc','ps-','<input','number']){
  let i=0,hits=[];
  while((i=code.indexOf(kw,i))>-1 && hits.length<4){hits.push(code.slice(Math.max(0,i-60),i+80).replace(/\n/g,' '));i+=kw.length;}
  out+='=== "'+kw+'" ('+hits.length+') ===\n'+hits.map(x=>'  '+x).join('\n')+'\n\n';
}
putText('_s547.txt', out);
console.log('done '+code.length);
