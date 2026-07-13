import { execSync } from "child_process";
import fs from "fs";
import { chromium } from "playwright";
function putBinary(n,buf){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:buf.toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pb.json',JSON.stringify(b));execSync('curl -s --max-time 45 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000});}
const BASE='https://dev.avesa.lt';
(async()=>{const b=await chromium.launch({args:['--no-sandbox']});
const d=await b.newContext({viewport:{width:1280,height:1400},ignoreHTTPSErrors:true});
const p=await d.newPage(); await p.goto(BASE+'/kategorija/sunims/maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000}); await p.waitForTimeout(4000);
putBinary('sidebar_check.png', await p.screenshot({clip:{x:0,y:150,width:400,height:1100}}));
console.log('ok');
await d.close();await b.close();})();
