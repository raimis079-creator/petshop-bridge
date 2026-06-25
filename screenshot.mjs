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
function buildAge(weights, rows){let t='\n'+MARK+'\n<table>\n<tr><th>Am\u017eius (m\u0117n.)</th>';weights.forEach(w=>{t+='<th>'+w+' kg</th>';});t+='</tr>\n';rows.forEach(r=>{t+='<tr><td>'+r.age+'</td>'+r.vals.map(v=>'<td>'+v+'</td>').join('')+'</tr>\n';});return t+'</table>\n<p>Kiekiai (g per par\u0105) pagal galutin\u012f suaugusio \u0161uns svor\u012f ir am\u017ei\u0173. Nurodyti intervalai \u2014 orientaciniai, pritaikykite pagal augimo temp\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
const ser=buildAge([10,20,30,40,60,80],[
 {age:"1,5\u20132",vals:["95\u2013120 g","150\u2013175 g","190\u2013225 g","235\u2013280 g","245\u2013290 g","305\u2013360 g"]},
 {age:"3",vals:["130\u2013155 g","210\u2013245 g","275\u2013320 g","340\u2013400 g","415\u2013485 g","510\u2013605 g"]},
 {age:"4",vals:["140\u2013165 g","230\u2013270 g","300\u2013355 g","375\u2013440 g","475\u2013560 g","590\u2013690 g"]},
 {age:"5\u20136",vals:["150\u2013175 g","245\u2013290 g","330\u2013390 g","410\u2013480 g","535\u2013630 g","665\u2013780 g"]},
 {age:"7\u201312",vals:["150\u2013170 g","250\u2013290 g","335\u2013400 g","420\u2013495 g","555\u2013675 g","685\u2013835 g"]},
 {age:"13\u201320",vals:["\u2013","\u2013","335\u2013405 g","415\u2013445 g","565\u2013600 g","700\u2013745 g"]}
]);
const results=[];
for(const id of [26399,25237]){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  const hasSud=/Sud\u0117tis/.test(T), hasAnal=T.indexOf("Analitin")>-1;
  if(/<td>\d+\s*kg<\/td>/.test(T)||T.lastIndexOf(MARK)>=0){results.push({id,SKIP:"jau turi lentel\u0119",hasSud,hasAnal});continue;}
  const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):null;
  const newT=T+ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const sudOk= sm? (sm2&&md5(sm2[0])===sud) : true;
  if(!newT.startsWith(T)||!sudOk||(newT.indexOf("Analitin")>-1)!==hasAnal||!/<th>Am\u017eius/.test(newT)||!/<th>10 kg<\/th>/.test(newT)){results.push({id,SKIP:"guard",hasSud,hasAnal});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:"SensiJunior",hasSud,hasAnal,contentLen:T.length,write:wc,ver_5_6:after!==null&&/<td>410\u2013480 g<\/td>/.test(after)&&/<td>535\u2013630 g<\/td>/.test(after)&&/<td>665\u2013780 g<\/td>/.test(after),ver_table:after!==null&&/<td>95\u2013120 g<\/td>/.test(after)&&/<td>700\u2013745 g<\/td>/.test(after),ver_anal:after!==null?(after.indexOf("Analitin")>-1)===hasAnal:false,lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,ERR:String(e).slice(0,120)});}}
commit("waveU_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
