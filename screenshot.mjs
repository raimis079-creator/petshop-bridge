import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'perm',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:50000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function rel(u){ return (u||'').replace(/https?:\/\/[^/]+/,''); }
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putFile('permrecon.json',JSON.stringify(out)); }

step('product',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products?per_page=1&status=publish&_fields=permalink,slug')); return rel(a[0].permalink); });
step('page_breed',()=>{ const a=JSON.parse(wp('/wp-json/wp/v2/pages?slug=jorksyro-terjeras&status=any&_fields=link')); return rel(a[0]&&a[0].link); });
step('post_brand',()=>{ const a=JSON.parse(wp('/wp-json/wp/v2/posts?slug=miamor-is-meiles-katems&status=any&_fields=link')); return rel(a[0]&&a[0].link); });
step('category',()=>{ const a=JSON.parse(wp('/wp-json/wc/v3/products/categories?per_page=1&_fields=slug')); const slug=a[0].slug; // permalink kategorijos: fetchinam per HTML? geriau per wp/v2 taxonomy
  const t=JSON.parse(wp('/wp-json/wp/v2/product_cat?slug='+slug+'&_fields=link')); return {slug, link: t[0]?rel(t[0].link):'no-wp-v2'}; });
step('brand_term',()=>{ // pa_brendas terms
  const terms=JSON.parse(wp('/wp-json/wc/v3/products/attributes/1/terms?per_page=3&_fields=id,slug,name')); 
  const t=JSON.parse(wp('/wp-json/wp/v2/pa_brendas?per_page=2&_fields=slug,link')); 
  return {wc_terms:terms.map(x=>x.slug), wp_link: Array.isArray(t)&&t[0]?rel(t[0].link):'no-wp-v2'}; });
step('permalink_structure',()=>{ const s=wp('/wp-json/wp/v2/settings'); try{ const j=JSON.parse(s); return {ok:true}; }catch(e){ return 'settings blocked'; } });

putFile('permrecon.json',JSON.stringify(out));
