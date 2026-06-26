import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const TD='border-bottom: 2px solid #d3d3d3;padding: 7px;';
const STY='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style>';
const D='\u2013';
const WCAT=["2"+D+"3 kg","3"+D+"4 kg","4"+D+"5 kg","5"+D+"7 kg","7"+D+"10 kg"];
function adultNote(extra){return 'Nurodyti kiekiai '+'\u2014'+' vienai suaugusiai katei per par\u0105 (orientaciniai). Pritaikykite pagal kat\u0117s aktyvum\u0105, am\u017e\u012f ir k\u016bno b\u016bkl\u0119. '+extra+'Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';}
function buildAdultS(cells,extra){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';for(let i=0;i<5;i++){t+='<tr><td style="'+TD+'">'+WCAT[i]+'</td><td style="'+TD+'">'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>'+adultNote(extra||'')+'</p></div>';return t;}
const KIT_AGE=[["2","50"],["3","45"],["4","40"],["5","35"],["6","30"],["7"+D+"12","20"+D+"30"]];
const KIT_PREG=[["2"+D+"4 kg","40"+D+"90"],["4"+D+"6 kg","90"+D+"140"],["6"+D+"8 kg","140"+D+"180"]];
function buildKittenS(){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Am\u017eius (m\u0117n.)</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_AGE.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Vaikingos kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_PREG.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<p>Kiekiai vienam augintiniui per par\u0105 (orientaciniai). Vaikingoms ir \u017eindan\u010dioms kat\u0117ms poreikis priklauso nuo ka\u010diuk\u0173 skai\u010diaus '+'\u2014'+' venkite per\u0161\u0117rimo. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
const ADULT_CELLS={SensiCat:["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],Culinesse:["30"+D+"45","45"+D+"60","60"+D+"75","75"+D+"105","105"+D+"135"],Marinesse:["30"+D+"45","45"+D+"55","55"+D+"70","70"+D+"100","100"+D+"130"],NatureCat:["25"+D+"35","45"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],DailyCat:["25"+D+"45","40"+D+"55","55"+D+"70","70"+D+"100","100"+D+"130"],Catelux:["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],Senior:["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"],Naturelle:["30"+D+"45","45"+D+"60","60"+D+"80","80"+D+"105","105"+D+"135"],Indoor:["30"+D+"45","45"+D+"60","60"+D+"80","80"+D+"105","105"+D+"135"]};
const A=[[18109,"Catelux","a"],[18106,"Catelux","a"],[18101,"Culinesse","a"],[18098,"Culinesse","a"],[18095,"DailyCat","a"],[18092,"DailyCat","a"],[18084,"Indoor","a"],[18080,"Indoor","a"],[18077,"Kitten","k"],[18074,"Kitten","k"],[18065,"KittenGrainfree","k"],[18062,"KittenGrainfree","k"],[18043,"Marinesse","a"],[18040,"Marinesse","a"],[18011,"NatureCat","a"],[18007,"Naturelle","a"],[18004,"Naturelle","a"],[17992,"Senior","a"],[17986,"SensiCat","a"],[17983,"SensiCat","a"]];
function stripTags(b){return b.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&ndash;/g,"\u2013").replace(/\s+/g," ").trim();}
function isFeed(s){return /^\d/.test(s)&&/g$/.test(s)&&s.length<70;}
function isKitHdr(s){return /Am\u017eius|Kitten \/ kg|k\u016bno svorio/.test(s);}
function removeBlock(T){
  const iR=T.indexOf("\u0160\u0117rimo rekomendacij"); if(iR<0)return null;
  const iStart=T.lastIndexOf("<p",iR); if(iStart<0)return null;
  let pos=iStart,consumed=0,first=true,rems=[];
  while(consumed<16){
    const ws=(T.slice(pos).match(/^\s*/)||[""])[0]; const bstart=pos+ws.length;
    if(T.slice(bstart,bstart+2)!=="<p")break;
    const endP=T.indexOf("</p>",bstart); if(endP<0)break;
    const inner=stripTags(T.slice(bstart,endP+4));
    const keep=first||isFeed(inner)||isKitHdr(inner)||inner===""||inner==="\u2013";
    if(!keep)break;
    rems.push(inner); pos=endP+4; consumed++; first=false;
  }
  return {iStart,iEnd:pos,consumed,rems};
}
const results=[];
for(const [id,line,fmt] of A){try{
  const T=readRaw(id); if(T===null){results.push({id,line,ERR:"read"});continue;}
  const r=removeBlock(T); if(r===null){results.push({id,line,SKIP:"no_block"});continue;}
  const block=fmt==="k"?buildKittenS():buildAdultS(ADULT_CELLS[line], line==="Senior"?'Netinka vaikingoms, \u017eindan\u010dioms ir augan\u010dioms kat\u0117ms. ':'');
  const newT=T.slice(0,r.iStart)+block+T.slice(r.iEnd);
  const probe=fmt==="k"?'7px;">2</td><td style="'+TD+'">50 g</td>':'7px;">'+ADULT_CELLS[line][0]+' g</td>';
  results.push({id,line,fmt,consumed:r.consumed,rem0:(r.rems[0]||"").slice(0,46),remL:(r.rems[r.rems.length-1]||"").slice(0,46),after0:stripTags(T.slice(r.iEnd,r.iEnd+120)).slice(0,46),
    g_sud:newT.indexOf("Sud\u0117tis")>-1,g_anal:newT.indexOf("Analitin")>-1,g_mark1:(newT.split(MARK).length-1)===1,g_rekom_gone:newT.indexOf("\u0160\u0117rimo rekomendacij")<0,g_probe:newT.indexOf(probe)>-1,dlen:newT.length-T.length});
}catch(e){results.push({id,line,ERR:String(e).slice(0,80)});}}
commit("catA_dry_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
