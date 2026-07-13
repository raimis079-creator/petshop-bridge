import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1200},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:45000});
  await p.waitForTimeout(4000);
  const info=await p.evaluate(()=>{
    const path=(el)=>{let a=[];let n=el;for(let i=0;i<5&&n&&n.tagName;i++){let s=n.tagName.toLowerCase();if(typeof n.className==='string'&&n.className.trim())s+='.'+n.className.trim().split(/\s+/).slice(0,3).join('.');a.unshift(s);n=n.parentElement;}return a.join(' > ');};
    const out={};
    // the mnm status/message
    const m=document.querySelector('.mnm_message');
    out.message = m ? {path:path(m), y:Math.round(m.getBoundingClientRect().top)} : 'none';
    // footer quantity: NOT inside td
    const q=[...document.querySelectorAll('.quantity')].filter(x=>!x.closest('td'));
    out.footer_qtys = q.map(x=>({path:path(x), y:Math.round(x.getBoundingClientRect().top+window.scrollY)}));
    return out;
  });
  L(JSON.stringify(info,null,2));
  await d.close(); await b.close();
}catch(e){L('ERR '+e);}
finally{ putText('_bd3.txt',out); }
})();
