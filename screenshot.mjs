import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={httpResources:[]};
try {
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const ctx = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await ctx.newPage();
  // gaudau visus http:// (ne https) requestus
  page.on('request', function(r){ var u=r.url(); if(u.startsWith('http://')) o.httpResources.push(r.resourceType()+' '+u.slice(0,120)); });
  page.on('console', function(m){ if(m.text().includes('Mixed Content')) { o.mixedMsg = o.mixedMsg||[]; o.mixedMsg.push(m.text().slice(0,200)); } });
  await page.goto('https://dev.avesa.lt/my-account/augintinis/', { waitUntil:'domcontentloaded', timeout:30000 });
  await page.waitForTimeout(5000);
  // dedupe
  o.httpResources = Array.from(new Set(o.httpResources));
  await browser.close();
} catch(e){ o.fatal=String(e).slice(0,200); }
putB64('mixed.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
