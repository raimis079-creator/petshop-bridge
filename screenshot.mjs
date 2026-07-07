import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SLUGS="auksciausios-kokybes-sausi-maistai-konservai-sunims-katems-ontario,miamor-is-meiles-katems,susipazinkime-prins,auksciausios-kokybes-pasarai-sunims-katems-rasco,saugus-biologiniai-antiparazitiniai-preparatai-gyvunams,jorksyro-terjeras,rusu-melynoji,siamo-kate,geriausias-sausas-sunu-maistas,josera-kaciu-maistas,rotveileris-s-v,cvergsnauceris,mastifas,taksas,biglis,kaukazo-aviganis,samojedas,senbernaras,amerikieciu-putbulterjeras,tibeto-mastifas,dzeko-raselo-terjeras,ciau-ciau,havanu-bisonai,josera-sunu-maistas,kinu-kuduotasis-suo,amerikieciu-buldogas,bokseris,dalmantinas,kolis,suns-mitybos-auditas-skaiciai-kurie-pades-sutaupyti,hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu,monoproteininis-maistas-sunims-kas-tai-ir-kada-verta-rinktis,suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien".split(",");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'bloggate',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function code(u){ try{ return execSync('curl -sk -o /dev/null -w "%{http_code}" -u "$WPU:$WPP" "'+DEV+u+'"',{encoding:'utf8',timeout:30000,env:{...process.env,WPU,WPP}}).trim(); }catch(e){ return 'EXC'; } }
const res=[];
for(const slug of SLUGS){
  let status='none',ep='',id=0,contentLen=0;
  for(const e of ['pages','posts']){
    const raw=wp('/wp-json/wp/v2/'+e+'?slug='+slug+'&status=any&_fields=id,status,title,content');
    try{ const a=JSON.parse(raw); if(Array.isArray(a)&&a.length){ status=a[0].status; ep=e; id=a[0].id; contentLen=((a[0].content||{}).rendered||'').length; break; } }catch(e){}
  }
  // frontend patikra (jei publikuota, gautu 200; dev noindex laukiama)
  const httpCode=code('/'+slug+'/');
  const html= (status==='publish')? wp('/'+slug+'/') : '';
  const title=((html.match(/<title>([^<]*)<\/title>/i)||[])[1]||'').slice(0,50);
  const h1=((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)||[])[1]||'').replace(/<[^>]+>/g,'').trim().slice(0,40);
  const canonical=((html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)["']/i)||[])[1]||'').replace(DEV,'');
  const noindex=/noindex/i.test((html.match(/<meta[^>]*robots[^>]*>/i)||[''])[0]);
  res.push({slug,status,ep,id,contentLen,httpCode,title,h1,canonical,noindex});
}
putFile('bloggate.json',JSON.stringify({ts:new Date().toISOString(),res}));
