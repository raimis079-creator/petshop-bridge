import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fr',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:50000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
let out='';

// === 1. Rendered footer HTML iš homepage ===
const html = api('/pagrindinis-test/');
const footerStart = html.indexOf('<footer');
const footerEnd = html.indexOf('</footer>');
if(footerStart > 0 && footerEnd > footerStart){
  const footer = html.slice(footerStart, footerEnd+9);
  out += '=== FOOTER HTML (ilgis '+footer.length+') ===\n';
  // Ieškau nuorodų
  const links = [...footer.matchAll(/href="([^"]+)"[^>]*>([^<]+)</g)];
  out += 'nuorodos: '+links.length+'\n';
  links.forEach((m,i)=>{
    if(i<40) out += '  '+m[1].replace(DEV,'')+' → '+m[2].trim().slice(0,40)+'\n';
  });
  // Widget'ų klasės (kad rasčiau kur gyvena)
  const widgetClasses = [...footer.matchAll(/class="[^"]*widget[^"]*"/g)].slice(0,10);
  out += '\nwidget klasės:\n';
  widgetClasses.forEach(m=>out += '  '+m[0].slice(0,120)+'\n');
} else {
  out += 'FOOTER HTML nerastas!\n';
}
out += '\n';

// === 2. Aktyvūs snippet'ai footer temai (snippet 587 - footer hider) ===
out += '=== Snippet 587 (footer widget hider) — būklė ===\n';
const s587 = api('/wp-json/code-snippets/v1/snippets/587?_fields=id,name,active,scope,code');
try{
  const j = JSON.parse(s587);
  out += '  active: '+j.active+' | scope: '+j.scope+'\n';
  out += '  code (pirmi 300):\n'+j.code.slice(0,300)+'\n';
}catch(e){ out += '  ERR\n'; }
out += '\n';

// === 3. Menu'ai — footer menu registruotas? ===
const menus = api('/wp-json/wp/v2/menus?per_page=20');
out += '=== Registruoti meniu ===\n';
try{
  const arr = JSON.parse(menus);
  arr.forEach(m=>out += '  id='+m.id+' | '+m.name+' | slug='+m.slug+' | locations='+(m.locations||[]).join(',')+'\n');
}catch(e){ out += '  menus endpoint neprieinamas: '+menus.slice(0,150)+'\n'; }
out += '\n';

// === 4. Visų 9 puslapių HTTP status + slug patikra ===
out += '=== 9 puslapiai (owner nurodymas) ===\n';
const pages = [
  ['Apie mus', '/apie-mus/'],
  ['Kontaktai', '/kontaktai/'],
  ['Pristatymas', '/pristatymas/'],
  ['Apmokėjimas', '/apmokejimas/'],
  ['Grąžinimas', '/grazinimas/'],
  ['Taisyklės', '/taisykles/'],
  ['Privatumo politika', '/privatumo-politika/'],
  ['Slapukų politika', '/slapuku-politika/'],
  ['DUK', '/duk/'],
];
for(const [name, u] of pages){
  out += '  '+code(u).padEnd(4)+u.padEnd(25)+' → '+name+'\n';
}
out += '\n';

// === 5. Kategorijos + promo puslapiai KATEGORIJŲ stulpeliui ===
out += '=== KATEGORIJŲ stulpelio nuorodos ===\n';
const cats = [
  ['Šunims', '/kategorija/sunims/'],
  ['Katėms', '/kategorija/katems/'],
  ['Graužikams', '/kategorija/grauzikams/'],
  ['Paukščiams', '/kategorija/pauksciams/'],
  ['Žuvims', '/kategorija/zuvims/'],
  ['Akcijos', '/akcijos/'],
  ['Pasiūlymai', '/pasiulymai/'],
];
for(const [name, u] of cats){
  out += '  '+code(u).padEnd(4)+u.padEnd(28)+' → '+name+'\n';
}

putFile('footer_recon.txt', out);
