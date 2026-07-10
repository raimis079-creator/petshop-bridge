import { chromium } from 'playwright';
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
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 45 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}
const CODE=fs.readFileSync('petshop_cmplz_css_fix.php','utf8');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
try{
  api('POST',API+'/622',{name:'TEMP — Complianz CSS regen v2 (token)',code:CODE,active:true,scope:'front-end',priority:6});
  L('snippet 622 atnaujintas');
  await new Promise(r=>setTimeout(r,3000));

  L(''); L('=== RECON ===');
  const rc=get('https://dev.avesa.lt/?cmplz_css=1&token='+TOKEN);
  try{
    const j=JSON.parse(rc.body);
    L('  dabartinis privacy page: '+JSON.stringify(j.dabartinis_privacy_page));
    L('  kandidatai: '+JSON.stringify(j.kandidatai));
    L('  target ID: '+j.target_privacy_page_id);
    L('  CSS pries: '+JSON.stringify(j.css_pries));
  }catch(e){ L('  '+rc.body.slice(0,400)); }
  L('');

  L('=== APPLY ===');
  const ap=get('https://dev.avesa.lt/?cmplz_css=1&token='+TOKEN+'&confirm=APPLY_CSS');
  L('  HTTP '+ap.code);
  try{
    const j=JSON.parse(ap.body);
    L('  privacy_updated: '+j.privacy_updated);
    L('  privacy_page_po: '+j.privacy_page_po);
    L('  istrinta CSS: '+JSON.stringify(j.istrinta_css));
    L('  iskviesta: '+JSON.stringify(j.iskviesta));
    if(j.banner_err) L('  ⚠️ banner_err: '+j.banner_err);
    L('');
    L('  CSS PO:');
    (j.css_po||[]).forEach(f=>L('    '+f.file+'  '+f.size+' B  '+f.mtime+'   violetine: '+f.turi_3B29FF+'   zalia: '+f.turi_2D5F3F));
  }catch(e){ L('  parse err: '+ap.body.slice(0,400)); }
  L('');
  await new Promise(r=>setTimeout(r,6000));

  L('=== VIZUALI VERIFIKACIJA ===');
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, locale:'lt-LT'});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/?nocache='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(8000);
  const b=await page.evaluate(()=>{
    const el=document.querySelector('.cmplz-cookiebanner');
    if(!el) return null;
    const acc=el.querySelector('.cmplz-accept');
    const lnk=el.querySelector('.cmplz-links a');
    return {
      title:(el.querySelector('.cmplz-title')||{}).innerText,
      accept:(acc||{}).innerText, deny:(el.querySelector('.cmplz-deny')||{}).innerText,
      acceptBg: acc?getComputedStyle(acc).backgroundColor:null,
      linkColor: lnk?getComputedStyle(lnk).color:null,
      links:[...el.querySelectorAll('a')].filter(a=>{let e=a,v=true;while(e&&e!==document.body){if(getComputedStyle(e).display==='none'){v=false;break;}e=e.parentElement;}return v;})
            .map(a=>({t:a.innerText.trim(), h:(a.getAttribute('href')||'').replace(/^https?:\/\/dev\.avesa\.lt/,'')}))
    };
  });
  if(!b){ L('  ❌ baneris nerastas'); }
  else{
    L('  antraste: '+JSON.stringify(b.title));
    L('  accept: '+JSON.stringify(b.accept)+'  fonas: '+b.acceptBg);
    L('  deny  : '+JSON.stringify(b.deny));
    L('  nuorodu spalva: '+b.linkColor);
    L('  matomos nuorodos:');
    b.links.forEach(l=>L('    "'+l.t+'" -> '+l.h));
    L('');
    const green = /rgb\(45,\s*95,\s*63\)/;
    L('  '+(green.test(b.acceptBg||'')?'✅':'❌')+' accept mygtukas zalias (45,95,63)');
    L('  '+(green.test(b.linkColor||'')?'✅':'❌')+' nuorodos zalios');
    L('  '+(!b.links.some(l=>l.h==='/slapuku-politika/')?'✅':'❌')+' nera nuorodos i sena "Slapukų naudojimas"');
  }
  await browser.close();
}catch(e){ L('!!! ERROR: '+e.message.slice(0,150)); }
putFile('cmplz_css_apply.txt', out); console.log(out);
