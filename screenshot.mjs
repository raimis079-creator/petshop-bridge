import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;
function api(url){
  const code=execSync('curl -sk -o /tmp/r.json -w "%{http_code}" --max-time 45 -u "'+AUTH+'" "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
  let b=''; try{ b=fs.readFileSync('/tmp/r.json','utf8'); }catch(e){}
  return {code, body:b};
}
function hdr(url){
  return execSync('curl -sk -I -u "'+AUTH+'" "'+url+'" 2>/dev/null | tr -d "\r"',{encoding:'utf8'});
}
function head(url){
  return execSync('curl -sk -o /dev/null -w "%{http_code}" --max-time 25 "'+url+'" 2>/dev/null || echo ERR',{encoding:'utf8'}).trim();
}

L('############ SEO BUSENOS RECON ############'); L('');

L('=== 1. Redirection plugin ===');
const pl=api('https://dev.avesa.lt/wp-json/wp/v2/plugins?per_page=100');
if(pl.code==='200'){
  const arr=JSON.parse(pl.body);
  const seo=arr.filter(p=>/redirect|yoast|rank.?math|seo|sitemap/i.test(p.name+p.plugin));
  if(seo.length) seo.forEach(p=>L('  ['+(p.status==='active'?'ON ':'off')+'] '+p.name+' v'+p.version+'  ('+p.plugin+')'));
  else L('  ❌ jokio redirect/SEO plugin\'o nerasta');
  L('');
  L('  is viso plugin\'u: '+arr.length+'  aktyviu: '+arr.filter(p=>p.status==='active').length);
} else L('  HTTP '+pl.code);
L('');

L('=== 2. Blog straipsniai (posts) ===');
const h=hdr('https://dev.avesa.lt/wp-json/wp/v2/posts?per_page=1&status=any');
const tot=(h.match(/x-wp-total:\s*(\d+)/i)||[])[1];
L('  is viso posts (visi statusai): '+(tot||'?'));
for(const st of ['publish','draft','pending','private']){
  const r=hdr('https://dev.avesa.lt/wp-json/wp/v2/posts?per_page=1&status='+st);
  const t=(r.match(/x-wp-total:\s*(\d+)/i)||[])[1];
  L('    '+st.padEnd(10)+' '+(t||'0'));
}
L('');

L('=== 3. Trys "truksta" straipsniai — ar tikrai? ===');
const missing=['royal-canin-kaciu-maistas','sterilizuotu-kaciu-maistas','maistas-sterilizuotai-katei-su-antsvorio-problema'];
for(const s of missing){
  const r=api('https://dev.avesa.lt/wp-json/wp/v2/posts?slug='+s+'&status=any&_fields=id,slug,status,title,link');
  let found=false;
  if(r.code==='200'){
    const arr=JSON.parse(r.body);
    if(arr.length){ found=true; L('  ✅ RASTAS  '+s+'  id='+arr[0].id+'  status='+arr[0].status); }
  }
  if(!found){
    const r2=api('https://dev.avesa.lt/wp-json/wp/v2/pages?slug='+s+'&status=any&_fields=id,status');
    if(r2.code==='200'){ const a=JSON.parse(r2.body); if(a.length){ found=true; L('  ✅ RASTAS kaip PAGE  '+s+'  id='+a[0].id+'  status='+a[0].status); } }
  }
  if(!found){
    const c=head('https://dev.avesa.lt/'+s+'/');
    L('  ❌ NERASTAS  '+s+'   (/'+s+'/ -> HTTP '+c+')');
  }
}
L('');

L('=== 4. Blog draft/publish pavyzdziai ===');
const dr=api('https://dev.avesa.lt/wp-json/wp/v2/posts?per_page=8&status=draft&_fields=id,slug,title');
if(dr.code==='200'){
  const arr=JSON.parse(dr.body);
  L('  draft ('+arr.length+' rodoma):');
  arr.forEach(p=>L('    ['+p.id+'] '+p.slug));
}
const pb=api('https://dev.avesa.lt/wp-json/wp/v2/posts?per_page=5&status=publish&_fields=id,slug');
if(pb.code==='200'){
  const arr=JSON.parse(pb.body);
  L('  publish ('+arr.length+' rodoma):');
  arr.forEach(p=>L('    ['+p.id+'] '+p.slug));
}
L('');

L('=== 5. noindex / blog_public busena ===');
const st=api('https://dev.avesa.lt/wp-json/wp/v2/settings');
if(st.code==='200'){
  try{
    const j=JSON.parse(st.body);
    L('  title: '+j.title);
    L('  url: '+j.url);
    L('  ⚠️ blog_public per REST nepasiekiamas — tikrinam per HTML');
  }catch(e){}
}
const hp=execSync('curl -skL --max-time 30 "https://dev.avesa.lt/" 2>/dev/null | head -c 60000',{encoding:'utf8'});
const robots = hp.match(/<meta[^>]*name="robots"[^>]*>/i);
L('  homepage robots meta: '+(robots?robots[0]:'nerasta'));
L('  noindex: '+(/noindex/i.test(hp)?'✅ TAIP (teisinga staging)':'❌ NE'));
L('');
const rt=execSync('curl -sk --max-time 20 "https://dev.avesa.lt/robots.txt" 2>/dev/null | head -c 400',{encoding:'utf8'});
L('  robots.txt:');
rt.split('\n').slice(0,8).forEach(l=>L('    '+l));
L('');

L('=== 6. Sitemap ===');
for(const s of ['/wp-sitemap.xml','/sitemap.xml','/sitemap_index.xml']){
  const c=head('https://dev.avesa.lt'+s);
  L('  '+String(c).padEnd(5)+' '+s);
}
L('');

L('=== 7. Ar mapping.csv / SEO failai repo ===');
L('  (tikrinam GitHub repo per API)');
try{
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  const r=execSync('curl -s -H "Authorization: Bearer '+tok+'" "https://api.github.com/repos/'+repo+'/contents/screenshots?ref=main" | head -c 400000',{encoding:'utf8',maxBuffer:20000000});
  const arr=JSON.parse(r);
  const seo=arr.filter(f=>/mapping|redirect|seo|sitemap|gsc|inventor/i.test(f.name));
  L('  SEO failai screenshots/: '+seo.length);
  seo.slice(0,15).forEach(f=>L('    '+f.name+'  '+f.size+' B'));
}catch(e){ L('  '+e.message.slice(0,80)); }
putFile('seo_status.txt', out); console.log(out);
