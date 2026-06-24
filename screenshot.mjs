import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
function buildAge(weights, rows){
  let t='\n<p><strong>\u0160\u0117rimo instrukcija:</strong></p>\n<table>\n<tr><th>Am\u017eius (m\u0117n.)</th>';
  weights.forEach(w=>{t+='<th>'+w+' kg</th>';}); t+='</tr>\n';
  rows.forEach(r=>{t+='<tr><td>'+r.age+'</td>'+r.vals.map(v=>'<td>'+v+'</td>').join('')+'</tr>\n';});
  return t+'</table>\n<p>Kiekiai (g per par\u0105) pagal galutin\u012f suaugusio \u0161uns svor\u012f ir am\u017ei\u0173. Nurodyti intervalai \u2014 orientaciniai, pritaikykite pagal augimo temp\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';
}
const weights=[10,20,30,40,60,80];
const rows=[
 {age:"1,5",  vals:["35\u201375 g","55\u2013115 g","75\u2013190 g","95\u2013250 g","110\u2013260 g","145\u2013325 g"]},
 {age:"2",    vals:["80\u2013110 g","130\u2013155 g","175\u2013210 g","235\u2013285 g","270\u2013330 g","360\u2013440 g"]},
 {age:"3",    vals:["130\u2013150 g","220\u2013270 g","270\u2013325 g","370\u2013410 g","455\u2013520 g","510\u2013605 g"]},
 {age:"4",    vals:["155\u2013165 g","285\u2013350 g","345\u2013415 g","380\u2013490 g","535\u2013670 g","640\u2013745 g"]},
 {age:"5\u20136",vals:["150\u2013175 g","295\u2013360 g","380\u2013440 g","455\u2013520 g","650\u2013790 g","790\u2013890 g"]},
 {age:"7\u201312",vals:["145\u2013170 g","275\u2013335 g","370\u2013415 g","445\u2013500 g","740\u2013835 g","865\u2013930 g"]},
 {age:"13\u201320",vals:["\u2013","\u2013","355\u2013400 g","430\u2013490 g","695\u2013780 g","790\u2013835 g"]}
];
const ser=buildAge(weights,rows);
const results=[];
for(const id of [26399,25237]){
  try{
    const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
    if(/<th>Am\u017eius/.test(T)||/<th>\u0160uns svoris<\/th>/.test(T)||/<td>\d+\s*kg<\/td>/.test(T)||/\u0160\u0117rim(o|as)/.test(T)){results.push({id,SKIP:"jau turi"});continue;}
    const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):"NONE"; const analP=T.indexOf("Analitin")>-1;
    const newT=T+ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
    if(!newT.startsWith(T)||!(sm2&&md5(sm2[0])===sud)||(newT.indexOf("Analitin")>-1)!==analP||!/<th>Am\u017eius/.test(newT)){results.push({id,SKIP:"guard"});continue;}
    const wc=writeRaw(id,newT); const after=readRaw(id);
    results.push({id,recipe:"SensiJunior",write:wc,ver_table:after!==null&&/<th>Am\u017eius/.test(after)&&/35\u201375 g/.test(after)&&/865\u2013930 g/.test(after),ver_sud:after!==null&&md5((after.match(/Sud\u0117tis:[\s\S]*?<\/p>/)||[""])[0])===sud,ver_anal:after!==null&&after.indexOf("Analitin")>-1,lossless:after!==null&&md5(after)===md5(newT)});
  }catch(e){results.push({id,ERR:String(e).slice(0,100)});}
}
commit("waveF_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
