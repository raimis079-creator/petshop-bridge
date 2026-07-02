import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'c2',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbc2.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbc2.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:30000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34260"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/jautrus-virskinimas/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const p=await c.newPage();
    await p.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await p.waitForTimeout(3000);
    out.faq_details_dom = await p.evaluate(()=> document.querySelectorAll('.psc-sol-faq details').length);
    out.faq_summaries = await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-sol-faq summary')).map(function(s){return s.textContent.trim().slice(0,45);}));
    // add_to_cart lokacijos: ar main turinyje ar footer
    out.addcart_in_main = await p.evaluate(()=>{ var main=document.querySelector('main, .page-content, article'); if(!main) return -1; return main.querySelectorAll('.add_to_cart_button, [class*="add_to_cart"]').length; });
    out.addcart_in_footer = await p.evaluate(()=>{ var f=document.querySelector('footer'); if(!f) return -1; return f.querySelectorAll('.add_to_cart_button, [class*="add_to_cart"]').length; });
    out.footer_hidden = await p.evaluate(()=>{ var f=document.querySelector('footer .footer-widgets.footer-1'); return f?getComputedStyle(f).display:'nera'; });
    out.krypt_grid_addcart = await p.evaluate(()=>{ var g=document.querySelector('.psc-sol-krypt-grid'); if(!g) return -1; return g.querySelectorAll('.add_to_cart_button, [class*="add_to_cart"]').length; });
    await b.close();
  }catch(e){ out.err=e.message.slice(0,200); }
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34260"');
  commit('check2.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
})();
