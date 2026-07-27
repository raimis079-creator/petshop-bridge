import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2RwJ10pIHx8ICRfR0VUWydwc19kcCddIT09J0RweCcpIHJldHVybjsKICAkbz1hcnJheSgpOwogIGZvcmVhY2goYXJyYXkoMzQ1MDAsMzQ0ODgsMzQ0ODYsMTk2NzIsMTk0MTcpIGFzICRwaWQpewogICAgJHA9d2NfZ2V0X3Byb2R1Y3QoJHBpZCk7CiAgICBpZighJHApeyAkb1skcGlkXT0nTkVSQSc7IGNvbnRpbnVlOyB9CiAgICAkY2F0cz13cF9nZXRfb2JqZWN0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J3NsdWdzJykpOwogICAgJG9bJHBpZF09YXJyYXkoCiAgICAgICduJz0+bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNTApLAogICAgICAndHlwZSc9PiRwLT5nZXRfdHlwZSgpLAogICAgICAnbWFuYWdlJz0+JHAtPmdldF9tYW5hZ2Vfc3RvY2soKSwKICAgICAgJ3F0eSc9PiRwLT5nZXRfc3RvY2tfcXVhbnRpdHkoKSwKICAgICAgJ3N0YXR1cyc9PiRwLT5nZXRfc3RvY2tfc3RhdHVzKCksCiAgICAgICdpbnN0b2NrJz0+JHAtPmlzX2luX3N0b2NrKCksCiAgICAgICdwYWsnPT4kcC0+Z2V0X2F0dHJpYnV0ZSgncGFfcGFrdW90ZXNfZHlkaXMnKSwKICAgICAgJ2NhdHMnPT5pc193cF9lcnJvcigkY2F0cyk/YXJyYXkoKTokY2F0cywKICAgICAgJ3NrdSc9PiRwLT5nZXRfc2t1KCksCiAgICApOwogIH0KICAvLyBraWVrIGlzIHZpc28gc2ltcGxlIGJlIG1hbmFnZV9zdG9jayBrb25zZXJ2dW9zZSBpciBrb2tpZQogIGdsb2JhbCAkd3BkYjsKICAkY2F0cz1hcnJheSgna29uc2VydmFpLWthdGVtcycsJ2tvbnNlcnZhaS1zdW5pbXMnLCdhbmltb25kYS1rb25zZXJ2YWktc3VuaW1zJywnbWlhbW9yLWthdGVtcycpOwogICRpbj0iJyIuaW1wbG9kZSgiJywnIiwkY2F0cykuIiciOwogICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBESVNUSU5DVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQKICAgIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwcm9kdWN0X2NhdCcKICAgIEpPSU4geyR3cGRiLT50ZXJtc30gdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBBTkQgdC5zbHVnIElOICgkaW4pCiAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgJG5vbWc9YXJyYXkoKTsKICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7ICRwPXdjX2dldF9wcm9kdWN0KCRwaWQpOyBpZighJHApIGNvbnRpbnVlOwogICAgaWYoJHAtPmdldF90eXBlKCk9PT0nc2ltcGxlJyAmJiAhJHAtPmdldF9tYW5hZ2Vfc3RvY2soKSkgJG5vbWdbXT1hcnJheSgnaWQnPT4kcGlkLCduJz0+bWJfc3Vic3RyKCRwLT5nZXRfbmFtZSgpLDAsNDQpLCdzdGF0dXMnPT4kcC0+Z2V0X3N0b2NrX3N0YXR1cygpKTsgfQogICRvWydzaW1wbGVfYmVfbWFuYWdlJ109JG5vbWc7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0pOwo=';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk --max-time 150 '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:170000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<2;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'DP (temp)',code:php,scope:'front-end',active:true,priority:5}); break; }catch(e){ execSync('sleep 5'); } }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  try{ const r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_dp=Dpx"',{maxBuffer:8e6,timeout:110000}).toString();
    const i=r.indexOf('{'),k=r.lastIndexOf('}'); if(i>=0&&k>i) o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.e=String(e).slice(0,100); }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('dup.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
