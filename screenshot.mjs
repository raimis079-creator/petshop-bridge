import { execSync } from "child_process"; import fs from "fs"; import crypto from "crypto";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'check547',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var rb=exec('curl -sk -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/547"');
  var out={}; try{ var j=JSON.parse(rb); out={name:j.name,active:j.active,code_md5:crypto.createHash('md5').update(j.code||'','utf8').digest('hex'), has_v12_css: (j.code||'').indexOf('white-space: normal !important')>=0}; }catch(e){ out={err:e.message}; }
  commitB64('check547_1782928647.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out));
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1300,height:720}});
    const p=await c.newPage();
    await p.goto(BASE+'/?p=34207',{waitUntil:'domcontentloaded'});
    await p.waitForTimeout(4500);
    const buf=await p.screenshot({fullPage:false});
    commitB64('shot_1782928647.png', buf.toString('base64'));
    await b.close(); console.log('shot bytes='+buf.length);
  }catch(e){ console.log('shot EXC:'+e.message); }
})();
