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

L('############ S169 CLEANUP ############'); L('');
L('=== TEMP snippet\'u deaktyvavimas ===');
for(const id of [616,617,618,620,621,622]){
  const g=api('GET',API+'/'+id);
  if(g.code!=='200'){ L('  ['+id+'] HTTP '+g.code); continue; }
  const j=JSON.parse(g.body);
  if(j.active){
    const r=api('POST',API+'/'+id,{active:false});
    L('  ['+id+'] "'+j.name.slice(0,45)+'"  -> deaktyvuota HTTP '+r.code);
  } else L('  ['+id+'] "'+j.name.slice(0,45)+'"  jau neaktyvus ✅');
}
L('');
L('=== TEMP endpoint\'u patikra (turi neveikti) ===');
for(const [nm,u] of [['cmplz_do','https://dev.avesa.lt/?cmplz_do=STATUS'],['cmplz_probe','https://dev.avesa.lt/?cmplz_probe=1'],
                     ['cmplz_probe2','https://dev.avesa.lt/?cmplz_probe2=1'],['cmplz_banner','https://dev.avesa.lt/?cmplz_banner=1'],
                     ['cmplz_edit','https://dev.avesa.lt/?cmplz_edit=1'],['cmplz_css','https://dev.avesa.lt/?cmplz_css=1']]){
  const r=page(u);
  const isJson=r.html.trim().startsWith('{');
  L('  '+nm.padEnd(14)+' '+(isJson?'❌ VIS DAR VEIKIA':'✅ neveikia'));
}
L('');
L('=== Aktyvus tracking snippet\'ai ===');
for(const id of [614,615,619]){
  const g=api('GET',API+'/'+id);
  if(g.code==='200'){ const j=JSON.parse(g.body); L('  ['+id+'] '+(j.active?'ON ':'off')+' "'+j.name+'"  prio='+j.priority); }
}
L('');
L('=== Svetaines sveikata ===');
for(const [nm,u] of [['Homepage','https://dev.avesa.lt/'],['Preke','https://dev.avesa.lt/?p=15484'],['Krepselis','https://dev.avesa.lt/cart/'],
                     ['Slapuku politika','https://dev.avesa.lt/slapuku-politika-es/'],['Privatumo politika','https://dev.avesa.lt/privatumo-politika/']]){
  const r=page(u);
  const fatal=/Fatal error|Parse error|critical error/i.test(r.html);
  L('  '+nm.padEnd(20)+' HTTP '+r.code+'  '+(fatal?'❌ FATAL':'✅'));
}
L('');
L('=== Banerio busena (HTML) ===');
const h=page('https://dev.avesa.lt/');
L('  GTM loader: '+(/googletagmanager\.com\/gtm\.js/.test(h.html)?'✅':'❌'));
L('  consent bridge: '+(/data-petshop-consent-bridge/.test(h.html)?'✅':'❌'));
L('  dataLayer snippet: '+(/data-petshop-gtm="1"/.test(h.html)?'✅':'❌'));
L('  banner_version: '+((h.html.match(/"banner_version":"(\d+)"/)||[])[1]||'?'));
L('  blokuotu scriptu: '+((h.html.match(/type=["']text\/plain["']/g)||[]).length));
putFile('s169_cleanup.txt', out); console.log(out);
