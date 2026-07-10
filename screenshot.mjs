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
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}

const CODE=fs.readFileSync('petshop_gtm_snippet.php','utf8');
L('GTM snippet PHP: '+CODE.length+' B'); L('');

try{
  L('=== 1. Ar jau yra GTM snippet ===');
  const list=api('GET',API+'?per_page=100');
  const arr=JSON.parse(list.body);
  const ex=arr.find(s=>s.name&&s.name.includes('GTM Snippet'));
  L('  '+(ex?'rastas id='+ex.id:'nerasta'));
  L('');

  L('=== 2. Deploy ===');
  const payload={
    name:'Petshop GTM Snippet v1.0 (GTM-MF3GZGT)',
    desc:'Google Tag Manager idiegimas. DEV blokavimas — GTM viduje (trigger 17/18). Complianz NETURI ideti savo GTM/GA4/Meta.',
    code:CODE, scope:'front-end', active:false, priority:5, tags:['tracking','gtm']
  };
  let id;
  if(ex){ const r=api('POST',API+'/'+ex.id,payload); L('  UPDATE -> HTTP '+r.code); id=ex.id; }
  else { const r=api('POST',API,payload); L('  CREATE -> HTTP '+r.code); if(r.code!=='200'&&r.code!=='201'){L('  '+r.body.slice(0,300)); throw new Error('create fail');} id=JSON.parse(r.body).id; L('  id='+id); }
  L('');

  L('=== 3. Aktyvavimas ===');
  const act=api('POST',API+'/'+id,{active:true});
  L('  HTTP '+act.code);
  if(act.code!=='200'){ L('  ❌ '+act.body.slice(0,400)); throw new Error('activate fail'); }
  const j=JSON.parse(act.body);
  L('  active='+j.active+'  code_error='+JSON.stringify(j.code_error||null));
  L('');

  L('=== 4. Svetaines sveikata ===');
  for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'],['Kategorija','https://dev.avesa.lt/kategorija/sausas-maistas-sunims/'],['Krepselis','https://dev.avesa.lt/cart/']]){
    const r=page(u);
    const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
    L('  '+nm.padEnd(12)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅'));
  }
  L('');

  L('=== 5. GTM snippet HTML patikra ===');
  const h=page('https://dev.avesa.lt/');
  const checks={
    'gtm.js loader':            /googletagmanager\.com\/gtm\.js/.test(h.html),
    'GTM-MF3GZGT ID':           /GTM-MF3GZGT/.test(h.html),
    'noscript iframe (ns.html)':/googletagmanager\.com\/ns\.html\?id=GTM-MF3GZGT/.test(h.html),
    'data-petshop-gtm-loader':  /data-petshop-gtm-loader/.test(h.html),
    'data-petshop-gtm-noscript':/data-petshop-gtm-noscript/.test(h.html),
    'dataLayer inicijuotas':    /dataLayer/.test(h.html),
    'NEra seno GTM-MZGDV75F':   !/GTM-MZGDV75F/.test(h.html),
    'NEra tiesioginio gtag config': !/gtag\('config'/.test(h.html),
    'NEra tiesioginio fbq init':    !/fbq\('init'/.test(h.html),
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
  L('');
  const pos_head = h.html.indexOf('googletagmanager.com/gtm.js');
  const pos_body = h.html.indexOf('<body');
  const pos_ns   = h.html.indexOf('ns.html');
  L('  Poziciju patikra:');
  L('    gtm.js @ '+pos_head+'   <body> @ '+pos_body+'   noscript @ '+pos_ns);
  L('    gtm.js pries <body>: '+(pos_head>0 && pos_head<pos_body ? '✅' : '❌'));
  L('    noscript po <body>:  '+(pos_ns>pos_body ? '✅' : (pos_ns<0?'❌ NERA (wp_body_open nepalaikomas)':'❌')));
  L('');
  L('=== SNIPPET ID: '+id+' ===');
}catch(e){ L(''); L('!!! ERROR: '+e.message); }
putFile('e7_result.txt', out); console.log(out);
