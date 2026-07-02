import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'final',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbfin.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbfin.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={};
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"publish"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  await new Promise(r=>setTimeout(r,1200));
  var url = BASE+'/sprendimai/isrankus-augintinis/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const cD=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1440,height:1000}});
    const pD=await cD.newPage();
    await pD.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pD.waitForTimeout(3000);
    // atidarom pirmą FAQ, kad matytųsi accordion būsena
    await pD.evaluate(()=>{ var d=document.querySelector('.psc-sol-faq details'); if(d) d.setAttribute('open','open'); });
    await pD.waitForTimeout(400);
    const bufD = await pD.screenshot({fullPage:true});
    commitB64('final_desktop.png', bufD.toString('base64'));
    await cD.close();

    const cM=await b.newContext({ignoreHTTPSErrors:true, viewport:{width:390,height:844}, isMobile:true, hasTouch:true});
    const pM=await cM.newPage();
    await pM.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:25000});
    await pM.waitForTimeout(3000);
    const bufM = await pM.screenshot({fullPage:true});
    commitB64('final_mobile.png', bufM.toString('base64'));
    await cM.close();
    await b.close();
  }catch(e){ out.err=e.message.slice(0,200); }
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34254"');
  exec('curl -sk -m 15 -o /dev/null -X POST -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -d \'{"status":"draft"}\' "'+BASE+'/wp-json/wp/v2/pages/34253"');
  commitB64('final_shots.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log('done', JSON.stringify(out));
})();
