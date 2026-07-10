import { execSync } from "child_process";
import fs from "fs";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}

L('############ PO COMPLIANZ WIZARD ############'); L('');

L('=== 1. Svetaines sveikata ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'],['Krepselis','https://dev.avesa.lt/cart/'],['Kategorija','https://dev.avesa.lt/kategorija/sausas-maistas-sunims/']]){
  const r=page(u);
  const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
  L('  '+nm.padEnd(12)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅')+'  '+r.html.length+' B');
}
L('');

const h = page('https://dev.avesa.lt/');

L('=== 2. KRITINE: ar GTM islikes ir NEblokuotas ===');
const gtm={
  'gtm.js loader yra':          /googletagmanager\.com\/gtm\.js/.test(h.html),
  'loader NEturi text/plain':   !/data-petshop-gtm-loader[^>]*text\/plain/.test(h.html),
  'loader NEturi data-service': !/data-petshop-gtm-loader[^>]*data-service/.test(h.html),
  'noscript ns.html':           /googletagmanager\.com\/ns\.html/.test(h.html),
  'dataLayer snippet (614)':    /data-petshop-gtm="1"/.test(h.html),
};
for(const [k,v] of Object.entries(gtm)) L('  '+(v?'✅':'❌')+' '+k);
const loaderTag = h.html.match(/<script[^>]{0,300}data-petshop-gtm-loader[^>]{0,300}>/);
L('  loader tag: '+(loaderTag?loaderTag[0].slice(0,200):'NERASTAS'));
L('');

L('=== 3. Ar Complianz ideje SAVO tracking koda ===');
const bad={
  'gtag(\'config\' (GA)':   /gtag\(\s*['"]config['"]/.test(h.html),
  'fbq(\'init\' (Meta)':    /fbq\(\s*['"]init['"]/.test(h.html),
  'senas GTM-MZGDV75F':     /GTM-MZGDV75F/.test(h.html),
  'antras GTM container':   (h.html.match(/GTM-[A-Z0-9]{6,9}/g)||[]).filter((v,i,a)=>a.indexOf(v)===i).length > 1,
  'analytics.js / ga(':     /analytics\.js|ga\(\s*['"]create/.test(h.html),
};
for(const [k,v] of Object.entries(bad)) L('  '+(v?'❌ RASTA':'✅ nera')+'  '+k);
const gtmIds=[...new Set(h.html.match(/GTM-[A-Z0-9]{6,9}/g)||[])];
L('  GTM ID sarasas: '+JSON.stringify(gtmIds));
L('');

L('=== 4. Blokuoti scriptai (turi buti 0) ===');
const blocked=(h.html.match(/<script[^>]{0,300}type=["']text\/plain["'][^>]{0,300}>/g)||[]);
L('  blokuotu: '+blocked.length+'  '+(blocked.length===0?'✅':'❌'));
blocked.slice(0,5).forEach(s=>L('    '+s.replace(/\s+/g,' ').slice(0,170)));
L('');

L('=== 5. Complianz baneris ===');
const banner={
  'cmplz JS':                /cmplz-cookiebanner|complianz.*\.js|cmplz.*\.js/i.test(h.html),
  'cmplz CSS':               /cmplz.*\.css/i.test(h.html),
  'banner HTML (#cmplz-)':   /id=["']cmplz-/.test(h.html),
  'cmplz_banner_status JS':  /cmplz/i.test(h.html),
  'Priimti/Neigti mygtukai': /cmplz-accept|cmplz-deny/i.test(h.html),
  'Kategoriju checkboxai':   /cmplz-category|cmplz-statistics|cmplz-marketing/i.test(h.html),
};
for(const [k,v] of Object.entries(banner)) L('  '+(v?'✅':'❌')+' '+k);
L('');
const cats = [...new Set((h.html.match(/cmplz-(functional|preferences|statistics|marketing)/g)||[]))];
L('  Rastos kategorijos: '+JSON.stringify(cats));
L('');

L('=== 6. cmplz JS failai ===');
const js=[...new Set((h.html.match(/https?:\/\/[^"'\s]*cmplz[^"'\s]*\.js[^"'\s]*/g)||[]))];
js.forEach(u=>L('  '+u.slice(0,130)));
if(js.length===0) L('  (nerasta)');
L('');

L('=== 7. Complianz options po wizard ===');
const p=get('https://dev.avesa.lt/?cmplz_probe=1&token='+TOKEN);
if(p.code==='200'){
  try{
    const j=JSON.parse(p.body);
    L('  wizard_completed_once: '+j.important?.cmplz_wizard_completed_once);
    L('  cmplz_get_value:');
    for(const [k,v] of Object.entries(j.cmplz_get_value||{})) L('    '+k.padEnd(28)+' = '+(Array.isArray(v)?JSON.stringify(v):v));
    L('  options kiekis: '+j.options_count);
  }catch(e){ L('  parse err: '+p.body.slice(0,200)); }
} else L('  HTTP '+p.code);
putFile('e8_after_wizard.txt', out); console.log(out);
