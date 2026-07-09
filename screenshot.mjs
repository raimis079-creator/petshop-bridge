import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
let out=''; const L=(s)=>{out+=s+'\n';};
function grab(url,label){
  L('===== '+label+' =====');
  L(url);
  let js='';
  try{ js = execSync('curl -sk -L --max-time 40 -A "Mozilla/5.0 Chrome/120" "'+url+'"',{encoding:'utf8',maxBuffer:30000000}); }
  catch(e){ L('ERR '+(e.message||'').slice(0,120)); L(''); return; }
  L('dydis: '+js.length+' baitu');
  if(js.length < 500){ L('TURINYS: '+js.slice(0,400)); L(''); return; }
  const pats={
    'GA4 (G-)':/\bG-[A-Z0-9]{8,12}\b/g,
    'Google Ads (AW-)':/\bAW-\d{9,12}\b/g,
    'Conversion label':/AW-\d+\/[A-Za-z0-9_-]+/g,
    'UA-':/\bUA-\d{4,10}-\d{1,3}\b/g,
    'Floodlight (DC-)':/\bDC-\d+\b/g,
    'Meta pixel id':/\b\d{15,16}\b/g,
    'facebook':/connect\.facebook\.net/g,
    'consent api':/gtag\('consent'|"consent"/g,
    'GTM refs':/GTM-[A-Z0-9]{6,9}/g,
  };
  for(const [k,re] of Object.entries(pats)){
    const m=js.match(re);
    if(m){ const u=[...new Set(m)]; L('  ['+u.length+'] '+k+' -> '+u.slice(0,8).join(', ')); }
    else L('  [0] '+k);
  }
  L('');
}
grab('https://www.googletagmanager.com/gtm.js?id=GTM-MZGDV75F','PROD naudojamas GTM-MZGDV75F');
grab('https://www.googletagmanager.com/gtm.js?id=GTM-MF3GZGT','Avesa tuscias GTM-MF3GZGT');
grab('https://www.googletagmanager.com/gtag/js?id=G-FMTKEGGLMG','petshop account Google tag G-FMTKEGGLMG');
putFile('gtm_public_scan.txt', out); console.log(out);
