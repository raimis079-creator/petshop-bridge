import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2pkJ10pIHx8ICRfR0VUWydwc19qZCddIT09J0pkMjR4JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsgJHBmPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCk7CiAgJHI9UGV0c2hvcF9GZWVkaW5nX1NlcnZpY2U6OmNhbGMoYXJyYXkoJ3Byb2R1Y3RfaWQnPT4xOTc4NSwnd2VpZ2h0X2tnJz0+MzAsJ3NwZWNpZXNfY29kZSc9Pidkb2cnLCdhZ2VfbW9udGhzJz0+OC41LCdleHBlY3RlZF9hZHVsdF93ZWlnaHRfa2cnPT40NSkpOwogICRvWydzdTQ1J109YXJyYXkoJ3N0Jz0+JHJbJ3N0YXR1cyddLCdyYyc9PiRyWydyZWFzb25fY29kZXMnXT8/bnVsbCwnbXNnJz0+JHJbJ21lc3NhZ2VfbHQnXT8/bnVsbCwnZyc9Pigkclsnbm9ybV9taW5fZyddPz9udWxsKS4nLScuKCRyWydub3JtX21heF9nJ10/P251bGwpKTsKICAvLyBrYSByZXBvIGdyYXppbmEgcG8gYW16aWF1cyBmaWx0cm8gbmV6aW5vbSDigJQgcGFzaWltYW0gcGlsbmEgcnQgaXIgcGVyIHJlZmxla3NpamEgcGF6aXVyaW0gcG8gZGVmYXVsdHMKICAkcmVwbz1uZXcgUGV0c2hvcF9GZWVkaW5nX1JlcG9zaXRvcnkoKTsgJHJ0PSRyZXBvLT5nZXRfZm9yX3Byb2R1Y3QoMTk3ODUpOwogICRyZWY9bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRmVlZGluZ19TZXJ2aWNlJywnYXBwbHlfYXhpc19kZWZhdWx0cycpOyAkcmVmLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogIGxpc3QoJHJ0MiwkbmEpPSRyZWYtPmludm9rZShudWxsLCRydCxhcnJheSgnYWdlX21vbnRocyc9PjguNSkpOwogICRvWydwb19kZWZhdWx0cyddPWFycmF5KCduZWVkX2FnZSc9PiRuYSwnYXhlcyc9PmFycmF5X2tleXMoKGFycmF5KSgkcnQyWydheGlzX3BvbGljeSddPz9hcnJheSgpKSksJ24nPT5jb3VudCgkcnQyWydyb3dzJ10/P2FycmF5KCkpLAogICAgJ3Jvd3MnPT5hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHIpe3JldHVybiBhcnJheSgkclsnd2VpZ2h0X2Zyb21fa2cnXSwkclsnYW1vdW50X2Zyb21fZyddLCRyWydjb25kaXRpb25zJ10/P251bGwpO30sJHJ0Mlsncm93cyddPz9hcnJheSgpKSwwLDYpLAogICAgJ3N1cHBvcnQnPT4kcnQyWydzdXBwb3J0J10/P251bGwsJ3diJz0+JHJ0Mlsnd2VpZ2h0X2Jhc2lzJ10/P251bGwpOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const mk=wj('POST','code-snippets/v1/snippets',{name:'JD (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){}
execSync('sleep 3');
let r='';
try{ r=execSync('curl -sk "https://dev.avesa.lt/?ps_jd=Jd24x"',{maxBuffer:100*1024*1024,timeout:90000}).toString(); }catch(e){ r='EJD '+String(e).slice(0,200); }
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('jd.json', Buffer.from(r).toString('base64'));
console.log('done', r.length);
