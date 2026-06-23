import { chromium } from 'playwright';
import { execSync } from 'child_process';
import fs from 'fs';
const url = process.argv[2] || 'https://dev.avesa.lt';
const TS = String(Date.now());
function putBinary(name, buf){
  const b64 = buf.toString('base64');
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const apiurl='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+apiurl+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'shot',content:b64,branch:'main'}; if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/sb.json', JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/sb.json "'+apiurl+'"',{encoding:'utf8',maxBuffer:50000000}).trim();
}
(async()=>{
  const browser=await chromium.launch();
  const page=await browser.newPage({viewport:{width:1100,height:1600}});
  await page.goto(url,{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(3500);
  // bandau isskleisti Serimo instrukcija sekcija per teksta
  let clicked=false;
  try{ const el=page.getByText('\u0160\u0117rimo instrukcija',{exact:false}).first(); await el.click({timeout:4000}); clicked=true; await page.waitForTimeout(800);}catch(e){}
  // istraukiu rendered Serimo zonos teksta patikrai
  let serText='';
  try{ serText=await page.evaluate(()=>{ const all=[...document.querySelectorAll('table')]; for(const t of all){ if(/svoris/i.test(t.innerText)) return t.innerText.replace(/\n+/g,' | ').slice(0,400);} return 'NERA table';}); }catch(e){serText='EVAL ERR';}
  const buf=await page.screenshot({fullPage:true});
  const code=putBinary('festshot_'+TS+'.png', buf);
  // teksto rezultata irgi irasau
  fs.writeFileSync('/tmp/meta.json', JSON.stringify({clicked, serText, http:code, ts:TS}));
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const apiurl='https://api.github.com/repos/'+repo+'/contents/screenshots/festshot_meta_'+TS+'.json';
  const body={message:'m',content:Buffer.from(JSON.stringify({clicked,serText,http:code})).toString('base64'),branch:'main'};
  fs.writeFileSync('/tmp/mb.json', JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -d @/tmp/mb.json "'+apiurl+'"');
  await browser.close();
  console.log('SHOT '+code+' '+TS+' clicked='+clicked);
})();
