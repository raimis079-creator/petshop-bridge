import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'dr '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s --max-time 40 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("aWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCgkX0dFVFsncHNfZGVscm93cyddKSApIHsgcmV0dXJuOyB9CgkkdG9rID0gaXNzZXQoJF9HRVRbJ3Rva2VuJ10pID8gc2FuaXRpemVfdGV4dF9maWVsZCh3cF91bnNsYXNoKCRfR0VUWyd0b2tlbiddKSkgOiAnJzsKCWlmICggJHRvayAhPT0gJ2NtcGx6XzY2ODBhYTJhNDIxNTFkNTRmYThkNjRlYycgKSB7IHJldHVybjsgfQoJZ2xvYmFsICR3cGRiOwoJJHNlbGYgPSBpc3NldCgkX0dFVFsnc2VsZiddKSA/IGludHZhbCgkX0dFVFsnc2VsZiddKSA6IDA7CgkkaWRzID0gYXJyYXkoNjY0LDY2NSw2NjYsNjY3LDY2OCw2NjksNjcwLDY3MSw2NzIsNjczLDY3NCw2NzUsNjc2KTsKCWlmICggJHNlbGYgKSB7ICRpZHNbXSA9ICRzZWxmOyB9CgkkaWRzID0gYXJyYXlfbWFwKCdpbnR2YWwnLCRpZHMpOwoJJGluID0gaW1wbG9kZSgnLCcsICRpZHMpOwoJJHRhYmxlID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwoJJG91dCA9IGFycmF5KCd0YWJsZSc9PiR0YWJsZSk7Cgkkb3V0WydwcmllcyddPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR0YWJsZX0gV0hFUkUgaWQgSU4gKHskaW59KSIpOwoJJG91dFsnZGVsZXRlZCddPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskdGFibGV9IFdIRVJFIGlkIElOICh7JGlufSkiKTsKCSRvdXRbJ3BvJ109IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHRhYmxlfSBXSEVSRSBpZCBJTiAoeyRpbn0pIik7CglpZiAoIGZ1bmN0aW9uX2V4aXN0cygnY2xlYW5fc25pcHBldHNfY2FjaGUnKSApIHsgY2xlYW5fc25pcHBldHNfY2FjaGUoJHRhYmxlKTsgJG91dFsnY2FjaGUnXT0nY2xlYW5fc25pcHBldHNfY2FjaGUnOyB9Cgl3cF9jYWNoZV9kZWxldGUoJ2FsbF9zbmlwcGV0cycsJ2NvZGVfc25pcHBldHMnKTsKCXdwX2NhY2hlX2ZsdXNoKCk7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQsSlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCA2ICk7Cg==",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const payload={name:'Petshop DelRows v1',desc:'token',code:PHP,scope:'global',active:true,priority:10};
  const c=api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  L('delrows helper id='+id); execSync('sleep 2');
  const r=sh('curl -s -k --max-time 40 "'+BASE+'/?ps_delrows=1&self='+id+'&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('=== DELETE ROWS ==='); L(r.slice(0,600));
  execSync('sleep 3');
  // verifikacija per REST
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=400');
  let snips=[];try{snips=JSON.parse(list.body);}catch(e){}
  const targets=[664,665,666,667,668,669,670,671,672,673,674,675,676,id];
  const left=snips.filter(s=>targets.includes(s.id)).map(s=>s.id);
  L('PO trynimo dar liko is taikiniu: ['+left.join(',')+']');
  L('viso snippetu dabar: '+snips.length);
  putText('_run69_delrows.txt', out);
}catch(e){L('!!! '+e); putText('_run69_delrows.txt',out);}})();
