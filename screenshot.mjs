import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putFile(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'seoinv',branch:'main',content:Buffer.isBuffer(buf)?buf.toString('base64'):Buffer.from(buf,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={ts:new Date().toISOString(),start:'ok'}; putFile('seoinv_meta.json',JSON.stringify(out));
function gx(u,f){ execSync('curl -sLk -A "Mozilla/5.0" --max-time 90 -o '+f+'.raw "'+u+'"',{timeout:100000}); try{ execSync('gunzip -c '+f+'.raw > '+f+' 2>/dev/null'); if(!fs.existsSync(f)||fs.statSync(f).size<40) throw 0; }catch(e){ execSync('cp '+f+'.raw '+f); } return fs.readFileSync(f,'utf8'); }
function locs(x){ return (x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim()); }
function typeOf(sub){ const s=sub.toLowerCase(); if(s.includes('product'))return'product'; if(s.includes('category'))return'category'; if(s.includes('manufacturer'))return'brand'; if(s.includes('information'))return'info'; if(s.includes('blog'))return'blog'; return'other'; }

try{
  const idx=gx(OLD+'/index.php?route=feed/google_sitemap/generate','/tmp/idx.xml');
  const subs=locs(idx);
  out.subs=subs.map(s=>s.replace(/https?:\/\/[^/]+/,''));
  putFile('seoinv_meta.json',JSON.stringify(out));

  const rows=[]; const counts={};
  for(const su of subs){
    const t=typeOf(su);
    let sx; try{ sx=gx(su,'/tmp/'+t+'_'+Math.random().toString(36).slice(2,6)+'.xml'); }catch(e){ out['err_'+su]=String(e).slice(0,60); continue; }
    // istraukiam <url><loc>..</loc><lastmod>..</lastmod>
    const urlBlocks=sx.split(/<url>/i).slice(1);
    let n=0;
    urlBlocks.forEach(b=>{ const l=(b.match(/<loc>([^<]+)<\/loc>/i)||[])[1]; if(!l)return; const lm=(b.match(/<lastmod>([^<]+)<\/lastmod>/i)||[])[1]||''; rows.push({url:l.trim().replace(/&amp;/g,'&'),type:t,lastmod:lm.trim()}); n++; });
    counts[su.replace(/https?:\/\/[^/]+/,'')]={type:t,n};
  }
  out.counts=counts; out.total=rows.length;
  // by type
  const byType={}; rows.forEach(r=>byType[r.type]=(byType[r.type]||0)+1); out.byType=byType;
  putFile('seoinv_meta.json',JSON.stringify(out));

  // CSV
  let csv='url,type,lastmod\n';
  rows.forEach(r=>{ const u='"'+r.url.replace(/"/g,'""')+'"'; csv+=u+','+r.type+','+r.lastmod+'\n'; });
  putFile('senas_url_inventorius.csv', csv);
  // taip pat JSON (atsargai)
  putFile('seoinv_rows.json', JSON.stringify(rows));
  out.done=true; putFile('seoinv_meta.json',JSON.stringify(out));
}catch(e){ out.fatal=String(e.message||e).slice(0,200); putFile('seoinv_meta.json',JSON.stringify(out)); }
