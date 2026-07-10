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
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, locale:'lt-LT'});
const page=await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(7000);

L('############ BANERIO DOM TIKSLI ANALIZE ############'); L('');

L('=== 1. Nuorodu MATOMUMAS ===');
const links = await page.evaluate(()=>{
  const b=document.querySelector('.cmplz-cookiebanner');
  return [...b.querySelectorAll('a')].map(a=>{
    let el=a, vis=true;
    while(el && el!==document.body){
      const s=getComputedStyle(el);
      if(s.display==='none'||s.visibility==='hidden'||s.opacity==='0'){ vis=false; break; }
      el=el.parentElement;
    }
    return { txt:a.innerText.trim().slice(0,40), href:(a.getAttribute('href')||'').slice(0,60), visible:vis, cls:a.className.slice(0,40) };
  });
});
links.forEach(l=>L('  '+(l.visible?'👁 MATOMA ':'   paslepta')+'  "'+l.txt+'"  -> '+l.href));
L('');
L('  Matomu nuorodu: '+links.filter(l=>l.visible).length+' is '+links.length);
L('');

L('=== 2. Kategoriju checkbox\'ai (po "Peržiūrėti nuostatas") ===');
await page.click('.cmplz-view-preferences',{timeout:10000});
await page.waitForTimeout(2500);
const cats = await page.evaluate(()=>{
  const b=document.querySelector('.cmplz-cookiebanner');
  return [...b.querySelectorAll('input[type=checkbox]')].map(i=>{
    let el=i.closest('.cmplz-category, .cmplz-service-header') || i.parentElement;
    let vis=true, e2=i;
    while(e2 && e2!==document.body){ const s=getComputedStyle(e2); if(s.display==='none'){vis=false;break;} e2=e2.parentElement; }
    const lbl = el ? (el.querySelector('.cmplz-category-title, h3, label')||{}).innerText : null;
    return {
      dataCat: i.getAttribute('data-category'),
      value: i.value, id: i.id, name: i.name,
      checked: i.checked, disabled: i.disabled,
      readonly: i.hasAttribute('readonly'),
      cls: i.className.slice(0,50),
      label: lbl?lbl.trim().slice(0,30):null,
      visible: vis,
      parentCls: el?el.className.slice(0,50):null
    };
  });
});
cats.forEach((c,i)=>{
  L('  ['+(i+1)+'] '+String(c.dataCat||c.value).padEnd(20)+' "'+(c.label||'?')+'"');
  L('       checked='+c.checked+'  disabled='+c.disabled+'  readonly='+c.readonly+'  matomas='+c.visible);
  L('       class: '+c.cls);
});
L('');
const func = cats.find(c=>/functional/.test(c.dataCat||c.value||''));
L('  Funkcinis checkbox: '+(func? (func.disabled||func.readonly ? '✅ uzrakintas' : '❌ NEUZRAKINTAS — vartotojas gali isjungti') : 'nerastas'));
const pref = cats.find(c=>/preferences/.test(c.dataCat||c.value||''));
L('  Parinktys (preferences): '+(pref? (pref.visible?'❌ MATOMA (nenaudojama)':'✅ paslepta') : 'nerasta'));
L('');

L('=== 3. Ar realiai galima atjungti funkcini ===');
if(func && !func.disabled){
  try{
    await page.evaluate(()=>{ const i=document.querySelector('.cmplz-cookiebanner input[data-category="cmplz_functional"]'); if(i) i.click(); });
    await page.waitForTimeout(1000);
    const after = await page.evaluate(()=>{ const i=document.querySelector('.cmplz-cookiebanner input[data-category="cmplz_functional"]'); return i?i.checked:null; });
    L('  Po paspaudimo checked='+after+'   '+(after===false?'❌ PAVYKO ATJUNGTI (bloga)':'✅ liko ijungtas (Complianz apsaugo)'));
  }catch(e){ L('  '+e.message.slice(0,60)); }
} else L('  (praleista)');
L('');

L('=== 4. cmplz body klases ir TCF ===');
const meta = await page.evaluate(()=>({
  body: document.body.className.split(' ').filter(c=>c.startsWith('cmplz')),
  tcfWrapper: !!document.querySelector('.cmplz-tcf-wrapper, #cmplz-tcf-wrapper'),
  tcfVisible: (()=>{ const e=document.querySelector('.cmplz-tcf-wrapper, #cmplz-tcf-wrapper'); return e?getComputedStyle(e).display!=='none':null; })(),
  vendorCount: (document.body.innerText.match(/\{vendor_count\}/g)||[]).length,
  titlePlaceholder: (document.body.innerText.match(/\{title\}/g)||[]).length
}));
L('  body klases: '+JSON.stringify(meta.body));
L('  TCF wrapper DOM\'e: '+meta.tcfWrapper+'   matomas: '+meta.tcfVisible);
L('  {vendor_count} matomame tekste: '+meta.vendorCount);
L('  {title} matomame tekste: '+meta.titlePlaceholder);
L('');

L('=== 5. Senojo "Slapukų naudojimas" puslapio busena ===');
const old = await page.evaluate(async()=>{
  try{ const r=await fetch('/slapuku-politika/',{method:'HEAD'}); return r.status; }catch(e){ return 'err'; }
});
L('  /slapuku-politika/ -> HTTP '+old);

await browser.close();
putFile('cmplz_dom.txt', out); console.log(out);
