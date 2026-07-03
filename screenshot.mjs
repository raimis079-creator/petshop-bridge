import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ni',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbni.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbni.json "'+url+'"',{encoding:'utf8'}); }
(async()=>{
  var out={requests:[], console_errors:[]};
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    const p=await c.newPage();
    p.on('console', msg=>{ if(msg.type()==='error') out.console_errors.push(msg.text().slice(0,200)); });
    p.on('response', async (res)=>{
      var url = res.url();
      if (url.includes('admin-ajax.php') || url.includes('wcan')) {
        try{
          var body = await res.text();
          out.requests.push({url:url.slice(0,150), status:res.status(), body_len:body.length, body_snippet:body.slice(0,500)});
        }catch(e){}
      }
    });
    await p.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(4000);
    var links = await p.$$('a');
    for (var l of links){
      var txt = await l.textContent();
      if (txt && txt.trim() === 'Uždaras tualetas / namelis'){ await l.click(); break; }
    }
    await p.waitForTimeout(6000);
    await b.close();
  }catch(e){ out.err=e.message.slice(0,150); }
  commitB64('network_inspect.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log('requests:', out.requests.length, 'console_errors:', out.console_errors.length);
})();
