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
function api(url){
  const code=execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 40 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}

L('############ /pristatymas/ ir /apmokejimas/ TURINYS ############'); L('');
for(const [nm,slug] of [['Pristatymas','pristatymas'],['Apmokejimas','apmokejimas'],['Grazinimas','grazinimas']]){
  const r=api('https://dev.avesa.lt/wp-json/wp/v2/pages?slug='+slug+'&_fields=id,title,content&context=edit');
  L('=== '+nm+' ===');
  if(r.code!=='200'){ L('  HTTP '+r.code); continue; }
  try{
    const arr=JSON.parse(r.body);
    if(!arr.length){ L('  nerastas'); continue; }
    const p=arr[0];
    const raw=(p.content?.raw||p.content?.rendered||'');
    const txt=raw.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    L('  id='+p.id+'  turinys '+txt.length+' simb.');
    // kainos
    const prices=[...new Set(txt.match(/\d+[,.]\d{2}\s*€|\d+\s*€|€\s*\d+[,.]?\d*/g)||[])];
    L('  rastos kainos: '+JSON.stringify(prices));
    L('');
    L('  Turinys (pirmi 1200 simb.):');
    L('  '+txt.slice(0,1200));
    L('');
  }catch(e){ L('  parse err: '+e.message.slice(0,80)); }
  L('');
}

L('############ Snippet 587 ir 594 (footer / nuorodu stilius) ############');
for(const id of [587,594]){
  const r=api('https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+id);
  if(r.code!=='200'){ L('  ['+id+'] HTTP '+r.code); continue; }
  const j=JSON.parse(r.body);
  L('  ['+id+'] "'+j.name+'"  active='+j.active);
  const slugs=[...new Set((j.code.match(/'([a-z0-9\-]+)'/g)||[]).map(s=>s.replace(/'/g,'')).filter(s=>s.length>3 && !/^(array|string|return|function|true|false|null)$/.test(s)))];
  L('       slug\'ai kode: '+JSON.stringify(slugs.slice(0,16)));
  L('       ar yra "duk": '+(/["']duk["']/.test(j.code)?'✅':'❌'));
  L('');
}
putFile('duk_recon2.txt', out); console.log(out);
