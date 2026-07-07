import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'caturl',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:5000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString(),res:[]};
// gaunam realius category link per wp/v2/product_cat
const slugs=['tualetai-kraikai-semtuveliai','transportavimo-dezes-sunims','akvariumo-zuvyciu-maistas','sausas-maistas-sunims','sunims','maistas-katems'];
for(const s of slugs){
  let link='',cnt='',flat='?',nested='';
  try{ const a=JSON.parse(wp('/wp-json/wp/v2/product_cat?slug='+s+'&_fields=link,count,slug')); if(Array.isArray(a)&&a.length){ link=(a[0].link||'').replace(DEV,''); cnt=a[0].count; } }catch(e){ link='ERR'; }
  // testuojam flat URL koda
  try{ flat=execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+'/kategorija/'+s+'/"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ flat='EXC'; }
  out.res.push({slug:s,real_link:link,count:cnt,flat_code:flat});
  putFile('caturl.json',JSON.stringify(out));
}
putFile('caturl.json',JSON.stringify(out));
