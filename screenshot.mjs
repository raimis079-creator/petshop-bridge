import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ts',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

// Visi snippet'ai
const all = api('/wp-json/code-snippets/v1/snippets?per_page=200&_fields=id,name,active,scope,priority,modified');
try{
  const arr = JSON.parse(all);
  out += '=== VISI snippet\'ai ('+arr.length+' total, '+arr.filter(x=>x.active).length+' aktyvūs) ===\n\n';
  
  // 1. Aktyvūs
  out += '--- AKTYVŪS ---\n';
  arr.filter(x=>x.active).forEach(s=>{
    out += '  ['+s.id+'] '+s.name+' (scope='+s.scope+', prio='+s.priority+')\n';
  });
  out += '\n';

  // 2. TEMP/test/probe kandidatai (neaktyvūs) - pagal name substring
  out += '--- TEMP/test/probe KANDIDATAI VALYMUI ---\n';
  const tempPattern = /temp|test|probe|debug|old|backup|check|deprecated|nenaudojama|senas|migravimas|xxx|remove|delete|senastest|hidepay/i;
  const candidates = arr.filter(x=>!x.active && tempPattern.test(x.name));
  candidates.forEach(s=>{
    out += '  ['+s.id+'] '+s.name+' (modif='+(s.modified||'?')+')\n';
  });
  out += 'total: '+candidates.length+' kandidatų\n\n';

  // 3. Kiti neaktyvūs (kad matytum full sarasa) - senesniuose modification date
  out += '--- KITI NEAKTYVUS (jei įdomu, first 30) ---\n';
  arr.filter(x=>!x.active && !tempPattern.test(x.name)).slice(0,30).forEach(s=>{
    out += '  ['+s.id+'] '+s.name+'\n';
  });
}catch(e){ out += 'ERR: '+all.slice(0,300)+'\n'; }

putFile('tempsnip.txt', out);
