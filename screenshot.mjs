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
function fmt2(rows){let t='\n'+MARK+'\n<table>\n<tr><th>\u0160uns svoris</th><th>Aktyvumas iki 1 val./d.</th><th>Aktyvumas iki 3 val./d.</th></tr>\n';rows.forEach(r=>{t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td><td>'+r[2]+' g</td></tr>\n';});return t+'</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105 (pagal aktyvum\u0105). Pritaikykite pagal gyv\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
function buildAge(weights, rows){let t='\n'+MARK+'\n<table>\n<tr><th>Am\u017eius (m\u0117n.)</th>';weights.forEach(w=>{t+='<th>'+w+' kg</th>';});t+='</tr>\n';rows.forEach(r=>{t+='<tr><td>'+r.age+'</td>'+r.vals.map(v=>'<td>'+v+'</td>').join('')+'</tr>\n';});return t+'</table>\n<p>Kiekiai (g per par\u0105) pagal galutin\u012f suaugusio \u0161uns svor\u012f ir am\u017ei\u0173. Nurodyti intervalai \u2014 orientaciniai, pritaikykite pagal augimo temp\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
const mjSer=buildAge([2,4,6,8,10],[
 {age:"1,5\u20132",vals:["30\u201340 g","50\u201365 g","70\u201390 g","80\u2013100 g","95\u2013120 g"]},
 {age:"3",vals:["40\u201345 g","65\u201380 g","90\u2013105 g","110\u2013130 g","130\u2013150 g"]},
 {age:"4",vals:["40\u201350 g","70\u201385 g","95\u2013115 g","115\u2013140 g","140\u2013165 g"]},
 {age:"5\u20136",vals:["45\u201350 g","75\u201385 g","100\u2013120 g","125\u2013145 g","145\u2013170 g"]},
 {age:"7\u201312",vals:["45\u201350 g","75\u201385 g","100\u2013115 g","125\u2013145 g","150\u2013170 g"]}
]);
const jobs=[
 {recipe:"MiniJunior Duck+Salmon", ser:mjSer, ids:[25387,25383], age:true, probe:"<td>30\u201340 g</td>", probe2:"<td>150\u2013170 g</td>"},
 {recipe:"Mini Lamb & Sweet Potato", ser:fmt2([[2,40,50],[4,70,80],[6,95,110],[8,120,140],[10,140,165]]), ids:[26884,26418,26365], age:false, probe:"<td>2 kg</td>", probe2:"<td>165 g</td>"},
 {recipe:"Mini Lamb", ser:fmt2([[2,40,50],[4,70,80],[6,95,110],[8,120,135],[10,140,160]]), ids:[25411,25407], age:false, probe:"<td>2 kg</td>", probe2:"<td>135 g</td>"}
];
const results=[];
for(const J of jobs){ for(const id of J.ids){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  if(/<td>\d+\s*kg<\/td>/.test(T)||T.lastIndexOf(MARK)>=0){results.push({id,SKIP:"jau turi"});continue;}
  const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):null; const analP=T.indexOf("Analitin")>-1;
  const newT=T+J.ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const sudOk= sm? (sm2&&md5(sm2[0])===sud) : true;
  const hdrOk = J.age? /<th>Am\u017eius/.test(newT) : /<th>\u0160uns svoris<\/th>/.test(newT);
  if(!newT.startsWith(T)||!sudOk||(newT.indexOf("Analitin")>-1)!==analP||!hdrOk){results.push({id,SKIP:"guard",hadSud:!!sm});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:J.recipe,write:wc,ver_table:after!==null&&after.indexOf(J.probe)>-1&&after.indexOf(J.probe2)>-1,ver_anal:after!==null?(after.indexOf("Analitin")>-1)===analP:false,lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,ERR:String(e).slice(0,100)});}}}
commit("waveS_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
