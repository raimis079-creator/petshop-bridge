import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const BODY=Buffer.from("PHN0eWxlPi5waC1oZXJve2JhY2tncm91bmQ6bGluZWFyLWdyYWRpZW50KDEzNWRlZywjMkQ1RjNGIDAlLCMzZDdhNTIgMTAwJSk7Ym9yZGVyLXJhZGl1czoxMnB4O21hcmdpbjowIDAgNDBweDttaW4taGVpZ2h0OjQwMHB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7cG9zaXRpb246cmVsYXRpdmU7b3ZlcmZsb3c6aGlkZGVuO30ucGgtaGVyby1pbm5lcntwYWRkaW5nOjQ4cHggNTZweDttYXgtd2lkdGg6NjQwcHg7fS5waC1oZXJvLXRleHQgaDF7Y29sb3I6I2ZmZiAhaW1wb3J0YW50O2ZvbnQtc2l6ZToyLjZyZW07bGluZS1oZWlnaHQ6MS4xNTttYXJnaW46MCAwIDE4cHg7Zm9udC13ZWlnaHQ6ODAwO30ucGgtaGVyby10ZXh0IHB7Y29sb3I6I0VBRjNFODtmb250LXNpemU6MS4xMnJlbTtsaW5lLWhlaWdodDoxLjU7bWFyZ2luOjAgMCAyOHB4O30ucGgtaGVyby1jdGF7ZGlzcGxheTpmbGV4O2dhcDoxNHB4O2FsaWduLWl0ZW1zOmNlbnRlcjtmbGV4LXdyYXA6d3JhcDt9LnBoLWJ0bi1wcmltYXJ5e2Rpc3BsYXk6aW5saW5lLWJsb2NrO2JhY2tncm91bmQ6I2ZmZjtjb2xvcjojMkQ1RjNGICFpbXBvcnRhbnQ7Zm9udC13ZWlnaHQ6NzAwO3BhZGRpbmc6MTRweCAyOHB4O2JvcmRlci1yYWRpdXM6OHB4O3RleHQtZGVjb3JhdGlvbjpub25lICFpbXBvcnRhbnQ7dHJhbnNpdGlvbjphbGwgLjE1cyBlYXNlO30ucGgtYnRuLXByaW1hcnk6aG92ZXJ7YmFja2dyb3VuZDojRjdGQkY2O3RyYW5zZm9ybTp0cmFuc2xhdGVZKC0xcHgpO2JveC1zaGFkb3c6MCA0cHggMTRweCByZ2JhKDAsMCwwLC4xNSk7fS5waC1idG4tZ2hvc3R7ZGlzcGxheTppbmxpbmUtYmxvY2s7Y29sb3I6I2ZmZiAhaW1wb3J0YW50O2ZvbnQtd2VpZ2h0OjYwMDtwYWRkaW5nOjE0cHggMjBweDtib3JkZXI6MS41cHggc29saWQgcmdiYSgyNTUsMjU1LDI1NSwuNik7Ym9yZGVyLXJhZGl1czo4cHg7dGV4dC1kZWNvcmF0aW9uOm5vbmUgIWltcG9ydGFudDt0cmFuc2l0aW9uOmFsbCAuMTVzIGVhc2U7fS5waC1idG4tZ2hvc3Q6aG92ZXJ7Ym9yZGVyLWNvbG9yOiNmZmY7YmFja2dyb3VuZDpyZ2JhKDI1NSwyNTUsMjU1LC4xKTt9LnBoLXNlY3Rpb257bWFyZ2luOjAgMCA0MHB4O30ucGgtc2VjdGlvbi10aXRsZXtmb250LXNpemU6MS42cmVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojMWYyOTM3O21hcmdpbjowIDAgMjBweDt9LnBoLWNhdC1ncmlke2Rpc3BsYXk6Z3JpZCAhaW1wb3J0YW50O2dyaWQtdGVtcGxhdGUtY29sdW1uczpyZXBlYXQoNSxtaW5tYXgoMCwxZnIpKSAhaW1wb3J0YW50O2dhcDoxNnB4ICFpbXBvcnRhbnQ7fS5waC1jYXQtZ3JpZCAucGgtY2F0LWNhcmR7ZGlzcGxheTpmbGV4ICFpbXBvcnRhbnQ7ZmxleC1kaXJlY3Rpb246Y29sdW1uICFpbXBvcnRhbnQ7YWxpZ24taXRlbXM6Y2VudGVyICFpbXBvcnRhbnQ7anVzdGlmeS1jb250ZW50OmNlbnRlciAhaW1wb3J0YW50O2dhcDoxMnB4ICFpbXBvcnRhbnQ7cGFkZGluZzoyOHB4IDE2cHggIWltcG9ydGFudDtiYWNrZ3JvdW5kOiNmZmYgIWltcG9ydGFudDtib3JkZXI6MXB4IHNvbGlkICNFNUU3RUIgIWltcG9ydGFudDtib3JkZXItcmFkaXVzOjEwcHggIWltcG9ydGFudDt0ZXh0LWRlY29yYXRpb246bm9uZSAhaW1wb3J0YW50O3RyYW5zaXRpb246YWxsIC4xNXMgZWFzZSAhaW1wb3J0YW50O30ucGgtY2F0LWdyaWQgLnBoLWNhdC1jYXJkOmhvdmVye2JvcmRlci1jb2xvcjojMkQ1RjNGICFpbXBvcnRhbnQ7YmFja2dyb3VuZDojRjdGQkY2ICFpbXBvcnRhbnQ7dHJhbnNmb3JtOnRyYW5zbGF0ZVkoLTNweCkgIWltcG9ydGFudDtib3gtc2hhZG93OjAgNnB4IDE2cHggcmdiYSg0NSw5NSw2MywuMTIpICFpbXBvcnRhbnQ7fS5waC1jYXQtZ3JpZCAucGgtY2F0LXBoe2ZvbnQtc2l6ZToyLjZyZW0gIWltcG9ydGFudDt3aWR0aDo3MnB4O2hlaWdodDo3MnB4O2Rpc3BsYXk6ZmxleDthbGlnbi1pdGVtczpjZW50ZXI7anVzdGlmeS1jb250ZW50OmNlbnRlcjtiYWNrZ3JvdW5kOiNFQUYzRTg7Ym9yZGVyLXJhZGl1czo1MCU7fS5waC1jYXQtZ3JpZCAucGgtY2F0LW5hbWV7Zm9udC1zaXplOjEuMDVyZW0gIWltcG9ydGFudDtmb250LXdlaWdodDo3MDAgIWltcG9ydGFudDtjb2xvcjojMkQ1RjNGICFpbXBvcnRhbnQ7fUBtZWRpYShtYXgtd2lkdGg6OTAwcHgpey5waC1jYXQtZ3JpZHtncmlkLXRlbXBsYXRlLWNvbHVtbnM6cmVwZWF0KDMsbWlubWF4KDAsMWZyKSkgIWltcG9ydGFudDt9LnBoLWhlcm8tdGV4dCBoMXtmb250LXNpemU6MnJlbTt9LnBoLWhlcm8taW5uZXJ7cGFkZGluZzozNnB4IDI4cHg7fX1AbWVkaWEobWF4LXdpZHRoOjYwMHB4KXsucGgtY2F0LWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOnJlcGVhdCgyLG1pbm1heCgwLDFmcikpICFpbXBvcnRhbnQ7fS5waC1oZXJve21pbi1oZWlnaHQ6YXV0bzt9LnBoLWhlcm8tdGV4dCBoMXtmb250LXNpemU6MS43cmVtO319PC9zdHlsZT4KCjxkaXYgY2xhc3M9InBoLWhlcm8iPjxkaXYgY2xhc3M9InBoLWhlcm8taW5uZXIiPjxkaXYgY2xhc3M9InBoLWhlcm8tdGV4dCI+PGgxPlByZWvEl3MgYXVnaW50aW5pdWkgcGFnYWwgcmVhbMWzIHBvcmVpa8SvPC9oMT48cD5NYWlzdGFzLCBwcmllxb5pxatyYSBpciBzcHJlbmRpbWFpIMWhdW5pbXMsIGthdMSXbXMgYmVpIGtpdGllbXMgYXVnaW50aW5pYW1zLiBOdW8gMjAxMCBtLiBwYWRlZGFtZSBpxaFzaXJpbmt0aSBuZSBwYWdhbCByZWtsYW3EhSwgbyBwYWdhbCBzdWTEl3TErywgZ2FtaW50b2rEhSBpciBwcmFrdGluxK8gbmF1ZG9qaW3EhS48L3A+PGRpdiBjbGFzcz0icGgtaGVyby1jdGEiPjxhIGhyZWY9Ii9wYXJkdW90dXZlLyIgY2xhc3M9InBoLWJ0bi1wcmltYXJ5Ij5QZXLFvmnFq3LEl3RpIHByZWtlcyDihpI8L2E+PGEgaHJlZj0iL3NwcmVuZGltYWkvIiBjbGFzcz0icGgtYnRuLWdob3N0Ij5SYXN0aSBzcHJlbmRpbcSFIOKGkjwvYT48L2Rpdj48L2Rpdj48L2Rpdj48L2Rpdj4KCjxkaXYgY2xhc3M9InBoLXNlY3Rpb24iPjxoMiBjbGFzcz0icGgtc2VjdGlvbi10aXRsZSI+UGFncmluZGluxJdzIGthdGVnb3Jpam9zPC9oMj48ZGl2IGNsYXNzPSJwaC1jYXQtZ3JpZCI+PGEgaHJlZj0iL2thdGVnb3JpamEvc3VuaW1zLyIgY2xhc3M9InBoLWNhdC1jYXJkIj48c3BhbiBjbGFzcz0icGgtY2F0LXBoIj7wn5C2PC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1jYXQtbmFtZSI+xaB1bmltczwvc3Bhbj48L2E+PGEgaHJlZj0iL2thdGVnb3JpamEva2F0ZW1zLyIgY2xhc3M9InBoLWNhdC1jYXJkIj48c3BhbiBjbGFzcz0icGgtY2F0LXBoIj7wn5CxPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1jYXQtbmFtZSI+S2F0xJdtczwvc3Bhbj48L2E+PGEgaHJlZj0iL2thdGVnb3JpamEvZ3JhdXppa2Ftcy8iIGNsYXNzPSJwaC1jYXQtY2FyZCI+PHNwYW4gY2xhc3M9InBoLWNhdC1waCI+8J+QuTwvc3Bhbj48c3BhbiBjbGFzcz0icGgtY2F0LW5hbWUiPkdyYXXFvmlrYW1zPC9zcGFuPjwvYT48YSBocmVmPSIva2F0ZWdvcmlqYS9wYXVrc2NpYW1zLyIgY2xhc3M9InBoLWNhdC1jYXJkIj48c3BhbiBjbGFzcz0icGgtY2F0LXBoIj7wn6acPC9zcGFuPjxzcGFuIGNsYXNzPSJwaC1jYXQtbmFtZSI+UGF1a8WhxI1pYW1zPC9zcGFuPjwvYT48YSBocmVmPSIva2F0ZWdvcmlqYS96dXZpbXMvIiBjbGFzcz0icGgtY2F0LWNhcmQiPjxzcGFuIGNsYXNzPSJwaC1jYXQtcGgiPvCfkKA8L3NwYW4+PHNwYW4gY2xhc3M9InBoLWNhdC1uYW1lIj7FvXV2aW1zPC9zcGFuPjwvYT48L2Rpdj48L2Rpdj4K","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'h1b',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 50 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:55000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  api('/wp-json/wp/v2/pages/34543','POST',{content:BODY,status:'publish'});
  const html=get('/pagrindinis-test/?nc='+Date.now());
  // ar <p> style viduje?
  const sIdx=html.indexOf('.ph-cat-grid{');
  const chunk=html.slice(sIdx-50,sIdx+200);
  out.p_in_style=(chunk.match(/<\/?p>/gi)||[]).length;
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1000} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3000);
  out.gridInfo = await page.evaluate(()=>{
    const g=document.querySelector('.ph-cat-grid');
    if(!g) return {found:false};
    const cards=[...g.querySelectorAll('.ph-cat-card')];
    const rects=cards.map(c=>{const r=c.getBoundingClientRect();return {left:Math.round(r.left),top:Math.round(r.top)};});
    const lefts=[...new Set(rects.map(r=>r.left))];
    const tops=[...new Set(rects.map(r=>r.top))];
    return {found:true, display:getComputedStyle(g).display, cardCount:cards.length, cols:lefts.length, rows:tops.length};
  });
  // hero patikra
  out.heroInfo = await page.evaluate(()=>{
    const h=document.querySelector('.ph-hero');
    if(!h) return {found:false};
    const cs=getComputedStyle(h);
    return {found:true, display:cs.display, minHeight:cs.minHeight, bg:cs.backgroundImage.slice(0,40)};
  });
  putBin('home1b_desktop.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1000} }));
  const ctxM = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:390,height:844} });
  const pageM = await ctxM.newPage();
  await pageM.goto(DEV+'/pagrindinis-test/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await pageM.waitForTimeout(3000);
  putBin('home1b_mobile.png', await pageM.screenshot({ fullPage:false, clip:{x:0,y:0,width:390,height:1300} }));
  await browser.close();
  putFile('mkhome1b.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
