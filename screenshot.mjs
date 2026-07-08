import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fq',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" -L "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  // 1+2. Visos apie-mus turinio nuorodos - HTTP kodai
  const links=['/kategorija/sunims/','/kategorija/katems/','/pasiulymai/','/suns-serimo-lentele-gramais/'];
  out.links={}; for(const l of links) out.links[l]=code(l);
  // 3. Footer kontaktai vs puslapio - istraukiam abu is HTML
  const html=get('/apie-mus/?nc='+Date.now());
  const footer_idx=html.indexOf('footer-2');
  const footer=footer_idx>=0?html.slice(footer_idx,footer_idx+3000):'';
  const foot_tel=(footer.match(/\+370[\d\s]+/g)||[]);
  const foot_email=(footer.match(/[\w.-]+@[\w.-]+/g)||[]);
  const foot_hours=(footer.match(/(?:I|V)[–-]?V?\s*\d{1,2}:\d{2}[–-]\d{1,2}:\d{2}/g)||[]);
  out.footer_tel=foot_tel; out.footer_email=foot_email; out.footer_hours=foot_hours;
  // puslapio kontaktai (iš content)
  const content_idx=html.indexOf('Telefonas:');
  const content=content_idx>=0?html.slice(content_idx,content_idx+500):'';
  out.page_tel=(content.match(/\+370[\d\s]+/g)||[]);
  out.page_email=(content.match(/[\w.-]+@[\w.-]+/g)||[]);
  out.page_hours=(content.match(/I[–-]V\s*\d{1,2}:\d{2}[–-]\d{1,2}:\d{2}/g)||[]);
  // 4. Mobile screenshot
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:390,height:844}, deviceScaleFactor:2 });
  const page = await ctx.newPage();
  await page.goto(DEV+'/apie-mus/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3000);
  // Hero aukstis
  const heroHeight = await page.evaluate(()=>{ const el=document.querySelector('.pa-hero'); return el?el.offsetHeight:0; });
  out.mobile_hero_height=heroHeight;
  const buf = await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:390,height:900} });
  putBin('apie_mus_mobile.png', buf);
  await browser.close();
  putFile('finalqa.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
