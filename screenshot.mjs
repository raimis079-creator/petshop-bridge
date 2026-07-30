import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}

const OUT={pages:[],httpReqs:[],htmlHits:[],notes:[]};
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));

const PAGES=[
 ['home','https://dev.avesa.lt/'],
 ['product','https://dev.avesa.lt/product/exclusion-hypoallergenic-sausas-sunu-maistas-su-arkliena-ir-bulvemis-m-l-12-kg/'],
 ['kategorija','https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/'],
 ['myaccount','https://dev.avesa.lt/my-account/']
];

(async()=>{
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();

  // gaudom VISAS http:// (ne https) uzklausas
  p.on('request',r=>{ const u=r.url(); if(/^http:\/\//i.test(u)) OUT.httpReqs.push({u:u.slice(0,220),type:r.resourceType()}); });
  p.on('console',m=>{ const t=m.text(); if(/[Mm]ixed [Cc]ontent|insecure/.test(t)) OUT.notes.push(t.slice(0,240)); });

  for(const [name,url] of PAGES){
    const before=OUT.httpReqs.length;
    try{
      await p.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
      await wait(2500);
      const html=await p.content();
      // ieskom http:// nuorodu SOURCE HTML'e (src/href/url())
      const re=/(?:src|href)=["']http:\/\/[^"']+["']|url\(\s*['"]?http:\/\/[^)'"]+/gi;
      const hits=[...new Set((html.match(re)||[]).map(x=>x.slice(0,200)))];
      OUT.pages.push({name,url,status:'OK',newHttpReqs:OUT.httpReqs.length-before,htmlHitCount:hits.length});
      if(hits.length) OUT.htmlHits.push({page:name,hits:hits.slice(0,15)});
    }catch(e){ OUT.pages.push({name,url,status:'ERR',e:String(e).slice(0,160)}); }
  }
 }catch(e){ OUT.notes.push('LUZO: '+String(e).slice(0,240)); }
 try{ if(br) await br.close(); }catch(e){}

 // dedupe http requests
 const seen=new Set(); OUT.httpReqs=OUT.httpReqs.filter(r=>{ if(seen.has(r.u))return false; seen.add(r.u); return true; }).slice(0,40);

 putB64('mc.json', Buffer.from(JSON.stringify(OUT,null,1)).toString('base64'));
 console.log('done');
})();
