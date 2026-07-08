import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gh',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
try{
  const r=execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+'/wp-json/wp/v2/pages/34543?context=edit&_fields=content"',{encoding:'utf8',maxBuffer:5000000,timeout:27000,env:{...process.env,WPU,WPP}});
  const j=JSON.parse(r);
  const raw=j.content&&j.content.raw||'';
  putFile('homepage_raw.txt', raw);
  putFile('homepage_meta.txt', 'length='+raw.length+'\nhas_hero='+(raw.indexOf('ph-hero')>=0)+'\nhas_need_grid='+(raw.indexOf('ph-need-grid')>=0)+'\nhas_cat_grid='+(raw.indexOf('ph-cat-grid')>=0));
}catch(e){ putFile('homepage_raw.txt','ERR: '+String(e).slice(0,200)); }
