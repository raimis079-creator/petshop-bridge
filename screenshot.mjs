import { execSync } from "child_process";
import fs from "fs";
import { putFile } from './gtm_lib.mjs';
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(method,url,body){
  let cmd='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+method+' ';
  if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  cmd+='"'+url+'" 2>/dev/null || echo ERR';
  const code=execSync(cmd,{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}
const CODE=fs.readFileSync('petshop_cmplz_activate.php','utf8');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();

try{
  L('=== 1. Deploy TEMP aktyvatoriu ===');
  const list=api('GET',API+'?per_page=100');
  const arr=JSON.parse(list.body);
  const ex=arr.find(s=>s.name&&s.name.includes('Complianz aktyvavimas'));
  const payload={ name:'TEMP — Complianz aktyvavimas v1 (token)', desc:'Vienkartinis. Po naudojimo deaktyvuoti.', code:CODE, scope:'front-end', active:true, priority:5, tags:['temp'] };
  let id;
  if(ex){ const r=api('POST',API+'/'+ex.id,payload); L('  UPDATE HTTP '+r.code); id=ex.id; }
  else { const r=api('POST',API,payload); L('  CREATE HTTP '+r.code); if(r.code!=='200'&&r.code!=='201'){L(r.body.slice(0,300)); throw new Error('fail');} id=JSON.parse(r.body).id; }
  L('  snippet id='+id);
  const chk=api('GET',API+'/'+id);
  if(chk.code==='200'){ const j=JSON.parse(chk.body); L('  active='+j.active+'  code_error='+JSON.stringify(j.code_error||null)); }
  L('');
  await new Promise(r=>setTimeout(r,3000));

  L('=== 2. STATUS ===');
  const st=get('https://dev.avesa.lt/?cmplz_do=STATUS');
  L('  HTTP '+st.code);
  L('  '+st.body.slice(0,600));
  L('');

  L('=== 3. ACTIVATE ===');
  const ac=get('https://dev.avesa.lt/?cmplz_do=ACTIVATE&token='+TOKEN);
  L('  HTTP '+ac.code);
  L('  '+ac.body.slice(0,500));
  L('');
  await new Promise(r=>setTimeout(r,4000));

  L('=== 4. Svetaines sveikata ===');
  for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'],['Krepselis','https://dev.avesa.lt/cart/'],['Kasa','https://dev.avesa.lt/checkout/']]){
    const r=page(u);
    const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
    L('  '+nm.padEnd(12)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅')+'  '+r.html.length+' B');
  }
  L('');

  L('=== 5. KRITINE: ar GTM islikes ===');
  const h=page('https://dev.avesa.lt/');
  const checks={
    'GTM gtm.js loader':          /googletagmanager\.com\/gtm\.js/.test(h.html),
    'GTM loader NEblokuotas':     !/data-petshop-gtm-loader[^>]*type=["']text\/plain["']/.test(h.html),
    'noscript ns.html':           /googletagmanager\.com\/ns\.html/.test(h.html),
    'dataLayer snippet (614)':    /data-petshop-gtm="1"/.test(h.html),
    'view_item / petshopGtmItem': /petshopGtmItem|view_item/.test(h.html),
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
  L('');
  L('=== 6. Complianz pedsakai ===');
  const cm={
    'cmplz script/css':        /cmplz/i.test(h.html),
    'cmplz-cookiebanner':      /cmplz-cookiebanner/i.test(h.html),
    'cmplz-blocked-content':   /cmplz-blocked/i.test(h.html),
    'type="text/plain" blokuoti': /type=["']text\/plain["']/.test(h.html),
    'data-service atributas':  /data-service=/.test(h.html),
    'data-category atributas': /data-category=/.test(h.html),
    'cmplz-status-change JS':  /cmplz_status_change|cmplz_event/i.test(h.html),
  };
  for(const [k,v] of Object.entries(cm)) L('  '+(v?'✅ yra':'❌ nera')+'  '+k);
  L('');
  const blocked=(h.html.match(/<script[^>]{0,300}type=["']text\/plain["'][^>]{0,300}>/g)||[]);
  L('  Blokuotu script\'u: '+blocked.length);
  blocked.slice(0,5).forEach(s=>L('    '+s.replace(/\s+/g,' ').slice(0,180)));
  L('');
  L('  Dydis: '+h.html.length+' B');
  L('');
  L('=== 7. Complianz REST route\'ai ===');
  const rt=get('https://dev.avesa.lt/wp-json/');
  if(rt.code==='200'){
    try{ const j=JSON.parse(rt.body); const cmr=Object.keys(j.routes||{}).filter(r=>/complianz|cmplz/i.test(r));
      L('  rasta: '+cmr.length); cmr.slice(0,15).forEach(r=>L('    '+r)); }catch(e){ L('  parse err'); }
  }
  L('');
  L('=== TEMP snippet id: '+id+' — DEAKTYVUOTI po darbo ===');
}catch(e){ L('!!! ERROR: '+e.message); }
putFile('e8_activate.txt', out); console.log(out);
