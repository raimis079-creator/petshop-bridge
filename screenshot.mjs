import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }

const raw = process.env.GTM_SA_JSON || '';
let out='';
const L=(s)=>{out+=s+'\n';};
L('length: '+raw.length);
L('first 8 char codes: '+Array.from(raw.slice(0,8)).map(c=>c.charCodeAt(0)).join(','));
L('last 8 char codes:  '+Array.from(raw.slice(-8)).map(c=>c.charCodeAt(0)).join(','));
L('starts with {: '+raw.trimStart().startsWith('{'));
L('ends with }:   '+raw.trimEnd().endsWith('}'));
L('has CR: '+raw.includes('\r'));
L('count of \\n literal (backslash-n): '+(raw.match(/\\n/g)||[]).length);
L('count of real newlines: '+(raw.match(/\n/g)||[]).length);
L('contains "private_key": '+raw.includes('private_key'));
L('contains "client_email": '+raw.includes('client_email'));
L('contains BEGIN PRIVATE KEY: '+raw.includes('BEGIN PRIVATE KEY'));
// Bandom fix: apvyniojam skliaustais jei trūksta
let fixed = raw.trim();
if(!fixed.startsWith('{')) fixed = '{'+fixed;
if(!fixed.endsWith('}')) fixed = fixed+'}';
try{ const o=JSON.parse(fixed); L('FIXED PARSE: OK, keys='+Object.keys(o).length+' client_email='+o.client_email); }
catch(e){ L('FIXED PARSE FAIL: '+e.message); }
putFile('gtm_diag.txt', out);
console.log(out);
