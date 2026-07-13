import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1280,height:1000},ignoreHTTPSErrors:true});
  const p=await d.newPage();
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await p.waitForTimeout(5000);
  // find visible add-to-cart button text
  const btns=await p.evaluate(()=>{
    const res=[];
    document.querySelectorAll('button, .button, input[type=submit], a.button').forEach(el=>{
      const t=(el.innerText||el.value||'').trim();
      if(t && (/cart|krepšel|add|pridėti|pasirink|išvalyt|clear|select/i.test(t))) res.push(t);
    });
    return [...new Set(res)];
  });
  L('matomi mygtukai: '+JSON.stringify(btns));
  // scroll to add to cart
  await p.evaluate(()=>{const b=[...document.querySelectorAll('button,.button')].find(e=>/cart|krepšel/i.test(e.innerText||''));if(b)b.scrollIntoView({block:'center'});});
  await p.waitForTimeout(1000);
  putBinary('box_addtocart.png', await p.screenshot()); L('shot ok');
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boxbtn.txt',out); }
})();
