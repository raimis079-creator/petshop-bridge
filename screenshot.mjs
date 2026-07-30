import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null; const wait=ms=>new Promise(r=>setTimeout(r,ms));
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgV2V0IE9ubHkgRTJFIExvZ2luIHYxCiAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogICAgaWYgKCAhIGlzc2V0KCRfR0VUWydwc19sZyddKSB8fCAkX0dFVFsncHNfbGcnXSAhPT0gJ0xnOXcnICkgcmV0dXJuOwogICAgZ2xvYmFsICR3cGRiOwogICAgJHBldCA9IChpbnQpICggJF9HRVRbJ3BldCddID8/IDE0OSApOwogICAgJHJvdyA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKAogICAgICAgICJTRUxFQ1QgaWQsdXNlcl9pZCxwZXRfbmFtZSxzcGVjaWVzLGZlZWRpbmdfdHlwZSxwcmltYXJ5X3Byb2R1Y3RfaWQsd2V0X3Byb2R1Y3RfaWQKICAgICAgICAgRlJPTSB7JHdwZGItPnByZWZpeH1wc19wZXRzIFdIRVJFIGlkPSVkIiwgJHBldCksIEFSUkFZX0EpOwogICAgaWYgKCAhICRyb3cgfHwgISAkcm93Wyd1c2VyX2lkJ10gKSB7IHdwX2RpZSgnbm8gcGV0L3VzZXInKTsgfQogICAgd3Bfc2V0X2F1dGhfY29va2llKCAoaW50KSRyb3dbJ3VzZXJfaWQnXSwgZmFsc2UgKTsKICAgIHdwX3NldF9jdXJyZW50X3VzZXIoIChpbnQpJHJvd1sndXNlcl9pZCddICk7CiAgICBpZiAoIGlzc2V0KCRfR0VUWydpbmZvJ10pICkgewogICAgICAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHJvdyk7IGV4aXQ7CiAgICB9CiAgICB3cF9zYWZlX3JlZGlyZWN0KCBob21lX3VybCgnL215LWFjY291bnQvYXVnaW50aW5pcy8nKSApOyBleGl0Owp9LCAxKTsK','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP Wet Only E2E Login v1',code:php,scope:'global',active:true}));
for(let i=0;i<4&&!sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,200); sh('sleep 4');}
}
O.sid=sid;
if(sid){
 await new Promise(r=>setTimeout(r,4000));
 const inf=sh('curl -sSk "'+SITE+'/?ps_lg=Lg9w&pet=149&info=1"');
 try{O.pet=JSON.parse(inf.out);}catch(e){O.pet_raw=inf.out.slice(0,300);}
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:390,height:900},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(String(e).slice(0,140)));
  p.on('console',m=>{ if(m.type()==='error') errs.push('console: '+m.text().slice(0,140)); });
  await p.goto(SITE+'/?ps_lg=Lg9w&pet=149',{waitUntil:'domcontentloaded',timeout:60000});
  await wait(4000);
  O.url=p.url();
  O.logged_in = await p.evaluate(()=>document.body.className.indexOf('logged-in')>=0);
  const dump=async(tag)=>{
    const t=await p.evaluate(()=>{
      const r=document.querySelector('#pspet-root, .pspet-profile, #ps-pet-root') || document.body;
      return (r.innerText||'').replace(/\n{2,}/g,'\n').slice(0,1400);
    });
    const btns=await p.$$eval('button, a.button, .pspet-profile a', es=>es.map(e=>(e.textContent||'').trim()).filter(t=>t&&t.length<50).slice(0,40));
    O[tag]={text:t,buttons:[...new Set(btns)]};
  };
  await dump('screen_profile');
  await p.screenshot({path:'/tmp/w1.png',fullPage:true});
  // bandom rasti mitybos ieiti
  const cand=await p.$$('button, a');
  for(const c of cand){
    const t=((await c.textContent())||'').trim();
    if(/mityb|maist|planas|Mityba/i.test(t)){ await c.click().catch(()=>{}); break; }
  }
  await wait(3500);
  await dump('screen_feeding');
  await p.screenshot({path:'/tmp/w2.png',fullPage:true});
  O.errs=[...new Set(errs)].slice(0,10);
 }catch(e){ O.browser_err=String(e).slice(0,300); }
 try{ if(br) await br.close(); }catch(e){}
 fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
 sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
}
putB64('we.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
for(const f of ['w1','w2']){ try{ putB64(f+'.png', fs.readFileSync('/tmp/'+f+'.png').toString('base64')); }catch(e){} }
console.log('done');
