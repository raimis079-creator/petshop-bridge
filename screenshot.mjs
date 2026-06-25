import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const D='\u2013', EM='\u2014', DEG='\u00b0';
const W=["5 kg","10 kg","20 kg","30 kg","40 kg"];
function buildWet(cells){let t='\n'+MARK+'\n<table>\n<tr><th>\u0160uns svoris</th><th>Kiekis per par\u0105</th></tr>\n';for(let i=0;i<5;i++){t+='<tr><td>'+W[i]+'</td><td>'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>Nurodyti kiekiai '+EM+' vienam suaugusiam \u0161uniui per par\u0105 (pilnas dienos davinys). Pa\u0161aras pilnavertis: gali b\u016bti \u0161eriamas atskirai arba derinamas su sausu maistu (atitinkamai ma\u017einant kiek\u012f). Tiksl\u0173 kiek\u012f pritaikykite pagal \u0161uns svor\u012f, am\u017ei\u0173, aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Atidar\u0119 laikykite \u0161aldytuve (2'+D+'6 '+DEG+'C) ir su\u0161erkite per 24 val. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';return t;}
function buildJrWet(rows){let t='\n'+MARK+'\n<table>\n<tr><th>Am\u017eius (m\u0117n.)</th>';W.forEach(w=>{t+='<th>'+w+'</th>';});t+='</tr>\n';rows.forEach(r=>{t+='<tr><td>'+r.age+'</td>'+r.v.map(x=>'<td>'+x+' g</td>').join('')+'</tr>\n';});t+='</table>\n<p>Kiekiai (g per par\u0105) pagal galutin\u012f suaugusio \u0161uns svor\u012f ir am\u017ei\u0173. Pa\u0161aras pilnavertis augantiems \u0161unims (nuo 6 sav.). Augan\u010diam \u0161uniui svarbus saikingas energijos kiekis '+EM+' jei \u0161uo per sunkus pagal am\u017ei\u0173, kiek\u012f suma\u017einkite. Atidar\u0119 laikykite \u0161aldytuve (2'+D+'6 '+DEG+'C) ir su\u0161erkite per 24 val. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p>';return t;}
const ADULT=[
 {n:"Pure Beef",ids:[20475,20455],c:["320"+D+"440","540"+D+"740","910"+D+"1240","1230"+D+"1680","1520"+D+"2090"]},
 {n:"Pure Lamb",ids:[20481,20461],c:["300"+D+"410","510"+D+"690","850"+D+"1170","1150"+D+"1580","1430"+D+"1960"]},
 {n:"Pure Chicken",ids:[20478,20458],c:["320"+D+"430","530"+D+"730","890"+D+"1220","1210"+D+"1660","1500"+D+"2060"]},
 {n:"Pure Turkey",ids:[20484,20463],c:["310"+D+"430","530"+D+"720","880"+D+"1210","1200"+D+"1640","1485"+D+"2033"]},
 {n:"Menu Chicken+Carrot",ids:[20493,20469],c:["280"+D+"380","460"+D+"640","780"+D+"1070","1060"+D+"1450","1310"+D+"1800"]},
 {n:"Menu Duck+Pumpkin",ids:[20490,20472],c:["290"+D+"390","480"+D+"660","810"+D+"1100","1100"+D+"1510","1370"+D+"1870"]},
 {n:"Menu Beef+Potato",ids:[20487,20466],c:["270"+D+"370","460"+D+"630","770"+D+"1050","1040"+D+"1420","1290"+D+"1770"]}
];
const JUN_IDS=[21659,21663,21661];
const JUN_ROWS=[
 {age:"1"+D+"2",v:["150"+D+"200","250"+D+"350","390"+D+"550","500"+D+"740","660"+D+"990"]},
 {age:"3"+D+"5",v:["330"+D+"420","540"+D+"730","930"+D+"1200","1250"+D+"1500","1670"+D+"2050"]},
 {age:"6"+D+"12",v:["450"+D+"490","750"+D+"800","1250"+D+"1370","1580"+D+"1720","2100"+D+"2290"]}
];
const results=[];
for(const r of ADULT){ const block=buildWet(r.c); const new5=r.c[0]+" g";
  for(const id of r.ids){ try{
    const T=readRaw(id); if(T===null){results.push({id,recipe:r.n,ERR:"read"});continue;}
    const idx=T.lastIndexOf(MARK); const has=idx>=0;
    let cut=idx; if(has&&T[idx-1]==="\n")cut=idx-1;
    const base=has?T.slice(0,cut):T; const oldBlock=has?T.slice(idx):"";
    const m=oldBlock.match(/5 kg<\/td><td>([^<]+)<\/td>/); const old5=m?m[1]:null;
    const newT=base+block;
    const g_single=(newT.split(MARK).length-1)===1, g_base=newT.startsWith(base), g_anal=(T.indexOf("Analitin")>-1)===(newT.indexOf("Analitin")>-1), g_probe=newT.indexOf("<td>"+new5+"</td>")>-1, g_realdesc=(base.indexOf("Analitin")>-1||/Sud\u0117tis/.test(base));
    results.push({id,recipe:r.n,act:has?"REPLACE":"APPEND",old5k:old5,new5k:new5,g_single,g_base,g_anal,g_probe,g_realdesc});
  }catch(e){results.push({id,recipe:r.n,ERR:String(e).slice(0,100)});}}
}
const jblock=buildJrWet(JUN_ROWS); const jnew5="150"+D+"200 g";
for(const id of JUN_IDS){ try{
  const T=readRaw(id); if(T===null){results.push({id,recipe:"Junior",ERR:"read"});continue;}
  const idx=T.lastIndexOf(MARK); const has=idx>=0;
  let cut=idx; if(has&&T[idx-1]==="\n")cut=idx-1;
  const base=has?T.slice(0,cut):T; const oldBlock=has?T.slice(idx):"";
  const m=oldBlock.match(/<td>1[\u2013\-]2<\/td><td>([^<]+ g)<\/td>/); const old1=m?m[1]:null;
  const newT=base+jblock;
  const g_single=(newT.split(MARK).length-1)===1, g_base=newT.startsWith(base), g_anal=(T.indexOf("Analitin")>-1)===(newT.indexOf("Analitin")>-1), g_probe=newT.indexOf("<td>"+jnew5+"</td>")>-1, g_realdesc=(base.indexOf("Analitin")>-1||/Sud\u0117tis/.test(base));
  results.push({id,recipe:"Junior(shared)",act:has?"REPLACE":"APPEND",old_1_2_5k:old1,new_1_2_5k:jnew5,g_single,g_base,g_anal,g_probe,g_realdesc});
}catch(e){results.push({id,recipe:"Junior",ERR:String(e).slice(0,100)});}}
commit("konsde_dry_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
