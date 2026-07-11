import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'df '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("aWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCggJF9HRVRbJ3BzX2R1bXBmbiddICkgKSB7IHJldHVybjsgfQoJJHRva2VuID0gaXNzZXQoICRfR0VUWyd0b2tlbiddICkgPyBzYW5pdGl6ZV90ZXh0X2ZpZWxkKCB3cF91bnNsYXNoKCAkX0dFVFsndG9rZW4nXSApICkgOiAnJzsKCWlmICggJHRva2VuICE9PSAnY21wbHpfNjY4MGFhMmE0MjE1MWQ1NGZhOGQ2NGVjJyApIHsgcmV0dXJuOyB9CgkkZm4gPSBnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKSAuICcvZnVuY3Rpb25zLnBocCc7CgkkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCAkZm4gKTsKCWhlYWRlciggJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcgKTsKCWVjaG8gd3BfanNvbl9lbmNvZGUoIGFycmF5KCAnc2l6ZSc9PnN0cmxlbigkYyksICd3cml0YWJsZSc9PmlzX3dyaXRhYmxlKCRmbiksICdiNjQnPT5iYXNlNjRfZW5jb2RlKCRjKSApICk7CglleGl0Owp9LCA2ICk7Cg==",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:80000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let ex=null;try{ex=JSON.parse(list.body).find(s=>/Dump Functions/i.test(s.name));}catch(e){}
  const payload={name:'Petshop Dump Functions v1',desc:'token',code:PHP,scope:'front-end',active:true,priority:10};
  const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); execSync('sleep 2');
  const r=sh('curl -s -k --max-time 40 "'+BASE+'/?ps_dumpfn=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  let j;try{j=JSON.parse(r);L('size='+j.size+' writable='+j.writable);putText('functions_full_b64.txt', j.b64);}catch(e){L('parse err '+r.slice(0,200));}
  if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});}
}catch(e){L('!!! '+e);}finally{putText('_run33_log.txt',out);}})();
