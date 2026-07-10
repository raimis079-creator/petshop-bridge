import { chromium } from 'playwright';
import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s,bin){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const content = bin ? fs.readFileSync(s).toString('base64') : Buffer.from(s,'utf8').toString('base64');
    const b={message:'ci',branch:'main',content}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};

const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, locale:'lt-LT',
  userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120'});
const page=await ctx.newPage();

L('############ COMPLIANZ BANERIO TEKSTU RECON ############'); L('');

await page.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(7000);

// ---- 1. Pagrindinis baneris ----
L('=== 1. Pagrindinis baneris ===');
const banner = await page.evaluate(()=>{
  const b=document.querySelector('.cmplz-cookiebanner');
  if(!b) return null;
  const g=s=>{const e=b.querySelector(s); return e?e.innerText.trim():null;};
  return {
    visible: getComputedStyle(b).display!=='none',
    title: g('.cmplz-title'),
    message: g('.cmplz-message'),
    accept: g('.cmplz-accept'),
    deny: g('.cmplz-deny'),
    view: g('.cmplz-view-preferences'),
    save: g('.cmplz-save-preferences'),
    links: [...b.querySelectorAll('.cmplz-links a, .cmplz-documents a')].map(a=>({t:a.innerText.trim(), h:a.getAttribute('href')})),
    fullText: b.innerText.trim().slice(0,600)
  };
});
if(!banner){ L('  ❌ baneris nerastas'); }
else{
  L('  matomas: '+banner.visible);
  L('  Antraste : '+JSON.stringify(banner.title));
  L('  Zinute   : '+JSON.stringify(banner.message));
  L('');
  L('  Mygtukai:');
  L('    accept          : '+JSON.stringify(banner.accept));
  L('    deny            : '+JSON.stringify(banner.deny));
  L('    view-preferences: '+JSON.stringify(banner.view));
  L('    save-preferences: '+JSON.stringify(banner.save));
  L('');
  L('  Nuorodos:');
  banner.links.forEach(l=>L('    "'+l.t+'" -> '+l.h));
}
await page.screenshot({path:'/tmp/banner.png', clip:{x:840,y:520,width:600,height:380}}).catch(async()=>{ await page.screenshot({path:'/tmp/banner.png'}); });
L('');

// ---- 2. Perziureti nuostatas ----
L('=== 2. "Peržiūrėti nuostatas" langas ===');
try{
  await page.click('.cmplz-view-preferences',{timeout:10000});
  await page.waitForTimeout(2500);
  const prefs = await page.evaluate(()=>{
    const b=document.querySelector('.cmplz-cookiebanner');
    const cats=[...b.querySelectorAll('.cmplz-service-header, .cmplz-category')].map(c=>{
      const t=c.querySelector('.cmplz-category-title, h3, .cmplz-title');
      const d=c.querySelector('.cmplz-description, .cmplz-category-description, p');
      const inp=c.querySelector('input[type=checkbox]');
      return {
        title: t?t.innerText.trim():null,
        desc: d?d.innerText.trim().slice(0,160):null,
        checked: inp?inp.checked:null,
        disabled: inp?inp.disabled:null,
        value: inp?(inp.getAttribute('data-category')||inp.value):null
      };
    });
    return { cats, save: (b.querySelector('.cmplz-save-preferences')||{}).innerText };
  });
  L('  Kategoriju: '+prefs.cats.length);
  prefs.cats.forEach((c,i)=>{
    L('');
    L('  ['+(i+1)+'] '+JSON.stringify(c.title)+'   value='+c.value);
    L('      checked='+c.checked+'  disabled='+c.disabled);
    L('      aprasas: '+JSON.stringify(c.desc));
  });
  L('');
  L('  Issaugoti mygtukas: '+JSON.stringify(prefs.save));
  await page.screenshot({path:'/tmp/prefs.png', fullPage:false});
}catch(e){ L('  ❌ '+e.message.slice(0,90)); }
L('');

// ---- 3. Angliski likuciai ----
L('=== 3. Angliski likuciai banerio DOM\'e ===');
const en = await page.evaluate(()=>{
  const b=document.querySelector('.cmplz-cookiebanner');
  if(!b) return [];
  const txt=b.innerText;
  const words=['Accept','Deny','Save','Preferences','Functional','Statistics','Marketing','Cookie','Consent','Manage','View','Settings','Necessary','Always active'];
  return words.filter(w=>new RegExp('\\b'+w+'\\b').test(txt));
});
L('  rasta: '+(en.length? JSON.stringify(en) : 'nerasta ✅'));
L('');

// ---- 4. Slapuku politikos puslapis ----
L('=== 4. Slapuku politikos puslapis ===');
await page.goto('https://dev.avesa.lt/slapuku-politika-es/',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(5000);
const policy = await page.evaluate(()=>{
  const body=document.querySelector('.entry-content, .page-content, main') || document.body;
  const txt=body.innerText;
  const cookies=['_ga','_ga_FMTKEGGLMG','_gcl_au','_fbp','cmplz_','woocommerce_','wp_woocommerce_session'];
  return {
    len: txt.length,
    headings: [...body.querySelectorAll('h2,h3')].map(h=>h.innerText.trim()).slice(0,12),
    foundCookies: cookies.filter(c=>txt.includes(c)),
    tables: body.querySelectorAll('table').length,
    first300: txt.slice(0,300)
  };
});
L('  turinio ilgis: '+policy.len+' simb.');
L('  lenteliu: '+policy.tables);
L('  antrastes: '+JSON.stringify(policy.headings));
L('');
L('  Ar isvardinti musu slapukai:');
for(const c of ['_ga','_ga_FMTKEGGLMG','_gcl_au','_fbp','cmplz_','woocommerce_']){
  L('    '+(policy.foundCookies.includes(c)?'✅':'❌')+' '+c);
}
L('');
L('  Pradzia: '+JSON.stringify(policy.first300.slice(0,200)));
await page.screenshot({path:'/tmp/policy.png', fullPage:false});

await browser.close();
putFile('cmplz_texts.txt', out);
putFile('cmplz_banner.png','/tmp/banner.png',true);
putFile('cmplz_prefs.png','/tmp/prefs.png',true);
putFile('cmplz_policy.png','/tmp/policy.png',true);
console.log(out);
