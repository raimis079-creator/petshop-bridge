import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1',{maxBuffer:20e6,shell:'/bin/bash'}).toString();return o;}catch(e){return String(e).slice(0,300);}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:20e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s419',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:20e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run419-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQxOSBOZXdzbGV0dGVyIEZvb3RlciBEZXBsb3kgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3M0MTknXSkgfHwgJF9HRVRbJ3BzX3M0MTknXSAhPT0gJ0s0MTluZicgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIEBzZXRfdGltZV9saW1pdCgxNTApOwogICAgJHI9YXJyYXkoJ1ZFUlNJSkEnPT4nczQxOS12MScpOwogICAgJENPUkU9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZSc7CiAgICAkTUFJTj0kQ09SRS4nL3BldHNob3AtY29yZS5waHAnOwogICAgJGM9aXNzZXQoJF9QT1NUWydmJ10pP2Jhc2U2NF9kZWNvZGUoJF9QT1NUWydmJ10sdHJ1ZSk6ZmFsc2U7CiAgICBpZigkYz09PWZhbHNlfHxzdHJwb3MoJGMsJ1BldHNob3BfTmV3c2xldHRlcl9Gb290ZXInKT09PWZhbHNlKXsgJHJbJ0tMQUlEQSddPSdkZWNvZGUnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsgfQogICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRjLCBUT0tFTl9QQVJTRSk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnS0xBSURBJ109J3NpbnRha3NlJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KICAgICRmPSRDT1JFLicvaW5jbHVkZXMvY2xhc3MtbmV3c2xldHRlci1mb290ZXIucGhwJzsKICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRjKTsgQGNobW9kKCRmLDA2NDQpOwogICAgJHJbJ2ZhaWxhcyddPWFycmF5KCdCJz0+ZmlsZXNpemUoJGYpLCdzaGEnPT5zdWJzdHIoaGFzaCgnc2hhMjU2JyxmaWxlX2dldF9jb250ZW50cygkZikpLDAsMTYpKTsKICAgICRtPWZpbGVfZ2V0X2NvbnRlbnRzKCRNQUlOKTsKICAgIGlmKHN0cnBvcygkbSwnY2xhc3MtbmV3c2xldHRlci1mb290ZXIucGhwJyk9PT1mYWxzZSl7CiAgICAgICAgJGluaz0icmVxdWlyZV9vbmNlIFBFVFNIT1BfQ09SRV9ESVIgLiAnaW5jbHVkZXMvY2xhc3MtbmV3c2xldHRlci5waHAnOyI7CiAgICAgICAgaWYoc3Vic3RyX2NvdW50KCRtLCRpbmspIT09MSl7ICRyWydLTEFJREEnXT0naW5rYXJhcyc7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIpOyBleGl0OyB9CiAgICAgICAgaWYoIWZpbGVfZXhpc3RzKCRNQUlOLicuYmFrX1M0MTknKSkgY29weSgkTUFJTiwkTUFJTi4nLmJha19TNDE5Jyk7CiAgICAgICAgJG0yPXN0cl9yZXBsYWNlKCRpbmssJGluay4iXG5yZXF1aXJlX29uY2UgUEVUU0hPUF9DT1JFX0RJUiAuICdpbmNsdWRlcy9jbGFzcy1uZXdzbGV0dGVyLWZvb3Rlci5waHAnOyIsJG0pOwogICAgICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkbTIsIFRPS0VOX1BBUlNFKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydLTEFJREEnXT0nc2ludGFrc2UgbWFpbic7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIpOyBleGl0OyB9CiAgICAgICAgZmlsZV9wdXRfY29udGVudHMoJE1BSU4sJG0yKTsKICAgICAgICAkclsncmVxdWlyZSddPSdwcmlkZXRhcyc7CiAgICB9IGVsc2UgeyAkclsncmVxdWlyZSddPSdqYXUgYnV2byc7IH0KICAgICRyWydtYWluX0InXT1maWxlc2l6ZSgkTUFJTik7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSwgMSk7Cg==','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S419 NL Footer v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const t=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(t); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
fs.writeFileSync('/tmp/f.b64','PD9waHAKLyoqCiAqIFBldHNob3AgTmV3c2xldHRlciBGb290ZXIgdjEuMCAoUzQxOSkg4oCUIGZvcm1hIHZpcsWhIHBvcmHFoXTEl3MuCiAqCiAqIFNQUkVORElNQVMgKGtvbnN1bHRhbnRhcyArIFJhaW1pcyAyMDI2LTA4LTA0KTogTkUgd2lkZ2V0J2FzIGlyIE5FIEZvb3RlciAxCiAqIHpvbm9zIMSvanVuZ2ltYXMsIG8gRmxhdHNvbWUga2FibGl1a2FzLgogKiAgIC0gcGlsbm8gcGxvxI1pbyBibG9rYXMgVklSxaAgZXNhbW9zIHBvcmHFoXTEl3MKICogICAtIG5la2VpxI1pYW1hIHZlaWtpYW50aSBGb290ZXIgMiBrZXR1cmnFsyBrb2xvbsWzIHN0cnVrdMWrcmEKICogICAtIG5lxK9qdW5naWFtYSBpa2kgxaFpb2wgbmVuYXVkb3RhIEZvb3RlciAxIHpvbmEgKG5lxb5pbm9tYXMgZm9uYXMvdGFycGFpKQogKiAgIC0gbmVwcmlrbGF1c29tYSBudW8gd2lkZ2V0IHpvbm9zIG51c3RhdHltxbMKICogICAtIHR1cmlueXMgbGlla2Egdmllbm9qZSB2aWV0b2plOiBbcGV0c2hvcF9uZXdzbGV0dGVyXSBzaG9ydGNvZGUga2xhc8SXamUKICoKICogS2FibGl1a2FzIHBhdGlrcmludGFzIEtPREUgKHN0cnVjdHVyZS1mb290ZXIucGhwOjEyOCk6CiAqICAgYWRkX2FjdGlvbignZmxhdHNvbWVfYmVmb3JlX2Zvb3RlcicsICdmbGF0c29tZV9odG1sX2JlZm9yZV9mb290ZXInKTsKICogRWluYW0gcHJpb3JpdGV0dSAyMCDigJQgUE8gdGVtb3Mgc2F2byBIVE1MIGJsb2tvLgogKi8KaWYgKCAhIGRlZmluZWQoICdBQlNQQVRIJyApICkgeyBleGl0OyB9CgpjbGFzcyBQZXRzaG9wX05ld3NsZXR0ZXJfRm9vdGVyIHsKCglwdWJsaWMgc3RhdGljIGZ1bmN0aW9uIGluaXQoKSB7CgkJYWRkX2FjdGlvbiggJ2ZsYXRzb21lX2JlZm9yZV9mb290ZXInLCBhcnJheSggX19DTEFTU19fLCAncmVuZGVyJyApLCAyMCApOwoJfQoKCXByb3RlY3RlZCBzdGF0aWMgZnVuY3Rpb24gcm9keXRpKCkgewoJCWlmICggaXNfYWRtaW4oKSApIHJldHVybiBmYWxzZTsKCQkvLyBBdHNpc2thaXR5bW8gaXIga3JlcMWhZWxpbyBwdXNsYXBpdW9zZSBuZXRydWtkb20gcGlya2ltbyBrZWxpby4KCQlpZiAoIGZ1bmN0aW9uX2V4aXN0cyggJ2lzX2NoZWNrb3V0JyApICYmICggaXNfY2hlY2tvdXQoKSB8fCBpc19jYXJ0KCkgKSApIHJldHVybiBmYWxzZTsKCQlpZiAoIGZ1bmN0aW9uX2V4aXN0cyggJ2lzX3djX2VuZHBvaW50X3VybCcgKSAmJiBpc193Y19lbmRwb2ludF91cmwoICdvcmRlci1yZWNlaXZlZCcgKSApIHJldHVybiBmYWxzZTsKCQlpZiAoICEgc2hvcnRjb2RlX2V4aXN0cyggJ3BldHNob3BfbmV3c2xldHRlcicgKSApIHJldHVybiBmYWxzZTsKCQlyZXR1cm4gKGJvb2wpIGFwcGx5X2ZpbHRlcnMoICdwZXRzaG9wX25ld3NsZXR0ZXJfZm9vdGVyX3Nob3cnLCB0cnVlICk7Cgl9CgoJcHVibGljIHN0YXRpYyBmdW5jdGlvbiByZW5kZXIoKSB7CgkJaWYgKCAhIHNlbGY6OnJvZHl0aSgpICkgcmV0dXJuOwoJCT8+CgkJPHNlY3Rpb24gY2xhc3M9InBzbmwtYmFuZCIgYXJpYS1sYWJlbD0iTmF1amllbmxhacWha2lvIHByZW51bWVyYXRhIj4KCQkJPGRpdiBjbGFzcz0icHNubC1iYW5kLWluIj4KCQkJCTw/cGhwCgkJCQllY2hvIGRvX3Nob3J0Y29kZSgKCQkJCQknW3BldHNob3BfbmV3c2xldHRlciAnCgkJCQkJLiAndGl0bGU9IkdhdWtpdGUgbmF1ZGluZ3VzIHBhdGFyaW11cyBpciBQZXRzaG9wLmx0IHBhc2nFq2x5bXVzIiAnCgkJCQkJLiAndGV4dD0iUmV0YWksIGJldCBpxaEgZXNtxJdzOiBtYWlzdG8gbmF1amllbm9zLCBwcmFrdGluaWFpIHBhdGFyaW1haSBpciBha3R1YWzFq3MgcGFzacWrbHltYWkuIiAnCgkJCQkJLiAnYnV0dG9uPSJQcmVudW1lcnVvdGkiIHNvdXJjZT0iZm9vdGVyX2Zvcm0iXScKCQkJCSk7CgkJCQk/PgoJCQk8L2Rpdj4KCQk8L3NlY3Rpb24+CgkJPHN0eWxlPgoJCS5wc25sLWJhbmR7YmFja2dyb3VuZDojRjNFRkU1O3BhZGRpbmc6NDRweCAyMHB4O3dpZHRoOjEwMCV9CgkJLnBzbmwtYmFuZC1pbnttYXgtd2lkdGg6MTA4MHB4O21hcmdpbjowIGF1dG87ZGlzcGxheTpmbGV4O2p1c3RpZnktY29udGVudDpjZW50ZXJ9CgkJLnBzbmwtYmFuZCAucHNubHttYXgtd2lkdGg6NjQwcHg7d2lkdGg6MTAwJTtib3gtc2hhZG93OjAgMXB4IDNweCByZ2JhKDAsMCwwLC4wNil9CgkJQG1lZGlhKG1heC13aWR0aDo3NjhweCl7LnBzbmwtYmFuZHtwYWRkaW5nOjMycHggMTZweH19CgkJPC9zdHlsZT4KCQk8P3BocAoJfQp9ClBldHNob3BfTmV3c2xldHRlcl9Gb290ZXI6OmluaXQoKTsK');
const x=sh('curl -sSk --max-time 150 -X POST --data-urlencode f@/tmp/f.b64 "'+SITE+'/?ps_s419=K419nf&z='+Math.random()+'"');
try{O.deploy=JSON.parse(x);}catch(e){O.deploy={raw:String(x).slice(0,300)};}
sh('sleep 3');
try{
 const b=await chromium.launch();
 for(const [vardas,vp,mob] of [['desktop',{width:1280,height:900},false],['mobile',{width:390,height:844},true]]){
   const ctx=await b.newContext({viewport:vp,ignoreHTTPSErrors:true,isMobile:mob,hasTouch:mob,locale:'lt-LT'});
   const p=await ctx.newPage(); const errs=[];
   p.on('pageerror',e=>errs.push(String(e).slice(0,120)));
   await p.goto(SITE+'/',{waitUntil:'domcontentloaded',timeout:60000});
   await p.waitForTimeout(3000);
   try{const c=p.locator('button:has-text("Priimti")').first(); if(await c.count()) await c.click({timeout:4000});}catch(e){}
   await p.waitForTimeout(1200);
   const band=p.locator('.psnl-band').first();
   const o={ juosta_DOM: await band.count() };
   if(await band.count()){
     await band.scrollIntoViewIfNeeded().catch(()=>{});
     await p.waitForTimeout(700);
     o.matoma=await band.isVisible();
     o.box=await band.boundingBox().catch(()=>null);
     o.tekstas=(await band.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,140);
     o.varnele_pazymeta=await p.locator('.psnl-check').first().isChecked().catch(()=>null);
     o.honeypot=await p.locator('.psnl-website').first().isVisible().catch(()=>null);
     o.hScroll=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
     // ar VIRS pagrindines porastes
     const fb=await p.locator('#footer').boundingBox().catch(()=>null);
     o.footer_y=fb?Math.round(fb.y):null;
     o.juosta_y=o.box?Math.round(o.box.y):null;
     o.VIRS_PORASTES = (o.box&&fb) ? (o.box.y < fb.y ? 'TAIP':'NE') : null;
     o.footer2_nepaliesta = /APIE|KLIENTAMS|KATEGORIJOS/.test(await p.locator('#footer').innerText().catch(()=>'')) ? 'TAIP':'NE';
   }
   o.js=errs;
   O[vardas]=o;
   await ctx.close();
 }
 // checkout — juostos NETURI buti
 const c2=await b.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
 const p3=await c2.newPage();
 await p3.goto(SITE+'/checkout/',{waitUntil:'domcontentloaded',timeout:60000});
 await p3.waitForTimeout(2500);
 O.checkout_be_juostos= await p3.locator('.psnl-band').count()===0 ? 'TAIP (gerai)':'NE';
 await b.close();
}catch(e){ O.NARSYKLE=String(e).slice(0,400); }
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s419.json', JSON.stringify(O,null,1));
console.log('OK');
