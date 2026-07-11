import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'cu '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("LyoqCiAqIFBldHNob3AgVGVzdGluaXUgVXNlcml1IFZhbHltYXMgdjEgKHRva2VuKQogKiBSVU46IC8/cHNfZGVsX3Rlc3RfdXNlcnM9MSZ0b2tlbj1jbXBsel82NjgwYWEyYTQyMTUxZDU0ZmE4ZDY0ZWMKICovCmlmICggISBkZWZpbmVkKCAnQUJTUEFUSCcgKSApIHsgcmV0dXJuOyB9CmFkZF9hY3Rpb24oICd3cF9sb2FkZWQnLCBmdW5jdGlvbiAoKSB7CglpZiAoICEgaXNzZXQoICRfR0VUWydwc19kZWxfdGVzdF91c2VycyddICkgKSB7IHJldHVybjsgfQoJJHRva2VuID0gaXNzZXQoJF9HRVRbJ3Rva2VuJ10pID8gc2FuaXRpemVfdGV4dF9maWVsZCh3cF91bnNsYXNoKCRfR0VUWyd0b2tlbiddKSkgOiAnJzsKCWlmICggJHRva2VuICE9PSAnY21wbHpfNjY4MGFhMmE0MjE1MWQ1NGZhOGQ2NGVjJyApIHsgcmV0dXJuOyB9CglpZiAoICEgZnVuY3Rpb25fZXhpc3RzKCd3cF9kZWxldGVfdXNlcicpICkgeyByZXF1aXJlX29uY2UgQUJTUEFUSC4nd3AtYWRtaW4vaW5jbHVkZXMvdXNlci5waHAnOyB9CgoJJG91dCA9IGFycmF5KCdyYXN0aSc9PmFycmF5KCksJ2lzdHJpbnRpJz0+YXJyYXkoKSk7CgkvLyBJZXNrb20gZ2E0dGVzdCpAcGV0c2hvcC5sdCArIHRlcnJhQGd5dnVuYWkubHQgKHRlc3RpbmlhaSkKCSR1c2VycyA9IGdldF91c2VycyggYXJyYXkoJ251bWJlcic9PjEwMCwgJ2ZpZWxkcyc9PmFycmF5KCdJRCcsJ3VzZXJfZW1haWwnLCd1c2VyX3JlZ2lzdGVyZWQnLCd1c2VyX2xvZ2luJykpICk7Cglmb3JlYWNoICggJHVzZXJzIGFzICR1ICkgewoJCSRlbSA9ICR1LT51c2VyX2VtYWlsOwoJCSRpc190ZXN0ID0gKCBwcmVnX21hdGNoKCcvXmdhNHRlc3RcZCtAcGV0c2hvcFwubHQkLycsICRlbSkgfHwgJGVtID09PSAndGVycmFAZ3l2dW5haS5sdCcgKTsKCQlpZiAoICRpc190ZXN0ICkgewoJCQkkb3V0WydyYXN0aSddW10gPSBhcnJheSgnaWQnPT4kdS0+SUQsJ2VtYWlsJz0+JGVtLCdyZWcnPT4kdS0+dXNlcl9yZWdpc3RlcmVkLCdsb2dpbic9PiR1LT51c2VyX2xvZ2luKTsKCQl9Cgl9CgoJJGFwcGx5ID0gaXNzZXQoJF9HRVRbJ2NvbmZpcm0nXSkgJiYgJF9HRVRbJ2NvbmZpcm0nXT09PSdBUFBMWV9ERUwnOwoJJG91dFsnbW9kZSddID0gJGFwcGx5ID8gJ0FQUExZJyA6ICdEUlktUlVOJzsKCglpZiAoICRhcHBseSApIHsKCQlmb3JlYWNoICggJG91dFsncmFzdGknXSBhcyAkciApIHsKCQkJLy8gcmVhc3NpZ24gdHVyaW5pIGFkbWludWkgKElEIDEpLCB0YWRhIHRyaW5hbQoJCQkkb2sgPSB3cF9kZWxldGVfdXNlciggJHJbJ2lkJ10sIDEgKTsKCQkJJG91dFsnaXN0cmludGknXVtdID0gYXJyYXkoJ2lkJz0+JHJbJ2lkJ10sJ2VtYWlsJz0+JHJbJ2VtYWlsJ10sJ29rJz0+JG9rPydERUxFVEVEJzonRkFJTCcpOwoJCX0KCX0KCgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwoJZWNobyB3cF9qc29uX2VuY29kZSgkb3V0LCBKU09OX1BSRVRUWV9QUklOVHxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwoJZXhpdDsKfSwgNiApOwo=",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let ex=null;try{ex=JSON.parse(list.body).find(s=>/Testiniu Useriu Valymas/i.test(s.name));}catch(e){}
  const payload={name:'Petshop Testiniu Useriu Valymas v1',desc:'token',code:PHP,scope:'front-end',active:true,priority:10};
  const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let snip=null;try{snip=JSON.parse(c.body);}catch(e){}const id=snip&&snip.id?snip.id:(ex&&ex.id);
  L('cleanup snippet id='+id+' HTTP '+c.code);
  execSync('sleep 2');
  // DRY
  const dry=sh('curl -s -k "'+BASE+'/?ps_del_test_users=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  L('=== DRY ==='); L(dry.slice(0,800));
  // APPLY
  execSync('sleep 1');
  const ap=sh('curl -s -k "'+BASE+'/?ps_del_test_users=1&token=cmplz_6680aa2a42151d54fa8d64ec&confirm=APPLY_DEL"');
  L('=== APPLY ==='); L(ap.slice(0,800));
  if(id){const d=api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('deactivate '+id+' -> '+d.code);}
  L('DONE');
}catch(e){L('!!! '+e);}finally{putText('_run25_log.txt',out);}})();
