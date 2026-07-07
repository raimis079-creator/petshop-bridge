import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'feed',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:50000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};
// serimo lentele — ieskom pages+posts pagal slug ir pagal paieska
const slugs=['suns-serimo-lentele-gramais','serimo-lentele','suns-serimo-lentele'];
out.byslug=[];
for(const s of slugs){
  for(const ep of ['pages','posts']){
    try{ const a=JSON.parse(wp('/wp-json/wp/v2/'+ep+'?slug='+s+'&status=any&_fields=id,slug,status,link,title')); if(Array.isArray(a)&&a.length){ out.byslug.push({s,ep,found:a[0].status,slug:a[0].slug,link:(a[0].link||'').replace(DEV,'')}); } }catch(e){}
  }
}
// paieska pagal "serimo" ir "lentele"
for(const q of ['serimo','lentele','grama']){
  for(const ep of ['pages','posts']){
    try{ const a=JSON.parse(wp('/wp-json/wp/v2/'+ep+'?search='+q+'&status=any&per_page=5&_fields=slug,status,title')); if(Array.isArray(a)&&a.length){ out['search_'+q+'_'+ep]=a.map(x=>({slug:x.slug,st:x.status,t:(x.title&&x.title.rendered||'').slice(0,35)})); } }catch(e){}
  }
}
// athena brand?
try{ const a=JSON.parse(wp('/wp-json/wp/v2/product_brand?slug=athena&_fields=slug,count')); out.athena=Array.isArray(a)&&a.length?{count:a[0].count}:'no-term'; }catch(e){ out.athena='err'; }
putFile('feedcheck.json',JSON.stringify(out));
