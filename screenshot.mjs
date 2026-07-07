import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const OLD="https://petshop.lt";
function putResult(name,obj){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'seorecon3',branch:'main',content:Buffer.from(JSON.stringify(obj),'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pr.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pr.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
const out={ts:new Date().toISOString(),start:'ok'}; putResult('seorecon3_0707.json',out);
function step(k,fn){ try{ out[k]=fn(); }catch(e){ out[k]='ERR:'+String(e.message||e).slice(0,150); } putResult('seorecon3_0707.json',out); }

function fetchXml(u,f){
  execSync('curl -sLk -A "Mozilla/5.0" --max-time 90 -o '+f+'.raw "'+u+'"',{timeout:100000});
  // bandom gunzip; jei ne gzip - kopijuojam
  try{ execSync('gunzip -c '+f+'.raw > '+f+' 2>/dev/null'); if(!fs.existsSync(f)||fs.statSync(f).size<50) throw 0; }
  catch(e){ execSync('cp '+f+'.raw '+f); }
  return fs.readFileSync(f,'utf8');
}

step('sitemap',()=>{
  const x=fetchXml(OLD+'/sitemap.xml','/tmp/s.xml');
  const isIndex=/<sitemapindex/i.test(x);
  const locs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim());
  return {isIndex, count:locs.length, first:locs.slice(0,12), xmlHead:x.slice(0,200)};
});

// jei index -> traukiam kiekviena sub-sitemap ir skaiciuojam
step('subsitemaps',()=>{
  const x=fs.readFileSync('/tmp/s.xml','utf8');
  if(!/<sitemapindex/i.test(x)) return 'not-index';
  const subs=(x.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim());
  const res={};
  subs.slice(0,10).forEach((su,i)=>{
    try{ const sx=fetchXml(su,'/tmp/sub'+i+'.xml'); const locs=(sx.match(/<loc>([^<]+)<\/loc>/gi)||[]).map(m=>m.replace(/<\/?loc>/gi,'').trim());
      res[su.replace(/https?:\/\/[^/]+/,'')]={count:locs.length, sample:locs.slice(0,4).map(u=>u.replace(/https?:\/\/[^/]+/,''))};
    }catch(e){ res[su]='ERR'; }
  });
  return res;
});

putResult('seorecon3_0707.json',out);
