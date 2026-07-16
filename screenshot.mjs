import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN;
function ghPut(p,buf,m){const u=`https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/${p}`;let s='';try{const j=JSON.parse(execSync(`curl -s -H "Authorization: Bearer ${TOKG}" "${u}"`).toString());if(j.sha)s=j.sha;}catch(e){}
 fs.writeFileSync('/tmp/p.json',JSON.stringify({message:m,content:buf.toString('base64'),...(s?{sha:s}:{})}));
 execSync(`curl -s -X PUT -H "Authorization: Bearer ${TOKG}" -d @/tmp/p.json "${u}" -o /dev/null`,{maxBuffer:30*1024*1024});}
function sh(c){try{return execSync(c,{maxBuffer:40*1024*1024}).toString();}catch(e){return 'ERR';}}
const AUTH=Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').replace(/\s+/g,'')).toString('base64');
const API='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const out={};
try{
const php=fs.readFileSync('/tmp/hy.php','utf8');
fs.writeFileSync('/tmp/snip.json',JSON.stringify({name:'Exclusion HY Feeding v1 (Vetfarmas OCR + PL HTML)',code:php,scope:'global',active:true}));
sh(`curl -sk -X POST -H "Authorization: Basic ${AUTH}" -H "Content-Type: application/json" -d @/tmp/snip.json "${API}"`);
const r=sh('curl -sk --max-time 200 "https://dev.avesa.lt/?ps_hyw=Hw4Nn8Bb"');
try{ out.dry=JSON.parse(r); }catch(e){ out.raw=r.slice(0,600); }
}catch(e){ out.FATAL=String(e&&e.message?e.message:e).slice(0,300); }
ghPut('screenshots/m8_hydry.json',Buffer.from(JSON.stringify(out)),'HY dry-run');
console.log('DONE');
