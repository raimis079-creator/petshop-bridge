import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putB64(name, b64){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:b64};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
// get permalink
execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/26399?context=edit&_fields=link,slug" -o /tmp/l.json`,{env});
const link=JSON.parse(fs.readFileSync('/tmp/l.json','utf8')).link;
const url=link+(link.includes('?')?'&':'?')+'ps_desc=1';
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:2400}});
const page=await ctx.newPage();
let log={url};
try{
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(4500);
  // force-open any details/accordions and reveal feeding section
  await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelectorAll('.ps-acc__panel,.accordion-inner,.uael-accordion-content,[class*="panel"]').forEach(p=>{p.style.display='block';p.style.height='auto';p.style.maxHeight='none';p.style.overflow='visible';});});
  await page.waitForTimeout(800);
  // find the Šėrimo heading text and scroll near it
  const found=await page.evaluate(()=>{const els=[...document.querySelectorAll('*')];const h=els.find(e=>/\u0160\u0117rimo instrukcija/.test(e.textContent||'')&&e.children.length<3);if(h){h.scrollIntoView({block:'center'});return true;}return false;});
  log.serimo_heading_found=found;
  // detect a feeding-table cell on page
  log.has_5_6_cell=await page.evaluate(()=>/410\u2013480 g/.test(document.body.innerText));
  log.has_table=await page.evaluate(()=>{const t=[...document.querySelectorAll('table')];return t.some(x=>/Am\u017eius/.test(x.innerText));});
  await page.waitForTimeout(400);
  const png=await page.screenshot({fullPage:true});
  const b64=png.toString('base64');
  log.png_kb=Math.round(b64.length*0.75/1024);
  log.put=putB64('sensijunior_render.png.b64', b64);
}catch(e){log.ERR=String(e).slice(0,200);}
await browser.close();
fs.writeFileSync('/tmp/log.json',JSON.stringify(log));
const lb=Buffer.from(JSON.stringify(log,null,2),'utf8').toString('base64');
putB64('waveV_log.json.b64', lb);
console.log("DONE", JSON.stringify(log));
