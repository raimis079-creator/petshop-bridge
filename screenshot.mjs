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
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" -X '+m+' ';
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

L('############ S167 CLEANUP + FINALINE BUSENA ############'); L('');

// ---- 1. TEMP snippet'u deaktyvavimas ----
L('=== 1. TEMP snippet\'u deaktyvavimas ===');
for(const id of [616,617,618]){
  const g=api('GET',API+'/'+id);
  if(g.code!=='200'){ L('  ['+id+'] HTTP '+g.code+' — praleidziam'); continue; }
  const j=JSON.parse(g.body);
  L('  ['+id+'] "'+j.name+'"  active='+j.active);
  if(j.active){
    const r=api('POST',API+'/'+id,{active:false});
    L('        deaktyvuota -> HTTP '+r.code+'  '+(r.code==='200'?'✅':'❌'));
  } else L('        jau neaktyvus ✅');
}
L('');

// ---- 2. Ar TEMP endpoint'ai nebeveikia ----
L('=== 2. TEMP endpoint\'u patikra (turi neveikti) ===');
for(const [nm,u] of [['cmplz_do=STATUS','https://dev.avesa.lt/?cmplz_do=STATUS'],['cmplz_probe','https://dev.avesa.lt/?cmplz_probe=1'],['cmplz_probe2','https://dev.avesa.lt/?cmplz_probe2=1']]){
  const r=page(u);
  const isJson = r.html.trim().startsWith('{');
  L('  '+nm.padEnd(20)+' HTTP '+r.code+'  '+(isJson?'❌ VIS DAR VEIKIA':'✅ neveikia (grazina HTML)'));
}
L('');

// ---- 3. Aktyvus tracking snippet'ai ----
L('=== 3. Aktyvus tracking snippet\'ai ===');
for(const id of [614,615,619]){
  const g=api('GET',API+'/'+id);
  if(g.code!=='200'){ L('  ['+id+'] HTTP '+g.code); continue; }
  const j=JSON.parse(g.body);
  L('  ['+id+'] '+(j.active?'ON ':'off')+'  "'+j.name+'"  scope='+j.scope+'  prio='+j.priority);
}
L('');

// ---- 4. Svetaines sveikata ----
L('=== 4. Svetaines sveikata ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/product/trixie-baza-draskykle-2-stulpai-su-guoliu-50-cm-sviesi/'],['Kategorija','https://dev.avesa.lt/kategorija/sausas-maistas-sunims/'],['Krepselis','https://dev.avesa.lt/cart/'],['Slapuku politika','https://dev.avesa.lt/slapuku-politika-es/']]){
  const r=page(u);
  const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
  L('  '+nm.padEnd(18)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅'));
}
L('');

// ---- 5. HTML struktura ----
L('=== 5. Tracking sluoksniai HTML\'e ===');
const h=page('https://dev.avesa.lt/');
const pos={
  'consent bridge':   h.html.indexOf('data-petshop-consent-bridge'),
  'consent default':  h.html.indexOf("'consent', 'default'"),
  'gtm.js loader':    h.html.indexOf('googletagmanager.com/gtm.js'),
  '<body>':           h.html.indexOf('<body'),
  'noscript ns.html': h.html.indexOf('ns.html'),
  'cmplz baneris':    h.html.indexOf('cmplz-cookiebanner'),
};
for(const [k,v] of Object.entries(pos)) L('  '+String(v).padStart(7)+'  '+k);
L('');
L('  bridge < gtm.js:  '+(pos['consent bridge']>0 && pos['consent bridge']<pos['gtm.js loader']?'✅':'❌'));
L('  gtm.js < <body>:  '+(pos['gtm.js loader']<pos['<body>']?'✅':'❌'));
L('  noscript > <body>: '+(pos['noscript ns.html']>pos['<body>']?'✅':'❌'));
L('');
const bad={
  'antras GTM container': [...new Set(h.html.match(/GTM-[A-Z0-9]{6,9}/g)||[])].length>1,
  'tiesioginis gtag config': /gtag\(\s*['"]config['"]/.test(h.html),
  'tiesioginis fbq init': /fbq\(\s*['"]init['"]/.test(h.html),
  'senas GTM-MZGDV75F': /GTM-MZGDV75F/.test(h.html),
  'blokuoti scriptai (text/plain)': /type=["']text\/plain["']/.test(h.html),
};
for(const [k,v] of Object.entries(bad)) L('  '+(v?'❌ RASTA':'✅ nera')+'  '+k);
putFile('s167_cleanup_'+Date.now()+'.txt', out); console.log(out);
