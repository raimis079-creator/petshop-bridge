import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:50000});
  await p.waitForTimeout(6000);
  const r=await p.evaluate(()=>{
    function chain(el){var a=[];var n=el;for(var i=0;i<7&&n&&n.tagName;i++){var s=n.tagName.toLowerCase();if(typeof n.className==='string'&&n.className.trim())s+='.'+n.className.trim().split(/\s+/).slice(0,4).join('.');a.unshift(s);n=n.parentElement;}return a.join(' > ');}
    function vis(el){return el && el.offsetParent!==null && el.getBoundingClientRect().height>0;}
    var res=[];
    var all=document.querySelectorAll('*');
    for(var i=0;i<all.length;i++){
      var el=all[i];
      if(el.children.length!==0) continue; // leaf only
      if(!/kad tęstumėte/i.test(el.textContent||'')) continue;
      if(!vis(el)) continue;
      res.push({chain:chain(el), y:Math.round(el.getBoundingClientRect().top+window.scrollY), txt:(el.textContent||'').replace(/\s+/g,' ').slice(0,45)});
    }
    return res;
  });
  L(JSON.stringify(r,null,2));
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_msgfind.txt',out); }
})();
