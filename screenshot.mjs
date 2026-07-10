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

L('############ FLATSOME ACCORDION SHORTCODE TESTAS ############'); L('');
L('Kuriam laikina puslapi su [accordion] shortcode, tikrinam ar renderinasi.'); L('');

try{
  const test = '[accordion][accordion-item title="Testinis klausimas 1"]Testinis atsakymas 1.[/accordion-item][accordion-item title="Testinis klausimas 2"]Testinis atsakymas 2.[/accordion-item][/accordion]';
  const ex=api('GET','https://dev.avesa.lt/wp-json/wp/v2/pages?slug=acc-test-tmp&status=any&_fields=id');
  let pid=null;
  if(ex.code==='200'){ const a=JSON.parse(ex.body); if(a.length) pid=a[0].id; }
  const payload={title:'ACC TEST TMP', slug:'acc-test-tmp', status:'publish', content:test};
  const r = pid ? api('POST','https://dev.avesa.lt/wp-json/wp/v2/pages/'+pid,payload)
                : api('POST','https://dev.avesa.lt/wp-json/wp/v2/pages',payload);
  if(r.code!=='200'&&r.code!=='201'){ L('  ❌ create HTTP '+r.code); throw new Error('fail'); }
  pid=JSON.parse(r.body).id;
  L('  testinis puslapis id='+pid);
  await new Promise(x=>setTimeout(x,3000));

  const p=page('https://dev.avesa.lt/acc-test-tmp/');
  L('  HTTP '+p.code);
  L('');
  const checks={
    'shortcode NErenderintas (liko [accordion])': /\[accordion\]/.test(p.html),
    'flatsome accordion HTML (.accordion)':       /class="[^"]*accordion[^"]*"/.test(p.html),
    'accordion-item':                             /accordion-item/.test(p.html),
    'accordion-title':                            /accordion-title/.test(p.html),
    'accordion-inner':                            /accordion-inner/.test(p.html),
    'testinis tekstas matomas':                   /Testinis atsakymas 1/.test(p.html),
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
  L('');
  const works = !/\[accordion\]/.test(p.html) && /accordion-item|accordion-title/.test(p.html);
  L('  >>> Flatsome accordion shortcode: '+(works?'✅ VEIKIA':'❌ NEVEIKIA — naudosim <details>'));
  L('');
  if(works){
    const m=p.html.match(/<div[^>]*class="[^"]*accordion[^"]*"[\s\S]{0,700}/);
    if(m){ L('  HTML pavyzdys:'); L('  '+m[0].replace(/></g,'>\n  <').slice(0,600)); }
  }
  L('');
  L('=== Valymas: trinam testini puslapi ===');
  const d=api('DELETE','https://dev.avesa.lt/wp-json/wp/v2/pages/'+pid+'?force=true');
  L('  DELETE HTTP '+d.code);
}catch(e){ L('!!! '+e.message.slice(0,120)); }
putFile('acc_test.txt', out); console.log(out);
