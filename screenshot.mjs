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
const ser=buildAge([5,10,20,30,40,60,80],[
 {age:"1,5\u20132",vals:["70\u201385 g","100\u2013125 g","155\u2013185 g","200\u2013240 g","250\u2013295 g","260\u2013305 g","325\u2013380 g"]},
 {age:"3",vals:["90\u2013105 g","135\u2013160 g","220\u2013260 g","290\u2013340 g","355\u2013420 g","435\u2013510 g","540\u2013635 g"]},
 {age:"4",vals:["95\u2013110 g","150\u2013175 g","240\u2013285 g","320\u2013375 g","395\u2013465 g","500\u2013590 g","620\u2013730 g"]},
 {age:"5\u20136",vals:["100\u2013115 g","155\u2013185 g","260\u2013305 g","350\u2013410 g","430\u2013510 g","565\u2013665 g","700\u2013825 g"]},
 {age:"7\u201312",vals:["100\u2013110 g","160\u2013180 g","265\u2013305 g","355\u2013420 g","440\u2013520 g","585\u2013710 g","725\u2013885 g"]},
 {age:"13\u201320",vals:["\u2013","\u2013","\u2013","355\u2013430 g","440\u2013465 g","595\u2013635 g","740\u2013785 g"]}
]);
const results=[];
for(const id of [26925,26411,26368]){
  try{
    const T=readRaw(id); if(T===null){results.push({id,ERR:"read"});continue;}
    if(/<td>\d+\s*kg<\/td>/.test(T)||T.lastIndexOf(MARK)>=0){results.push({id,SKIP:"jau turi"});continue;}
    const sm=T.match(/Sud\u0117tis:[\s\S]*?<\/p>/); const sud=sm?md5(sm[0]):null; const analP=T.indexOf("Analitin")>-1;
    const newT=T+ser; const sm2=newT.match(/Sud\u0117tis:[\s\S]*?<\/p>/);
    const sudOk= sm? (sm2&&md5(sm2[0])===sud) : true;
    if(!newT.startsWith(T)||!sudOk||(newT.indexOf("Analitin")>-1)!==analP||!/<th>Am\u017eius/.test(newT)||!/<th>5 kg<\/th>/.test(newT)){results.push({id,SKIP:"guard",hadSud:!!sm,anal:analP});continue;}
    const wc=writeRaw(id,newT); const after=readRaw(id);
    results.push({id,recipe:"Junior Duck+Potato A/S",write:wc,ver_table:after!==null&&/<td>70\u201385 g<\/td>/.test(after)&&/<td>740\u2013785 g<\/td>/.test(after),ver_anal:after!==null?(after.indexOf("Analitin")>-1)===analP:false,lossless:after!==null&&md5(after)===md5(newT)});
  }catch(e){results.push({id,ERR:String(e).slice(0,100)});}
}
commit("waveR_"+Date.now()+".json", JSON.stringify(results,null,2));
console.log("DONE");
