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
function fmt3(rows){let t='\n'+MARK+'\n<table>\n<tr><th>\u0160uns svoris</th><th>Neaktyvus / senyvas</th><th>Normaliai aktyvus</th><th>Aktyvus</th></tr>\n';rows.forEach(r=>{t+='<tr><td>'+r[0]+' kg</td><td>'+r[1]+' g</td><td>'+r[2]+' g</td><td>'+r[3]+' g</td></tr>\n';});return t+'</table>\n<p>Nurodyti kiekiai \u2014 vienam gyv\u016bnui per par\u0105. Pritaikykite pagal gyv\u016bno aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
function buildAge(weights, rows){let t='\n'+MARK+'\n<table>\n<tr><th>Am\u017eius (m\u0117n.)</th>';weights.forEach(w=>{t+='<th>'+w+' kg</th>';});t+='</tr>\n';rows.forEach(r=>{t+='<tr><td>'+r.age+'</td>'+r.vals.map(v=>'<td>'+v+'</td>').join('')+'</tr>\n';});return t+'</table>\n<p>Kiekiai (g per par\u0105) pagal galutin\u012f suaugusio \u0161uns svor\u012f ir am\u017ei\u0173. Nurodyti intervalai \u2014 orientaciniai, pritaikykite pagal augimo temp\u0105 ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';}
const kidsSer=buildAge([10,20,30,40,60,80],[
 {age:"1,5\u20132",vals:["105\u2013130 g","160\u2013185 g","205\u2013240 g","255\u2013300 g","265\u2013310 g","330\u2013385 g"]},
 {age:"3",vals:["140\u2013165 g","225\u2013265 g","295\u2013345 g","365\u2013430 g","445\u2013520 g","550\u2013650 g"]},
 {age:"4",vals:["150\u2013175 g","245\u2013290 g","325\u2013380 g","405\u2013475 g","510\u2013600 g","630\u2013745 g"]},
 {age:"5\u20136",vals:["160\u2013185 g","265\u2013310 g","355\u2013415 g","440\u2013515 g","575\u2013675 g","715\u2013840 g"]},
 {age:"7\u201312",vals:["160\u2013185 g","270\u2013310 g","360\u2013425 g","450\u2013530 g","595\u2013725 g","735\u2013900 g"]},
 {age:"13\u201320",vals:["\u2013","\u2013","360\u2013435 g","450\u2013475 g","610\u2013645 g","755\u2013800 g"]}
]);
const results=[];
// APPEND fixes (Mini S&C 3-col, Mini Senior C&R 2-col) — relaxed sud guard
const appendJobs=[
 {recipe:"Mini Salmon & Chicken", ser:fmt3([[2,20,25,30],[4,35,50,60],[6,55,70,90],[8,65,90,110],[10,80,110,135]]), ids:[26901,25391], probe:"<td>80 g</td>"},
 {recipe:"Mini Senior Chicken & Rice", ser:fmt2([[2,45,50],[4,75,85],[6,100,115],[8,120,140],[10,145,165]]), ids:[26435], probe:"<td>145 g</td>"}
];
for(const J of appendJobs){ for(const id of J.ids){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  if(/<td>\d+\s*kg<\/td>/.test(T)||T.lastIndexOf(MARK)>=0){results.push({id,SKIP:"jau turi table"});continue;}
  const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):null; const analP=T.indexOf("Analitin")>-1;
  const newT=T+J.ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const sudOk = sm? (sm2&&md5(sm2[0])===sud) : true;
  if(!newT.startsWith(T)||!sudOk||(newT.indexOf("Analitin")>-1)!==analP||!/<th>\u0160uns svoris<\/th>/.test(newT)){results.push({id,SKIP:"guard",hadSud:!!sm,anal:analP});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:J.recipe,mode:"append",write:wc,ver_table:after!==null&&after.indexOf(J.probe)>-1&&/<td>2 kg<\/td>/.test(after),ver_anal:after!==null?(after.indexOf("Analitin")>-1)===analP:false,lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,ERR:String(e).slice(0,100)});}}}
// REPLACE Kids (old -> current M/M)
for(const id of [27130,25475,25471,24644]){ try{
  const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
  const idx=T.lastIndexOf(MARK);
  if(idx<0){ // no existing block -> append
    const newT=T+kidsSer; const wc=writeRaw(id,newT); const after=readRaw(id);
    results.push({id,recipe:"Kids",mode:"append-new",write:wc,ver_table:after!==null&&/<td>105\u2013130 g<\/td>/.test(after)&&/<td>755\u2013800 g<\/td>/.test(after),lossless:after!==null&&md5(after)===md5(newT)});continue;}
  let cut=idx; if(T[idx-1]==='\n') cut=idx-1;
  const base=T.slice(0,cut); const oldBlock=T.slice(cut);
  const sm=base.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const analP=base.indexOf("Analitin")>-1;
  if(!/<table>/.test(oldBlock)){results.push({id,ERR:"oldblock no table"});continue;}
  const newT=base+kidsSer; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
  const sudOk= sm? (sm2&&md5(sm2[0])===md5(sm[0])) : true;
  if(!sudOk||(newT.indexOf("Analitin")>-1)!==analP||!/<th>Am\u017eius/.test(newT)||(newT.split(MARK).length-1)!==1){results.push({id,SKIP:"guard replace"});continue;}
  const wc=writeRaw(id,newT); const after=readRaw(id);
  results.push({id,recipe:"Kids",mode:"REPLACE",write:wc,
    new_present:after!==null&&/<td>105\u2013130 g<\/td>/.test(after)&&/<td>755\u2013800 g<\/td>/.test(after),
    old_gone:after!==null&&!/2 m\u0117n\./.test(after)&&!/Suaugusio svoris/.test(after),
    single_block:after!==null&&(after.split(MARK).length-1)===1,
    ver_anal:after!==null&&after.indexOf("Analitin")>-1,
    lossless:after!==null&&md5(after)===md5(newT)});
}catch(e){results.push({id,ERR:String(e).slice(0,100)});}}
commit("waveQ_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
