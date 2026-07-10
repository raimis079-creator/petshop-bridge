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
const CODE=fs.readFileSync('petshop_cmplz_layout_fix.php','utf8');
const TOKEN=fs.readFileSync('.cmplz_token','utf8').trim();
try{
  api('POST',API+'/623',{name:'TEMP — Complianz layout fix v2 (token)',code:CODE,active:true,scope:'front-end',priority:6});
  L('snippet 623 atnaujintas + aktyvuotas');
  const v=api('GET',API+'/623'); if(v.code==='200'){ const j=JSON.parse(v.body); L('code_error='+JSON.stringify(j.code_error||null)); }
  await new Promise(r=>setTimeout(r,3000));

  L(''); L('=== APPLY ===');
  const a=get('https://dev.avesa.lt/?cmplz_layout=1&token='+TOKEN+'&confirm=APPLY_LAYOUT');
  try{
    const j=JSON.parse(a.body);
    L('  updated='+j.updated+'  db_error='+(j.db_error||'nera'));
    L('  iskviesta: '+JSON.stringify(j.iskviesta));
    L('  css_po: '+JSON.stringify(j.css_po));
    L('  PO: '+JSON.stringify(j.PO));
  }catch(e){ L('  '+a.body.slice(0,350)); }
  L('');

  L('=== Priverstinis regen per frontend ===');
  for(let i=0;i<3;i++){ get('https://dev.avesa.lt/?regen='+Date.now()+i); await new Promise(r=>setTimeout(r,2000)); }
  const css=get('https://dev.avesa.lt/wp-content/uploads/complianz/css/banner-1-optin.css?v=38');
  L('  banner-1-optin.css: HTTP '+css.code+'  ('+css.body.length+' B)');
  L('    turi flex-wrap/nowrap: '+(/flex-wrap/.test(css.body)?'✅':'❌'));
  L('    turi #2D5F3F: '+(/2D5F3F/i.test(css.body)?'✅':'❌'));
  L('');

  L('=== VIZUALI PATIKRA ===');
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  for(const [label,w,h] of [['DESKTOP',1440,900],['MOBILE',390,844]]){
    const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:w,height:h}, locale:'lt-LT'});
    const page=await ctx.newPage();
    await page.goto('https://dev.avesa.lt/?f='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(8000);
    const r=await page.evaluate(()=>{
      const el=document.querySelector('.cmplz-cookiebanner');
      if(!el) return null;
      const vis=n=>{let e=n,v=true;while(e&&e!==document.body){if(getComputedStyle(e).display==='none'){v=false;break;}e=e.parentElement;}return v;};
      const btns=[...el.querySelectorAll('.cmplz-btn')].filter(vis);
      const acc=el.querySelector('.cmplz-accept');
      const rects=btns.map(b=>b.getBoundingClientRect());
      const sameRow = rects.length>1 ? Math.abs(rects[0].top - rects[rects.length-1].top) < 5 : true;
      return {
        bannerW: Math.round(el.getBoundingClientRect().width),
        overflow: el.scrollWidth > el.clientWidth + 2,
        acceptBg: acc?getComputedStyle(acc).backgroundColor:null,
        title:(el.querySelector('.cmplz-title')||{}).innerText,
        btns: btns.map(b=>({t:b.innerText.trim(), w:Math.round(b.getBoundingClientRect().width), clipped:b.scrollWidth>b.clientWidth+1})),
        sameRow
      };
    });
    L('');
    L('  --- '+label+' ('+w+'px) ---');
    if(!r) L('    baneris nerastas');
    else{
      L('    plotis: '+r.bannerW+'px   overflow: '+(r.overflow?'❌':'✅ nera'));
      L('    accept fonas: '+r.acceptBg);
      L('    mygtukai '+(r.sameRow?'VIENOJE eiluteje':'kelios eilutes'));
      r.btns.forEach(b=>L('      "'+b.t+'"  '+b.w+'px  '+(b.clipped?'❌ nukirstas':'✅')));
      L('');
      const green=/rgb\(45,\s*95,\s*63\)/.test(r.acceptBg||'');
      if(label==='DESKTOP'){
        L('    '+(r.sameRow?'✅':'❌')+' desktop: 3 mygtukai vienoje eiluteje');
        L('    '+(!r.btns.some(b=>b.clipped)?'✅':'❌')+' nera nukirstu');
        L('    '+(!r.overflow?'✅':'❌')+' nera horizontalaus scroll');
        L('    '+(green?'✅':'❌')+' zalias accept');
      } else {
        L('    '+(!r.overflow?'✅':'❌')+' mobile: nera scroll');
        L('    '+(green?'✅':'❌')+' zalias accept');
      }
    }
    await page.screenshot({path:'/tmp/l_'+label+'.png'});
    await ctx.close();
  }
  await browser.close();
  putFile('layout_desktop.png','/tmp/l_DESKTOP.png',true);
  putFile('layout_mobile.png','/tmp/l_MOBILE.png',true);
  L('');
  const dz=api('POST',API+'/623',{active:false});
  L('TEMP 623 deaktyvuota: HTTP '+dz.code);
}catch(e){ L('!!! ERROR: '+e.message.slice(0,150)); }
putFile('cmplz_layout2.txt', out); console.log(out);
