import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
function putResult(name,txt){const u='https://api.github.com/repos/'+REPO+'/contents/analize/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk --max-time 30 -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'s412',content:Buffer.from(txt).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -sk --max-time 60 -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={VERSIJA_RUN:'run412-v1'}; let sid=null;
const PHP=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgUzQxMSBGb290ZXIgRm9ybSArIFdlbGNvbWUgTW9kYWwgdjEKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX3M0MTInXSkgfHwgJF9HRVRbJ3BzX3M0MTInXSAhPT0gJ0s0MTJmdCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIEBzZXRfdGltZV9saW1pdCgyMjApOwogICAgJGFjdD1pc3NldCgkX0dFVFsnYWN0J10pPyRfR0VUWydhY3QnXTonJzsKICAgICRyPWFycmF5KCdWRVJTSUpBJz0+J3M0MTItdjInLCdhY3QnPT4kYWN0KTsKICAgICRDT1JFPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUnOwogICAgJE1BSU49JENPUkUuJy9wZXRzaG9wLWNvcmUucGhwJzsKCiAgICBpZigkYWN0PT09J2RlcGxveScpewogICAgICAgIC8vIDEpIG1vZGFsbyBrbGFzZQogICAgICAgICRwaHA9aXNzZXQoJF9QT1NUWydtJ10pP2Jhc2U2NF9kZWNvZGUoJF9QT1NUWydtJ10sdHJ1ZSk6ZmFsc2U7CiAgICAgICAgaWYoJHBocD09PWZhbHNlfHxzdHJwb3MoJHBocCwnUGV0c2hvcF9XZWxjb21lX01vZGFsJyk9PT1mYWxzZSl7ICRyWydLTEFJREEnXT0nZGVjb2RlJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KICAgICAgICB0cnl7IHRva2VuX2dldF9hbGwoJHBocCwgVE9LRU5fUEFSU0UpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0tMQUlEQSddPSdzaW50YWtzZSc7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIpOyBleGl0OyB9CiAgICAgICAgJGY9JENPUkUuJy9pbmNsdWRlcy9jbGFzcy13ZWxjb21lLW1vZGFsLnBocCc7CiAgICAgICAgZmlsZV9wdXRfY29udGVudHMoJGYsJHBocCk7IEBjaG1vZCgkZiwwNjQ0KTsKICAgICAgICAkclsnbW9kYWxhcyddPWFycmF5KCdCJz0+ZmlsZXNpemUoJGYpLCdzaGEnPT5zdWJzdHIoaGFzaCgnc2hhMjU2JyxmaWxlX2dldF9jb250ZW50cygkZikpLDAsMTYpKTsKICAgICAgICAvLyAyKSByZXF1aXJlCiAgICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJE1BSU4pOwogICAgICAgIGlmKHN0cnBvcygkYywnY2xhc3Mtd2VsY29tZS1tb2RhbC5waHAnKT09PWZhbHNlKXsKICAgICAgICAgICAgJGluaz0icmVxdWlyZV9vbmNlIFBFVFNIT1BfQ09SRV9ESVIgLiAnaW5jbHVkZXMvY2xhc3MtbmV3c2xldHRlci5waHAnOyI7CiAgICAgICAgICAgIGlmKHN1YnN0cl9jb3VudCgkYywkaW5rKSE9PTEpeyAkclsnS0xBSURBJ109J2lua2FyYXMnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyKTsgZXhpdDsgfQogICAgICAgICAgICBpZighZmlsZV9leGlzdHMoJE1BSU4uJy5iYWtfUzQxMScpKSBjb3B5KCRNQUlOLCRNQUlOLicuYmFrX1M0MTEnKTsKICAgICAgICAgICAgJGMyPXN0cl9yZXBsYWNlKCRpbmssJGluay4iXG5yZXF1aXJlX29uY2UgUEVUU0hPUF9DT1JFX0RJUiAuICdpbmNsdWRlcy9jbGFzcy13ZWxjb21lLW1vZGFsLnBocCc7IiwkYyk7CiAgICAgICAgICAgIHRyeXsgdG9rZW5fZ2V0X2FsbCgkYzIsIFRPS0VOX1BBUlNFKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydLTEFJREEnXT0nc2ludGFrc2UgbWFpbic7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIpOyBleGl0OyB9CiAgICAgICAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRNQUlOLCRjMik7CiAgICAgICAgICAgICRyWydyZXF1aXJlX3ByaWRldGFzJ109dHJ1ZTsKICAgICAgICB9IGVsc2UgeyAkclsncmVxdWlyZV9qYXVfYnV2byddPXRydWU7IH0KICAgICAgICAkclsnbWFpbl9CJ109ZmlsZXNpemUoJE1BSU4pOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmKCRhY3Q9PT0nZm9vdGVyJyl7CiAgICAgICAgLy8gRmxhdHNvbWUgcG9yYcWhdMSXOiBpZGVkYW0gc2hvcnRjb2RlIGkgZm9vdGVyLTIgYmxva2EgcGVyIHRoZW1lX21vZAogICAgICAgICRibG9rYXM9J1twZXRzaG9wX25ld3NsZXR0ZXIgdGl0bGU9IkdhdWtpdGUgbmF1ZGluZ3VzIHBhdGFyaW11cyBpciBQZXRzaG9wLmx0IHBhc2nFq2x5bXVzIiAnCiAgICAgICAgICAgICAgLiAndGV4dD0iUmV0YWksIGJldCBpxaEgZXNtxJdzOiBtYWlzdG8gbmF1amllbm9zLCBwcmFrdGluaWFpIHBhdGFyaW1haSBpciBha3R1YWzFq3MgcGFzacWrbHltYWkuIiAnCiAgICAgICAgICAgICAgLiAnYnV0dG9uPSJQcmVudW1lcnVvdGkiXSc7CiAgICAgICAgJHJbJ2VzYW1hc19mb290ZXIxJ109c3Vic3RyKChzdHJpbmcpZ2V0X3RoZW1lX21vZCgnZm9vdGVyXzFfY29udGVudCcsJycpLDAsMzAwKTsKICAgICAgICAkclsnZXNhbWFzX2Zvb3RlcjInXT1zdWJzdHIoKHN0cmluZylnZXRfdGhlbWVfbW9kKCdmb290ZXJfMl9jb250ZW50JywnJyksMCwzMDApOwogICAgICAgIGlmKGlzc2V0KCRfR0VUWydhcHBseSddKSAmJiAkX0dFVFsnYXBwbHknXT09PScxJyl7CiAgICAgICAgICAgICRjdXI9KHN0cmluZylnZXRfdGhlbWVfbW9kKCdmb290ZXJfMV9jb250ZW50JywnJyk7CiAgICAgICAgICAgIGlmKHN0cnBvcygkY3VyLCdwZXRzaG9wX25ld3NsZXR0ZXInKT09PWZhbHNlKXsKICAgICAgICAgICAgICAgIHVwZGF0ZV9vcHRpb24oJ3BldHNob3BfZm9vdGVyMV9iYWtfUzQxMScsJGN1cixmYWxzZSk7CiAgICAgICAgICAgICAgICBzZXRfdGhlbWVfbW9kKCdmb290ZXJfMV9jb250ZW50JywgJGJsb2thcy4iXG5cbiIuJGN1cik7CiAgICAgICAgICAgICAgICAkclsnaWRldGEnXT10cnVlOwogICAgICAgICAgICB9IGVsc2UgeyAkclsnamF1X2J1dm8nXT10cnVlOyB9CiAgICAgICAgICAgICRyWyduYXVqYXNfZm9vdGVyMSddPXN1YnN0cigoc3RyaW5nKWdldF90aGVtZV9tb2QoJ2Zvb3Rlcl8xX2NvbnRlbnQnLCcnKSwwLDMwMCk7CiAgICAgICAgfQogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OwogICAgfQoKICAgIGlmKCRhY3Q9PT0nbW9kYWxfb24nKXsgIHVwZGF0ZV9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJywxLGZhbHNlKTsKICAgICAgICAkclsnanVuZ2lrbGlzJ109Z2V0X29wdGlvbigncGV0c2hvcF93ZWxjb21lX21vZGFsX2VuYWJsZWQnKT8nSUpVTkdUQVMnOiduZSc7IGVjaG8gd3BfanNvbl9lbmNvZGUoJHIpOyBleGl0OyB9CiAgICBpZigkYWN0PT09J21vZGFsX29mZicpeyB1cGRhdGVfb3B0aW9uKCdwZXRzaG9wX3dlbGNvbWVfbW9kYWxfZW5hYmxlZCcsMCxmYWxzZSk7CiAgICAgICAgJHJbJ2p1bmdpa2xpcyddPWdldF9vcHRpb24oJ3BldHNob3Bfd2VsY29tZV9tb2RhbF9lbmFibGVkJyk/J0lKVU5HVEFTJzonaXNqdW5ndGFzJzsgZWNobyB3cF9qc29uX2VuY29kZSgkcik7IGV4aXQ7IH0KCiAgICBpZigkYWN0PT09J3BhdGlrcmEnKXsKICAgICAgICAkclsnbW9kYWxvX2tsYXNlJ109IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9XZWxjb21lX01vZGFsJykgPyAneXJhJzonTkVSQSc7CiAgICAgICAgJHJbJ2p1bmdpa2xpcyddPSBnZXRfb3B0aW9uKCdwZXRzaG9wX3dlbGNvbWVfbW9kYWxfZW5hYmxlZCcpID8gJ0lKVU5HVEFTJzonaXNqdW5ndGFzIChudW1hdHl0YSknOwogICAgICAgICRyWyduZXdzbGV0dGVyX2tsYXNlJ109IGNsYXNzX2V4aXN0cygnUGV0c2hvcF9OZXdzbGV0dGVyJyk/J3lyYSc6J05FUkEnOwogICAgICAgIC8vIGFyIHNob3J0Y29kZSB2ZWlraWEgcG9yYcWhdMSXcyBrb250ZWtzdGUKICAgICAgICAkaD1kb19zaG9ydGNvZGUoJ1twZXRzaG9wX25ld3NsZXR0ZXIgdGl0bGU9IlgiIHRleHQ9IlkiIGJ1dHRvbj0iWiJdJyk7CiAgICAgICAgJHJbJ3Nob3J0Y29kZV9zdV9wYXJhbWV0cmFpcyddPWFycmF5KCdCJz0+c3RybGVuKCRoKSwKICAgICAgICAgICd0aXRsZV9YJz0+c3RycG9zKCRoLCc+WDwnKSE9PWZhbHNlPyd0YWlwJzonTkUnLAogICAgICAgICAgJ2J1dHRvbl9aJz0+c3RycG9zKCRoLCc+WjwnKSE9PWZhbHNlPyd0YWlwJzonTkUnKTsKICAgICAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKICAgIH0KICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PidhY3QnKSk7IGV4aXQ7Cn0sIDEpOwo=','base64').toString('utf8').replace(/^<\?php\s*/,'');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP S412 Footer Modal v2',code:PHP,scope:'global',active:true}));
for(let i=0;i<3&&!sid;i++){const r=sh('curl -sSk --max-time 60 '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
 try{const j=JSON.parse(r.out); if(j&&j.id)sid=j.id;}catch(e){} if(!sid)sh('sleep 4');}
O.sid=sid; sh('sleep 4');
function q(a){const x=sh('curl -sSk --max-time 200 "'+SITE+'/?ps_s412=K412ft&act='+a+'&z='+Math.random()+'"');
 try{return JSON.parse(x.out);}catch(e){return {raw:x.out.slice(0,500)};}}
O.footer_pries=q('footer');
O.footer_apply=q('footer&apply=1');
O.modal_on=q('modal_on');
sh('sleep 3');
// ---- NARSYKLE ----
try{
 const b=await chromium.launch();
 const ctx=await b.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true,locale:'lt-LT'});
 const p=await ctx.newPage(); const errs=[];
 p.on('pageerror',e=>errs.push(String(e).slice(0,120)));
 await p.goto(SITE+'/',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForTimeout(3000);
 try{const c=p.locator('button:has-text("Priimti")').first(); if(await c.count()) await c.click({timeout:4000});}catch(e){}
 await p.waitForTimeout(1500);
 // poraštės forma
 const f=p.locator('.psnl').first();
 O.porastes_forma={ yra:await f.count()>0 };
 if(await f.count()){
   await f.scrollIntoViewIfNeeded().catch(()=>{});
   await p.waitForTimeout(600);
   O.porastes_forma.matoma=await f.isVisible();
   O.porastes_forma.tekstas=(await f.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,180);
   O.porastes_forma.varnele_pazymeta=await p.locator('.psnl-check').first().isChecked().catch(()=>null);
   O.porastes_forma.honeypot_matomas=await p.locator('.psnl-website').first().isVisible().catch(()=>null);
 }
 // modalas — laukiam 14 s
 O.modalas={pries:await p.locator('#psw').count()};
 await p.waitForTimeout(14000);
 const m=p.locator('#psw');
 O.modalas.DOM=await m.count();
 O.modalas.matomas=await m.isVisible().catch(()=>false);
 if(O.modalas.matomas){
   O.modalas.tekstas=(await m.innerText().catch(()=>'')).replace(/\s+/g,' ').slice(0,260);
   O.modalas.turi_nuolaida=/nuolaid|%|kod[aą]s/i.test(O.modalas.tekstas)?'TAIP (blogai)':'ne (gerai)';
   O.modalas.anketos_nuoroda=await m.locator('.psw-b1').getAttribute('href').catch(()=>null);
   // paspaudziam "Tik naujienos"
   await m.locator('.psw-b2').click({timeout:8000}).catch(()=>{});
   await p.waitForTimeout(1200);
   O.modalas.nl_atsidare=await m.locator('.psnl-email').first().isVisible().catch(()=>false);
   // uzdarom ESC
   await p.keyboard.press('Escape');
   await p.waitForTimeout(1200);
   O.modalas.po_ESC_matomas=await m.isVisible().catch(()=>false);
   O.modalas.cookie=(await ctx.cookies()).some(c=>c.name==='psw_seen');
 }
 // checkout — modalo NETURI buti
 await p.goto(SITE+'/checkout/',{waitUntil:'domcontentloaded',timeout:60000});
 await p.waitForTimeout(2500);
 O.checkout_be_modalo= await p.locator('#psw').count()===0 ? 'TAIP (gerai)' : 'NE';
 O.js_klaidos=errs;
 await b.close();
}catch(e){ O.NARSYKLES_KLAIDA=String(e).slice(0,400); }
O.modal_off=q('modal_off');
if(sid){fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
 sh('curl -sSk --max-time 30 -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+sid+'"');}
putResult('s412.json', JSON.stringify(O,null,1));
console.log('OK');
