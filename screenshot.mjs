import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const TARGETS=["/auksciausios-kokybes-sausi-maistai-konservai-sunims-katems-ontario/", "/miamor-is-meiles-katems/", "/susipazinkime-prins/", "/auksciausios-kokybes-pasarai-sunims-katems-rasco/", "/saugus-biologiniai-antiparazitiniai-preparatai-gyvunams/", "/jorksyro-terjeras/", "/rusu-melynoji/", "/siamo-kate/", "/geriausias-sausas-sunu-maistas/", "/josera-kaciu-maistas/", "/rotveileris-s-v/", "/cvergsnauceris/", "/mastifas/", "/taksas/", "/biglis/", "/kaukazo-aviganis/", "/samojedas/", "/senbernaras/", "/amerikieciu-putbulterjeras/", "/tibeto-mastifas/", "/dzeko-raselo-terjeras/", "/ciau-ciau/", "/havanu-bisonai/", "/josera-sunu-maistas/", "/kinu-kuduotasis-suo/", "/amerikieciu-buldogas/", "/bokseris/", "/dalmantinas/", "/kolis/", "/suns-mitybos-auditas-skaiciai-kurie-pades-sutaupyti/", "/hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu/", "/monoproteininis-maistas-sunims-kas-tai-ir-kada-verta-rinktis/", "/suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien/"];
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gate',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function wp(path){ try{ return execSync('curl -sk -u ":" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:40000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={ts:new Date().toISOString(),res:[]};
for(const t of TARGETS){
  const slug=t.replace(/^\/|\/$/g,'');
  let found=false,status='none',ep='';
  for(const e of ['pages','posts']){
    try{ const a=JSON.parse(wp('/wp-json/wp/v2/'+e+'?slug='+encodeURIComponent(slug)+'&status=any&_fields=status,slug')); if(Array.isArray(a)&&a.length){ status=a[0].status; ep=e; found=true; break; } }catch(e){}
  }
  out.res.push({target:t,status,ep,found});
  putFile('publishgate.json',JSON.stringify(out));
}
putFile('publishgate.json',JSON.stringify(out));
