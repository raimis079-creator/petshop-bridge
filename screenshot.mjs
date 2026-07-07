import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'slugqa',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function codeNoFollow(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code} -> %{redirect_url}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function html(u){ try{ return execSync('curl -sk -L -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString()};

const clean='/suns-serimo-lentele-gramais/';
out.clean_code=code(clean);
const h=html(clean);
out.title=((h.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').slice(0,60);
out.h1=((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'').replace(/<[^>]+>/g,'').trim().slice(0,60);
out.canonical=((h.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)||[])[1]||'').replace(DEV,'');
out.body_len=h.length;
out.has_content = /serimo|lentele|grama|dubuo|kg|paros/i.test(h.replace(/<[^>]+>/g,''));
out.noindex = /noindex/i.test((h.match(/<meta[^>]*robots[^>]*>/i)||[''])[0]);

// -2 senas URL: ar redirectina?
out.old2_nofollow = (function(){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}|%{redirect_url}" -u "$WPU:$WPP" "'+DEV+'/suns-serimo-lentele-gramais-2/"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } })();
out.old2_final=code('/suns-serimo-lentele-gramais-2/');

putFile('slugqa.json',JSON.stringify(out));
