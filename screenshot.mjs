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
const W=["5 kg","10 kg","20 kg","30 kg","40 kg"];
function buildWet(cells){let t='\n'+MARK+'\n<table>\n<tr><th>\u0160uns svoris</th><th>Kiekis per par\u0105</th></tr>\n';for(let i=0;i<5;i++){t+='<tr><td>'+W[i]+'</td><td>'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>Nurodyti kiekiai \u2014 vienam suaugusiam \u0161uniui per par\u0105 (pilnas dienos davinys). Pa\u0161aras pilnavertis: gali b\u016bti \u0161eriamas atskirai arba derinamas su sausu maistu (atitinkamai ma\u017einant kiek\u012f). Tiksl\u0173 kiek\u012f pritaikykite pagal \u0161uns svor\u012f, am\u017ei\u0173, aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Atidar\u0119 laikykite \u0161aldytuve (2\u20136 \u00b0C) ir su\u0161erkite per 24 val. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';return t;}
const RECIPES=[
 {n:"Pure Beef",ids:[20475,20455],c:["315\u2013360","525\u2013610","885\u20131025","1200\u20131390","1490\u20131725"]},
 {n:"Pure Lamb",ids:[20481,20461],c:["290\u2013340","490\u2013570","825\u2013955","1120\u20131295","1390\u20131610"]},
 {n:"Pure Chicken",ids:[20478,20458],c:["310\u2013355","520\u2013600","875\u20131010","1185\u20131370","1470\u20131700"]},
 {n:"Pure Turkey",ids:[20484,20463],c:["305\u2013355","515\u2013595","865\u20131000","1170\u20131355","1450\u20131680"]},
 {n:"Menu Duck+Pumpkin",ids:[20490,20472],c:["300\u2013350","505\u2013585","850\u2013985","1150\u20131335","1430\u20131655"]},
 {n:"Menu Beef+Potato",ids:[20487,20466],c:["270\u2013310","450\u2013520","760\u2013880","1030\u20131190","1275\u20131475"]}
];
const results=[];
for(const r of RECIPES){
  const ser=buildWet(r.c);
  const probe='<td>'+r.c[0]+' g</td>'; // 5kg distinctive
  for(const id of r.ids){ try{
    const T=readRaw(id); if(T===null){results.push({id,recipe:r.n,ERR:"read"});continue;}
    if(T.indexOf(MARK)>-1){results.push({id,recipe:r.n,SKIP:"MARK exists"});continue;}
    const hasAnal=T.indexOf("Analitin")>-1, hasSud=/Sud\u0117tis/.test(T);
    if(!hasAnal&&!hasSud){results.push({id,recipe:r.n,SKIP:"no Sud/Anal"});continue;}
    const newT=T+ser;
    const okStart=newT.startsWith(T), okSingle=(newT.split(MARK).length-1)===1, analKept=(newT.indexOf("Analitin")>-1)===hasAnal, hasProbe=newT.indexOf(probe)>-1;
    if(!okStart||!okSingle||!analKept||!hasProbe){results.push({id,recipe:r.n,SKIP:"guard",okStart,okSingle,analKept,hasProbe});continue;}
    const wc=writeRaw(id,newT); const after=readRaw(id);
    results.push({id,recipe:r.n,write:wc,ver_mark:after!==null&&after.indexOf(MARK)>-1,ver_probe:after!==null&&after.indexOf(probe)>-1,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_anal:after!==null?(after.indexOf("Analitin")>-1)===hasAnal:false,lossless:after!==null&&md5(after)===md5(newT)});
  }catch(e){results.push({id,recipe:r.n,ERR:String(e).slice(0,100)});}}
}
commit("konswet1_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
