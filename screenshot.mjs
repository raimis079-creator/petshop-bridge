import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ec',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sk -u "$WPU:$WPP" -L --max-time 20 "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:22000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
(async()=>{
  let out='';
  // RAW HTML source h1
  for(const u of ['/bokseris/','/kolis/','/josera-sunu-maistas/']){
    const html = get(u);
    const m = html.match(/<h1\b[^>]*petshop-auto-h1[^>]*>([\s\S]*?)<\/h1>/i);
    out += u+'\n';
    out += '  RAW source: '+(m?JSON.stringify(m[1]):'nerasta')+'\n';
    // ar yra dvigubas encode
    if(m){
      out += '  turi &amp;#: '+m[1].includes('&amp;#')+'\n';
      out += '  turi &#8211;: '+m[1].includes('&#8211;')+'\n';
    }
  }
  out += '\n=== KAIP MATO NARSYKLE (innerText) ===\n';
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:900} });
  for(const u of ['/bokseris/','/kolis/','/josera-sunu-maistas/','/hipoalerginis-maistas/']){
    const pg = await ctx.newPage();
    await pg.goto(DEV+u+'?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:45000 });
    await pg.waitForTimeout(2000);
    const t = await pg.evaluate(()=>{
      const h = document.querySelector('h1');
      return h ? { text: h.innerText, html: h.innerHTML.slice(0,120) } : null;
    });
    out += u+'\n  innerText: '+(t?JSON.stringify(t.text):'nera')+'\n';
    if(t) out += '  innerHTML: '+JSON.stringify(t.html)+'\n';
    await pg.close();
  }
  await ctx.close(); await browser.close();
  putFile('entcheck.txt', out);
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
