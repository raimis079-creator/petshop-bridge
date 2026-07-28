import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const o={marker:'S295-APPLY'};
try{
  // 1. APPLY
  const r=execSync('curl -sk --max-time 150 "https://dev.avesa.lt/?ps_feed=Feedx&confirm=APPLY_FEED"',{maxBuffer:20e6,timeout:170000}).toString();
  const i=r.indexOf('{'),k=r.lastIndexOf('}');
  if(i>=0&&k>i){ try{ o.apply=JSON.parse(r.slice(i,k+1)); }catch(e){ o.rawslice=r.slice(i,i+300); } }
  execSync('sleep 4');
  // 2. NEPRIKLAUSOMA VERIFIKACIJA — per TIKRĄ viešą endpointą, kaip mato klientas
  const call=(b)=>{ fs.writeFileSync('/tmp/cb.json', JSON.stringify(b));
    const x=execSync('curl -sk --max-time 45 -X POST -H "Content-Type: application/json" --data-binary @/tmp/cb.json "https://dev.avesa.lt/wp-json/petshop/v1/feeding-calc"',{maxBuffer:8e6,timeout:60000}).toString();
    try{ return JSON.parse(x); }catch(e){ return {}; } };
  const pick=(r2)=>({st:r2.status,norm:(r2.norm_min_g??null)+'-'+(r2.norm_max_g??null),
    days:(r2.days_min??null)+'-'+(r2.days_max??null),eur:(r2.cost_day_min??null)+'-'+(r2.cost_day_max??null),
    basis:r2.basis??null,rc:r2.reason_codes});
  // JosiDog Mini 900g: 2 kg -> 50-70 g
  o.t_mini_2   = pick(call({product_id:20403, weight_kg:2,  species_code:'dog'}));
  // tarp tasku (interpoliacija): 3 kg
  o.t_mini_3   = pick(call({product_id:20403, weight_kg:3,  species_code:'dog'}));
  // uz ribu: 20 kg (lentele iki 10)
  o.t_mini_20  = pick(call({product_id:20403, weight_kg:20, species_code:'dog'}));
  // JosiCat: 2.5 kg patenka i 2-3 range -> 45-60 g
  o.t_cat_2_5  = pick(call({product_id:20391, weight_kg:2.5, species_code:'cat'}));
  // JosiDog Active: 5 kg -> 50-90 g
  o.t_act_5    = pick(call({product_id:20393, weight_kg:5,  species_code:'dog'}));
  // REGRESIJA: senas produktas neturi buti paliestas
  o.t_regr     = pick(call({product_id:18620, weight_kg:13, species_code:'dog'}));
}catch(e){ o.err=String(e).slice(0,250); }
putB64('s295a.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
