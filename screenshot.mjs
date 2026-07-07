import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'recon2',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+(e.message||'').slice(0,150); } }
const out={ts:new Date().toISOString()};

// A. Visi snippetai su kodu (skenuojam pricing keywords VF Sync #565)
function snipCode(id){ try{ const r=JSON.parse(wp('/wp-json/code-snippets/v1/snippets/'+id)); return r.code||''; }catch(e){ return ''; } }
function scan(code,words){ const f={}; words.forEach(w=>{ f[w]=(code.match(new RegExp(w,'gi'))||[]).length; }); return f; }

// #565 VF Sync — ar liecia kainas?
const c565=snipCode(565);
out.s565={len:c565.length, hits:scan(c565,['_price','regular_price','sale_price','set_price','_zb_price','reprice','Pricing','update_meta.*price','_manual_price'])};

// #525 mobile sticky ATC — ar tikrai yra sticky
const c525=snipCode(525);
out.s525={len:c525.length, hits:scan(c525,['sticky','pscStickyAtc','add-to-cart','position:.?fixed'])};

// B. Reprice irankis — ieskau tarp VISU snippetu (aktyvus+neaktyvus)
let allSnips=[]; try{ allSnips=JSON.parse(wp('/wp-json/code-snippets/v1/snippets?per_page=400')); }catch(e){ out.allsnip_err=String(e).slice(0,100); }
out.reprice_candidates=allSnips.filter(s=>/repric|zb.*price|price.*init|masin/i.test(s.name||'')).map(s=>({id:s.id,name:(s.name||'').slice(0,70),active:s.active}));
out.snip_all_count=allSnips.length;

// C. 3 draft Sprendimai puslapiai — turinys + statusas
for (const pid of [34258,34259,34262]){
  try{ const p=JSON.parse(wp('/wp-json/wp/v2/pages/'+pid+'?context=edit')); out['page_'+pid]={status:p.status,title:(p.title&&p.title.raw||'').slice(0,40),content_len:(p.content&&p.content.raw||'').length}; }
  catch(e){ out['page_'+pid]='ERR:'+String(wp('/wp-json/wp/v2/pages/'+pid)).slice(0,120); }
}

// D. Paysera / mokejimai — test vs production, recurring
try{ const gws=JSON.parse(wp('/wp-json/wc/v3/payment_gateways')); out.gateways=gws.filter(g=>g.enabled).map(g=>({id:g.id,title:(g.title||'').slice(0,30),enabled:g.enabled})); }catch(e){ out.gw_err=String(e).slice(0,100); }

// E. DP puslapis + cat 91 (Daugiau=Pigiau) prekiu skaicius
try{ const h=execSync('curl -sk -u "$WPU:$WPP" -I "'+BASE+'/wp-json/wc/v3/products?category=91&per_page=1"',{encoding:'utf8',timeout:60000,env:{...process.env,WPU,WPP}}); out.dp_cat91=(h.match(/x-wp-total:\s*(\d+)/i)||[])[1]||'n/a'; }catch(e){ out.dp_err=String(e).slice(0,80); }

// F. Loco / lokalizacija — snippet #525 UI lokalizacija? patikrinam ar yra likusiu EN eiluciu checkout REST negalim; tik fiksuojam Loco pluginа aktyvu
out.loco_active=allSnips.length? 'see plugins':'?';

// G. Rinkiniu sistema — ar /daugiau-pigiau/ ir rinkinys puslapiai atsako 200
function httpCode(url){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" "'+url+'"',{encoding:'utf8',timeout:40000}); }catch(e){ return 'EXC'; } }
out.http_dp = httpCode(BASE+'/daugiau-pigiau/');
out.http_sprendimai = httpCode(BASE+'/sprendimai/');

putResult('recon2_0707.json',out);
