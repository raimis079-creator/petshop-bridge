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
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
function get(url){
  const code=execSync('curl -sk -o /tmp/g.txt -w "%{http_code}" --max-time 45 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/g.txt','utf8'); }catch(e){}
  return {code, body:b};
}

L('############ BANERIO APPLY + VERIFIKACIJA ############'); L('');
L('=== 1. APPLY ===');
const r=get('https://dev.avesa.lt/?cmplz_edit=1&token='+TOKEN+'&confirm=APPLY_BANNER');
L('  HTTP '+r.code);
try{
  const j=JSON.parse(r.body);
  L('  mode: '+j.mode);
  L('  updated (eiluciu): '+j.updated);
  L('  db_error: '+(j.db_error||'nera ✅'));
  L('  banner_version: '+j.banner_version+' -> '+j.new_version);
  L('  cache isvalyta: '+JSON.stringify(j.cache_cleared));
  L('');
  L('  PO ATNAUJINIMO (is DB):');
  const p=j.PO_ATNAUJINIMO;
  L('    header:  '+JSON.stringify(p.header));
  L('    dismiss: '+JSON.stringify(p.dismiss));
  L('    hyperlink spalva: '+JSON.stringify(p.colorpalette_text));
  L('    banner_version: '+p.banner_version);
  L('    message_optin: "'+String(p.message_optin).slice(0,90)+'..."');
}catch(e){ L('  parse err: '+r.body.slice(0,300)); }
L('');
await new Promise(x=>setTimeout(x,6000));

L('=== 2. Vizuali verifikacija (Playwright) ===');
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, locale:'lt-LT'});
const page=await ctx.newPage();
await page.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(8000);

const b = await page.evaluate(()=>{
  const el=document.querySelector('.cmplz-cookiebanner');
  if(!el) return null;
  const g=s=>{const e=el.querySelector(s); return e?e.innerText.trim():null;};
  const acc=el.querySelector('.cmplz-accept');
  const cs = acc?getComputedStyle(acc):null;
  return {
    title: g('.cmplz-title'),
    message: g('.cmplz-message'),
    accept: g('.cmplz-accept'),
    deny: g('.cmplz-deny'),
    view: g('.cmplz-view-preferences'),
    acceptBg: cs?cs.backgroundColor:null,
    acceptColor: cs?cs.color:null,
    linkColor: (()=>{ const a=el.querySelector('.cmplz-links a'); return a?getComputedStyle(a).color:null; })(),
    visibleLinks: [...el.querySelectorAll('a')].filter(a=>{
      let e=a,v=true; while(e&&e!==document.body){ if(getComputedStyle(e).display==='none'){v=false;break;} e=e.parentElement; } return v;
    }).map(a=>({t:a.innerText.trim(), h:(a.getAttribute('href')||'').replace('https://dev.avesa.lt','')}))
  };
});
if(!b){ L('  ❌ baneris nerastas'); }
else{
  L('  Antraste : '+JSON.stringify(b.title));
  L('  Zinute   : '+JSON.stringify(String(b.message).slice(0,120)));
  L('');
  L('  Mygtukai:');
  L('    accept: '+JSON.stringify(b.accept)+'   fonas: '+b.acceptBg+'   tekstas: '+b.acceptColor);
  L('    deny  : '+JSON.stringify(b.deny));
  L('    view  : '+JSON.stringify(b.view));
  L('');
  L('  Nuorodu spalva: '+b.linkColor);
  L('');
  L('  Matomos nuorodos:');
  b.visibleLinks.forEach(l=>L('    "'+l.t+'" -> '+l.h));
  L('');
  const checks = {
    'antraste pakeista':      b.title==='Slapukai ir privatumas',
    'atmesti mygtukas':       /ATMESTI/i.test(b.deny||''),
    'zinute be dublio':       !/funkcijas ir funkcijas/i.test(b.message||''),
    'zalias accept (45,95,63)': /45,\s*95,\s*63/.test(b.acceptBg||''),
    'zalios nuorodos':        /45,\s*95,\s*63/.test(b.linkColor||''),
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
}
L('');

L('=== 3. Kategorijos (Peržiūrėti nuostatas) ===');
try{
  await page.click('.cmplz-view-preferences',{timeout:10000});
  await page.waitForTimeout(2500);
  const cats = await page.evaluate(()=>{
    const el=document.querySelector('.cmplz-cookiebanner');
    return [...el.querySelectorAll('.cmplz-category')].map(c=>{
      let vis=true,e=c; while(e&&e!==document.body){ if(getComputedStyle(e).display==='none'){vis=false;break;} e=e.parentElement; }
      const t=c.querySelector('.cmplz-category-title, h3');
      const inp=c.querySelector('input[type=checkbox]');
      let inpVis=false;
      if(inp){ let x=inp; inpVis=true; while(x&&x!==document.body){ if(getComputedStyle(x).display==='none'){inpVis=false;break;} x=x.parentElement; } }
      return { title:t?t.innerText.trim():'?', rowVisible:vis, checkboxVisible:inpVis, cat:inp?inp.getAttribute('data-category'):null };
    });
  });
  cats.forEach((c,i)=>L('  ['+(i+1)+'] '+String(c.title).padEnd(14)+' eilute='+(c.rowVisible?'MATOMA':'paslepta')+'  jungiklis='+(c.checkboxVisible?'MATOMAS':'paslėptas')+'  ('+c.cat+')'));
  L('');
  const visibleToggles = cats.filter(c=>c.checkboxVisible).length;
  L('  Matomu jungikliu: '+visibleToggles+'  '+(visibleToggles===2?'✅ (Statistika + Rinkodara)':'⚠️'));
  const prefsRow = cats.find(c=>/preferences/.test(c.cat||''));
  if(prefsRow) L('  „Parinktys" eilute: '+(prefsRow.rowVisible?'❌ MATOMA (nenaudojama kategorija)':'✅ paslepta'));
}catch(e){ L('  ❌ '+e.message.slice(0,80)); }
await browser.close();

L('');
L('=== 4. legal_documents laukas (nuoroda "Slapukų naudojimas") ===');
const p2=get('https://dev.avesa.lt/?cmplz_banner=1&token='+TOKEN);
if(p2.code==='200'){
  try{
    const j=JSON.parse(p2.body);
    const ld = j.cookiebanners_row ? j.cookiebanners_row.legal_documents : null;
    L('  legal_documents: '+(ld!==null&&ld!==undefined?JSON.stringify(String(ld).slice(0,300)):'(nematyti — atsakymas nukirptas)'));
    if(j.values) { L('  privacy-statement: '+JSON.stringify(j.values['privacy-statement'])); }
    if(j.doc_by_type) L('  doc_by_type: '+JSON.stringify(j.doc_by_type).slice(0,300));
  }catch(e){ L('  parse err'); }
} else L('  HTTP '+p2.code);
putFile('cmplz_apply.txt', out); console.log(out);
