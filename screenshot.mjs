import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function pr(n,o){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?nocache='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:Buffer.from(JSON.stringify(o)).toString('base64'),...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c;}return 'fail';}
function get(url){ try{ return execSync('curl -skL --max-time 15 "'+url+'"',{maxBuffer:15*1024*1024}).toString(); }catch(e){ return ''; } }
const cats=['https://exclusion.lt/intestinal/','https://exclusion.lt/hydrolyzed-hypoallergenic/'];
const prodUrls=new Set();
for(const c of cats){
  const html=get(c);
  const re=/https:\/\/exclusion\.lt\/product\/[a-z0-9\-]+\//g;
  let m; while((m=re.exec(html))!==null){ prodUrls.add(m[0]); }
}
const out=[];
for(const purl of prodUrls){
  const html=get(purl);
  let title=''; const tm=html.match(/<title>([^<]+)<\/title>/); if(tm)title=tm[1].replace(' - exclusion.lt','').trim();
  const imgs=[];
  const ire=/https:\/\/exclusion\.lt\/wp-content\/uploads\/[0-9\/]+[^"'\s]*(?:SERIMAS|serimas)[^"'\s]*\.png/g;
  let im; while((im=ire.exec(html))!==null){ imgs.push(im[0]); }
  out.push({url:purl,title:title,serimas:[...new Set(imgs)]});
}
console.log('PUT:',pr('crawl2.json',{products:out.length,data:out}));
