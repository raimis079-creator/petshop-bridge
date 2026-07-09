import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'tb',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

// 1. Rendered HTML — kur tekstas puslapyje
const html = api('/pagrindinis-test/');
const idx = html.indexOf('sausam maistui');
if(idx > 0){
  out += '=== rendered HTML kontekstas ===\n';
  out += JSON.stringify(html.slice(Math.max(0,idx-350), idx+250))+'\n\n';
}

// 2. Iesku top-bar rendered
const idxTop = html.indexOf('paštomatą nuo €30');
if(idxTop > 0){
  out += '=== top-bar kontekstas ===\n';
  out += JSON.stringify(html.slice(Math.max(0,idxTop-350), idxTop+120))+'\n\n';
}

// 3. Flatsome tikriausiai naudoja customizer. Bet snippetuose gali buti override.
// Skenuoju code-snippets pagal top-bar/leaderboard tekstus
const s = api('/wp-json/code-snippets/v1/snippets?_fields=id,name,active&per_page=100');
try{
  const arr = JSON.parse(s);
  out += '=== visi aktyvus snippetai ('+arr.filter(x=>x.active).length+' is '+arr.length+') ===\n';
  arr.filter(x=>x.active).forEach(x=>out += '  '+x.id+' | '+x.name+'\n');
}catch(e){ out += 'snippets ERR\n'; }
out += '\n';

// 4. Ieskau snippetuose "sausam maistui" ir "paštomatą"
try{
  const arr = JSON.parse(s);
  for(const sn of arr){
    const one = api('/wp-json/code-snippets/v1/snippets/'+sn.id+'?_fields=id,name,code');
    try{
      const j = JSON.parse(one);
      const c = j.code || '';
      const hitAkcija = c.indexOf('sausam maistui')>=0 || c.indexOf('-20%')>=0;
      const hitTop = c.indexOf('paštomatą')>=0 || c.indexOf('paštomat')>=0;
      if(hitAkcija || hitTop){
        out += 'SNIPPET '+sn.id+' | '+sn.name+' | akcija='+hitAkcija+' top='+hitTop+' active='+sn.active+'\n';
      }
    }catch(e){}
  }
}catch(e){}

// 5. Flatsome theme mod — top_bar_content? Per WP customizer REST
const opts = api('/wp-json/wp/v2/settings');
try{
  const j = JSON.parse(opts);
  out += '\n=== settings keys ===\n'+Object.keys(j).slice(0,20).join(', ')+'\n';
}catch(e){}

putFile('topbar.txt', out);
