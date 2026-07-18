const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKCFpc3NldCgkX0dFVFsncHNfZnMnXSl8fCRfR0VUWydwc19mcyddIT09J0ZzOEt3M054Jyl7cmV0dXJuO30KCUBzZXRfdGltZV9saW1pdCgyMDApOyBnbG9iYWwgJHdwZGI7ICRwZj0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgncmVhZG9ubHknPT50cnVlKTsKCS8vIFZJU0kgc25pcHBldGFpIChpciBuZWFrdHl2xatzKSBzdSBjYW5vbmljYWwgaGFzaCBsb2dpa2EKCSRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSxMRU5HVEgoY29kZSkgbGVuIEZST00geyRwZn1zbmlwcGV0cwoJCVdIRVJFIGNvZGUgTElLRSAnJWNhbm9uaWNhbF90YWJsZV9oYXNoJScgT1IgY29kZSBMSUtFICclY2Fub25pY2FsX2hhc2glJwoJCU9SIChjb2RlIExJS0UgJyVjaGFzaCUnKSBPUiAoY29kZSBMSUtFICclY2Fub25pY2FsaXolJykiLCBBUlJBWV9BKTsKCSRvWydzbmlwcGV0YWknXT0kc247CgkvLyBpc3RyYXVraWFtIGNhbm9uaWNhbCBmdW5rY2lqb3Mga29kYSBpcyByYXN0byBzbmlwcGV0bwoJZm9yZWFjaCgkc24gYXMgJHMpewoJCSRjb2RlPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NIHskcGZ9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRzWydpZCddKSk7CgkJLy8gcmFuZGFtIGZ1bmtjaWphIGFwaWUgY2Fub25pY2FsIGhhc2gKCQlpZihwcmVnX21hdGNoX2FsbCgnL2Z1bmN0aW9uW157XSpjYW5vbmljW157XSpcey57MCw5MDB9P1xuXHQqXH0vaXMnLCRjb2RlLCRtKSl7CgkJCSRvWydmdW5rY2lqb3MnXVskc1snaWQnXV09YXJyYXlfbWFwKGZ1bmN0aW9uKCRmKXtyZXR1cm4gbWJfc3Vic3RyKCRmLDAsOTAwKTt9LCRtWzBdKTsKCQl9CgkJLy8gYXJiYSBlaWx1dGVzIHN1IGhhc2goIGlyIGNhbm9uaWNhbCBuZXRvbGkKCQlpZihwcmVnX21hdGNoKCcvKGNhbm9uaWNhbF90YWJsZV9oYXNoLnswLDQwMH0pL2lzJywkY29kZSwkbSkpewoJCQkkb1snc25pcHBldF8nLiRzWydpZCddLidfY3R4J109bWJfc3Vic3RyKCRtWzFdLDAsNjAwKTsKCQl9CgkJLy8gaWVza29tIGt1ciBoYXNoIHNrYWljaXVvamFtYXMKCQlpZihwcmVnX21hdGNoKCcvKGZ1bmN0aW9uXHMrXHcqY2Fub25cdypbXntdKlx7Lio/cmV0dXJuW147XSo7KS9pcycsJGNvZGUsJG0pKXsKCQkJJG9bJ2Nhbm9uX2Z1bmNfJy4kc1snaWQnXV09bWJfc3Vic3RyKCRtWzFdLDAsMTIwMCk7CgkJfQoJfQoJaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO='raimis079-creator/petshop-bridge';
function pr(n,o){const u=`https://api.github.com/repos/${REPO}/contents/screenshots/${n}`;let s='';
 for(let i=0;i<4;i++){ try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}?nocache=${Math.random()}"`).toString()); if(j.sha)s=j.sha; }catch(e){}
  fs.writeFileSync('/tmp/p.json',JSON.stringify({message:'fs',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync(`curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}"`,{maxBuffer:80*1024*1024}).toString().trim();
  if(c==='200'||c==='201') return c; }
 return 'fail';}
const U=process.env.WP_USER||'',P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
fs.writeFileSync('/tmp/wpu',U);fs.writeFileSync('/tmp/wpp',P);
function hit(u){try{return execSync(`curl -sk -m 500 -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" "${u}"`,{maxBuffer:150*1024*1024}).toString();}catch(e){return 'ERR';}}
function wj(m,p,b){fs.writeFileSync('/tmp/b.json',JSON.stringify(b));try{return execSync(`curl -sk -m 90 -X ${m} -H "Content-Type: application/json" -u "$(cat /tmp/wpu):$(cat /tmp/wpp)" -d @/tmp/b.json "https://dev.avesa.lt/wp-json/${p}"`,{maxBuffer:20*1024*1024}).toString();}catch(e){return 'ERR';}}
const o={};
const mk=wj('POST','code-snippets/v1/snippets',{name:'S212-C Find Snippet (read-only)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:10});
let id=null; try{const j=JSON.parse(mk); id=j.id; o.create={id:j.id,code_error:j.code_error||null};}catch(e){o.mk=mk.slice(0,250);}
if(id){ const r=hit('https://dev.avesa.lt/?ps_fs=Fs8Kw3Nx');
  const i=r.indexOf('{"');
  if(i>0){ o.php_warnings=r.slice(0,i).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,600); }
  const body=(i>=0)?r.slice(i):r;
  if(body.trim().startsWith('{')){ try{o.d=JSON.parse(body);}catch(e){o.perr=e.message.slice(0,120); o.raw=body.slice(0,4000);} }
  else o.raw=r.slice(0,4000);
  wj('POST',`code-snippets/v1/snippets/${id}`,{active:false}); }
console.log('PUT:',pr('fs.json',o));
