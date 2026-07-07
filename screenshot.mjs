import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'recon4',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('recon4_0707.json',out); }

// Visi snippetai per puslapius po 100 -> tik id+name+active
step('snips',()=>{ let all=[]; for(let p=1;p<=5;p++){ const raw=wp('/wp-json/code-snippets/v1/snippets?per_page=100&page='+p); let d; try{ d=JSON.parse(raw); }catch(e){ break; } if(!Array.isArray(d)){ if(d.code){ break; } d=[]; } if(!d.length) break; all=all.concat(d.map(s=>({id:s.id,n:(s.name||'').slice(0,60),a:s.active}))); if(d.length<100) break; } return {total:all.length, priceish:all.filter(s=>/repric|zb|price|masin|initial|kainodar|kaina/i.test(s.n)), tempish:all.filter(s=>/temp/i.test(s.n))}; });

// ZB pricing klase — ar yra bridge token-gate reprice endpoint? bandom keliais spejimais per plugin
step('probe_endpoints',()=>{ const tries=['/?ps_zb_reprice=dry','/?zb_reprice=dry&k=ps2026','/?petshop_zb_reprice=1&k=ps2026']; const r={}; tries.forEach(t=>{ const x=wp(t); r[t]=String(x).slice(0,60); }); return r; });

// #565 pilnas: reprice funkcijos vidus — ar liecia ZB prekes? filtruoja pagal source?
step('s565_body',()=>{ const rr=JSON.parse(wp('/wp-json/code-snippets/v1/snippets/565')); const c=rr.code||''; const i=c.indexOf('function petshop_vf_sync_reprice'); return c.slice(i, i+1400); });

putResult('recon4_0707.json',out);
