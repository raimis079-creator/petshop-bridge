import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3piMyddKSB8fCAkX0dFVFsncHNfemIzJ10hPT0nWmIzeCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgncmV6aW1hcyc9PidQUkVWSUVXIOKAlCBuaWVrbyBuZXJhxaFvbWEnKTsKICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9QcmljaW5nJyk7CiAgJGN0b3I9JHJjLT5nZXRDb25zdHJ1Y3RvcigpOwogICRvWydrb25zdHJ1a3RvcmlhdXNfcGFyYW0nXT0kY3Rvcj8kY3Rvci0+Z2V0TnVtYmVyT2ZSZXF1aXJlZFBhcmFtZXRlcnMoKTowOwogIHRyeXsgJFA9JGN0b3IgJiYgJGN0b3ItPmdldE51bWJlck9mUmVxdWlyZWRQYXJhbWV0ZXJzKCk+MCA/IG51bGwgOiBuZXcgUGV0c2hvcF9QcmljaW5nKCk7IH0KICBjYXRjaChUaHJvd2FibGUgJGUpeyAkUD1udWxsOyAkb1snY3Rvcl9lcnInXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgaWYoISRQKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAkb1snbWFya3VwX2xlbnRlbGUnXT1tZXRob2RfZXhpc3RzKCRQLCdnZXRfbWFya3VwX3RhYmxlJyk/JFAtPmdldF9tYXJrdXBfdGFibGUoKTpudWxsOwoKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgIEpPSU4geyR3cGRiLT5wb3N0bWV0YX0gYyBPTiBjLnBvc3RfaWQ9cC5JRCBBTkQgYy5tZXRhX2tleT0nX3piX2Nvc3QnIEFORCBjLm1ldGFfdmFsdWU+MAogICAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogICAgICBBTkQgcC5JRCBOT1QgSU4gKFNFTEVDVCBwb3N0X2lkIEZST00geyR3cGRiLT5wb3N0bWV0YX0gV0hFUkUgbWV0YV9rZXk9J196Yl9wcmljZV9pbml0aWFsaXplZCcpIik7CiAgJG9bJ25laW5pY2lhbGl6dW90dV9wdWJsaXNoJ109Y291bnQoJGlkcyk7CiAgJHNrPWFycmF5KCd2aWVub2RhJz0+MCwna2lscyc9PjAsJ2tyaXMnPT4wLCduZXBhdnlrbyc9PjApOwogICRwdno9YXJyYXkoKTsgJGRpZGVsaT1hcnJheSgpOyAkc3VtTz0wOyAkc3VtTj0wOyAkcmV2aWV3PTA7CiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJHBpZD0oaW50KSRwaWQ7CiAgICAkY29zdD0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkcGlkLCdfemJfY29zdCcsdHJ1ZSk7CiAgICAkY3VyPShmbG9hdClnZXRfcG9zdF9tZXRhKCRwaWQsJ19yZWd1bGFyX3ByaWNlJyx0cnVlKTsKICAgIGlmKCRjb3N0PD0wfHwkY3VyPD0wKXsgJHNrWyduZXBhdnlrbyddKys7IGNvbnRpbnVlOyB9CiAgICAkc2x1Z3M9d3BfZ2V0X3Bvc3RfdGVybXMoJHBpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdmaWVsZHMnPT4nc2x1Z3MnKSk7CiAgICBpZihpc193cF9lcnJvcigkc2x1Z3MpKSAkc2x1Z3M9YXJyYXkoKTsKICAgIHRyeXsgJHJlcz0kUC0+Y2FsY3VsYXRlX2ZpbmFsX3ByaWNlKCRjb3N0LChhcnJheSkkc2x1Z3MpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHNrWyduZXBhdnlrbyddKys7IGNvbnRpbnVlOyB9CiAgICAkbmV3PShmbG9hdCkkcmVzWydwcmljZSddOwogICAgaWYoIWVtcHR5KCRyZXNbJ3Jldmlld19yZWFzb25zJ10pKSAkcmV2aWV3Kys7CiAgICAkc3VtTys9JGN1cjsgJHN1bU4rPSRuZXc7CiAgICAkZD0kbmV3LSRjdXI7ICRkcD0kY3VyPjA/JGQvJGN1cioxMDA6MDsKICAgIGlmKGFicygkZCk8MC4wMDUpICRza1sndmllbm9kYSddKys7IGVsc2VpZigkZD4wKSAkc2tbJ2tpbHMnXSsrOyBlbHNlICRza1sna3JpcyddKys7CiAgICAkcmVjPWFycmF5KCdpZCc9PiRwaWQsJ24nPT5tYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLDAsMzIpLAogICAgICAnY29zdCc9PnJvdW5kKCRjb3N0LDIpLCdkYWJhcic9PnJvdW5kKCRjdXIsMiksJ25hdWphJz0+cm91bmQoJG5ldywyKSwnc2snPT5yb3VuZCgkZCwyKSwncHJvYyc9PnJvdW5kKCRkcCwxKSk7CiAgICBpZihjb3VudCgkcHZ6KTw4KSAkcHZ6W109JHJlYzsKICAgIGlmKGFicygkZHApPj0xMCAmJiBjb3VudCgkZGlkZWxpKTwxNSkgJGRpZGVsaVtdPSRyZWM7CiAgfQogICRvWydza2lydHVtYWknXT0kc2s7ICRvWydyZXZpZXdfZmxhZyddPSRyZXZpZXc7CiAgJG9bJ3N1bWFfZGFiYXInXT1yb3VuZCgkc3VtTywyKTsgJG9bJ3N1bWFfbmF1amEnXT1yb3VuZCgkc3VtTiwyKTsKICAkb1snYmVuZHJhc19wb2t5dGlzX3Byb2MnXT0kc3VtTz4wP3JvdW5kKCgkc3VtTi0kc3VtTykvJHN1bU8qMTAwLDIpOm51bGw7CiAgJG9bJ3B2eiddPSRwdno7ICRvWydkaWRlbGknXT0kZGlkZWxpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'ZB3 '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  const r=execSync('curl -sk --max-time 170 "https://dev.avesa.lt/?ps_zb3=Zb3x"',{maxBuffer:20e6,timeout:190000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.result=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+400); } }
}catch(e){o.err=String(e).slice(0,200);}
try{ if(sid!=null) execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"'); }catch(e){}
putB64('zb3.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
