import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'f2',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 30 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:100000000,timeout:32000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';

// 1. Pilnas footer HTML (rendered) - kad rasčiau visus 4 stulpelius
const html = api('/pagrindinis-test/');
// Ieškau div su class="footer footer-2" (Flatsome antra footer area)
const f2Match = html.match(/<div[^>]*id="footer"[\s\S]*?<\/footer>/);
if(f2Match){
  const f2 = f2Match[0];
  out += '=== <footer> pilnas HTML (ilgis '+f2.length+') ===\n';
  // Ieškau widget'ų
  const widgets = [...f2.matchAll(/<(?:div|aside)\s+id="([^"]+)"\s+class="([^"]*widget[^"]*)"[^>]*>/g)];
  out += 'widget\'ai: '+widgets.length+'\n';
  widgets.forEach(m=>out += '  id='+m[1]+' class='+m[2].slice(0,80)+'\n');
  out += '\n';
  // Widget-title'ai
  const titles = [...f2.matchAll(/<span[^>]*class="widget-title"[^>]*>(?:<span>)?([^<]+)/g)];
  out += 'stulpelių pavadinimai:\n';
  titles.forEach(m=>out += '  → '+m[1].trim()+'\n');
  out += '\n';
  // Ieškau 4 stulpelių pagal Flatsome grid: col
  const cols = [...f2.matchAll(/<div[^>]+class="col[^"]*(pb-0)?[^"]*"[^>]*>/g)];
  out += 'col divs: '+cols.length+'\n';
}
out += '\n';

// 2. Sidebars endpoint (WP standartinis widget'ų sąrašas)
const sidebars = api('/wp-json/wp/v2/sidebars');
try{
  const arr = JSON.parse(sidebars);
  out += '=== SIDEBAR (Flatsome footer areas) ===\n';
  arr.forEach(s=>{
    if(s.id.toLowerCase().includes('foot') || s.id.toLowerCase().includes('below')){
      out += '  id: '+s.id+' | name: '+s.name+' | widgets: '+(s.widgets||[]).length+'\n';
      (s.widgets||[]).forEach(w=>out += '     → '+w+'\n');
    }
  });
}catch(e){ out += 'sidebars ERR\n'; }
out += '\n';

// 3. Widgets endpoint (WP kiekvieno widget'o turinys)
const widgets = api('/wp-json/wp/v2/widgets?per_page=100');
try{
  const arr = JSON.parse(widgets);
  out += '=== WIDGETS (visi, kur sidebar footer) ===\n';
  arr.forEach(w=>{
    if(w.sidebar && (w.sidebar.toLowerCase().includes('foot') || w.sidebar.toLowerCase().includes('below'))){
      out += '  id: '+w.id+' | sidebar: '+w.sidebar+' | type: '+w.id_base+'\n';
      const inst = w.instance;
      if(inst){
        if(inst.raw){
          const r = JSON.stringify(inst.raw).slice(0,300);
          out += '     instance: '+r+'\n';
        } else {
          out += '     instance (encoded): '+(inst.encoded ? 'yes' : 'no')+'\n';
        }
      }
      if(w.rendered) out += '     rendered (pirmi 200): '+w.rendered.replace(/\s+/g,' ').slice(0,200)+'\n';
    }
  });
}catch(e){ out += 'widgets ERR: '+widgets.slice(0,200)+'\n'; }
out += '\n';

// 4. Menu ID 67 pilnas turinys
const menu67 = api('/wp-json/wp/v2/menu-items?menus=67&per_page=100&orderby=menu_order&order=asc');
try{
  const arr = JSON.parse(menu67);
  out += '=== Menu 67 "Secondary" pilnas turinys ===\n';
  arr.forEach(m=>{
    out += '  id='+m.id+' order='+m.menu_order+' parent='+m.parent+' | '+m.title.rendered+' → '+(m.url||m.object)+'\n';
  });
}catch(e){ out += 'menu-items ERR: '+menu67.slice(0,200)+'\n'; }

putFile('footer2.txt', out);
