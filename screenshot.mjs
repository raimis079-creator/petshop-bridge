import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const SITE='https://dev.avesa.lt';
function sh(c){try{return execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s423',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const O={VERSIJA_RUN:'run423-h1'};
const PSL=[
 ['pradzia','/'],
 ['blog_straipsnis','/sunu-veisles/'],
 ['sprendimai_hub','/sprendimai/'],
 ['sprendimas_34260','/?p=34260'],
 ['kategorija_sunims','/sunims/'],
 ['subkategorija','/sunims/sausas-maistas-sunims/'],
 ['preke','/?p=15484'],
 ['duk','/duk/'],
 ['privatumo','/privatumo-politika/'],
 ['augintinio_profilis','/augintinio-profilis/'],
];
try{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true,locale:'lt-LT'});
 const p=await ctx.newPage();
 for(const [vardas,kelias] of PSL){
   const o={kelias};
   try{
     const resp=await p.goto(SITE+kelias,{waitUntil:'domcontentloaded',timeout:60000});
     o.http=resp?resp.status():null;
     await p.waitForTimeout(1200);
     const d=await p.evaluate(()=>{
       function info(sel){ return [...document.querySelectorAll(sel)].map(e=>({
         t:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70),
         cls:(e.className||'').toString().slice(0,45),
         matomas: !!(e.offsetWidth||e.offsetHeight||e.getClientRects().length)
       })); }
       return {
         title: document.title.slice(0,80),
         h1: info('h1'), h2: info('h2').slice(0,4), h3n: document.querySelectorAll('h3').length,
         pirmas_headingas: (function(){ var e=document.querySelector('h1,h2,h3');
           return e?e.tagName+': '+(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60):null; })()
       };
     });
     Object.assign(o,d);
     o.H1_kiekis=d.h1.length;
     o.H1_matomu=d.h1.filter(x=>x.matomas).length;
     o.VERDIKTAS = d.h1.length===0 ? 'NULIS H1'
                 : d.h1.length>1 ? 'KELI H1 ('+d.h1.length+')'
                 : (d.h1[0].t.length<3 ? 'H1 TUSCIAS' : 'OK');
   }catch(e){ o.KLAIDA=String(e).slice(0,120); }
   O[vardas]=o;
 }
 await b.close();
}catch(e){ O.NARSYKLE=String(e).slice(0,300); }
putResult('s423.json', JSON.stringify(O,null,1));
console.log('OK');
