import { execSync } from 'child_process';
import fs from 'fs';
const PHPB64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3JiJ10pIHx8ICRfR0VUWydwc19yYiddIT09J1JieCcpIHJldHVybjsKICB3aGlsZShvYl9nZXRfbGV2ZWwoKSkgb2JfZW5kX2NsZWFuKCk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgpOwogICR0YWJzPSR3cGRiLT5wcmVmaXguJ3BzX2ZlZWRpbmdfdGFibGVzJzsgJHJvd3M9JHdwZGItPnByZWZpeC4ncHNfZmVlZGluZ19yb3dzJzsgJG1hcD0kd3BkYi0+cHJlZml4Lidwc19mZWVkaW5nX21hcCc7CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00gJHRhYnMgV0hFUkUgaW1wb3J0X2JhdGNoX2lkIExJS0UgJ1MyOTUlJyIpOwogICRvWydyYXN0YV9sZW50ZWxpdSddPWNvdW50KCRpZHMpOwogICRvWydpZHMnXT0kaWRzOwogIGlmKGlzc2V0KCRfR0VUWydjb25maXJtJ10pICYmICRfR0VUWydjb25maXJtJ109PT0nUk9MTEJBQ0snICYmICRpZHMpewogICAgJGluPWltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkaWRzKSk7CiAgICAkb1snbWFwX2RlbCddPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJG1hcCBXSEVSRSBmZWVkaW5nX3RhYmxlX2lkIElOICgkaW4pIik7CiAgICAkb1sncm93c19kZWwnXT0kd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRyb3dzIFdIRVJFIGZlZWRpbmdfdGFibGVfaWQgSU4gKCRpbikiKTsKICAgICRvWyd0YWJzX2RlbCddPSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gJHRhYnMgV0hFUkUgaWQgSU4gKCRpbikiKTsKICAgICRvWydsaWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHRhYnMgV0hFUkUgaW1wb3J0X2JhdGNoX2lkIExJS0UgJ1MyOTUlJyIpOwogIH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
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
const o={marker:'S295-ROLLBACK'}; let sid=null;
try{
  const php = Buffer.from(PHPB64,'base64').toString('utf8');
  let mk=null;
  for(let a=0;a<3;a++){ try{ mk=wj('POST','code-snippets/v1/snippets',{name:'RB '+Date.now(),code:php,scope:'front-end',active:true,priority:5});
    if(mk && mk.indexOf('"id"')>=0) break; }catch(e){} execSync('sleep 8'); }
  try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 5');
  let r=execSync('curl -sk --max-time 60 "https://dev.avesa.lt/?ps_rb=Rbx&confirm=ROLLBACK"',{maxBuffer:20e6}).toString();
  let i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i) o.rollback=JSON.parse(r.slice(i,k+1));
  execSync('sleep 4');
  // PATIKRA: sistema tokia pat kaip pries
  const call=(b)=>{ fs.writeFileSync('/tmp/cb.json', JSON.stringify(b));
    const x=execSync('curl -sk --max-time 45 -X POST -H "Content-Type: application/json" --data-binary @/tmp/cb.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:8e6,timeout:60000}).toString();
    try{ return JSON.parse(x); }catch(e){ return {}; } };
  const pick=(r2)=>({st:r2.status,norm:(r2.norm_min_g??null)+'-'+(r2.norm_max_g??null),rc:r2.reason_codes});
  o.mini = pick(call({product_id:20403, weight_kg:2, species_code:'dog'}));
  o.excl = pick(call({product_id:18620, weight_kg:13, species_code:'dog'}));
  o.kat  = pick(call({product_id:18536, weight_kg:3.7, age_months:11, species_code:'cat'}));
  if(sid!==null){ try{execSync('curl -sk --max-time 60 '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){ o.err=String(e).slice(0,250); }
putB64('rb.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
