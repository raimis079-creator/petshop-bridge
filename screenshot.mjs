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
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 45 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}
function page(url){
  const code=execSync('curl -skL -o /tmp/p.html -w "%{http_code}" --max-time 40 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let h=''; try{ h=fs.readFileSync('/tmp/p.html','utf8'); }catch(e){}
  return {code, html:h};
}
const CODE=fs.readFileSync('petshop_footer_duk.php','utf8');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
try{
  api('POST',SNIP+'/625',{name:'TEMP — Footer DUK fix (token)',code:CODE,active:true,scope:'front-end',priority:6});
  const v=api('GET',SNIP+'/625'); L('code_error='+JSON.stringify(JSON.parse(v.body).code_error||null));
  await new Promise(r=>setTimeout(r,3000));

  L(''); L('=== DRY ===');
  const d=get('https://dev.avesa.lt/?footer_fix=1&token='+TOKEN);
  try{
    const j=JSON.parse(d.body);
    L('  title: '+j.title);
    L('  metodas: '+j.metodas);
    L('  po_valymo_pakeista: '+j.po_valymo_pakeista);
    L('  ilgis: '+j.ilgis+'   duk_li_kiekis: '+j.duk_li_kiekis);
    L('');
    L('  PO (HTML):');
    L('  '+String(j.PO).replace(/></g,'>\n  <').slice(0,900));
  }catch(e){ L('  '+d.body.slice(0,400)); }
  L('');
  L('=== APPLY ===');
  const a=get('https://dev.avesa.lt/?footer_fix=1&token='+TOKEN+'&confirm=FIX_DUK');
  try{
    const j=JSON.parse(a.body);
    L('  metodas: '+j.metodas);
    L('  issaugota: '+j.issaugota+'   duk_kiekis_po: '+j.duk_kiekis_po+'  '+(j.duk_kiekis_po===1?'✅':'❌'));
  }catch(e){ L('  '+a.body.slice(0,300)); }
  L('');
  await new Promise(r=>setTimeout(r,4000));

  L('=== VERIFIKACIJA (frontend) ===');
  const h=page('https://dev.avesa.lt/');
  const footer=h.html.slice(h.html.lastIndexOf('<footer'));
  const i=footer.search(/KLIENTAMS/i);
  const seg=footer.slice(i,i+1200);
  const lis=[...(seg.match(/<li[^>]*>\s*<a[^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>\s*<\/li>/g)||[])];
  L('  <li> nuorodu: '+lis.length);
  lis.forEach(l=>{
    const href=(l.match(/href="([^"]+)"/)||[])[1];
    const txt=l.replace(/<[^>]+>/g,'').trim();
    L('    "'+txt+'"'.padEnd(24)+' -> '+href);
  });
  L('');
  L('  '+(/href="\/duk\/"/.test(seg)?'✅ DUK footer\'yje':'❌')+'   '+(!/<br>\s*<a[^>]*duk/i.test(seg)?'✅ nera <br> artefakto':'❌ liko <br>'));
  L('  DUK pasikartojimu: '+((seg.match(/href="\/duk\/"/g)||[]).length));
  L('');
  L('=== Puslapiu sveikata ===');
  for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['/duk/','https://dev.avesa.lt/duk/'],['/grazinimas/','https://dev.avesa.lt/grazinimas/']]){
    const r=page(u);
    L('  '+nm.padEnd(14)+' HTTP '+r.code+'  '+(/Fatal error|Parse error/i.test(r.html)?'❌ FATAL':'✅'));
  }
  L('');
  const dz=api('POST',SNIP+'/625',{active:false});
  L('TEMP 625 deaktyvuota: HTTP '+dz.code);
}catch(e){ L('!!! '+e.message.slice(0,150)); }
putFile('footer_duk_fix.txt', out); console.log(out);
