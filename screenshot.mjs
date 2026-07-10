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
  const payload={name:'TEMP — Footer KLIENTAMS + DUK (token)',desc:'DRY/APPLY.',code:CODE,scope:'front-end',active:true,priority:6,tags:['temp']};
  const chk=api('GET',SNIP+'/625');
  let id;
  if(chk.code==='200'){ api('POST',SNIP+'/625',payload); id=625; } else { const r=api('POST',SNIP,payload); id=JSON.parse(r.body).id; }
  L('snippet id='+id);
  const v=api('GET',SNIP+'/'+id); if(v.code==='200'){ const j=JSON.parse(v.body); L('code_error='+JSON.stringify(j.code_error||null)); }
  await new Promise(r=>setTimeout(r,3000));
  L('');
  L('=== DRY ===');
  const d=get('https://dev.avesa.lt/?footer_duk=1&token='+TOKEN);
  L('HTTP '+d.code);
  try{
    const j=JSON.parse(d.body);
    L('  rasti widgetai: '+j.rasti_widgetai.length);
    j.rasti_widgetai.forEach(w=>{
      L('    option='+w.option+' idx='+w.index+'  title="'+(w.title||'')+'"  turi_duk='+w.has_duk);
      L('      preview: '+String(w.content_preview).replace(/\s+/g,' ').slice(0,200));
    });
  }catch(e){ L('  '+d.body.slice(0,400)); }
  L('');
  L('=== APPLY ===');
  const a=get('https://dev.avesa.lt/?footer_duk=1&token='+TOKEN+'&confirm=APPLY_DUK');
  try{
    const j=JSON.parse(a.body);
    L('  atnaujinta: '+JSON.stringify(j.atnaujinta));
    L('  po: '+JSON.stringify(j.po));
  }catch(e){ L('  '+a.body.slice(0,400)); }
  L('');
  await new Promise(r=>setTimeout(r,4000));

  L('=== VERIFIKACIJA ===');
  const h=page('https://dev.avesa.lt/');
  const footer=h.html.slice(h.html.lastIndexOf('<footer'));
  const i=footer.search(/KLIENTAMS/i);
  if(i>0){
    const seg=footer.slice(i,i+1000);
    const links=[...(seg.match(/<a[^>]*href="([^"]+)"[^>]*>([^<]+)</g)||[])].slice(0,10);
    L('  KLIENTAMS stulpelis:');
    links.forEach(l=>{
      const href=(l.match(/href="([^"]+)"/)||[])[1]||'';
      const txt=l.replace(/<[^>]+>/g,'').trim();
      L('    "'+txt+'"  ->  '+href.replace('https://dev.avesa.lt',''));
    });
    L('');
    L('  '+(/\/duk\//.test(seg)?'✅ DUK yra footer\'yje':'❌ DUK nerastas'));
  } else L('  KLIENTAMS nerastas');
  L('');
  L('=== /duk/ sveikata ===');
  const d2=page('https://dev.avesa.lt/duk/');
  L('  HTTP '+d2.code+'  fatal: '+(/Fatal error|Parse error/i.test(d2.html)?'❌':'✅ ne'));
  L('  H1: '+((d2.html.match(/<h1[^>]*>([^<]+)/)||[])[1]||'?'));
  L('');
  const dz=api('POST',SNIP+'/'+id,{active:false});
  L('TEMP '+id+' deaktyvuota: HTTP '+dz.code);
}catch(e){ L('!!! '+e.message.slice(0,150)); }
putFile('footer_duk.txt', out); console.log(out);
