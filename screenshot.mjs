import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'seorecon4',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={ts:new Date().toISOString(),start:'ok'}; putResult('seorecon4_0707.json',out);
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,150); } putResult('seorecon4_0707.json',out); }
function gx(u,f){ execSync('curl -sLk -A "Mozilla/5.0" --max-time 90 -o '+f+'.raw "'+u+'"',{timeout:100000}); try{ execSync('gunzip -c '+f+'.raw > '+f+' 2>/dev/null'); if(!fs.existsSync(f)||fs.statSync(f).size<50) throw 0; }catch(e){ execSync('cp '+f+'.raw '+f); } return fs.readFileSync(f,'utf8'); }

step('generator',()=>{
  const x=gx(OLD+'/index.php?route=feed/google_sitemap/generate','/tmp/g.xml');
  const isIndex=/<sitemapindex/i.test(x);
  const locs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim());
  // klasifikacija
  const cat={product:0,category:0,manufacturer:0,info:0,blog:0,other:0}; const s={p:[],c:[],m:[],i:[]};
  locs.forEach(u=>{ const p=u.replace(/https?:\/\/[^/]+/,'').replace(/&amp;/g,'&');
    if(/route=product\/manufacturer|\/gamintojai|manufacturer_id/i.test(p)){cat.manufacturer++; if(s.m.length<5)s.m.push(p);}
    else if(/route=product\/category|path=/i.test(p)){cat.category++; if(s.c.length<5)s.c.push(p);}
    else if(/route=product\/product|product_id=/i.test(p)){cat.product++; if(s.p.length<5)s.p.push(p);}
    else if(/-\d{3,}(-\d+)?\/?$/.test(p)){cat.product++; if(s.p.length<5)s.p.push(p);}
    else if(/(sunims|katems|grauzik|pauksc|zuvim|maistas|akcij|daugiau-pigiau)/i.test(p)){cat.category++; if(s.c.length<5)s.c.push(p);}
    else if(/(blog|straipsn|naujien|veisl|patar)/i.test(p)){cat.blog++; if(s.i.length<5)s.i.push(p);}
    else if(/(apie|pristatym|grazinim|kontakt|taisykl|privatum)/i.test(p)){cat.info++;}
    else {cat.other++; if(s.i.length<5)s.i.push('?'+p);}
  });
  return {isIndex,total:locs.length,cat,samplesP:s.p,samplesC:s.c,samplesM:s.m,samplesOther:s.i,head:x.slice(0,150)};
});
putResult('seorecon4_0707.json',out);
