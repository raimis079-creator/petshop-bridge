import { execSync } from "child_process";
import fs from "fs";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function api(method,url,body){
  let cmd='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+method+' ';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  cmd+='"'+url+'" 2>/dev/null || echo ERR';
  const code=execSync(cmd,{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

L('############ E8 — COMPLIANZ RECON ############'); L('');

// --- 1. Plugin info ---
L('=== 1. Complianz plugin ===');
const pl=api('GET','https://dev.avesa.lt/wp-json/wp/v2/plugins?search=complianz');
let slug=null;
if(pl.code==='200'){
  const arr=JSON.parse(pl.body);
  for(const p of arr){
    L('  plugin: '+p.plugin);
    L('  name:   '+p.name);
    L('  ver:    '+p.version+'   status: '+p.status);
    L('  reikalauja WP: '+(p.requires_wp||'?')+'  PHP: '+(p.requires_php||'?'));
    slug=p.plugin;
  }
} else L('  HTTP '+pl.code);
L('');

// --- 2. Pries aktyvavima: HTML baseline ---
L('=== 2. Baseline (pries aktyvavima) ===');
const before = page('https://dev.avesa.lt/');
L('  HTTP '+before.code+'  '+before.html.length+' B');
L('  GTM snippet: '+(/googletagmanager\.com\/gtm\.js/.test(before.html)?'✅':'❌'));
L('  cmplz pedsakai: '+(/cmplz|complianz/i.test(before.html)?'yra':'nera'));
L('');

// --- 3. Aktyvuojam ---
L('=== 3. Aktyvavimas ===');
if(!slug){ L('  ❌ slug nerastas'); }
else{
  const r=api('POST','https://dev.avesa.lt/wp-json/wp/v2/plugins/'+encodeURIComponent(slug),{status:'active'});
  L('  POST status=active -> HTTP '+r.code);
  if(r.code==='200'){ const j=JSON.parse(r.body); L('  status dabar: '+j.status); }
  else L('  '+r.body.slice(0,300));
}
L('');
await new Promise(r=>setTimeout(r,4000));

// --- 4. Svetaines sveikata ---
L('=== 4. Svetaines sveikata po aktyvavimo ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'],['Krepselis','https://dev.avesa.lt/cart/']]){
  const r=page(u);
  const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
  L('  '+nm.padEnd(12)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅')+'  ('+r.html.length+' B)');
}
L('');

// --- 5. KRITINE: ar GTM islikas ---
L('=== 5. KRITINE: ar Complianz neuzblokavo GTM ===');
const after = page('https://dev.avesa.lt/');
const checks={
  'GTM gtm.js loader':        /googletagmanager\.com\/gtm\.js/.test(after.html),
  'data-petshop-gtm-loader':  /data-petshop-gtm-loader/.test(after.html),
  'noscript ns.html':         /googletagmanager\.com\/ns\.html/.test(after.html),
  'dataLayer snippet (614)':  /data-petshop-gtm="1"/.test(after.html),
  '--- Complianz ---':        true,
  'cmplz script':             /cmplz/i.test(after.html),
  'cmplz-blocked-content':    /cmplz-blocked/i.test(after.html),
  'type="text/plain" (blokuota)': /type=["']text\/plain["']/.test(after.html),
  'data-service atributas':   /data-service=/.test(after.html),
  'data-category atributas':  /data-category=/.test(after.html),
  'cookiebanner':             /cmplz-cookiebanner|cc-window|banner/i.test(after.html),
};
for(const [k,v] of Object.entries(checks)) L('  '+(k.startsWith('---')?'':(v?'✅':'❌'))+' '+k);
L('');
L('  Dydis: pries '+before.html.length+' B  ->  po '+after.html.length+' B  (skirtumas '+(after.html.length-before.html.length)+')');
L('');

// --- 6. Ar GTM script'as blokuotas ---
L('=== 6. GTM script tag\'o buklė ===');
const gtmTag = after.html.match(/<script[^>]{0,200}data-petshop-gtm-loader[^>]{0,200}>/);
if(gtmTag) L('    '+gtmTag[0].slice(0,220));
else L('    ❌ GTM loader script tag NERASTAS');
const blocked = after.html.match(/<script[^>]{0,300}type=["']text\/plain["'][^>]{0,300}>/g)||[];
L('  Blokuotu script\'u: '+blocked.length);
blocked.slice(0,4).forEach(s=>L('    '+s.replace(/\s+/g,' ').slice(0,180)));
L('');

// --- 7. Complianz options ---
L('=== 7. Complianz REST endpoint\'ai ===');
const routes = api('GET','https://dev.avesa.lt/wp-json/');
if(routes.code==='200'){
  try{
    const j=JSON.parse(routes.body);
    const cm = Object.keys(j.routes||{}).filter(r=>/complianz|cmplz/i.test(r));
    L('  rasta '+cm.length+' route\'u:');
    cm.slice(0,20).forEach(r=>L('    '+r));
  }catch(e){ L('  parse err'); }
}
L('');
L('=== 8. Wizard busena / config ===');
const wiz = api('GET','https://dev.avesa.lt/wp-json/complianz/v1/fields/get');
L('  /complianz/v1/fields/get -> HTTP '+wiz.code);
if(wiz.code==='200') L('  atsakymas: '+wiz.body.slice(0,300));
putFile('e8_recon.txt', out); console.log(out);
