import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'dr2 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s --max-time 40 -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("aWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyByZXR1cm47IH0KYWRkX2FjdGlvbiggJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uICgpIHsKCWlmICggISBpc3NldCgkX0dFVFsncHNfZGVscm93czInXSkgKSB7IHJldHVybjsgfQoJJHRvayA9IGlzc2V0KCRfR0VUWyd0b2tlbiddKSA/IHNhbml0aXplX3RleHRfZmllbGQod3BfdW5zbGFzaCgkX0dFVFsndG9rZW4nXSkpIDogJyc7CglpZiAoICR0b2sgIT09ICdjbXBsel82NjgwYWEyYTQyMTUxZDU0ZmE4ZDY0ZWMnICkgeyByZXR1cm47IH0KCWdsb2JhbCAkd3BkYjsKCSRzZWxmID0gaXNzZXQoJF9HRVRbJ3NlbGYnXSkgPyBpbnR2YWwoJF9HRVRbJ3NlbGYnXSkgOiAwOwoJJGlkcyA9IGFycmF5KDY2NCw2NjUsNjY2LDY2Nyw2NjgsNjY5LDY3MCw2NzEsNjcyLDY3Myw2NzQsNjc1LDY3Nik7CglpZiAoICRzZWxmID4gMCApIHsgJGlkc1tdID0gJHNlbGY7IH0KCSRpbiA9IGltcGxvZGUoJywnLCBhcnJheV9tYXAoJ2ludHZhbCcsJGlkcykpOwoJJHRhYmxlID0gJHdwZGItPnByZWZpeC4nc25pcHBldHMnOwoJJG91dCA9IGFycmF5KCd0YWJsZSc9PiR0YWJsZSk7Cgkkb3V0WydwcmllcyddPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR0YWJsZX0gV0hFUkUgaWQgSU4gKHskaW59KSIpOwoJJG91dFsnZGVsZXRlZCddPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskdGFibGV9IFdIRVJFIGlkIElOICh7JGlufSkiKTsKCSRvdXRbJ3BvJ109IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHRhYmxlfSBXSEVSRSBpZCBJTiAoeyRpbn0pIik7CglpZiAoIGZ1bmN0aW9uX2V4aXN0cygnY2xlYW5fc25pcHBldHNfY2FjaGUnKSApIHsgY2xlYW5fc25pcHBldHNfY2FjaGUoJHRhYmxlKTsgfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkb3V0LEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgNiApOwo=",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const payload={name:'Petshop DelRows2 v1',desc:'token',code:PHP,scope:'global',active:true,priority:10};
  const c=api('POST','/wp-json/code-snippets/v1/snippets',payload);
  L('create HTTP '+c.code);
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){L('create parse: '+c.body.slice(0,200));}
  L('helper id='+id);
  if(!id){ L('CREATE NEPAVYKO - stoju'); putText('_run71.txt',out); return; }
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 40 "'+BASE+'/?ps_delrows2=1&self='+id+'&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('=== DELETE ==='); L(r.slice(0,500));
  execSync('sleep 3');
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=400');
  let snips=[];try{snips=JSON.parse(list.body);}catch(e){}
  const targets=[664,665,666,667,668,669,670,671,672,673,674,675,676,id];
  const left=snips.filter(s=>targets.includes(s.id)).map(s=>s.id);
  L('PO trynimo dar liko: ['+left.join(',')+']');
  L('viso snippetu: '+snips.length);
  const hp=sh('curl -s -k -o /dev/null -w "%{http_code}" --max-time 20 "'+BASE+'/"'); L('HOMEPAGE: '+hp);
  putText('_run71.txt',out);
}catch(e){L('!!! '+e); putText('_run71.txt',out);}})();
