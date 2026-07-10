import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const SNIP='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 50 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

L('############ SNIPPET 587/594 + FOOTER ############'); L('');

// ---- 1. Snippet'u atnaujinimas ----
L('=== 1. Snippet\'ai: pridedam "duk" ===');
for(const id of [587,594]){
  const g=api('GET',SNIP+'/'+id);
  if(g.code!=='200'){ L('  ['+id+'] HTTP '+g.code); continue; }
  const j=JSON.parse(g.body);
  L('  ['+id+'] "'+j.name+'"');
  if(/["']duk["']/.test(j.code)){ L('        jau turi "duk" ✅'); continue; }
  // randam slug masyva ir pridedam 'duk' po 'slapuku-politika'
  let code=j.code;
  const before=code.length;
  if(/'slapuku-politika',/.test(code)){
    code=code.replace(/'slapuku-politika',/, "'slapuku-politika',\n\t\t'duk',");
  } else if(/'slapuku-politika'/.test(code)){
    code=code.replace(/'slapuku-politika'/, "'slapuku-politika',\n\t\t'duk'");
  } else if(/'taisykles',/.test(code)){
    code=code.replace(/'taisykles',/, "'taisykles',\n\t\t'duk',");
  } else { L('        ⚠️ nerastas iterpimo taskas'); continue; }
  const r=api('POST',SNIP+'/'+id,{code, active:true});
  L('        UPDATE HTTP '+r.code+'   kodas '+before+' -> '+code.length+' B');
  if(r.code==='200'){
    const chk=JSON.parse(r.body);
    L('        code_error='+JSON.stringify(chk.code_error||null)+'  active='+chk.active);
    const v=api('GET',SNIP+'/'+id);
    L('        patikra: "duk" kode = '+(/["']duk["']/.test(JSON.parse(v.body).code)?'✅':'❌'));
  } else L('        ❌ '+r.body.slice(0,200));
}
L('');
await new Promise(x=>setTimeout(x,3000));

// ---- 2. Footer recon ----
L('=== 2. Footer struktura ===');
const h=page('https://dev.avesa.lt/');
const footer = h.html.slice(h.html.lastIndexOf('<footer'), h.html.lastIndexOf('</footer>')+9);
L('  footer ilgis: '+footer.length+' B');
const cols = footer.match(/<div[^>]*class="[^"]*col[^"]*"[^>]*>/g)||[];
L('  col divu: '+cols.length);
L('');
L('  Footer antrastes:');
const heads = [...(footer.match(/<(h[2-6]|span)[^>]*class="[^"]*widget-title[^"]*"[^>]*>([^<]+)</g)||[])];
if(heads.length) heads.forEach(x=>L('    "'+x.replace(/<[^>]+>/g,'').trim()+'"'));
else {
  const alt = [...(footer.match(/widget-title[^>]*>([^<]{2,40})</g)||[])].map(x=>x.split('>').pop());
  L('    '+JSON.stringify(alt));
}
L('');
L('  Ar yra "KLIENTAMS": '+(/KLIENTAMS|Klientams/i.test(footer)?'✅':'❌'));
if(/KLIENTAMS|Klientams/i.test(footer)){
  const i=footer.search(/KLIENTAMS|Klientams/i);
  const seg=footer.slice(i, i+900);
  const links=[...(seg.match(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)</g)||[])].slice(0,10);
  L('  Nuorodos KLIENTAMS stulpelyje:');
  links.forEach(l=>{
    const href=(l.match(/href="([^"]+)"/)||[])[1]||'';
    const txt=l.replace(/<[^>]+>/g,'').trim();
    L('    "'+txt+'"  ->  '+href.replace('https://dev.avesa.lt',''));
  });
  L('');
  L('  Ar jau yra DUK: '+(/\/duk\//.test(seg)?'✅':'❌ reikia prideti'));
}
L('');
L('=== 3. Footer meniu (WP) ===');
const menus=api('GET','https://dev.avesa.lt/wp-json/wp/v2/menus?per_page=20');
if(menus.code==='200'){
  try{
    const arr=JSON.parse(menus.body);
    arr.forEach(m=>L('  ['+m.id+'] "'+m.name+'"  slug='+m.slug+'  locations='+JSON.stringify(m.locations)));
  }catch(e){ L('  '+menus.body.slice(0,150)); }
} else L('  HTTP '+menus.code+' (menus endpoint gali reikalauti teisiu)');
L('');
L('=== 4. /duk/ su snippet\'ais (587 footer widget slepimas) ===');
const d=page('https://dev.avesa.lt/duk/');
L('  /duk/ HTTP '+d.code);
L('  footer-1 produktu widget\'ai: '+(/footer-1[\s\S]{0,3000}?product/i.test(d.html)?'⚠️ gali buti':'✅ nera'));
L('  nuorodu stilius (594): '+(/petshop-legal-links|petshop-content-links/i.test(d.html)?'✅ pritaikytas':'? patikrinti vizualiai'));
putFile('duk_footer.txt', out); console.log(out);
