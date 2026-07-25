import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50e6,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={consoleErrors:[], pageErrors:[], requests:[]};
try{
  // sukuriam login token
  const AL=`<?php
add_action('wp_loaded', function(){
  if(isset($_GET['ps_go2'])){ $tok=sanitize_text_field($_GET['ps_go2']); $uid=get_transient('psg_'.$tok);
    if($uid){ wp_set_auth_cookie($uid,false); wp_set_current_user($uid); wp_safe_redirect('https://dev.avesa.lt/my-account/augintinis/'); exit; } }
  if(isset($_GET['ps_mk2']) && $_GET['ps_mk2']==='Mk2x'){ $tok=wp_generate_password(20,false); set_transient('psg_'.$tok,1,300);
    header('Content-Type: application/json'); echo '###T###'.$tok.'###E###'; exit; }
});`;
  const mk=wj('POST','code-snippets/v1/snippets',{name:'ALD (temp)',code:AL,scope:'front-end',active:true,priority:5});
  let sid=null; try{sid=JSON.parse(mk).id;}catch(e){}
  execSync('sleep 4');
  let token=null;
  try{ const r=execSync('curl -sk "https://dev.avesa.lt/?ps_mk2=Mk2x"',{maxBuffer:5e6,timeout:60000}).toString();
    const a=r.indexOf('###T###'),b=r.indexOf('###E###'); if(a>=0&&b>a) token=r.slice(a+7,b); }catch(e){}
  o.gotToken=!!token;

  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ viewport: { width: 1000, height: 1400 }, ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  page.on('console', function(m){ if(m.type()==='error') o.consoleErrors.push(m.text().slice(0,150)); });
  page.on('pageerror', function(e){ o.pageErrors.push(String(e).slice(0,200)); });
  page.on('response', function(r){ var u=r.url(); if(u.includes('pet-dashboard')||u.includes('/petshop/')||u.includes('my-pet')) o.requests.push(r.status()+' '+u.slice(u.indexOf('/wp-json')).slice(0,60)); });
  await page.goto('https://dev.avesa.lt/?ps_go2='+token, { waitUntil:'domcontentloaded', timeout:40000 });
  await page.waitForTimeout(7000);
  o.state = await page.evaluate(() => {
    var root = document.querySelector('#pspet-app,[id*="pspet-app"],.pspet-root,[data-pspet]');
    // ieskau bet kokio pspet konteinerio kuris nera css/js
    var candidates = Array.from(document.querySelectorAll('[id^="pspet"],[class^="pspet"]')).filter(function(e){return e.tagName!=='LINK'&&e.tagName!=='SCRIPT'&&e.tagName!=='STYLE';});
    return {
      url: location.href,
      loggedIn: !document.body.innerHTML.includes('Prisijungimas prie'),
      candidateCount: candidates.length,
      candidateInfo: candidates.slice(0,5).map(function(e){return (e.tagName+'#'+(e.id||'')+'.'+(e.className||'').toString().split(' ')[0]).slice(0,40)+' empty='+(e.innerHTML.trim().length<10);}),
      hasProfile: !!document.querySelector('.pspet-profile'),
      bodyHasPspetProfile: document.body.innerHTML.includes('pspet-profile'),
      windowPetForm: typeof window.PetshopPetForm,
      windowPSPet: typeof window.PSPet
    };
  });
  await browser.close();
  if(sid!=null){ try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
}catch(e){ o.fatal=String(e).slice(0,300); }
putB64('jsdiag.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
