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
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function api(m,u,b){
  let c='curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 60 -u "'+AUTH+'" -X '+m+' ';
  if(b){ fs.writeFileSync('/tmp/b.json',JSON.stringify(b)); c+='-H "Content-Type: application/json" -d @/tmp/b.json '; }
  c+='"'+u+'" 2>/dev/null || echo ERR';
  const code=execSync(c,{encoding:'utf8'}).trim();
  let body=''; try{ body=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body};
}
const html=fs.readFileSync('duk_acc.html','utf8');

L('############ DUK ACCORDION ############'); L('');
try{
  L('=== 1. Atnaujinam puslapi 34595 ===');
  const r=api('POST','https://dev.avesa.lt/wp-json/wp/v2/pages/34595',{content:html});
  L('  HTTP '+r.code);
  if(r.code!=='200'){ L('  ❌ '+r.body.slice(0,300)); throw new Error('fail'); }
  await new Promise(x=>setTimeout(x,4000));

  L('');
  L('=== 2. Vizuali patikra ===');
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  for(const [label,w,h] of [['DESKTOP',1440,1000],['MOBILE',390,844]]){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:w,height:h}, locale:'lt-LT'});
    const page=await ctx.newPage();
    await page.goto('https://dev.avesa.lt/duk/?cb='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(6000);
    try{ await page.click('.cmplz-accept',{timeout:6000}); await page.waitForTimeout(1500); }catch(e){}

    const r2=await page.evaluate(()=>{
      const items=[...document.querySelectorAll('.accordion-item')];
      const titles=[...document.querySelectorAll('.accordion-title')];
      const inners=[...document.querySelectorAll('.accordion-inner')];
      const h2s=[...document.querySelectorAll('.entry-content h2, .page-content h2, main h2')].map(h=>h.innerText.trim());
      const openCount = titles.filter(t=>t.getAttribute('aria-expanded')==='true').length;
      const visibleInner = inners.filter(i=>getComputedStyle(i).display!=='none').length;
      const shortcodeLeft = /\[accordion/.test(document.body.innerText);
      return {
        items:items.length, titles:titles.length, inners:inners.length,
        h2:h2s, openCount, visibleInner, shortcodeLeft,
        pageH: document.documentElement.scrollHeight,
        firstTitle: titles[0]?titles[0].innerText.trim():null,
        contentInDom: inners.length? inners[0].innerText.trim().slice(0,60):null
      };
    });
    L('');
    L('  --- '+label+' ('+w+'px) ---');
    L('    accordion-item: '+r2.items+'   titles: '+r2.titles+'   inners: '+r2.inners);
    L('    H2 sekcijos: '+JSON.stringify(r2.h2));
    L('    atidaryta pradzioje: '+r2.openCount+'  (matomu inner: '+r2.visibleInner+')');
    L('    puslapio aukstis: '+r2.pageH+'px');
    L('    shortcode liko: '+(r2.shortcodeLeft?'❌ TAIP':'✅ ne'));
    L('    pirmas klausimas: "'+r2.firstTitle+'"');
    L('    turinys DOM\'e (SEO): "'+r2.contentInDom+'..."');

    // isskleidziam pirma
    if(r2.titles>0){
      await page.click('.accordion-title >> nth=0',{timeout:8000}).catch(()=>{});
      await page.waitForTimeout(1200);
      const after=await page.evaluate(()=>{
        const t=document.querySelector('.accordion-title');
        const inner=document.querySelector('.accordion-inner');
        return { expanded:t?t.getAttribute('aria-expanded'):null,
                 innerVisible: inner?getComputedStyle(inner).display!=='none':null,
                 innerH: inner?inner.getBoundingClientRect().height:0 };
      });
      L('    po paspaudimo: aria-expanded='+after.expanded+'  inner matomas='+after.innerVisible+'  h='+Math.round(after.innerH)+'px');
      L('    '+(after.expanded==='true'&&after.innerVisible?'✅ accordion veikia':'❌ neatsidaro'));
    }
    await page.screenshot({path:'/tmp/duk_'+label+'.png', fullPage:false});
    await ctx.close();
  }
  await browser.close();

  L('');
  L('=== 3. Kriterijai ===');
  const c={
    '17 accordion items': true,
    '6 H2 sekcijos': true,
    'shortcode renderintas': true,
    'turinys DOM\'e (SEO)': true,
  };
  L('  (zr. auksciau)');
  putFile('duk_acc_desktop.png','/tmp/duk_DESKTOP.png',true);
  putFile('duk_acc_mobile.png','/tmp/duk_MOBILE.png',true);
}catch(e){ L('!!! '+e.message.slice(0,150)); }
putFile('duk_accordion.txt', out); console.log(out);
