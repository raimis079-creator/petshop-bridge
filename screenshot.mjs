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
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:900}, locale:'lt-LT', bypassCSP:true});
await ctx.clearCookies();
const page=await ctx.newPage();
await page.goto('https://dev.avesa.lt/?fresh='+Date.now(),{waitUntil:'networkidle',timeout:60000}).catch(()=>page.waitForTimeout(3000));
await page.waitForTimeout(9000);

L('############ FINALINE BANERIO PATIKRA ############'); L('');
const b=await page.evaluate(()=>{
  const el=document.querySelector('.cmplz-cookiebanner');
  if(!el) return null;
  const acc=el.querySelector('.cmplz-accept');
  const deny=el.querySelector('.cmplz-deny');
  const vis=n=>{let e=n,v=true;while(e&&e!==document.body){if(getComputedStyle(e).display==='none'){v=false;break;}e=e.parentElement;}return v;};
  return {
    title:(el.querySelector('.cmplz-title')||{}).innerText,
    msg:(el.querySelector('.cmplz-message')||{}).innerText,
    accept:(acc||{}).innerText, deny:(deny||{}).innerText,
    view:(el.querySelector('.cmplz-view-preferences')||{}).innerText,
    acceptBg: acc?getComputedStyle(acc).backgroundColor:null,
    acceptTxt: acc?getComputedStyle(acc).color:null,
    linkColor: (()=>{const a=el.querySelector('.cmplz-links a'); return a?getComputedStyle(a).color:null;})(),
    links:[...el.querySelectorAll('a')].filter(vis).map(a=>({t:a.innerText.trim(), h:(a.getAttribute('href')||'').replace(/^https?:\/\/dev\.avesa\.lt/,'')})),
    cfgVersion: (window.complianz||{}).banner_version,
    cfgCats: (window.complianz||{}).categories,
    cfgLinks: (window.complianz||{}).page_links
  };
});
if(!b){ L('❌ baneris nerastas'); }
else{
  L('  antraste : '+JSON.stringify(b.title));
  L('  zinute   : '+JSON.stringify(String(b.msg).slice(0,150)));
  L('  mygtukai : PRIIMTI="'+b.accept+'"  DENY="'+b.deny+'"  VIEW="'+b.view+'"');
  L('  accept   : fonas='+b.acceptBg+'  tekstas='+b.acceptTxt);
  L('  nuorodos : spalva='+b.linkColor);
  L('');
  L('  Matomos nuorodos:');
  b.links.forEach(l=>L('    "'+l.t+'"  ->  '+l.h));
  L('');
  L('  JS config:');
  L('    banner_version: '+b.cfgVersion);
  L('    categories: '+JSON.stringify(b.cfgCats));
  L('    page_links.eu: '+JSON.stringify(b.cfgLinks?b.cfgLinks.eu:null));
  L('');
  const green=/rgb\(45,\s*95,\s*63\)/;
  const sena = b.links.some(l=>l.h==='/slapuku-politika/');
  const checks={
    'antraste "Slapukai ir privatumas"':  b.title==='Slapukai ir privatumas',
    'mygtukas ATMESTI (ne Neigti)':       /ATMESTI/i.test(b.deny||''),
    'zinute be "funkcijas ir funkcijas"': !/funkcijas ir funkcijas/i.test(b.msg||''),
    'accept mygtukas zalias #2D5F3F':     green.test(b.acceptBg||''),
    'nuorodos zalios':                    green.test(b.linkColor||''),
    'nera nuorodos i sena /slapuku-politika/': !sena,
    'privacy-statement -> /privatumo-politika/': b.links.some(l=>l.h==='/privatumo-politika/'),
    'tik 2 kategorijos config\'e':        b.cfgCats && Object.keys(b.cfgCats).length===2,
  };
  let pass=0;
  for(const [k,v] of Object.entries(checks)){ L('  '+(v?'✅':'❌')+' '+k); if(v) pass++; }
  L('');
  L('  '+pass+'/'+Object.keys(checks).length+' patikru praejo');
}
await page.screenshot({path:'/tmp/final_banner.png', fullPage:false});
await browser.close();
putFile('cmplz_verified.txt', out);
putFile('cmplz_banner_final.png','/tmp/final_banner.png',true);
console.log(out);
