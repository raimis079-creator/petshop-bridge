import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ua',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbua.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbua.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3VwYWtjJ10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogICRjb250ZW50ID0gYmFzZTY0X2RlY29kZSgnUEdScGRpQmpiR0Z6Y3owaWNITmpMWE52YkMxb1pYSnZJajRLUEdneElHTnNZWE56UFNKd2MyTXRjMjlzTFdobGNtOHRkR2wwYkdVaVBrRnJZMmxxYjNNOEwyZ3hQZ284Y0NCamJHRnpjejBpY0hOakxYTnZiQzFvWlhKdkxYUmxlSFFpUGtGMGNtbHVhMjl0WlNERm9XbDFieUJ0WlhSMUlHZGhiR2x2YW1GdXhJMXBkWE1nY0dGemFjV3JiSGx0ZFhNc0lHdGhaQ0JpeGF0MHhiTWdiR1Z1WjNacFlYVWdjbUZ6ZEdrZ2NISmxhMlZ6SUhYRnZpQm5aWEpsYzI3RW1TQnJZV2x1eElVZzRvQ1VJRzUxYnlCdWRXdGhhVzV2ZE1XeklIQnliMlIxYTNURnN5QnBhMmtnY21saWIzUnZJR3hoYVd0dklHRnJZMmxxeGJNdVBDOXdQZ284TDJScGRqNEtDbHR6WVd4bFgzQnliMlIxWTNSeklIQmxjbDl3WVdkbFBTSXlOQ0lnWTI5c2RXMXVjejBpTkNJZ2IzSmtaWEppZVQwaWNHOXdkV3hoY21sMGVTSWdiM0prWlhJOUlrUkZVME1pWFFvPScpOwogICRyID0gd3BfdXBkYXRlX3Bvc3QoYXJyYXkoJ0lEJz0+MzQ0NDUsJ3Bvc3RfY29udGVudCc9PiRjb250ZW50KSwgdHJ1ZSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KAogICAgJ3VwZGF0ZScgPT4gaXNfd3BfZXJyb3IoJHIpID8gJHItPmdldF9lcnJvcl9tZXNzYWdlKCkgOiAnT0snLAogICAgJ2xlbmd0aCcgPT4gc3RybGVuKGdldF9wb3N0X2ZpZWxkKCdwb3N0X2NvbnRlbnQnLDM0NDQ1KSksCiAgKSk7IGV4aXQ7Cn0pOwo=",'base64').toString('utf8').trim();
(async()=>{
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC UPAKC', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 25 "'+BASE+'/?psc_upakc=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); commit('upd_akc.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
