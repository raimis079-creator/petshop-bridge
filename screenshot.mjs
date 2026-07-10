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
  const payload={name:'TEMP — Complianz layout fix v1 (token)',desc:'DRY/APPLY.',code:CODE,scope:'front-end',active:true,priority:6,tags:['temp']};
  const chk=api('GET',API+'/623');
  let id;
  if(chk.code==='200'){ api('POST',API+'/623',payload); id=623; }
  else { const r=api('POST',API,payload); id=JSON.parse(r.body).id; }
  L('snippet id='+id);
  const v=api('GET',API+'/'+id);
  if(v.code==='200'){ const j=JSON.parse(v.body); L('active='+j.active+' code_error='+JSON.stringify(j.code_error||null)); }
  L('');
  await new Promise(r=>setTimeout(r,3000));

  L('=== DRY ===');
  const d=get('https://dev.avesa.lt/?cmplz_layout=1&token='+TOKEN);
  try{ const j=JSON.parse(d.body); L('  PRIES: '+JSON.stringify(j.PRIES)); L('  PLANUOJAMA: '+JSON.stringify(j.PLANUOJAMA)); }
  catch(e){ L('  '+d.body.slice(0,300)); }
  L('');

  L('=== APPLY ===');
  const a=get('https://dev.avesa.lt/?cmplz_layout=1&token='+TOKEN+'&confirm=APPLY_LAYOUT');
  try{
    const j=JSON.parse(a.body);
    L('  updated: '+j.updated+'  db_error: '+(j.db_error||'nera'));
    L('  istrinta CSS: '+JSON.stringify(j.istrinta_css));
    L('  iskviesta: '+JSON.stringify(j.iskviesta));
    L('  CSS po: '+JSON.stringify(j.css_po));
    L('  PO: '+JSON.stringify(j.PO));
  }catch(e){ L('  '+a.body.slice(0,400)); }
  L('');
  await new Promise(r=>setTimeout(r,6000));

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
      const btns=[...el.querySelectorAll('.cmplz-btn')].filter(b=>{let e=b,v=true;while(e&&e!==document.body){if(getComputedStyle(e).display==='none'){v=false;break;}e=e.parentElement;}return v;});
      const wrap=el.querySelector('.cmplz-buttons');
      return {
        bannerW: el.getBoundingClientRect().width,
        scrollW: el.scrollWidth, clientW: el.clientWidth,
        overflow: el.scrollWidth > el.clientWidth + 2,
        btns: btns.map(b=>({t:b.innerText.trim(), w:Math.round(b.getBoundingClientRect().width), clipped: b.scrollWidth > b.clientWidth+1})),
        wrapStyle: wrap?{flexWrap:getComputedStyle(wrap).flexWrap, overflowX:getComputedStyle(wrap).overflowX}:null
      };
    });
    L('');
    L('  --- '+label+' ('+w+'px) ---');
    if(!r){ L('    baneris nerastas'); }
    else{
      L('    banerio plotis: '+Math.round(r.bannerW)+'px   scrollW='+r.scrollW+'  clientW='+r.clientW);
      L('    horizontalus overflow: '+(r.overflow?'❌ YRA':'✅ NĖRA'));
      L('    flex-wrap: '+JSON.stringify(r.wrapStyle));
      L('    mygtukai:');
      r.btns.forEach(b=>L('      "'+b.t+'"  '+b.w+'px  '+(b.clipped?'❌ NUKIRSTAS':'✅')));
    }
    await page.screenshot({path:'/tmp/b_'+label+'.png'});
    await ctx.close();
  }
  await browser.close();
  putFile('cmplz_layout_desktop.png','/tmp/b_DESKTOP.png',true);
  putFile('cmplz_layout_mobile.png','/tmp/b_MOBILE.png',true);
  L('');
  L('=== TEMP snippet '+id+' — deaktyvuoju ===');
  const dz=api('POST',API+'/'+id,{active:false});
  L('  HTTP '+dz.code);
}catch(e){ L('!!! ERROR: '+e.message.slice(0,150)); }
putFile('cmplz_layout.txt', out); console.log(out);
