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

L('############ page_links + FINALINE BUSENA ############'); L('');

const html = execSync('curl -skL --max-time 40 "https://dev.avesa.lt/?cb='+Date.now()+'"',{encoding:'utf8',maxBuffer:30000000});
const m = html.match(/"page_links":\s*(\{[\s\S]*?\})\s*,\s*"/);
L('=== page_links (inline config) ===');
if(m){
  try{
    const pl = JSON.parse(m[1]);
    for(const [region,docs] of Object.entries(pl)){
      L('  region: '+region);
      for(const [type,d] of Object.entries(docs)){
        L('    '+String(type).padEnd(20)+' "'+d.title+'"');
        L('    '+' '.repeat(20)+' '+String(d.url).replace(/^https?:\/\/dev\.avesa\.lt/,''));
      }
    }
  }catch(e){
    L('  parse err, raw:');
    L('  '+m[1].slice(0,600));
  }
} else {
  const m2 = html.match(/page_links[\s\S]{0,600}/);
  L('  '+(m2?m2[0].slice(0,600):'nerasta'));
}
L('');

L('=== Vizuali patikra ===');
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, locale:'lt-LT'});
const page=await ctx.newPage();
await page.goto('https://dev.avesa.lt/?cb2='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(8000);
const b = await page.evaluate(()=>{
  const el=document.querySelector('.cmplz-cookiebanner');
  if(!el) return null;
  const acc=el.querySelector('.cmplz-accept');
  return {
    title:(el.querySelector('.cmplz-title')||{}).innerText,
    msg:((el.querySelector('.cmplz-message')||{}).innerText||'').slice(0,80),
    accept:(acc||{}).innerText, deny:(el.querySelector('.cmplz-deny')||{}).innerText,
    view:(el.querySelector('.cmplz-view-preferences')||{}).innerText,
    acceptBg: acc?getComputedStyle(acc).backgroundColor:null,
    links:[...el.querySelectorAll('a')].filter(a=>{let e=a,v=true;while(e&&e!==document.body){if(getComputedStyle(e).display==='none'){v=false;break;}e=e.parentElement;}return v;})
          .map(a=>({t:a.innerText.trim(), h:(a.getAttribute('href')||'').replace(/^https?:\/\/dev\.avesa\.lt/,'')}))
  };
});
if(!b) L('  ❌ baneris nerastas');
else{
  L('  antraste : '+JSON.stringify(b.title));
  L('  zinute   : '+JSON.stringify(b.msg)+'...');
  L('  mygtukai : '+JSON.stringify([b.accept,b.deny,b.view]));
  L('  accept fonas: '+b.acceptBg);
  L('');
  L('  Matomos nuorodos:');
  b.links.forEach(l=>L('    "'+l.t+'"  ->  '+l.h));
  L('');
  const green=/rgb\(45,\s*95,\s*63\)/;
  const senaNuoroda = b.links.some(l=>l.h==='/slapuku-politika/');
  const checks={
    'antraste "Slapukai ir privatumas"': b.title==='Slapukai ir privatumas',
    'mygtukas ATMESTI':                  /ATMESTI/i.test(b.deny||''),
    'zinute be dublio':                  !/funkcijas ir funkcijas/i.test(b.msg||''),
    'accept zalias':                     green.test(b.acceptBg||''),
    'nera senos nuorodos /slapuku-politika/': !senaNuoroda,
  };
  for(const [k,v] of Object.entries(checks)) L('  '+(v?'✅':'❌')+' '+k);
}
await browser.close();
putFile('cmplz_final.txt', out); console.log(out);
