import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
const DEV="https://dev.avesa.lt";
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'seorecon',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sL -A "Mozilla/5.0" --max-time 40 "'+u+'"',{encoding:'utf8',maxBuffer:50000000}); }catch(e){ return 'EXC'; } }
function head(u){ try{ return execSync('curl -sIL -A "Mozilla/5.0" --max-time 30 "'+u+'"',{encoding:'utf8'}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('seorecon_0707.json',out); }

// SENAS sitemap — bandom kelis kelius
step('old_sitemap_paths',()=>{ const paths=['/sitemap.xml','/sitemap_index.xml','/sitemaps.xml','/index.php?route=extension/feed/google_sitemap','/system/sitemap.xml','/robots.txt']; const r={}; paths.forEach(p=>{ const h=head(OLD+p); const code=(h.match(/HTTP\/[\d.]+ (\d+)/g)||[]).pop()||'?'; const ct=(h.match(/content-type:\s*([^\r\n]+)/i)||[])[1]||''; r[p]={code:code.slice(-3),ct:ct.trim().slice(0,40)}; }); return r; });
// robots.txt turinys (dazniausiai nurodo sitemap)
step('old_robots',()=>{ return get(OLD+'/robots.txt').slice(0,800); });
// naujas dev sitemap + noindex busena
step('dev_robots',()=>{ return get(DEV+'/robots.txt').slice(0,600); });
step('dev_sitemap_head',()=>{ const h=head(DEV+'/wp-sitemap.xml'); const code=(h.match(/HTTP\/[\d.]+ (\d+)/g)||[]).pop()||'?'; return {code:code.slice(-3), body:get(DEV+'/wp-sitemap.xml').slice(0,500)}; });

putResult('seorecon_0707.json',out);
