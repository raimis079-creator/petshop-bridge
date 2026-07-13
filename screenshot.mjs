import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<4;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));const r=execSync('curl -s --max-time 45 -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 2');}return false;}
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
let out='';const L=s=>{out+=s+'\n';};
const BASE='https://dev.avesa.lt';
(async()=>{try{
  const b=await chromium.launch({args:['--no-sandbox']});
  const d=await b.newContext({viewport:{width:1000,height:900},ignoreHTTPSErrors:true,userAgent:'Mozilla/5.0 fresh'});
  const p=await d.newPage();
  await p.setExtraHTTPHeaders({'Cache-Control':'no-cache','Pragma':'no-cache'});
  await p.goto(BASE+'/product/susidek-konservu-rinkini-sunims/?ts='+Date.now(),{waitUntil:'domcontentloaded',timeout:50000});
  await p.waitForTimeout(6500);
  const r=await p.evaluate(()=>{
    var forms=[...document.querySelectorAll('.psc-form')].filter(f=>f.style.display!=='none');
    if(!forms.length) return {err:'no active form'};
    var imgs=[...forms[0].querySelectorAll('.mnm_child_product_images img')].filter(i=>i.offsetParent!==null);
    var wraps=[...forms[0].querySelectorAll('.mnm_child_product_images')].filter(i=>i.offsetParent!==null);
    return {
      imgs:imgs.slice(0,7).map(i=>{var b=i.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height),src:(i.src||'').split('/').pop().slice(0,40)};}),
      wraps:wraps.slice(0,3).map(w=>{var b=w.getBoundingClientRect();return {w:Math.round(b.width),h:Math.round(b.height)};}),
      snippet_present: document.getElementById('ps-img-uniform')?'YES':'NO'
    };
  });
  L('server rezultatas: '+JSON.stringify(r,null,2));
  // scroll to 4th visible item to match user screenshot area
  await p.evaluate(()=>{
    var f=[...document.querySelectorAll('.psc-form')].filter(x=>x.style.display!=='none')[0];
    if(!f)return;
    var imgs=[...f.querySelectorAll('.mnm_child_product_images')];
    if(imgs[3])imgs[3].scrollIntoView({block:'start'});
  });
  await p.waitForTimeout(1500);
  putBinary('box_fresh.png', await p.screenshot()); L('shot ok');
  await d.close(); await b.close();
}catch(e){L('!!! '+e);}
finally{ putText('_boxfresh.txt',out); }
})();
