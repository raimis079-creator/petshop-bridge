import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const BODY=Buffer.from("PCEtLSA9PT09PT09PT09PT0gSEVSTyA9PT09PT09PT09PT0gLS0+CjxkaXYgY2xhc3M9InBoLWhlcm8iPgogIDxkaXYgY2xhc3M9InBoLWhlcm8taW5uZXIiPgogICAgPGRpdiBjbGFzcz0icGgtaGVyby10ZXh0Ij4KICAgICAgPGgxPlByZWvEl3MgYXVnaW50aW5pdWkgcGFnYWwgcmVhbMWzIHBvcmVpa8SvPC9oMT4KICAgICAgPHA+TWFpc3RhcywgcHJpZcW+acWrcmEgaXIgc3ByZW5kaW1haSDFoXVuaW1zLCBrYXTEl21zIGJlaSBraXRpZW1zIGF1Z2ludGluaWFtcy4gTnVvIDIwMTAgbS4gcGFkZWRhbWUgacWhc2lyaW5rdGkgbmUgcGFnYWwgcmVrbGFtxIUsIG8gcGFnYWwgc3VkxJd0xK8sIGdhbWludG9qxIUgaXIgcHJha3RpbsSvIG5hdWRvamltxIUuPC9wPgogICAgICA8ZGl2IGNsYXNzPSJwaC1oZXJvLWN0YSI+CiAgICAgICAgPGEgaHJlZj0iL3BhcmR1b3R1dmUvIiBjbGFzcz0icGgtYnRuLXByaW1hcnkiPlBlcsW+acWrcsSXdGkgcHJla2VzIOKGkjwvYT4KICAgICAgICA8YSBocmVmPSIvc3ByZW5kaW1haS8iIGNsYXNzPSJwaC1idG4tZ2hvc3QiPlJhc3RpIHNwcmVuZGltxIUg4oaSPC9hPgogICAgICA8L2Rpdj4KICAgIDwvZGl2PgogIDwvZGl2Pgo8L2Rpdj4KCjwhLS0gPT09PT09PT09PT09IEtBVEVHT1JJSk9TID09PT09PT09PT09PSAtLT4KPGRpdiBjbGFzcz0icGgtc2VjdGlvbiI+CiAgPGgyIGNsYXNzPSJwaC1zZWN0aW9uLXRpdGxlIj5QYWdyaW5kaW7El3Mga2F0ZWdvcmlqb3M8L2gyPgogIDxkaXYgY2xhc3M9InBoLWNhdC1ncmlkIj4KICAgIDxhIGhyZWY9Ii9rYXRlZ29yaWphL3N1bmltcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PHNwYW4gY2xhc3M9InBoLWNhdC1waCI+8J+Qtjwvc3Bhbj48c3BhbiBjbGFzcz0icGgtY2F0LW5hbWUiPsWgdW5pbXM8L3NwYW4+PC9hPjxhIGhyZWY9Ii9rYXRlZ29yaWphL2thdGVtcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PHNwYW4gY2xhc3M9InBoLWNhdC1waCI+8J+QsTwvc3Bhbj48c3BhbiBjbGFzcz0icGgtY2F0LW5hbWUiPkthdMSXbXM8L3NwYW4+PC9hPjxhIGhyZWY9Ii9rYXRlZ29yaWphL2dyYXV6aWthbXMvIiBjbGFzcz0icGgtY2F0LWNhcmQiPjxzcGFuIGNsYXNzPSJwaC1jYXQtcGgiPvCfkLk8L3NwYW4+PHNwYW4gY2xhc3M9InBoLWNhdC1uYW1lIj5HcmF1xb5pa2Ftczwvc3Bhbj48L2E+PGEgaHJlZj0iL2thdGVnb3JpamEvcGF1a3NjaWFtcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PHNwYW4gY2xhc3M9InBoLWNhdC1waCI+8J+mnDwvc3Bhbj48c3BhbiBjbGFzcz0icGgtY2F0LW5hbWUiPlBhdWvFocSNaWFtczwvc3Bhbj48L2E+PGEgaHJlZj0iL2thdGVnb3JpamEvenV2aW1zLyIgY2xhc3M9InBoLWNhdC1jYXJkIj48c3BhbiBjbGFzcz0icGgtY2F0LXBoIj7wn5CgPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1jYXQtbmFtZSI+xb11dmltczwvc3Bhbj48L2E+CiAgPC9kaXY+CjwvZGl2PgoKPHN0eWxlPgovKiAtLS0tIEhFUk8gLS0tLSAqLwoucGgtaGVyb3sKICBiYWNrZ3JvdW5kOmxpbmVhci1ncmFkaWVudCgxMzVkZWcsIzJENUYzRiAwJSwjM2Q3YTUyIDEwMCUpOwogIGJvcmRlci1yYWRpdXM6MTJweDsKICBtYXJnaW46MCAwIDQwcHg7CiAgbWluLWhlaWdodDo0MDBweDsKICBkaXNwbGF5OmZsZXg7CiAgYWxpZ24taXRlbXM6Y2VudGVyOwogIHBvc2l0aW9uOnJlbGF0aXZlOwogIG92ZXJmbG93OmhpZGRlbjsKfQovKiBwbGFjZWhvbGRlciBwYXN0YWJhOiBjaWEgYnVzIDE2MDB4NjQwIG51b3RyYXVrYSAoZm9ubyBpbWcpLiBUZWtzdGFzIGthaXJlamUuICovCi5waC1oZXJvLWlubmVye3BhZGRpbmc6NDhweCA1NnB4O21heC13aWR0aDo2NDBweDt9Ci5waC1oZXJvLXRleHQgaDF7CiAgY29sb3I6I2ZmZiAhaW1wb3J0YW50OwogIGZvbnQtc2l6ZToyLjZyZW07CiAgbGluZS1oZWlnaHQ6MS4xNTsKICBtYXJnaW46MCAwIDE4cHg7CiAgZm9udC13ZWlnaHQ6ODAwOwp9Ci5waC1oZXJvLXRleHQgcHsKICBjb2xvcjojRUFGM0U4OwogIGZvbnQtc2l6ZToxLjEycmVtOwogIGxpbmUtaGVpZ2h0OjEuNTsKICBtYXJnaW46MCAwIDI4cHg7Cn0KLnBoLWhlcm8tY3Rhe2Rpc3BsYXk6ZmxleDtnYXA6MTRweDthbGlnbi1pdGVtczpjZW50ZXI7ZmxleC13cmFwOndyYXA7fQoucGgtYnRuLXByaW1hcnl7CiAgZGlzcGxheTppbmxpbmUtYmxvY2s7CiAgYmFja2dyb3VuZDojZmZmOwogIGNvbG9yOiMyRDVGM0YgIWltcG9ydGFudDsKICBmb250LXdlaWdodDo3MDA7CiAgcGFkZGluZzoxNHB4IDI4cHg7CiAgYm9yZGVyLXJhZGl1czo4cHg7CiAgdGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDsKICB0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2U7Cn0KLnBoLWJ0bi1wcmltYXJ5OmhvdmVye2JhY2tncm91bmQ6I0Y3RkJGNjt0cmFuc2Zvcm06dHJhbnNsYXRlWSgtMXB4KTtib3gtc2hhZG93OjAgNHB4IDE0cHggcmdiYSgwLDAsMCwuMTUpO30KLnBoLWJ0bi1naG9zdHsKICBkaXNwbGF5OmlubGluZS1ibG9jazsKICBjb2xvcjojZmZmICFpbXBvcnRhbnQ7CiAgZm9udC13ZWlnaHQ6NjAwOwogIHBhZGRpbmc6MTRweCAyMHB4OwogIGJvcmRlcjoxLjVweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LC42KTsKICBib3JkZXItcmFkaXVzOjhweDsKICB0ZXh0LWRlY29yYXRpb246bm9uZSAhaW1wb3J0YW50OwogIHRyYW5zaXRpb246YWxsIC4xNXMgZWFzZTsKfQoucGgtYnRuLWdob3N0OmhvdmVye2JvcmRlci1jb2xvcjojZmZmO2JhY2tncm91bmQ6cmdiYSgyNTUsMjU1LDI1NSwuMSk7fQoKLyogLS0tLSBTRUtDSUpBIC0tLS0gKi8KLnBoLXNlY3Rpb257bWFyZ2luOjAgMCA0MHB4O30KLnBoLXNlY3Rpb24tdGl0bGV7Zm9udC1zaXplOjEuNnJlbTtmb250LXdlaWdodDo3MDA7Y29sb3I6IzFmMjkzNzttYXJnaW46MCAwIDIwcHg7fQoKLyogLS0tLSBLQVRFR09SSUpVIEdSSUQgLS0tLSAqLwoucGgtY2F0LWdyaWR7CiAgZGlzcGxheTpncmlkICFpbXBvcnRhbnQ7CiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCg1LG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7CiAgZ2FwOjE2cHggIWltcG9ydGFudDsKfQoucGgtY2F0LWdyaWQgLnBoLWNhdC1jYXJkewogIGRpc3BsYXk6ZmxleCAhaW1wb3J0YW50OwogIGZsZXgtZGlyZWN0aW9uOmNvbHVtbiAhaW1wb3J0YW50OwogIGFsaWduLWl0ZW1zOmNlbnRlciAhaW1wb3J0YW50OwogIGp1c3RpZnktY29udGVudDpjZW50ZXIgIWltcG9ydGFudDsKICBnYXA6MTJweCAhaW1wb3J0YW50OwogIHBhZGRpbmc6MjhweCAxNnB4ICFpbXBvcnRhbnQ7CiAgYmFja2dyb3VuZDojZmZmICFpbXBvcnRhbnQ7CiAgYm9yZGVyOjFweCBzb2xpZCAjRTVFN0VCICFpbXBvcnRhbnQ7CiAgYm9yZGVyLXJhZGl1czoxMHB4ICFpbXBvcnRhbnQ7CiAgdGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDsKICB0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2UgIWltcG9ydGFudDsKfQoucGgtY2F0LWdyaWQgLnBoLWNhdC1jYXJkOmhvdmVyewogIGJvcmRlci1jb2xvcjojMkQ1RjNGICFpbXBvcnRhbnQ7CiAgYmFja2dyb3VuZDojRjdGQkY2ICFpbXBvcnRhbnQ7CiAgdHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTNweCkgIWltcG9ydGFudDsKICBib3gtc2hhZG93OjAgNnB4IDE2cHggcmdiYSg0NSw5NSw2MywuMTIpICFpbXBvcnRhbnQ7Cn0KLyogcGxhY2Vob2xkZXIgaWtvbmEgLSBjaWEgYnVzIDQwMHg0MDAgbnVvdHJhdWthICovCi5waC1jYXQtZ3JpZCAucGgtY2F0LXBoewogIGZvbnQtc2l6ZToyLjZyZW0gIWltcG9ydGFudDsKICB3aWR0aDo3MnB4O2hlaWdodDo3MnB4OwogIGRpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjsKICBiYWNrZ3JvdW5kOiNFQUYzRTg7CiAgYm9yZGVyLXJhZGl1czo1MCU7Cn0KLnBoLWNhdC1ncmlkIC5waC1jYXQtbmFtZXsKICBmb250LXNpemU6MS4wNXJlbSAhaW1wb3J0YW50OwogIGZvbnQtd2VpZ2h0OjcwMCAhaW1wb3J0YW50OwogIGNvbG9yOiMyRDVGM0YgIWltcG9ydGFudDsKfQpAbWVkaWEobWF4LXdpZHRoOjkwMHB4KXsKICAucGgtY2F0LWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgzLG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7fQogIC5waC1oZXJvLXRleHQgaDF7Zm9udC1zaXplOjJyZW07fQogIC5waC1oZXJvLWlubmVye3BhZGRpbmc6MzZweCAyOHB4O30KfQpAbWVkaWEobWF4LXdpZHRoOjYwMHB4KXsKICAucGgtY2F0LWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7fQogIC5waC1oZXJve21pbi1oZWlnaHQ6YXV0bzt9CiAgLnBoLWhlcm8tdGV4dCBoMXtmb250LXNpemU6MS43cmVtO30KfQo8L3N0eWxlPgo=","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'h1',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 50 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:55000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  // ar egzistuoja pagrindinis test puslapis?
  const exist=get('/wp-json/wp/v2/pages?slug=pagrindinis-test&status=any&_fields=id');
  let existId=0; try{ const a=JSON.parse(exist); if(Array.isArray(a)&&a.length) existId=a[0].id; }catch(e){}
  let pageId=existId;
  if(existId){ api('/wp-json/wp/v2/pages/'+existId,'POST',{title:'Pagrindinis (test)',content:BODY,status:'publish'}); out.action='updated'; }
  else { const c=api('/wp-json/wp/v2/pages','POST',{title:'Pagrindinis (test)',slug:'pagrindinis-test',content:BODY,status:'publish'}); out.action='created'; try{ pageId=JSON.parse(c).id; }catch(e){} }
  out.pageId=pageId;
  const html=get('/pagrindinis-test/?nc='+Date.now());
  out.http=code('/pagrindinis-test/');
  out.h1=(html.match(/<h1[\s>]/gi)||[]).length;
  out.hero=html.indexOf('Prekės augintiniui pagal realų poreikį')>=0;
  out.cat_cards=(html.match(/ph-cat-card"/gi)||[]).length;
  out.btn_primary=html.indexOf('ph-btn-primary')>=0;
  out.btn_ghost=html.indexOf('ph-btn-ghost')>=0;
  // desktop + mobile screenshot
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  // desktop
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1000} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3000);
  // JS patikra kategoriju grid
  out.gridInfo = await page.evaluate(()=>{
    const g=document.querySelector('.ph-cat-grid');
    if(!g) return {found:false};
    const cards=[...g.querySelectorAll('.ph-cat-card')];
    const lefts=[...new Set(cards.map(c=>Math.round(c.getBoundingClientRect().left)))];
    return {found:true, display:getComputedStyle(g).display, cardCount:cards.length, cols:lefts.length};
  });
  putBin('home1_desktop.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1000} }));
  // mobile
  const ctxM = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pageM = await ctxM.newPage();
  await pageM.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await pageM.waitForTimeout(3000);
  putBin('home1_mobile.png', await pageM.screenshot({ fullPage:false, clip:{x:0,y:0,width:390,height:1400} }));
  await browser.close();
  putFile('mkhome1.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
