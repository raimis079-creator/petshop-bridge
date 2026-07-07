import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'seorecon2',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={ts:new Date().toISOString(),start:'ok'};
putResult('seorecon2_0707.json',out);
function getf(u,f){ try{ execSync('curl -sLk -A "Mozilla/5.0" --max-time 90 -o '+f+' "'+u+'"',{timeout:100000}); return fs.existsSync(f)?fs.statSync(f).size:0; }catch(e){ return -1; } }
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,150); } putResult('seorecon2_0707.json',out); }

// SENAS sitemap -> failas, tada parse python-free JS
step('old_sitemap',()=>{ let sz=getf(OLD+'/sitemap.xml','/tmp/os.xml'); let src='sitemap.xml'; if(sz<100){ sz=getf(OLD+'/index.php?route=feed/google_sitemap/generate','/tmp/os.xml'); src='route'; } const x=fs.readFileSync('/tmp/os.xml','utf8'); const isIndex=/<sitemapindex/i.test(x); const locs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim()); const cat={product:0,category:0,info:0,other:0}; const psamp=[],csamp=[],isamp=[]; locs.forEach(u=>{ const p=u.replace(/https?:\/\/[^/]+/,''); if(/^\/(index\.php)/.test(p)){cat.other++;} else if(/-\d{3,}(-\d+)?\/?$/.test(p)){cat.product++; if(psamp.length<8)psamp.push(p);} else if(/(sunims|katems|grauzik|pauksc|zuvim|maistas|daugiau-pigiau|akcij)/i.test(p)){cat.category++; if(csamp.length<8)csamp.push(p);} else if(/(apie|pristatym|grazinim|kontakt|taisykl|privatum|blog|straipsn|veisl)/i.test(p)){cat.info++; if(isamp.length<8)isamp.push(p);} else {cat.other++; if(psamp.length<8)psamp.push('?'+p);} }); return {src,sz,isIndex,total:locs.length,roughClass:cat,productSamples:psamp,categorySamples:csamp,infoSamples:isamp}; });

// DEV sitemap
step('dev_sitemap',()=>{ const sz=getf(DEV+'/wp-sitemap.xml','/tmp/dv.xml'); if(sz<50) return {sz,note:'no wp-sitemap'}; const x=fs.readFileSync('/tmp/dv.xml','utf8'); const subs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim()).slice(0,15); return {sz,subs}; });

// DEV noindex + slug pavyzdziai
step('dev_noindex',()=>{ getf(DEV+'/','/tmp/dh.html'); const x=fs.readFileSync('/tmp/dh.html','utf8'); return {noindex:/noindex/i.test(x), meta:((x.match(/<meta[^>]*name=["']robots["'][^>]*>/i)||[])[0]||'none').slice(0,120)}; });
step('dev_products',()=>{ const rr=JSON.parse(execSync('curl -sk -u "$WPU:$WPP" "'+DEV+'/wp-json/wc/v3/products?per_page=5&status=publish"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}})); return rr.map(p=>({id:p.id,slug:p.slug})); });

putResult('seorecon2_0707.json',out);
