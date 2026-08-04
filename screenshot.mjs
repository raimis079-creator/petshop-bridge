import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s415',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run415-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQxNSBGb290ZXIgV2lkZ2V0IHYxIOKAlCBmb3JtYSBpIHNpZGViYXItZm9vdGVyLTEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3M0MTUnXSkgfHwgJF9HRVRbJ3BzX3M0MTUnXSAhPT0gJ0s0MTVmdycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIEBzZXRfdGltZV9saW1pdCgxNTApOwogICAgJGFjdD1pc3NldCgkX0dFVFsnYWN0J10pPyRfR0VUWydhY3QnXTonJzsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M0MTUtdjEnLCdhY3QnPT4kYWN0KTsKCiAgICAkU0M9J1twZXRzaG9wX25ld3NsZXR0ZXIgdGl0bGU9IkdhdWtpdGUgbmF1ZGluZ3VzIHBhdGFyaW11cyBpciBQZXRzaG9wLmx0IHBhc2nFq2x5bXVzIiAnCiAgICAgIC4gJ3RleHQ9IlJldGFpLCBiZXQgacWhIGVzbcSXczogbWFpc3RvIG5hdWppZW5vcywgcHJha3RpbmlhaSBwYXRhcmltYWkgaXIgYWt0dWFsxatzIHBhc2nFq2x5bWFpLiIgJwogICAgICAuICdidXR0b249IlByZW51bWVydW90aSJdJzsKCiAgICBpZigkYWN0PT09J2J1c2VuYScpewogICAgICAgICRzdz1nZXRfb3B0aW9uKCdzaWRlYmFyc193aWRnZXRzJyxhcnJheSgpKTsKICAgICAgICAkclsnZm9vdGVyMSddPSBpc3NldCgkc3dbJ3NpZGViYXItZm9vdGVyLTEnXSk/JHN3WydzaWRlYmFyLWZvb3Rlci0xJ106J05FUkEnOwogICAgICAgICRyWydmb290ZXIyJ109IGlzc2V0KCRzd1snc2lkZWJhci1mb290ZXItMiddKT8kc3dbJ3NpZGViYXItZm9vdGVyLTInXTonTkVSQSc7CiAgICAgICAgJGNoPWdldF9vcHRpb24oJ3dpZGdldF9jdXN0b21faHRtbCcsYXJyYXkoKSk7CiAgICAgICAgJHJbJ2N1c3RvbV9odG1sX2lkcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfa2V5cygoYXJyYXkpJGNoKSwnaXNfbnVtZXJpYycpKTsKICAgICAgICAkclsnZm9vdGVyXzFfY29sdW1ucyddPWdldF90aGVtZV9tb2QoJ2Zvb3Rlcl8xX2NvbHVtbnMnLDQpOwogICAgICAgICRyWydmb290ZXJfMV9jb2xvciddPWdldF90aGVtZV9tb2QoJ2Zvb3Rlcl8xX2NvbG9yJywnX19uZW51c3RhdHl0YV9fJyk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7CiAgICB9CgogICAgaWYoJGFjdD09PSdpZGV0aScpewogICAgICAgICRzdz1nZXRfb3B0aW9uKCdzaWRlYmFyc193aWRnZXRzJyxhcnJheSgpKTsKICAgICAgICAkY2g9Z2V0X29wdGlvbignd2lkZ2V0X2N1c3RvbV9odG1sJyxhcnJheSgpKTsKICAgICAgICBpZighaXNfYXJyYXkoJGNoKSkgJGNoPWFycmF5KCk7CiAgICAgICAgLy8gamF1IHlyYT8KICAgICAgICBmb3JlYWNoKCRjaCBhcyAkaz0+JHYpewogICAgICAgICAgICBpZihpc19hcnJheSgkdikgJiYgaXNzZXQoJHZbJ2NvbnRlbnQnXSkgJiYgc3RycG9zKCR2Wydjb250ZW50J10sJ3BldHNob3BfbmV3c2xldHRlcicpIT09ZmFsc2UpewogICAgICAgICAgICAgICAgJHJbJ2phdV95cmEnXT0nY3VzdG9tX2h0bWwtJy4kazsgYnJlYWs7CiAgICAgICAgICAgIH0KICAgICAgICB9CiAgICAgICAgaWYoZW1wdHkoJHJbJ2phdV95cmEnXSkpewogICAgICAgICAgICAkbmF1aj0xOwogICAgICAgICAgICBmb3JlYWNoKGFycmF5X2tleXMoJGNoKSBhcyAkaykgaWYoaXNfbnVtZXJpYygkaykgJiYgJGs+PSRuYXVqKSAkbmF1aj0kaysxOwogICAgICAgICAgICB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX3NpZGViYXJzX2Jha19TNDE1Jywkc3csZmFsc2UpOwogICAgICAgICAgICAkY2hbJG5hdWpdPWFycmF5KCd0aXRsZSc9PicnLCdjb250ZW50Jz0+JFNDKTsKICAgICAgICAgICAgJGNoWydfbXVsdGl3aWRnZXQnXT0xOwogICAgICAgICAgICB1cGRhdGVfb3B0aW9uKCd3aWRnZXRfY3VzdG9tX2h0bWwnLCRjaCk7CiAgICAgICAgICAgICRpZD0nY3VzdG9tX2h0bWwtJy4kbmF1ajsKICAgICAgICAgICAgaWYoIWlzc2V0KCRzd1snc2lkZWJhci1mb290ZXItMSddKXx8IWlzX2FycmF5KCRzd1snc2lkZWJhci1mb290ZXItMSddKSkgJHN3WydzaWRlYmFyLWZvb3Rlci0xJ109YXJyYXkoKTsKICAgICAgICAgICAgJHN3WydzaWRlYmFyLWZvb3Rlci0xJ11bXT0kaWQ7CiAgICAgICAgICAgIHVwZGF0ZV9vcHRpb24oJ3NpZGViYXJzX3dpZGdldHMnLCRzdyk7CiAgICAgICAgICAgICRyWydwcmlkZXRhcyddPSRpZDsKICAgICAgICB9CiAgICAgICAgJHN3Mj1nZXRfb3B0aW9uKCdzaWRlYmFyc193aWRnZXRzJyxhcnJheSgpKTsKICAgICAgICAkclsnZm9vdGVyMV9wbyddPWlzc2V0KCRzdzJbJ3NpZGViYXItZm9vdGVyLTEnXSk/JHN3Mlsnc2lkZWJhci1mb290ZXItMSddOidORVJBJzsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KCiAgICBpZigkYWN0PT09J3JvbGxiYWNrJyl7CiAgICAgICAgJGI9Z2V0X29wdGlvbigncGV0c2hvcF9zaWRlYmFyc19iYWtfUzQxNScpOwogICAgICAgIGlmKGlzX2FycmF5KCRiKSl7IHVwZGF0ZV9vcHRpb24oJ3NpZGViYXJzX3dpZGdldHMnLCRiKTsgJHJbJ2F0c3RhdHl0YSddPXRydWU7IH0KICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PidhY3QnKSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S415 Footer Widget v1',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 150 "'+SITE+'/?ps_s415=K415fw&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,500)};}}
O.pries=q('busena');
O.ideti=q('ideti');
sh('sleep 3');
try{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true,locale:'lt-LT'});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 await p.goto(SITE+'/',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForTimeout(3000);
 try{const c=p.locator('button:has-text("Priimti")').first(); if(await c.count()) await c.click({timeout:4000});}catch(e){}
 await p.waitForTimeout(1500);
 const f=p.locator('.psnl').first();
 O.forma={ DOM: await f.count() };
 if(await f.count()){
   await f.scrollIntoViewIfNeeded().catch(()=>{});
   await p.waitForTimeout(800);
   O.forma.matoma=await f.isVisible();
   const bx=await f.boundingBox().catch(()=>null);
   O.forma.box=bx;
   O.forma.tekstas=(await f.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,200);
   O.forma.varnele_pazymeta=await p.locator('.psnl-check').first().isChecked().catch(()=>null);
   O.forma.honeypot_matomas=await p.locator('.psnl-website').first().isVisible().catch(()=>null);
   O.forma.mygtukas=(await p.locator('.psnl-btn').first().innerText().catch(()=>'')).trim();
   // ar ji virs teisinio baro
   O.forma.footer_HTML=(await p.locator('#footer').innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,300);
 }
 // mobilus
 const m=await b.newContext({viewport:{width:390,height:844},ignoreHTTPSErrors:true,isMobile:true,hasTouch:true});
 const p2=await m.newPage();
 await p2.goto(SITE+'/',{waitUntil:'domcontentloaded',timeout:60000});
 await p2.waitForTimeout(3000);
 const f2=p2.locator('.psnl').first();
 O.mobilus={DOM:await f2.count()};
 if(await f2.count()){ await f2.scrollIntoViewIfNeeded().catch(()=>{}); await p2.waitForTimeout(600);
   O.mobilus.matoma=await f2.isVisible();
   const b2=await f2.boundingBox().catch(()=>null);
   O.mobilus.box=b2;
   O.mobilus.hScroll=await p2.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2); }
 O.js_klaidos=errs;
 await b.close();
}catch(e){ O.NARSYKLE=String(e).slice(0,400); }
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s415.json', JSON.stringify(O,null,1));
console.log('OK');
