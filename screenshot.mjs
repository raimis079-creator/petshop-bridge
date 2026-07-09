import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sn',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

// Visų snippet'ų sąrašas
const r = api('/wp-json/code-snippets/v1/snippets?_fields=id,name,active,scope,tags,modified&per_page=100');
try{
  const arr = JSON.parse(r);
  out += '=== VISI snippet\'ai ('+arr.length+', aktyvūs '+arr.filter(x=>x.active).length+') ===\n\n';
  
  // Rūšiuoju: aktyvūs pirma, TEMP/test kandidatai antra, kiti
  const active = arr.filter(x=>x.active);
  const inactive = arr.filter(x=>!x.active);
  
  out += '=== AKTYVŪS ('+active.length+') ===\n';
  active.forEach(s=>{
    out += '  '+s.id+' | '+s.name+' | scope='+s.scope+'\n';
  });
  out += '\n';
  
  // TEMP kandidatai iš neaktyvių
  const tempCands = inactive.filter(s=>{
    const n = s.name.toLowerCase();
    return n.includes('temp') || n.includes('test') || n.includes('probe') || n.includes('debug') || n.includes('draft') || n.includes('backup') || n.includes('old');
  });
  out += '=== NEAKTYVŪS TEMP kandidatai ('+tempCands.length+') ===\n';
  tempCands.forEach(s=>{
    out += '  '+s.id+' | '+s.name+' | scope='+s.scope+' | modified='+(s.modified||'?')+'\n';
  });
  out += '\n';
  
  // Kiti neaktyvūs
  const otherInactive = inactive.filter(s => !tempCands.includes(s));
  out += '=== KITI NEAKTYVŪS ('+otherInactive.length+') ===\n';
  otherInactive.forEach(s=>{
    out += '  '+s.id+' | '+s.name+' | scope='+s.scope+'\n';
  });
  
}catch(e){ out += 'ERR: '+r.slice(0,300)+'\n'; }

putFile('snippets.txt', out);
