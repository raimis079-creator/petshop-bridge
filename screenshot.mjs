import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const OLD="https://petshop.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'bp',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:10000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:25000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function oldtitle(u){ try{ const h=execSync('curl -s -L "'+OLD+u+'"',{encoding:'utf8',maxBuffer:10000000,timeout:30000}); return ((h.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').slice(0,70); }catch(e){ return 'EXC'; } }
const out={};
// 1. sprendimai/sterilizuotas-augintinis
out.sprendimai_ster_code=code('/sprendimai/sterilizuotas-augintinis/');
// 2. ar 3 P0 egzistuoja bet kokiu statusu
for(const s of ['sterilizuotu-kaciu-maistas','royal-canin-kaciu-maistas','maistas-sterilizuotai-katei-su-antsvorio-problema']){
  for(const e of ['pages','posts']){
    const r=wp('/wp-json/wp/v2/'+e+'?slug='+s+'&status=any&_fields=slug,status,link');
    try{ const a=JSON.parse(r); if(Array.isArray(a)&&a.length){ out['p0_'+s]={status:a[0].status,ep:e}; break; } }catch(err){}
  }
  if(!out['p0_'+s]) out['p0_'+s]='NERA';
}
// 3. blogid=24 senas turinys
out.blogid24_title=oldtitle('/index.php?route=blog/article/prints&blogid=24');
out.blogid11_title=oldtitle('/index.php?route=blog/article/prints&blogid=11');
// 4. royal canin brand
out.rc_brand_code=code('/gamintojas/royal-canin/');
putFile('bprecon.json',JSON.stringify(out));
