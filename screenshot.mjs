import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SLUGS="auksciausios-kokybes-sausi-maistai-konservai-sunims-katems-ontario,miamor-is-meiles-katems,susipazinkime-prins,auksciausios-kokybes-pasarai-sunims-katems-rasco,saugus-biologiniai-antiparazitiniai-preparatai-gyvunams,jorksyro-terjeras,rusu-melynoji,siamo-kate,geriausias-sausas-sunu-maistas,josera-kaciu-maistas,rotveileris-s-v,cvergsnauceris,mastifas,taksas,biglis,kaukazo-aviganis,samojedas,senbernaras,amerikieciu-putbulterjeras,tibeto-mastifas,dzeko-raselo-terjeras,ciau-ciau,havanu-bisonai,josera-sunu-maistas,kinu-kuduotasis-suo,amerikieciu-buldogas,bokseris,dalmantinas,kolis,suns-mitybos-auditas-skaiciai-kurie-pades-sutaupyti,hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu,monoproteininis-maistas-sunims-kas-tai-ir-kada-verta-rinktis,suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien".split(",");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'blogqa',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:25000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
function html(u){ try{ return execSync('curl -sk -L -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',maxBuffer:20000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
const res=[];
for(const slug of SLUGS){
  const u='/'+slug+'/';
  const c=code(u); const h=html(u);
  const title=((h.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').replace(/&#8211;/g,'-').slice(0,45);
  const h1=((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'').replace(/<[^>]+>/g,'').trim().slice(0,35);
  const canon=((h.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)||[])[1]||'').replace(DEV,'');
  const noindex=/noindex/i.test((h.match(/<meta[^>]*name=["']robots["'][^>]*>/i)||[''])[0]);
  const canonOk=(canon==='/'+slug+'/'||canon==u);
  res.push({slug,code:c,title,h1_ok:h1.length>0,canon,canonOk,noindex,len:h.length});
}
putFile('blogqa.json',JSON.stringify({ts:new Date().toISOString(),res}));
