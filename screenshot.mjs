process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
import { execSync } from 'child_process';
const B='https://dev.avesa.lt';
const U=process.env.WP_USER,P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='Basic '+Buffer.from(U+':'+P).toString('base64');
const TOK=process.env.GH_TOKEN||'';
fs.mkdirSync('screenshots',{recursive:true});
const out={marker:'PATIKRA 0813',ts:new Date().toISOString()};
async function wp(p,o={}){try{const r=await fetch(B+p,{...o,headers:{'Authorization':AUTH,'Content-Type':'application/json',...(o.headers||{})}});return{status:r.status,text:await r.text()}}catch(e){return{status:0,text:String(e)}}}
function js(t){const i=Math.min(...['[','{'].map(c=>{const x=t.indexOf(c);return x<0?1e9:x}));try{return JSON.parse(t.slice(i))}catch(e){return null}}
const s=await wp('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP RINK GAL 0813',code:Buffer.from('YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCgkX0dFVFsncHNfZ2FsJ10gPz8gJycpIT09J0dsNzdTczQnKSByZXR1cm47CglAc2V0X3RpbWVfbGltaXQoMTIwKTsKCWdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7Cgkkbz1hcnJheSgnbWFya2VyJz0+J0dBTEVSSUpBJyk7CgkkcGlkPShpbnQpKCRfR0VUWydwaWQnXSA/PyAzNDkxOCk7CgkkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKCSRvWydwaWQnXT0kcGlkOwoJJG9bJ3BhdiddPSRwP21iX3N1YnN0cigkcC0+Z2V0X25hbWUoKSwwLDUwKTonLSc7CgkkdGg9Z2V0X3Bvc3RfdGh1bWJuYWlsX2lkKCRwaWQpOwoJJG9bJ3RodW1ibmFpbF9pZCddPSR0aDsKCSRvWyd0aHVtYm5haWxfdXJsJ109JHRoP3dwX2dldF9hdHRhY2htZW50X3VybCgkdGgpOicnOwoJJG9bJ3RodW1ibmFpbF9mYWlsYXMnXT0kdGg/YmFzZW5hbWUoZ2V0X2F0dGFjaGVkX2ZpbGUoJHRoKSk6Jyc7Cgkkb1snZ2FsZXJpamEnXT0kcD8kcC0+Z2V0X2dhbGxlcnlfaW1hZ2VfaWRzKCk6YXJyYXkoKTsKCSRvWydnYWxlcmlqb3NfZmFpbGFpJ109YXJyYXkoKTsKCWZvcmVhY2goKGFycmF5KSRvWydnYWxlcmlqYSddIGFzICRnKXsgJG9bJ2dhbGVyaWpvc19mYWlsYWknXVtdPWJhc2VuYW1lKGdldF9hdHRhY2hlZF9maWxlKCRnKSk7IH0KCSRvWydrb21wX2hhc2gnXT1nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19yaW5rX2tvbXBfaGFzaCcsdHJ1ZSk7Cgkkb1sndmVyc2lqYV9rbGFzZWplJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1JpbmtpbmlhaScpP1BldHNob3BfUmlua2luaWFpOjpWRVJTSUpBOictJzsKCS8qIG5hdWphdXNpIHJpbmsta29tcG96aWNpamEgZmFpbGFpICovCgkkYXR0PSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdGl0bGUscG9zdF9wYXJlbnQscG9zdF9kYXRlIEZST00geyRwZn1wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J2F0dGFjaG1lbnQnIEFORCBwb3N0X3RpdGxlIExJS0UgJ3Jpbmsta29tcG96aWNpamElJyBPUkRFUiBCWSBJRCBERVNDIExJTUlUIDYiLEFSUkFZX0EpOwoJJG9bJ2tvbXBvemljaWpvcyddPSRhdHQ7CgkvKiBhciBNbk0gcHJpZGVkYSB2YWlrdSBudW90cmF1a2FzIGkgZ2FsZXJpamEgKi8KCWdsb2JhbCAkd3BfZmlsdGVyOwoJJGw9YXJyYXkoKTsKCWZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX3Byb2R1Y3RfZ2V0X2dhbGxlcnlfaW1hZ2VfaWRzJywnd29vY29tbWVyY2Vfc2luZ2xlX3Byb2R1Y3RfaW1hZ2VfdGh1bWJuYWlsX2h0bWwnKSBhcyAkaCl7CgkJaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKSBmb3JlYWNoKCR3cF9maWx0ZXJbJGhdLT5jYWxsYmFja3MgYXMgJHByPT4kY2JzKSBmb3JlYWNoKCRjYnMgYXMgJGNiKXsKCQkJJG49aXNfYXJyYXkoJGNiWydmdW5jdGlvbiddKT8oaXNfb2JqZWN0KCRjYlsnZnVuY3Rpb24nXVswXSk/Z2V0X2NsYXNzKCRjYlsnZnVuY3Rpb24nXVswXSk6JGNiWydmdW5jdGlvbiddWzBdKS4nOjonLiRjYlsnZnVuY3Rpb24nXVsxXTooaXNfc3RyaW5nKCRjYlsnZnVuY3Rpb24nXSk/JGNiWydmdW5jdGlvbiddOidjbG9zdXJlJyk7CgkJCSRsW109JGguJyAnLiRwci4nOicuJG47CgkJfQoJfQoJJG9bJ2dhbGVyaWpvc19maWx0cmFpJ109JGw7CgloZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMwKTsK','base64').toString('utf8'),scope:'global',active:true,priority:5})});
const j=js(s.text); out.snip=j&&j.id?j.id:null; out.snip_status=s.status;
await new Promise(r=>setTimeout(r,4000));
try{
  const res=execSync(`curl -sk "${B}/?ps_gal=Gl77Ss4&pid=34918" --max-time 120`,{encoding:'utf8',maxBuffer:20*1024*1024});
  out.rez=js(res); if(!out.rez) out.raw=res.slice(0,600);
}catch(e){ out.err=String(e).slice(0,300); }
if(out.snip) await wp('/wp-json/code-snippets/v1/snippets/'+out.snip,{method:'POST',body:JSON.stringify({active:false})});
const r=await fetch('https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/gal.json',{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify({message:'gal rez',content:Buffer.from(JSON.stringify(out,null,1)).toString('base64')})});
console.log('put',r.status);
