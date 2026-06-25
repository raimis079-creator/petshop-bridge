import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putB64(name, b64){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:b64};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
let log={};
try{
  try{ execSync('npx --yes playwright install chromium 2>&1 | tail -2',{encoding:'utf8',timeout:180000}); log.install="ok"; }catch(e){ log.install="skip:"+String(e).slice(0,60); }
  const { chromium } = await import("playwright");
  execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/26399?context=edit&_fields=link" -o /tmp/l.json`,{env});
  const link=JSON.parse(fs.readFileSync('/tmp/l.json','utf8')).link;
  const url=link+(link.includes('?')?'&':'?')+'ps_desc=1'; log.url=url;
  const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:2200}});
  const page=await ctx.newPage();
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:55000});
  await page.waitForTimeout(4500);
  await page.evaluate(()=>{document.querySelectorAll('details').forEach(d=>d.open=true);document.querySelectorAll('[class*="panel"],[class*="content"],[class*="accordion"]').forEach(p=>{try{p.style.display='block';p.style.maxHeight='none';p.style.overflow='visible';}catch(e){}});});
  await page.waitForTimeout(900);
  log.has_5_6_cell=await page.evaluate(()=>/410\u2013480 g/.test(document.body.innerText));
  log.has_age_table=await page.evaluate(()=>[...document.querySelectorAll('table')].some(x=>/Am\u017eius/.test(x.innerText)));
  await page.evaluate(()=>{const els=[...document.querySelectorAll('table')].filter(x=>/Am\u017eius/.test(x.innerText));if(els[0])els[0].scrollIntoView({block:'center'});});
  await page.waitForTimeout(500);
  const png=await page.screenshot({fullPage:true});
  const b64=png.toString('base64'); log.png_kb=Math.round(b64.length*0.75/1024);
  log.put_png=putB64('sensijunior_render.png.b64', b64);
  await browser.close();
}catch(e){ log.ERR=String(e&&e.stack||e).slice(0,300); }
putB64('waveW_log.json.b64', Buffer.from(JSON.stringify(log,null,2),'utf8').toString('base64'));
console.log("DONE");
