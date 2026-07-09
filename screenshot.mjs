import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ts3',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }

// Paginate visus snippet'us
let all = [];
for(let page=1; page<=10; page++){
  const r = api('/wp-json/code-snippets/v1/snippets?per_page=100&page='+page+'&_fields=id,name,active,scope,priority,modified');
  try{
    const arr = JSON.parse(r);
    if(!Array.isArray(arr) || arr.length === 0) break;
    all = all.concat(arr);
    if(arr.length < 100) break;
  }catch(e){ break; }
}

let out = '=== TOTAL: '+all.length+' snippet\'u, aktyvūs: '+all.filter(x=>x.active).length+' ===\n\n';

// Aktyvūs (svarbiausi - kad matytum, kas produkcijoje)
out += '--- VISI AKTYVŪS ---\n';
all.filter(x=>x.active).sort((a,b)=>a.id-b.id).forEach(s=>{
  out += '  ['+s.id+'] '+s.name+' (scope='+s.scope+', prio='+s.priority+')\n';
});
out += '\n';

// TEMP kandidatai (bendra praktika: pavadinimai su TEMP/test/probe/debug/old/senas)
const tempPattern = /\btemp\b|\btest\b|\bprobe\b|\bdebug\b|\bold\b|\bbackup\b|senas|deprecated|nenaudojama|remove|delete|xxx|diagnostinis|sanity|migravimas/i;
const tempCands = all.filter(x=>tempPattern.test(x.name));
out += '--- TEMP KANDIDATAI (aktyvūs + neaktyvūs) ---\n';
tempCands.sort((a,b)=>a.id-b.id).forEach(s=>{
  out += '  ['+(s.active?'ON ':'off')+'] ['+s.id+'] '+s.name+' | modif='+(s.modified||'?').slice(0,10)+'\n';
});
out += 'total: '+tempCands.length+' kandidatų\n\n';

// Skaitmens versijos (v1, v2, v3, ...) - senosios versijos, kurias tikriausiai galima ištrinti
out += '--- VERSIJU DUBLIKATAI (v1/v2/v3 senesnes) ---\n';
const groups = {};
all.forEach(s=>{
  const base = s.name.replace(/\s*v?\d+(\.\d+)*(\s|$)/i, ' ').trim().toLowerCase();
  if(!groups[base]) groups[base] = [];
  groups[base].push(s);
});
Object.entries(groups).filter(([k,v])=>v.length>1).forEach(([base, arr])=>{
  out += '  "'+base+'" ('+arr.length+' versijos):\n';
  arr.forEach(s=>out += '    ['+(s.active?'ON ':'off')+'] ['+s.id+'] '+s.name+'\n');
});

putFile('tempsnip.txt', out);
