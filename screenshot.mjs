import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cb2.json',JSON.stringify(body)); try{ execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb2.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
(async()=>{
  const browser=await chromium.launch({args:['--no-sandbox']});
  const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1280,height:1100}});
  const page=await ctx.newPage();
  await page.goto('https://dev.avesa.lt/product/susirink-konservu-rinkini-sunims-pats/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000}).catch(()=>{});
  await page.waitForTimeout(8000);
  const probe = await page.evaluate(()=>{
    // Randu KUR yra "Please select" - ar matomame elemente, ar script/template
    var locations = [];
    function walk(node){
      if(node.nodeType===3){ // text node
        if(node.textContent.includes('Please select')){
          var parent = node.parentElement;
          var inScript = false, el = parent;
          while(el){ if(el.tagName==='SCRIPT'||el.tagName==='TEMPLATE'){inScript=true;break;} el=el.parentElement; }
          // Ar matomas?
          var visible = false;
          if(parent){
            var rect = parent.getBoundingClientRect();
            var st = window.getComputedStyle(parent);
            visible = st.display!=='none' && st.visibility!=='hidden' && rect.width>0 && rect.height>0;
          }
          locations.push({
            parentTag: parent?.tagName,
            parentClass: (parent?.className||'').slice(0,40),
            inScriptOrTemplate: inScript,
            visible: visible
          });
        }
      }
      for(var i=0;i<node.childNodes.length;i++) walk(node.childNodes[i]);
    }
    walk(document.body);
    return {locations: locations.slice(0,8), total: locations.length};
  });
  commit('please_loc.json', JSON.stringify(probe,null,1));
  console.log(JSON.stringify(probe).slice(0,700));
  await ctx.close(); await browser.close();
})();
