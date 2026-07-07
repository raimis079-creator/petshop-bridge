import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const SLUGS="auksciausios-kokybes-sausi-maistai-konservai-sunims-katems-ontario,miamor-is-meiles-katems,susipazinkime-prins,auksciausios-kokybes-pasarai-sunims-katems-rasco,saugus-biologiniai-antiparazitiniai-preparatai-gyvunams,jorksyro-terjeras,rusu-melynoji,siamo-kate,geriausias-sausas-sunu-maistas,josera-kaciu-maistas,rotveileris-s-v,cvergsnauceris,mastifas,taksas,biglis,kaukazo-aviganis,samojedas,senbernaras,amerikieciu-putbulterjeras,tibeto-mastifas,dzeko-raselo-terjeras,ciau-ciau,havanu-bisonai,josera-sunu-maistas,kinu-kuduotasis-suo,amerikieciu-buldogas,bokseris,dalmantinas,kolis,suns-mitybos-auditas-skaiciai-kurie-pades-sutaupyti,hipoalerginis-maistas-senjoru-sunims-kaip-issirinkti-be-burtu,monoproteininis-maistas-sunims-kas-tai-ir-kada-verta-rinktis,suo-nuolat-kasosi-7-priezastys-ir-3-minuciu-planas-ka-daryti-siandien";

function putFile(name,str){
  try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
    let sha='';
    try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const body={message:'gate4',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};
    if(sha) body.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(body));
    return execSync('curl -s -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
  }catch(e){ return 'PUTERR:'+String(e.message||e).slice(0,200); }
}

let pagesRaw='ERR', postsRaw='ERR';
try{
  pagesRaw=execSync('curl -sk -u "$WPU:$WPP" "'+DEV+'/wp-json/wp/v2/pages?slug='+SLUGS+'&status=any&per_page=100&_fields=slug,status"',{encoding:'utf8',maxBuffer:5000000,timeout:60000,env:{...process.env,WPU,WPP}});
}catch(e){ pagesRaw='EXC:'+String(e.message||e).slice(0,200); }
try{
  postsRaw=execSync('curl -sk -u "$WPU:$WPP" "'+DEV+'/wp-json/wp/v2/posts?slug='+SLUGS+'&status=any&per_page=100&_fields=slug,status"',{encoding:'utf8',maxBuffer:5000000,timeout:60000,env:{...process.env,WPU,WPP}});
}catch(e){ postsRaw='EXC:'+String(e.message||e).slice(0,200); }

const out={ts:new Date().toISOString(),pagesRaw:pagesRaw.slice(0,8000),postsRaw:postsRaw.slice(0,8000)};
putFile('publishgate4.json', JSON.stringify(out));
