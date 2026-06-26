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
function adultNote(extra){return 'Nurodyti kiekiai \u2014 vienai suaugusiai katei per par\u0105 (orientaciniai). Pritaikykite pagal kat\u0117s aktyvum\u0105, am\u017e\u012f ir k\u016bno b\u016bkl\u0119. '+extra+'Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';}
function buildAdultS(cells,extra){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';for(let i=0;i<5;i++){t+='<tr><td style="'+TD+'">'+WCAT[i]+'</td><td style="'+TD+'">'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>'+adultNote(extra||'')+'</p></div>';return t;}
const KIT_AGE=[["2","50"],["3","45"],["4","40"],["5","35"],["6","30"],["7"+D+"12","20"+D+"30"]];
const KIT_PREG=[["2"+D+"4 kg","40"+D+"90"],["4"+D+"6 kg","90"+D+"140"],["6"+D+"8 kg","140"+D+"180"]];
function buildKittenS(){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Am\u017eius (m\u0117n.)</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_AGE.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Vaikingos kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_PREG.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<p>Kiekiai vienam augintiniui per par\u0105 (orientaciniai). Vaikingoms ir \u017eindan\u010dioms kat\u0117ms poreikis priklauso nuo ka\u010diuk\u0173 skai\u010diaus \u2014 venkite per\u0161\u0117rimo. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
const ADULT_CELLS={SensiCat:["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],Culinesse:["30"+D+"45","45"+D+"60","60"+D+"75","75"+D+"105","105"+D+"135"],Marinesse:["30"+D+"45","45"+D+"55","55"+D+"70","70"+D+"100","100"+D+"130"],NatureCat:["25"+D+"35","45"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],DailyCat:["25"+D+"45","40"+D+"55","55"+D+"70","70"+D+"100","100"+D+"130"],Catelux:["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],Senior:["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],Naturelle:["30"+D+"45","45"+D+"60","60"+D+"80","80"+D+"105","105"+D+"135"]};
function matchDiv(T,iStart){let depth=0,i=iStart;while(i<T.length){const no=T.indexOf("<div",i),nc=T.indexOf("</div>",i);if(nc<0)return -1;if(no>=0&&no<nc){depth++;i=no+4;}else{depth--;i=nc+6;if(depth===0)return nc+6;}}return -1;}
const D1=[[27134,"SensiCat","a"],[21846,"DailyCat","a"],[21789,"Senior","a"],[21785,"Senior","a"],[21766,"Naturelle","a"],[21762,"SensiCat","a"],[21757,"NatureCat","a"],[21752,"Marinesse","a"],[21744,"Culinesse","a"],[21735,"Catelux","a"],[21728,"NatureCat","a"],[21840,"KittenGrainfree","k"],[21740,"Kitten","k"]];
const cntDiv=s=>[(s.split("<div").length-1),(s.split("</div>").length-1)];
const results=[];
for(const [id,line,fmt] of D1){try{
  const T=readRaw(id);if(T===null){results.push({id,line,ERR:"read"});continue;}
  const iH=T.indexOf("Rekomenduojamas kiekis per par");if(iH<0){results.push({id,line,SKIP:"no_legacy"});continue;}
  const iStart=T.lastIndexOf("<div",iH);if(iStart<0){results.push({id,line,SKIP:"no_div"});continue;}
  const iEnd=matchDiv(T,iStart);if(iEnd<0){results.push({id,line,SKIP:"no_match"});continue;}
  const chunk=T.slice(iStart,iEnd);const[co,cc]=cntDiv(chunk);
  if(co!==cc){results.push({id,line,SKIP:"unbal",co,cc});continue;}
  if(chunk.indexOf("<table")<0||chunk.indexOf("margin-top")<0){results.push({id,line,SKIP:"chunk_wrong"});continue;}
  const block=fmt==="k"?buildKittenS():buildAdultS(ADULT_CELLS[line], line==="Senior"?'Netinka vaikingoms, \u017eindan\u010dioms ir augan\u010dioms kat\u0117ms. ':'');
  const newT=T.slice(0,iStart)+block+T.slice(iEnd);
  const probe=fmt==="k"?'7px;">2</td><td style="'+TD+'">50 g</td>':'7px;">'+ADULT_CELLS[line][0]+' g</td>';
  const[no,nc]=cntDiv(newT),[to,tc]=cntDiv(T);
  const g={rekom_gone:newT.indexOf("Rekomenduojamas kiekis per par")<0,sud:newT.indexOf("Sud\u0117tis")>-1,anal:newT.indexOf("Analitin")>-1,single:(newT.split(MARK).length-1)===1,probe:newT.indexOf(probe)>-1,divdelta:((no-nc)-(to-tc))===0};
  if(!g.rekom_gone||!g.sud||!g.anal||!g.single||!g.probe||!g.divdelta){results.push({id,line,SKIP:"guard",g});continue;}
  const wc=writeRaw(id,newT);const after=readRaw(id);
  results.push({id,line,fmt,act:"CONVERTED",write:wc,lossless:after!==null&&md5(after)===md5(newT),ver_rekom_gone:after!==null&&after.indexOf("Rekomenduojamas kiekis per par")<0,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_probe:after!==null&&after.indexOf(probe)>-1});
}catch(e){results.push({id,line,ERR:String(e).slice(0,80)});}}
commit("catD1_apply_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
