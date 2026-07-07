import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'recon2',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function scan(code,words){ const f={}; words.forEach(w=>{ try{ f[w]=(code.match(new RegExp(w,'gi'))||[]).length; }catch(e){ f[w]='rx'; } }); return f; }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('recon2_0707.json',out); }

step('s565',()=>{ const r=JSON.parse(wp('/wp-json/code-snippets/v1/snippets/565')); const c=r.code||''; return {len:c.length,hits:scan(c,['_price','regular_price','sale_price','set_regular_price','_zb_price','reprice','Pricing','_manual_price','update_vf_qty','_vf_qty'])}; });
step('s525',()=>{ const r=JSON.parse(wp('/wp-json/code-snippets/v1/snippets/525')); const c=r.code||''; return {len:c.length,hits:scan(c,['sticky','pscStickyAtc','add-to-cart','fixed'])}; });
step('reprice_search',()=>{ const arr=JSON.parse(wp('/wp-json/code-snippets/v1/snippets?per_page=400')); return {count:arr.length, cand:arr.filter(s=>/repric|zb.*price|price.*init|masin|_zb_/i.test(s.name||'')).map(s=>({id:s.id,name:(s.name||'').slice(0,70),active:s.active}))}; });
step('page_34258',()=>{ const p=JSON.parse(wp('/wp-json/wp/v2/pages/34258?context=edit')); return {status:p.status,clen:(p.content&&p.content.raw||'').length}; });
step('page_34259',()=>{ const p=JSON.parse(wp('/wp-json/wp/v2/pages/34259?context=edit')); return {status:p.status,clen:(p.content&&p.content.raw||'').length}; });
step('page_34262',()=>{ const p=JSON.parse(wp('/wp-json/wp/v2/pages/34262?context=edit')); return {status:p.status,clen:(p.content&&p.content.raw||'').length}; });
step('gateways',()=>{ const gws=JSON.parse(wp('/wp-json/wc/v3/payment_gateways')); return gws.map(g=>({id:g.id,en:g.enabled})); });
step('paysera_settings',()=>{ const g=JSON.parse(wp('/wp-json/wc/v3/payment_gateways/paysera')); const s=g.settings||{}; const keys=Object.keys(s).filter(k=>/test|mode|recur|environment|debug/i.test(k)); const r={}; keys.forEach(k=>r[k]=s[k].value); return r; });
step('dp_cat91',()=>{ const h=execSync('curl -sk -u "$WPU:$WPP" -I "'+BASE+'/wp-json/wc/v3/products?category=91&per_page=1"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}}); return (h.match(/x-wp-total:\s*(\d+)/i)||[])[1]||'n/a'; });
step('http',()=>{ function hc(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" "'+u+'"',{encoding:'utf8',timeout:40000}).trim(); }catch(e){ return 'EXC'; } } return {dp:hc(BASE+'/daugiau-pigiau/'),spr:hc(BASE+'/sprendimai/')}; });
putResult('recon2_0707.json',out);
