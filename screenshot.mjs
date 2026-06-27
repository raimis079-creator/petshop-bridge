import fs from "fs";
import { execSync } from "child_process";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function putBin(name, buf){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}fs.writeFileSync('/tmp/b64.txt',buf.toString('base64'));const body={message:'r',branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/meta.json',JSON.stringify(body));try{execSync('jq -n --arg c "$(cat /tmp/b64.txt)" --slurpfile m /tmp/meta.json \'$m[0] + {content:$c}\' > /tmp/put.json');}catch(e){const o=JSON.parse(fs.readFileSync('/tmp/meta.json','utf8'));o.content=fs.readFileSync('/tmp/b64.txt','utf8');fs.writeFileSync('/tmp/put.json',JSON.stringify(o));}
  try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/put.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
let chromium=null;
for(const m of ['playwright','playwright-core']){try{({chromium}=await import(m));if(chromium)break;}catch(e){}}
if(!chromium){commit('sc_status_'+Date.now()+'.json',JSON.stringify({err:'no_playwright'}));console.log('NO_PW');process.exit(0);}
const TARGETS={
 sc:'https://www.prinspetfoods.nl/nl_NL/hondenvoer/procare-grainfree/skin-coat-12kg',
 sens:'https://www.prinspetfoods.nl/nl_NL/hondenvoer/procare-grainfree/sensible-3kg'
};
let exe=undefined;
try{const base='/home/runner/.cache/ms-playwright';if(fs.existsSync(base)){const d=fs.readdirSync(base).find(x=>x.startsWith('chromium'));if(d){const p=base+'/'+d+'/chrome-linux/chrome';if(fs.existsSync(p))exe=p;}}}catch(e){}
let browser;
try{browser=await chromium.launch({headless:true,args:['--no-sandbox','--disable-setuid-sandbox'],...(exe?{executablePath:exe}:{})});}
catch(e){commit('sc_status_'+Date.now()+'.json',JSON.stringify({err:'launch_fail',msg:String(e).slice(0,300)}));console.log('LAUNCH_FAIL');process.exit(0);}
const out={};
for(const [key,url] of Object.entries(TARGETS)){
  try{
    const page=await browser.newPage({viewport:{width:1100,height:1600},deviceScaleFactor:2});
    await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(2500);
    for(const sel of ['text=Voedingswijzer','#collapse3','a[href="#collapse3"]']){try{await page.click(sel,{timeout:3000});break;}catch(e){}}
    await page.waitForTimeout(1200);
    await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
    await page.waitForTimeout(2500);
    await page.evaluate(()=>window.scrollTo(0,0));
    await page.waitForTimeout(800);
    let shotBuf;
    try{const el=await page.$('img[src*="voedingswijzer"]');if(el){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(800);shotBuf=await el.screenshot();out[key+'_mode']='element';}}catch(e){}
    if(!shotBuf){shotBuf=await page.screenshot({fullPage:true});out[key+'_mode']='fullpage';}
    const code=putBin('grain_'+key+'.png',shotBuf);
    out[key]={bytes:shotBuf.length,put:code};
    await page.close();
  }catch(e){out[key]={err:String(e).slice(0,200)};}
}
commit('sc_status_'+Date.now()+'.json',JSON.stringify(out,null,1));
await browser.close();
console.log('SHOT DONE');
