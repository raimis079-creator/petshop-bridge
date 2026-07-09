import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'s2',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

// Paginated fetch
let all = [];
let page = 1;
while(true){
  const r = api('/wp-json/code-snippets/v1/snippets?_fields=id,name,active,scope&per_page=100&page='+page);
  try{
    const arr = JSON.parse(r);
    if(!Array.isArray(arr) || arr.length === 0) break;
    all = all.concat(arr);
    if(arr.length < 100) break;
    page++;
    if(page > 10) break;
  }catch(e){ break; }
}
out += 'Iš viso snippet\'ų DB\'ėje: '+all.length+'\n';
out += 'Aktyvūs: '+all.filter(x=>x.active).length+'\n\n';

// Aktyvūs
const active = all.filter(x=>x.active);
out += '=== VISI AKTYVŪS ('+active.length+') ===\n';
active.forEach(s=>out += '  '+s.id+' | '+s.name+' | scope='+s.scope+'\n');
out += '\n';

// 587+ range - tikri Petshop nauji snippet'ai
const petshop = all.filter(s => s.id >= 587);
out += '=== NAUJI (id >= 587) ('+petshop.length+') ===\n';
petshop.forEach(s=>out += '  ['+(s.active?'ON ':'off')+'] '+s.id+' | '+s.name+' | scope='+s.scope+'\n');
out += '\n';

// TEMP/test/probe kandidatai (visame sąraše)
const cands = all.filter(s=>{
  const n = s.name.toLowerCase();
  return n.includes('temp') || n.includes('(temp)') || n.includes('probe') || n.includes('debug') || n.includes('draft publish vykdymas');
});
out += '=== TEMP kandidatai visame sąraše ('+cands.length+') ===\n';
cands.forEach(s=>out += '  ['+(s.active?'ON ':'off')+'] '+s.id+' | '+s.name+'\n');

putFile('snippets2.txt', out);
