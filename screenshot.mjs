import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PAYLOADS=JSON.parse(Buffer.from("eyJjdXN0b21faHRtbC0yIjogeyJpbnN0YW5jZSI6IHsicmF3IjogeyJ0aXRsZSI6ICJBUElFIiwgImNvbnRlbnQiOiAiPHA+TmFtaW5pxbMgZ3l2xatuxbMgcHJla8SXcyBpbnRlcm5ldHU6IG1haXN0YXMsIMW+YWlzbGFpIGlyIHByaWXFvmnFq3JhLjwvcD5cclxuPHAgc3R5bGU9XCJtYXJnaW4tdG9wOjEycHg7bWFyZ2luLWJvdHRvbToxNnB4O1wiPlxyXG4gIDxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb21cIiB0YXJnZXQ9XCJfYmxhbmtcIiByZWw9XCJub29wZW5lclwiIHN0eWxlPVwiZGlzcGxheTppbmxpbmUtYmxvY2s7d2lkdGg6MzJweDtoZWlnaHQ6MzJweDtib3JkZXI6MXB4IHNvbGlkICNmZmZjZWM7Ym9yZGVyLXJhZGl1czo1MCU7dGV4dC1hbGlnbjpjZW50ZXI7bGluZS1oZWlnaHQ6MzBweDtjb2xvcjojZmZmY2VjO3RleHQtZGVjb3JhdGlvbjpub25lO1wiPlxyXG4gICAgPHN0cm9uZz5mPC9zdHJvbmc+XHJcbiAgPC9hPlxyXG48L3A+XHJcbjx1bCBzdHlsZT1cImxpc3Qtc3R5bGU6bm9uZTtwYWRkaW5nOjA7bWFyZ2luOjA7XCI+XHJcbiAgPGxpIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo2cHg7XCI+PGEgaHJlZj1cIi9hcGllLW11cy9cIiBzdHlsZT1cImNvbG9yOiNmZmZjZWM7XCI+QXBpZSBtdXM8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL2tvbnRha3RhaS9cIiBzdHlsZT1cImNvbG9yOiNmZmZjZWM7XCI+S29udGFrdGFpPC9hPjwvbGk+XHJcbjwvdWw+In19fSwgImN1c3RvbV9odG1sLTMiOiB7Imluc3RhbmNlIjogeyJyYXciOiB7InRpdGxlIjogIktMSUVOVEFNUyIsICJjb250ZW50IjogIjx1bCBzdHlsZT1cImxpc3Qtc3R5bGU6bm9uZTtwYWRkaW5nOjA7bWFyZ2luOjA7XCI+XHJcbiAgPGxpIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo2cHg7XCI+PGEgaHJlZj1cIi9teS1hY2NvdW50L1wiIHN0eWxlPVwiY29sb3I6I2ZmZmNlYztcIj5NYW5vIHBhc2t5cmE8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL215LWFjY291bnQvb3JkZXJzL1wiIHN0eWxlPVwiY29sb3I6I2ZmZmNlYztcIj5Vxb5zYWt5bcWzIGlzdG9yaWphPC9hPjwvbGk+XHJcbiAgPGxpIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo2cHg7XCI+PGEgaHJlZj1cIi9wcmlzdGF0eW1hcy9cIiBzdHlsZT1cImNvbG9yOiNmZmZjZWM7XCI+UHJpc3RhdHltYXM8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL2FwbW9rZWppbWFzL1wiIHN0eWxlPVwiY29sb3I6I2ZmZmNlYztcIj5BcG1va8SXamltYXM8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL2dyYXppbmltYXMvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPkdyxIXFvmluaW1hczwvYT48L2xpPlxyXG4gIDxsaSBzdHlsZT1cIm1hcmdpbi1ib3R0b206NnB4O1wiPjxhIGhyZWY9XCIvdGFpc3lrbGVzL1wiIHN0eWxlPVwiY29sb3I6I2ZmZmNlYztcIj5UYWlzeWtsxJdzPC9hPjwvbGk+XHJcbiAgPGxpIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo2cHg7XCI+PGEgaHJlZj1cIi9wcml2YXR1bW8tcG9saXRpa2EvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPlByaXZhdHVtbyBwb2xpdGlrYTwvYT48L2xpPlxyXG4gIDxsaSBzdHlsZT1cIm1hcmdpbi1ib3R0b206NnB4O1wiPjxhIGhyZWY9XCIvc2xhcHVrdS1wb2xpdGlrYS9cIiBzdHlsZT1cImNvbG9yOiNmZmZjZWM7XCI+U2xhcHVrxbMgcG9saXRpa2E8L2E+PC9saT5cclxuPC91bD4ifX19LCAiY3VzdG9tX2h0bWwtNCI6IHsiaW5zdGFuY2UiOiB7InJhdyI6IHsidGl0bGUiOiAiS0FURUdPUklKT1MiLCAiY29udGVudCI6ICI8dWwgc3R5bGU9XCJsaXN0LXN0eWxlOm5vbmU7cGFkZGluZzowO21hcmdpbjowO1wiPlxyXG4gIDxsaSBzdHlsZT1cIm1hcmdpbi1ib3R0b206NnB4O1wiPjxhIGhyZWY9XCIva2F0ZWdvcmlqYS9zdW5pbXMvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPsWgdW5pbXM8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL2thdGVnb3JpamEva2F0ZW1zL1wiIHN0eWxlPVwiY29sb3I6I2ZmZmNlYztcIj5LYXTEl21zPC9hPjwvbGk+XHJcbiAgPGxpIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo2cHg7XCI+PGEgaHJlZj1cIi9rYXRlZ29yaWphL2dyYXV6aWthbXMvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPkdyYXXFvmlrYW1zPC9hPjwvbGk+XHJcbiAgPGxpIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo2cHg7XCI+PGEgaHJlZj1cIi9rYXRlZ29yaWphL3BhdWtzY2lhbXMvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPlBhdWvFocSNaWFtczwvYT48L2xpPlxyXG4gIDxsaSBzdHlsZT1cIm1hcmdpbi1ib3R0b206NnB4O1wiPjxhIGhyZWY9XCIva2F0ZWdvcmlqYS96dXZpbXMvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPsW9dXZpbXM8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL2FrY2lqb3MvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPkFrY2lqb3M8L2E+PC9saT5cclxuICA8bGkgc3R5bGU9XCJtYXJnaW4tYm90dG9tOjZweDtcIj48YSBocmVmPVwiL3Bhc2l1bHltYWkvXCIgc3R5bGU9XCJjb2xvcjojZmZmY2VjO1wiPlBhc2nFq2x5bWFpPC9hPjwvbGk+XHJcbjwvdWw+In19fSwgImN1c3RvbV9odG1sLTUiOiB7Imluc3RhbmNlIjogeyJyYXciOiB7InRpdGxlIjogIktPTlRBS1RBSSIsICJjb250ZW50IjogIjxwIHN0eWxlPVwibWFyZ2luLWJvdHRvbTo4cHg7XCI+XHJcbiAgPGEgaHJlZj1cInRlbDorMzcwNjgxODc3ODdcIiBzdHlsZT1cImNvbG9yOiNmZmZjZWM7dGV4dC1kZWNvcmF0aW9uOm5vbmU7Zm9udC13ZWlnaHQ6Ym9sZDtcIj4rMzcwIDY4MSA4Nzc4NzwvYT5cclxuPC9wPlxyXG48cCBzdHlsZT1cIm1hcmdpbi1ib3R0b206OHB4O1wiPlxyXG4gIDxhIGhyZWY9XCJtYWlsdG86dGVycmFAcGV0c2hvcC5sdFwiIHN0eWxlPVwiY29sb3I6I2ZmZmNlYztcIj50ZXJyYUBwZXRzaG9wLmx0PC9hPlxyXG48L3A+XHJcbjxwIHN0eWxlPVwibWFyZ2luLWJvdHRvbTowO2NvbG9yOiNhMmJkOWQ7Zm9udC1zaXplOjEzcHg7XCI+XHJcbiAgSeKAk1YgMDk6MDDigJMxODowMDxicj5cclxuICBWSSAxMDowMOKAkzE1OjAwXHJcbjwvcD4ifX19fQ==","base64").toString("utf8"));
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'df2',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(n,s){ putBin(n, Buffer.from(s,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -L --max-time 15 "'+DEV+u+'"',{encoding:'utf8',timeout:17000}).trim(); }catch(e){ return 'TO'; } }
(async()=>{
  let out='';

  // === 1. HTTP PRE-CHECK 17 URL ===
  const urls = ['/apie-mus/','/kontaktai/','/my-account/','/my-account/orders/','/pristatymas/','/apmokejimas/','/grazinimas/','/taisykles/','/privatumo-politika/','/slapuku-politika/','/kategorija/sunims/','/kategorija/katems/','/kategorija/grauzikams/','/kategorija/pauksciams/','/kategorija/zuvims/','/akcijos/','/pasiulymai/'];
  out += '=== HTTP PRE-CHECK (17 URL) ===\n';
  let allOk = true;
  for(const u of urls){
    const c = code(u);
    out += '  '+c+'  '+u+'\n';
    if(c !== '200') allOk = false;
  }
  if(!allOk){
    out += '\n!!! ne visi 200 - STABDOMAS !!!\n';
    putFile('deploy_footer2.txt', out);
    return;
  }
  out += '  visi 17 = 200 ✅\n\n';

  // === 2. PUT widgets ===
  out += '=== PUT widgets ===\n';
  for(const [wid, payload] of Object.entries(PAYLOADS)){
    const r = api('/wp-json/wp/v2/widgets/'+wid, 'PUT', payload);
    try{
      const j = JSON.parse(r);
      const t = j.instance && j.instance.raw ? j.instance.raw.title : '?';
      const c = j.instance && j.instance.raw ? (j.instance.raw.content||'').length : 0;
      out += '  '+wid+': title='+t+' content_len='+c+'\n';
    }catch(e){ out += '  '+wid+' PUT ERR: '+r.slice(0,200)+'\n'; }
  }
  await new Promise(r=>setTimeout(r,3000));

  // === 3. Verifikacija — homepage rendered ===
  const { chromium } = await import('playwright');
  const b = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p = await ctx.newPage();
  await p.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p.waitForTimeout(3500);
  const chk = await p.evaluate(()=>{
    const cols = ['custom_html-2','custom_html-3','custom_html-4','custom_html-5'];
    const result = {};
    for(const id of cols){
      const el = document.getElementById(id);
      if(!el){ result[id] = 'NERASTA'; continue; }
      const title = el.querySelector('.widget-title')?.innerText.trim();
      const links = [...el.querySelectorAll('a')].map(a=>({
        text: (a.innerText || a.textContent).trim().slice(0,30),
        href: a.getAttribute('href'),
      }));
      result[id] = { title, count: links.length, links };
    }
    return result;
  });
  out += '\n=== VERIFIKACIJA (homepage) ===\n'+JSON.stringify(chk, null, 2)+'\n';
  // Scroll iki footer + screenshot
  await p.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await p.waitForTimeout(1200);
  putBin('footer2_desktop.png', await p.screenshot({ fullPage:false }));
  await ctx.close();

  // === 4. Globali patikra — /apie-mus/ ===
  const ctx2 = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  const p2 = await ctx2.newPage();
  await p2.goto(DEV+'/apie-mus/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await p2.waitForTimeout(2500);
  const chk2 = await p2.evaluate(()=>{
    const kl = document.getElementById('custom_html-3');
    const kat = document.getElementById('custom_html-4');
    return {
      klientams_count: kl ? kl.querySelectorAll('a').length : 0,
      kategorijos_count: kat ? kat.querySelectorAll('a').length : 0,
      first_klientams_link: kl ? kl.querySelector('a')?.getAttribute('href') : '-',
    };
  });
  out += '\n=== /apie-mus/ (globali patikra) ===\n'+JSON.stringify(chk2)+'\n';
  await ctx2.close();

  // === 5. Mobile ===
  const cm = await b.newContext({ ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pm = await cm.newPage();
  await pm.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'load', timeout:60000 });
  await pm.waitForTimeout(2500);
  await pm.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
  await pm.waitForTimeout(1200);
  putBin('footer2_mobile.png', await pm.screenshot({ fullPage:false }));
  await cm.close();

  await b.close();
  putFile('deploy_footer2.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,300)); });
