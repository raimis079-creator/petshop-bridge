import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={};
try{
  const l=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?n='+Math.random()+'"',{maxBuffer:80e6,timeout:45000}).toString();
  const arr=JSON.parse(l);
  o.total = arr.length;
  // KRITERIJUS temp: pavadinime "(temp)" ARBA "(TEMP)" ARBA "tmp"
  const isTemp = function(s){ return /\(temp\)|\(TEMP\)|\btmp\b/i.test(s.name); };
  const temps = arr.filter(isTemp);
  o.temp_count = temps.length;
  o.active_temp = temps.filter(function(s){return s.active;}).map(function(s){return s.id+':'+s.name;});
  // SAUGUMO PATIKRA: ar tarp temp nera produkciniu raktazodziu
  const prodKeywords = /pricing|fulfillment|fbt|brand_label|filtru|atidarym|consent|gtm|datalayer|pragma|import|cron|xml|vf_|zb_/i;
  o.suspicious = temps.filter(function(s){return prodKeywords.test(s.name);}).map(function(s){return s.id+':'+s.name;});
  // id diapazonai
  const ids = temps.map(function(s){return s.id;}).sort(function(a,b){return a-b;});
  o.id_min = ids[0]; o.id_max = ids[ids.length-1];
  // grupavimas: seni (iki 1246), M8 sesijos (1247-1565), sios sesijos (>=1566)
  o.groups = {
    old_before_1247: temps.filter(function(s){return s.id<1247;}).length,
    s212_m8_1247_1565: temps.filter(function(s){return s.id>=1247&&s.id<=1565;}).length,
    this_session_1566plus: temps.filter(function(s){return s.id>=1566;}).length
  };
  // PILNAS temp sarasas su active zyma (dry-run)
  o.full_list = temps.map(function(s){return s.id+':'+(s.active?'ON:':'off:')+s.name.slice(0,30);});
}catch(e){o.err=String(e).slice(0,150);}
putB64('tmpdry.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
