import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'vp2 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("aWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCgkX0dFVFsncHNfcG9wdmVyaWZ5J10pICkgeyByZXR1cm47IH0KCSR0b2sgPSBpc3NldCgkX0dFVFsndG9rZW4nXSkgPyBzYW5pdGl6ZV90ZXh0X2ZpZWxkKHdwX3Vuc2xhc2goJF9HRVRbJ3Rva2VuJ10pKSA6ICcnOwoJaWYgKCAkdG9rICE9PSAnY21wbHpfNjY4MGFhMmE0MjE1MWQ1NGZhOGQ2NGVjJyApIHsgcmV0dXJuOyB9CgkkbW9kID0gZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9pbmMvaG9tZS1wb3B1bGFyLXByb2R1Y3RzLnBocCc7CgkkZm4gID0gZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJzsKCSRmYyAgPSBmaWxlX2V4aXN0cygkZm4pID8gZmlsZV9nZXRfY29udGVudHMoJGZuKSA6ICcnOwoJJG91dCA9IGFycmF5KAoJCSdtb2R1bGlzX2VnemlzdHVvamEnPT5maWxlX2V4aXN0cygkbW9kKSwKCQknbW9kdWxpc19keWRpcyc9PmZpbGVfZXhpc3RzKCRtb2QpP2ZpbGVzaXplKCRtb2QpOjAsCgkJJ2Z1bmN0aW9uc190dXJpX3JlcXVpcmUnPT4oc3RycG9zKCRmYywnaG9tZS1wb3B1bGFyLXByb2R1Y3RzLnBocCcpIT09ZmFsc2UpLAoJCSdzaG9ydGNvZGVfcmVnaXN0cnVvdGFzJz0+c2hvcnRjb2RlX2V4aXN0cygncGV0c2hvcF9wb3B1bGFyX3Byb2R1Y3RzJyksCgkJJ2Z1bmtjaWpvcyc9PmFycmF5KAoJCQknYmVuZWZpdF9tYXAnPT5mdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfcG9wdWxhcl9iZW5lZml0X21hcCcpLAoJCQkncGljayc9PmZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF9wb3B1bGFyX3BpY2snKSwKCQkpLAoJKTsKCS8vIGJhbmRvbSBhdHJpbmt0aSBraWVrIHByZWtpdSBwcmFlaW5hIGZpbHRyYQoJaWYgKCBmdW5jdGlvbl9leGlzdHMoJ3BldHNob3BfcG9wdWxhcl9waWNrJykgKSB7CgkJJGQ9cGV0c2hvcF9wb3B1bGFyX3BpY2soJzE4NTg3LDE3OTc4LDE5NTgyLDE3NDE1LDE5NzYwLDE3MDM4LDE5NDQ2LDE3MTcwLDE3ODIzJyw2KTsKCQkkYz1wZXRzaG9wX3BvcHVsYXJfcGljaygnMTgzNjksMTgwNDMsMTkzODcsMTkwMzMsMTg0NTgsMTY5NDIsMTc0ODEsMTY5MzMnLDYpOwoJCSRvdXRbJ2F0cmlua3RhX2RvZyddPWFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICRwLT5nZXRfaWQoKTt9LCRkKTsKCQkkb3V0WydhdHJpbmt0YV9jYXQnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHApe3JldHVybiAkcC0+Z2V0X2lkKCk7fSwkYyk7Cgl9CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQsSlNPTl9QUkVUVFlfUFJJTlR8SlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sIDYgKTsK",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  // 1. SVETAINES SVEIKATA
  const hp=sh('curl -s -k -o /dev/null -w "%{http_code}" --max-time 25 "'+BASE+'/"');
  L('HOMEPAGE HTTP: '+hp);
  // 2. verify snippet
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let ex=null;try{ex=JSON.parse(list.body).find(s=>/Popular Verify/i.test(s.name));}catch(e){}
  const payload={name:'Petshop Popular Verify v1',desc:'token',code:PHP,scope:'global',active:true,priority:10};
  const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  L('verify id='+id); execSync('sleep 2');
  const r=sh('curl -s -k --max-time 30 "'+BASE+'/?ps_popverify=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('=== VERIFY ===');L(r.slice(0,1500));
  if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});}
  putText('pop_verify.json', r.slice(0,3000));
}catch(e){L('!!! '+e);}finally{putText('_run55_log.txt',out);}})();
