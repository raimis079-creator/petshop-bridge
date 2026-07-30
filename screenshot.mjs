import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const O={};
const wait=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();
  await p.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:60000});
  await wait(2500);
  const html=await p.content();
  // konteksta apie href="http://url"
  const idx=[]; let i=-1;
  while((i=html.indexOf('href="http://url"',i+1))!==-1) idx.push(i);
  O.count=idx.length;
  O.contexts=idx.slice(0,4).map(k=>html.slice(Math.max(0,k-400),k+250).replace(/\s+/g,' '));
  // DOM info apie ta elementa
  O.els=await p.$$eval('a[href="http://url"]', as=>as.map(a=>({
    txt:(a.textContent||'').trim().slice(0,60),
    cls:a.className,
    parentCls:a.parentElement?a.parentElement.className:'',
    gpCls:a.parentElement&&a.parentElement.parentElement?a.parentElement.parentElement.className:'',
    html:a.outerHTML.slice(0,200)
  })));
 }catch(e){ O.err=String(e).slice(0,300); }
 try{ if(br) await br.close(); }catch(e){}
 putB64('nx.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
 console.log('done');
})();
