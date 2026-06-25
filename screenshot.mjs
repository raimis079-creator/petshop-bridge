import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
function build1r(rows){let t='\n'+MARK+'\n<table>\n<tr><th>\u0160uns svoris</th><th>Kiekis per par\u0105</th></tr>\n';rows.forEach(r=>{t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+'\u2013'+r[2]+' g</td></tr>\n';});return t+'</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105, normaliai aktyviam suaugusiam \u0161uniui. Pritaikykite pagal gyv\u016bno aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
const ser=build1r([[5,85,115],[10,145,190],[20,245,320],[30,330,435],[40,410,540],[60,555,730],[80,690,905]]);
const results=[];
for(const id of [21321]){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  const hasSud=/Sud\u0117tis/.test(T), hasAnal=T.indexOf("Analitin")>-1, isEmpty=T.trim().length<40;
  if(/<td>\d+\s*kg<\/td>/.test(T)||T.lastIndexOf(MARK)>=0){results.push({id,SKIP:"jau turi lentel\u0119",hasSud,hasAnal});continue;}
  const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):null;
  const newT=T+ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const sudOk= sm? (sm2&&md5(sm2[0])===sud) : true;
  if(!newT.startsWith(T)||!sudOk||(newT.indexOf("Analitin")>-1)!==hasAnal||!/<th>Kiekis per par/.test(newT)){results.push({id,SKIP:"guard",hasSud,hasAnal});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:"JosiDog Lamb Basic",hasSud,hasAnal,contentLen:T.length,write:wc,ver_table:after!==null&&/<td>85\u2013115 g<\/td>/.test(after)&&/<td>690\u2013905 g<\/td>/.test(after),ver_anal:after!==null?(after.indexOf("Analitin")>-1)===hasAnal:false,lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,ERR:String(e).slice(0,120)});}}
commit("waveT_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
