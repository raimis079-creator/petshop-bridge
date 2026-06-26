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
const TD='border-bottom: 2px solid #d3d3d3;padding: 7px;';
const STY='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style>';
const D='\u2013';
const WCAT=["2"+D+"3 kg","3"+D+"4 kg","4"+D+"5 kg","5"+D+"7 kg","7"+D+"10 kg"];
const LEGER=["30"+D+"45","45"+D+"60","60"+D+"80","80"+D+"110","110"+D+"140"];
function buildAdultS(cells,extra){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';for(let i=0;i<5;i++){t+='<tr><td style="'+TD+'">'+WCAT[i]+'</td><td style="'+TD+'">'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>Nurodyti kiekiai \u2014 vienai suaugusiai katei per par\u0105 (orientaciniai). Pritaikykite pagal kat\u0117s aktyvum\u0105, am\u017e\u012f ir k\u016bno b\u016bkl\u0119. '+extra+'Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
const KIT_AGE=[["2","50"],["3","45"],["4","40"],["5","35"],["6","30"],["7"+D+"12","20"+D+"30"]];
const KIT_PREG=[["2"+D+"4 kg","40"+D+"90"],["4"+D+"6 kg","90"+D+"140"],["6"+D+"8 kg","140"+D+"180"]];
function buildKittenS(){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Am\u017eius (m\u0117n.)</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_AGE.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Vaikingos kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_PREG.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<p>Kiekiai vienam augintiniui per par\u0105 (orientaciniai). Vaikingoms ir \u017eindan\u010dioms kat\u0117ms poreikis priklauso nuo ka\u010diuk\u0173 skai\u010diaus \u2014 venkite per\u0161\u0117rimo. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
const LEGER_NOTE='Ma\u017eiau aktyvioms ar linkusioms tukti kat\u0117ms galima duoti 25% ma\u017eiau. ';
const B=[[27132,"k",null],[21707,"a",LEGER],[18058,"a",LEGER],[18054,"a",LEGER],[18051,"a",LEGER]];
const results=[];
for(const [id,fmt,cells] of B){try{
  const T=readRaw(id);if(T===null){results.push({id,ERR:"read"});continue;}
  const iMark=T.indexOf(MARK);if(iMark<0){results.push({id,SKIP:"no_mark"});continue;}
  const iTab=T.indexOf("</table>",iMark);const iV=T.indexOf("vandens.</p>",iTab);
  if(iTab<0||iV<0){results.push({id,SKIP:"bounds",iTab,iV});continue;}
  const iEnd=iV+("vandens.</p>".length);
  const oldBlock=T.slice(iMark,iEnd);
  if(oldBlock.indexOf("</table>")<0){results.push({id,SKIP:"no_table_in_old"});continue;}
  const block=fmt==="k"?buildKittenS():buildAdultS(cells, id===27132?'':LEGER_NOTE);
  const newT=T.slice(0,iMark)+block+T.slice(iEnd);
  const probe=fmt==="k"?'7px;">2</td><td style="'+TD+'">50 g</td>':'7px;">'+cells[0]+' g</td>';
  const g={single:(newT.split(MARK).length-1)===1,probe:newT.indexOf(probe)>-1,styled:newT.indexOf('class="b2b-black"')>-1};
  if(!g.single||!g.probe||!g.styled){results.push({id,SKIP:"guard",g});continue;}
  const wc=writeRaw(id,newT);const after=readRaw(id);
  results.push({id,act:"RESTYLED",write:wc,lossless:after!==null&&md5(after)===md5(newT),ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_probe:after!==null&&after.indexOf(probe)>-1});
}catch(e){results.push({id,ERR:String(e).slice(0,80)});}}
commit("catB_apply_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
