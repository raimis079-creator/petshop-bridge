import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const BASE="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'reconm',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+BASE+path+'"',{encoding:'utf8',maxBuffer:200000000,timeout:120000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,120); } putResult('reconm_0707.json',out); }

// Visos Matisse prekes
step('search',()=>{ const raw=wp('/wp-json/wc/v3/products?search=Matisse&per_page=40&status=any'); let d=JSON.parse(raw); return d.map(p=>({id:p.id,name:(p.name||'').slice(0,50),status:p.status})); });
// Konkreciai 14700 turinys + visos KITTEN
step('p14700',()=>{
  const p=JSON.parse(wp('/wp-json/wp/v2/product/14700?context=edit'));
  const c=(p.content&&p.content.raw)||'';
  let frag=''; const m=c.search(/serim|paros doz|paros norm|kitten|kačiuk/i); if(m>=0) frag=c.slice(Math.max(0,m-30),m+350).replace(/\s+/g,' ');
  return {status:p.status, clen:c.length, hasTable:/<table/i.test(c), hasSerimo:/serim|paros doz|paros norm/i.test(c), hasMatisse:/matisse|THIN|FIT|FAT/i.test(c), frag:frag.slice(0,350)};
});
putResult('reconm_0707.json',out);
