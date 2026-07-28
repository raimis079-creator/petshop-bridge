import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2ZpeCddKSB8fCAkX0dFVFsncHNfZml4J10hPT0nRml4eCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICR0YWJzPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfdGFibGVzJzsgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsgJG1hcD0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX21hcCc7CiAgLy8gMS4ga29raW9zIHJlaWtzbWVzIG5hdWRvamFtb3MgSU5URVJWQUxJTkVNUyBsZW50ZWxlbXMgKHdlaWdodF9mcm9tIDw+IHdlaWdodF90bykKICAkZXRhbG9uPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgdC5pZCx0LnNoYXBlLHQubG9va3VwX21ldGhvZCx0LmJfcGF0aF9zdGF0dXMsdC5zY29wZSx0LnNvdXJjZV9zdHJ1Y3R1cmUsdC5yZXNvbHV0aW9uX3BvbGljeQogICAgRlJPTSAkdGFicyB0IEpPSU4gJHJvd3MgciBPTiByLmZlZWRpbmdfdGFibGVfaWQ9dC5pZAogICAgV0hFUkUgci53ZWlnaHRfdG9fa2cgPiByLndlaWdodF9mcm9tX2tnIEFORCB0LnN0YXR1cz0ndmVyaWZpZWQnCiAgICAgIEFORCB0LmltcG9ydF9iYXRjaF9pZCBJUyBOVUxMCiAgICBHUk9VUCBCWSB0LmlkIExJTUlUIDEiLEFSUkFZX0EpOwogICRvWydldGFsb25hcyddPSRldGFsb247CiAgJG9bJ3NoYXBlX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgc2hhcGUsQ09VTlQoKikgYyBGUk9NICR0YWJzIEdST1VQIEJZIHNoYXBlIixBUlJBWV9BKTsKICAkb1snbG9va3VwX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbG9va3VwX21ldGhvZCxDT1VOVCgqKSBjIEZST00gJHRhYnMgR1JPVVAgQlkgbG9va3VwX21ldGhvZCIsQVJSQVlfQSk7CiAgJG9bJ2JwYXRoX3JlaWtzbWVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgYl9wYXRoX3N0YXR1cyxDT1VOVCgqKSBjIEZST00gJHRhYnMgR1JPVVAgQlkgYl9wYXRoX3N0YXR1cyIsQVJSQVlfQSk7CgogIGlmKGlzc2V0KCRfR0VUWydjb25maXJtJ10pICYmICRfR0VUWydjb25maXJtJ109PT0nRklYJyAmJiAkZXRhbG9uKXsKICAgICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NICR0YWJzIFdIRVJFIGltcG9ydF9iYXRjaF9pZCBMSUtFICdTMjk1JSciKTsKICAgICRuPTA7CiAgICBmb3JlYWNoKCRpZHMgYXMgJHRpZCl7CiAgICAgICR0aWQ9KGludCkkdGlkOwogICAgICAkY250PShpbnQpJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRyb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQ9JWQiLCR0aWQpKTsKICAgICAgJHdwZGItPnVwZGF0ZSgkdGFicyxhcnJheSgKICAgICAgICAnc2hhcGUnPT4kZXRhbG9uWydzaGFwZSddLAogICAgICAgICdsb29rdXBfbWV0aG9kJz0+JGV0YWxvblsnbG9va3VwX21ldGhvZCddLAogICAgICAgICdiX3BhdGhfc3RhdHVzJz0+JGV0YWxvblsnYl9wYXRoX3N0YXR1cyddLAogICAgICAgICdzY29wZSc9PiRldGFsb25bJ3Njb3BlJ10sCiAgICAgICAgJ3NvdXJjZV9zdHJ1Y3R1cmUnPT4kZXRhbG9uWydzb3VyY2Vfc3RydWN0dXJlJ10sCiAgICAgICAgJ3Jlc29sdXRpb25fcG9saWN5Jz0+JGV0YWxvblsncmVzb2x1dGlvbl9wb2xpY3knXSwKICAgICAgICAndmFsdWVfcm93X2NvdW50Jz0+JGNudCwKICAgICAgICAncmVkaXJlY3Rfcm93X2NvdW50Jz0+MCwKICAgICAgICAncm93X2NvdW50Jz0+JGNudCwKICAgICAgICAndXBkYXRlZF9hdCc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwKICAgICAgKSxhcnJheSgnaWQnPT4kdGlkKSk7CiAgICAgICRuKys7CiAgICB9CiAgICAkb1sncGF0YWlzeXRhJ109JG47CiAgfQogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
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
const o={marker:'S295C'}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'FIX '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  // 1. etalonas
  let r=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_fix=Fixx"',{maxBuffer:20e6}).toString();
  let i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i) o.info=JSON.parse(r.slice(i,k+1));
  execSync('sleep 3');
  // 2. taisom
  r=execSync('curl -sk --max-time 90 "https://dev.avesa.lt/?ps_fix=Fixx&confirm=FIX"',{maxBuffer:20e6,timeout:110000}).toString();
  i=r.indexOf('{'); k=r.lastIndexOf('}');
  if(i>=0&&k>i) o.fix=JSON.parse(r.slice(i,k+1));
  execSync('sleep 4');
  // 3. PATIKRA
  const call=(b)=>{ fs.writeFileSync('/tmp/cb.json', JSON.stringify(b));
    const x=execSync('curl -sk --max-time 45 -X POST -H "Content-Type: application/json" --data-binary @/tmp/cb.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:8e6,timeout:60000}).toString();
    try{ return JSON.parse(x); }catch(e){ return {}; } };
  const pick=(r2)=>({st:r2.status,norm:(r2.norm_min_g??null)+'-'+(r2.norm_max_g??null),
    days:(r2.days_min??null)+'-'+(r2.days_max??null),eur:(r2.cost_day_min??null)+'-'+(r2.cost_day_max??null),rc:r2.reason_codes});
  o.t1 = pick(call({product_id:20403, weight_kg:2,  species_code:'dog'}));
  o.t2 = pick(call({product_id:20403, weight_kg:3,  species_code:'dog'}));
  o.t3 = pick(call({product_id:20403, weight_kg:20, species_code:'dog'}));
  o.t5 = pick(call({product_id:20393, weight_kg:5,  species_code:'dog'}));
  o.t6 = pick(call({product_id:18620, weight_kg:13, species_code:'dog'}));
  if(sid!==null){ try{execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){ o.err=String(e).slice(0,250); }
putB64('s295c.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
