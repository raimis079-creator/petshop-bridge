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
    function chain(el){var a=[];var n=el;for(var i=0;i<5&&n&&n.tagName;i++){var s=n.tagName.toLowerCase();if(typeof n.className==='string'&&n.className.trim())s+='.'+n.className.trim().split(/\s+/).slice(0,4).join('.');a.unshift(s);n=n.parentElement;}return a.join(' > ');}
    // find visible item images in the active psc-form
    var forms=[...document.querySelectorAll('.psc-form')].filter(f=>f.style.display!=='none');
    var active=forms[0];
    if(!active) return {err:'no active form'};
    var imgs=[...active.querySelectorAll('img')].filter(i=>i.offsetParent!==null).slice(0,6);
    return {
      form_class: active.className,
      imgs: imgs.map(i=>{
        var b=i.getBoundingClientRect();
        return {
          src: (i.currentSrc||i.src||'').split('/').pop(),
          natW: i.naturalWidth, natH: i.naturalHeight,
          w: Math.round(b.width), h: Math.round(b.height),
          chain: chain(i)
        };
      }),
      row_container: chain(active.querySelector('img'))
    };
  });
  L(JSON.stringify(r,null,2));
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boximgs.txt',out); }
})();
