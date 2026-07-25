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
const o={deleted:[], failed:[]};
try{
  const l=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?n='+Math.random()+'"',{maxBuffer:50e6,timeout:40000}).toString();
  const arr=JSON.parse(l);
  // trinu VISUS sios sesijos temp (id 1566-1583) + bet koki (temp) su id>1565
  const targets=arr.filter(function(s){return s.id>=1566 && /\(temp\)/i.test(s.name);});
  o.toDelete=targets.map(function(s){return s.id+':'+s.name;});
  targets.forEach(function(s){
    try{ const c=execSync('curl -sk -o /dev/null -w "%{http_code}" '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+s.id+'"',{timeout:20000}).toString().trim();
      if(c==='200') o.deleted.push(s.id); else o.failed.push(s.id+':'+c); }catch(e){ o.failed.push(s.id+':ERR'); }
  });
  // patikra po valymo
  const l2=execSync('curl -sk '+AUTH+' "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets?n='+Math.random()+'"',{maxBuffer:50e6,timeout:40000}).toString();
  const arr2=JSON.parse(l2);
  o.remaining_session=arr2.filter(function(s){return s.id>=1566 && /\(temp\)/i.test(s.name);}).map(function(s){return s.id+':'+(s.active?'ON':'off');});
  o.total_temp_after=arr2.filter(function(s){return /\(temp\)/i.test(s.name);}).length;
}catch(e){o.err=String(e).slice(0,150);}
putB64('cleantemp.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
