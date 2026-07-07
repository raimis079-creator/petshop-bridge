import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'recon3',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('recon3_0707.json',out); }

// #565 kodo fragmentai: hook registracija + ar liecia kaina publish metu
step('s565_head',()=>{ const r=JSON.parse(wp('/wp-json/code-snippets/v1/snippets/565')); const c=r.code||''; return {name:r.name,active:r.active,head:c.slice(0,900)}; });
step('s565_hooks',()=>{ const r=JSON.parse(wp('/wp-json/code-snippets/v1/snippets/565')); const c=r.code||''; const lines=c.split('\n').filter(l=>/add_action|add_filter|function .*reprice|wp_all_import|pmxi|save_post|_manual_price|import_id/i.test(l)); return lines.map(l=>l.trim().slice(0,120)).slice(0,25); });

// reprice irankis — snippetai kaip masyvas is .snippets arba tiesiai
step('all_snip_shape',()=>{ const raw=wp('/wp-json/code-snippets/v1/snippets?per_page=400'); let d; try{ d=JSON.parse(raw); }catch(e){ return 'noparse:'+raw.slice(0,80); } const arr=Array.isArray(d)?d:(d.snippets||d.data||[]); return {isArr:Array.isArray(d),keys:Array.isArray(d)?'array':Object.keys(d).slice(0,6),n:arr.length}; });
step('reprice_cand',()=>{ const raw=wp('/wp-json/code-snippets/v1/snippets?per_page=400'); let d=JSON.parse(raw); const arr=Array.isArray(d)?d:(d.snippets||[]); return arr.filter(s=>/repric|zb|price|masin|_zb_|initial/i.test(s.name||'')).map(s=>({id:s.id,name:(s.name||'').slice(0,65),active:s.active})); });

// ZB reprice endpoint — petshop-xml plugin gali tureti dry-run route
step('xml_routes',()=>{ const raw=wp('/wp-json/petshop-xml/v1'); return raw.slice(0,600); });
step('root_ns',()=>{ const raw=wp('/wp-json'); let d=JSON.parse(raw); return Object.keys(d.routes||{}).filter(r=>/petshop|zb|repric|pricing/i.test(r)).slice(0,30); });

putResult('recon3_0707.json',out);
