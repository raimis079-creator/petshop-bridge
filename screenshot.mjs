import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
function build1r(rows){
  let t='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>\u0160uns svoris</th><th>Kiekis per par\u0105</th></tr>\n';
  rows.forEach(r=>{t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td></tr>\n';});
  return t+'</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105; ma\u017eiau aktyviems / senyviems \u0161unims. Pritaikykite pagal gyv\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';
}
const ser=build1r([[5,"90\u2013120"],[10,"150\u2013205"],[20,"260\u2013345"],[30,"355\u2013465"],[40,"440\u2013580"],[60,"595\u2013785"],[80,"740\u2013975"]]);
const results=[];
for(const id of [21043,21041]){
  try{
    const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
    if(/<th>\u0160uns svoris<\/th>/.test(T)||/<th>Am\u017eius/.test(T)||/<td>\d+\s*kg<\/td>/.test(T)||/\u0160\u0117rim(o|as)/.test(T)){results.push({id,SKIP:"jau turi"});continue;}
    const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):"NONE"; const analP=T.indexOf("Analitin")>-1;
    const newT=T+ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
    if(!newT.startsWith(T)||!(sm2&&md5(sm2[0])===sud)||(newT.indexOf("Analitin")>-1)!==analP||!/<th>\u0160uns svoris<\/th>/.test(newT)){results.push({id,SKIP:"guard",hasSud:!!sm,anal:analP});continue;}
    const wc=writeRaw(id,newT); const after=readRaw(id);
    results.push({id,recipe:"JosiDog Senior/Light",write:wc,ver_table:after!==null&&/<td>90\u2013120 g<\/td>/.test(after)&&/<td>740\u2013975 g<\/td>/.test(after),ver_sud:after!==null&&md5((after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0])===sud,ver_anal:after!==null&&after.indexOf("Analitin")>-1,lossless:after!==null&&md5(after)===md5(newT)});
  }catch(e){results.push({id,ERR:String(e).slice(0,100)});}
}
commit("waveI_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
