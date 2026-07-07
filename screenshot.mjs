import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'seorecon2',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function get(u){ try{ return execSync('curl -sLk -A "Mozilla/5.0" --max-time 60 "'+u+'"',{encoding:'utf8',maxBuffer:80000000}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('seorecon2_0707.json',out); }

// SENAS sitemap turinys
step('old_sitemap',()=>{ let x=get(OLD+'/sitemap.xml'); if(x==='EXC'||x.length<50) x=get(OLD+'/index.php?route=feed/google_sitemap/generate'); const isIndex=/<sitemapindex/i.test(x); const locs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'')); const sample=locs.slice(0,20); // klasifikuojam
  const cat={product:0,category:0,info:0,other:0}; locs.forEach(u=>{ const p=u.replace(OLD,''); if(/^\/(index\.php)/.test(p)) cat.other++; else if(/^\/[a-z0-9-]+-\d+(-\d+)?\/?$/.test(p)) cat.product++; else if(/(sunims|katems|grauzik|pauksc|zuvim|maistas|daugiau-pigiau)/.test(p)) cat.category++; else if(/(apie|pristatym|grazinim|kontakt|taisykl|privatum|blog)/.test(p)) cat.info++; else cat.other++; }); return {isIndex, total:locs.length, sample, roughClass:cat, xmlLen:x.length}; });

// DEV sitemap (su -k) + noindex meta
step('dev_sitemap',()=>{ const x=get(DEV+'/wp-sitemap.xml'); const subs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'')).slice(0,15); return {head:x.slice(0,300), subs}; });
step('dev_noindex',()=>{ const x=get(DEV+'/'); const noidx=/noindex/i.test(x); const robotsMeta=(x.match(/<meta[^>]*robots[^>]*>/i)||[])[0]||'none'; return {noindex:noidx, meta:robotsMeta.slice(0,120)}; });
step('dev_product_sample',()=>{ const rr=JSON.parse(execSync('curl -sk -u "$WPU:$WPP" "'+DEV+'/wp-json/wc/v3/products?per_page=5&status=publish"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}})); return rr.map(p=>({id:p.id,slug:p.slug,link:(p.permalink||'').replace(DEV,'')})); });

putResult('seorecon2_0707.json',out);
