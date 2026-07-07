import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'brandtax',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:80000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putFile('brandtax.json',JSON.stringify(out)); }

// 1. Visos taksonomijos susijusios su brendu
step('taxonomies',()=>{ const t=JSON.parse(wp('/wp-json/wp/v2/taxonomies')); const keys=Object.keys(t); return keys.filter(k=>/brand|brend|zenkl|manufact|gaminto/i.test(k)||/brand|brend|zenkl/i.test((t[k].name||'')+(t[k].slug||''))); });
// 2. WooCommerce native product_brand? terms su count
step('product_brand_terms',()=>{ const r=wp('/wp-json/wp/v2/product_brand?per_page=10&_fields=slug,name,count,link'); try{ const a=JSON.parse(r); return Array.isArray(a)?{n:a.length,sample:a.slice(0,6).map(x=>({slug:x.slug,count:x.count,link:(x.link||'').replace(DEV,'')}))}:String(r).slice(0,120);}catch(e){return String(r).slice(0,120);} });
// 3. pa_brendas terms su count (per wc/v3)
step('pa_brendas_terms',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products/attributes/1/terms?per_page=8&_fields=slug,name,count')); return a.map(x=>({slug:x.slug,count:x.count})); });
// 4. pa_brendas atributo pilnas objektas (slug, has_archives)
step('pa_brendas_attr',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products/attributes/1')); return {id:a.id,slug:a.slug,name:a.name,has_archives:a.has_archives,type:a.type}; });
// 5. Kaip produktas laiko brenda? paimam 1 produkta ir ziurim brands/attributes
step('sample_product_brand',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products?per_page=3&status=publish&_fields=id,name,brands,attributes')); return a.map(p=>({id:p.id,brands:p.brands||'none',attrs:(p.attributes||[]).filter(x=>/brend/i.test(x.name||'')).map(x=>({name:x.name,opts:x.options}))})); });
// 6. product_brand su count>0?
step('brand_with_products',()=>{ const r=wp('/wp-json/wp/v2/product_brand?per_page=100&_fields=slug,count&orderby=count&order=desc'); try{ const a=JSON.parse(r); if(!Array.isArray(a)) return String(r).slice(0,100); const withp=a.filter(x=>x.count>0); return {total:a.length, with_products:withp.length, top:withp.slice(0,8).map(x=>x.slug+':'+x.count)}; }catch(e){ return String(r).slice(0,100); } });

putFile('brandtax.json',JSON.stringify(out));
