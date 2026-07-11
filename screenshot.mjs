import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'gf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("aWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCggJF9HRVRbJ3BzX2dlbmZuJ10gKSApIHsgcmV0dXJuOyB9CgkkdG9rZW4gPSBpc3NldCggJF9HRVRbJ3Rva2VuJ10gKSA/IHNhbml0aXplX3RleHRfZmllbGQoIHdwX3Vuc2xhc2goICRfR0VUWyd0b2tlbiddICkgKSA6ICcnOwoJaWYgKCAkdG9rZW4gIT09ICdjbXBsel82NjgwYWEyYTQyMTUxZDU0ZmE4ZDY0ZWMnICkgeyByZXR1cm47IH0KCSRmbiA9IGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpIC4gJy9mdW5jdGlvbnMucGhwJzsKCSRsaW5lcyA9IGV4cGxvZGUoICJcbiIsIGZpbGVfZ2V0X2NvbnRlbnRzKCAkZm4gKSApOwoJJG91dCA9IGFycmF5KCk7CgkvLyBwZXRzaG9wX2dlbmVyYXRlX2ludm9pY2VfcGRmICsgZG9jX3R5cGUgKyBudW1lcmFjaWphOiAyMjAtNDc1Cglmb3IgKCAkaSA9IDIxOTsgJGkgPCBtaW4oIDQ3NSwgY291bnQoJGxpbmVzKSApOyAkaSsrICkgeyAkb3V0WyAkaSsxIF0gPSAkbGluZXNbJGldOyB9CgloZWFkZXIoICdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnICk7CgllY2hvIHdwX2pzb25fZW5jb2RlKCAkb3V0LCBKU09OX1BSRVRUWV9QUklOVCB8IEpTT05fVU5FU0NBUEVEX1VOSUNPREUgfCBKU09OX1VORVNDQVBFRF9TTEFTSEVTICk7CglleGl0Owp9LCA2ICk7Cg==",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let ex=null;try{ex=JSON.parse(list.body).find(s=>/Read GenFn/i.test(s.name));}catch(e){}
  const payload={name:'Petshop Read GenFn v1',desc:'token',code:PHP,scope:'front-end',active:true,priority:10};
  const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); execSync('sleep 2');
  const r=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_genfn=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('len '+r.length);
  if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});}
  putText('genfn_read.json', r.slice(0,25000));
}catch(e){L('!!! '+e);}finally{putText('_run30_log.txt',out);}})();
