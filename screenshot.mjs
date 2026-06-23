import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const isBuf=Buffer.isBuffer(obj);
  const b64=isBuf?obj.toString('base64'):Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:200000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782199296";
const out={};
try{
  const html=fs.readFileSync('josidog_desc.html','utf8');
  // 1) backup esamo (saugiklis)
  const before=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/17947?_fields=id,permalink,description"`,{encoding:'utf8',env,maxBuffer:20000000}));
  out.before_desc_len=(before.description||'').length;
  out.permalink=before.permalink;
  // 2) irasyti TIK description
  fs.writeFileSync('/tmp/upd.json',JSON.stringify({description:html}));
  const upd=execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X PUT -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/wc/v3/products/17947"`,{encoding:'utf8',env,maxBuffer:20000000});
  const u=JSON.parse(upd); out.after_desc_len=(u.description||'').length; out.wrote=true;
  execSync('sleep 2');
  // 3) screenshot su ?ps_desc=1
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await (await browser.newContext({viewport:{width:1200,height:1500},ignoreHTTPSErrors:true})).newPage();
  const url=(before.permalink||'https://dev.avesa.lt/?p=17947')+(before.permalink.includes('?')?'&':'?')+'ps_desc=1';
  out.url=url;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000}); await page.waitForTimeout(2200);
  try{ const tl=await page.$('li.description_tab a, a[href="#tab-description"]'); if(tl){await tl.click();await page.waitForTimeout(700);} }catch(e){}
  out.dom=await page.evaluate(()=>{
    const dets=[...document.querySelectorAll('.ps-desc-acc details')];
    return {titles:dets.map(d=>d.querySelector('summary').textContent.trim()), open:dets.map(d=>d.hasAttribute('open')), has_table:!!document.querySelector('#tab-description table')};
  });
  out.png=putResult('josidog_test_'+TS+'.png', await page.screenshot({fullPage:true}));
  await browser.close();
}catch(e){ out.fatal=e.message.slice(0,200); }
putResult('josidog_meta_'+TS+'.json', JSON.stringify(out));
