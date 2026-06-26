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
const KIT_AGE=[["2","50"],["3","45"],["4","40"],["5","35"],["6","30"],["7"+D+"12","20"+D+"30"]];
const KIT_PREG=[["2"+D+"4 kg","40"+D+"90"],["4"+D+"6 kg","90"+D+"140"],["6"+D+"8 kg","140"+D+"180"]];
function buildKittenS(){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Am\u017eius (m\u0117n.)</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_AGE.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Vaikingos kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';KIT_PREG.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+' g</td></tr>\n';});t+='</table>\n<p>Kiekiai vienam augintiniui per par\u0105 (orientaciniai). Vaikingoms ir \u017eindan\u010dioms kat\u0117ms poreikis priklauso nuo ka\u010diuk\u0173 skai\u010diaus \u2014 venkite per\u0161\u0117rimo. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
const OLD_GARB='<p>36% baltym\u0173 ir 22%\u0160\u0117rimo rekomendacijos ka\u010diukams:</p>\n\n<p>&nbsp;riebal\u0173, i\u0161 j\u0173 84% gyvulin\u0117s kilm\u0117s baltym\u0173.</p>';
const NEW_GARB='<p>36% baltym\u0173 ir 22% riebal\u0173, i\u0161 j\u0173 84% gyvulin\u0117s kilm\u0117s baltym\u0173.</p>';
function stripTags(b){return b.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&ndash;/g,"\u2013").replace(/\s+/g," ").trim();}
function isFeed(s){return /^\d/.test(s)&&/g$/.test(s)&&s.length<70;}
const results=[];
for(const id of [18065,18062]){try{
  let T=readRaw(id);if(T===null){results.push({id,ERR:"read"});continue;}
  const hadGarb=T.indexOf(OLD_GARB)>=0;
  if(hadGarb)T=T.replace(OLD_GARB,NEW_GARB);
  const iReal=T.indexOf("<strong>\u0160\u0117rimo rekomendacijos ka\u010diukams:</strong>");
  if(iReal<0){results.push({id,SKIP:"no_real_hdr",hadGarb});continue;}
  const iStart=T.lastIndexOf("<p",iReal);
  let pos=iStart,consumed=0,first=true,rems=[];
  while(consumed<16){const ws=(T.slice(pos).match(/^\s*/)||[""])[0];const bstart=pos+ws.length;if(T.slice(bstart,bstart+2)!=="<p")break;const endP=T.indexOf("</p>",bstart);if(endP<0)break;const inner=stripTags(T.slice(bstart,endP+4));const keep=first||isFeed(inner)||/am\u017eius|dienos norma|vaikingoms/i.test(inner)||inner===""||inner==="\u2013";if(!keep)break;rems.push(inner.slice(0,40));pos=endP+4;consumed++;first=false;}
  const iEnd=pos;
  if(consumed<4){results.push({id,SKIP:"consumed_low",consumed,hadGarb,rems});continue;}
  const block=buildKittenS();
  const newT=T.slice(0,iStart)+block+T.slice(iEnd);
  const probe='7px;">2</td><td style="'+TD+'">50 g</td>';
  const g={rekom_gone:newT.indexOf("\u0160\u0117rimo rekomendacij")<0,garb_gone:newT.indexOf("22%\u0160\u0117rimo")<0,sud:newT.indexOf("Sud\u0117tis")>-1,anal:newT.indexOf("Analitin")>-1,single:(newT.split(MARK).length-1)===1,probe:newT.indexOf(probe)>-1};
  if(!g.rekom_gone||!g.garb_gone||!g.sud||!g.anal||!g.single||!g.probe){results.push({id,SKIP:"guard",g,consumed,hadGarb,rems});continue;}
  const wc=writeRaw(id,newT);const after=readRaw(id);
  results.push({id,act:"CONVERTED",hadGarb,consumed,rem0:rems[0],remL:rems[rems.length-1],write:wc,lossless:after!==null&&md5(after)===md5(newT),ver_rekom_gone:after!==null&&after.indexOf("\u0160\u0117rimo rekomendacij")<0,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_probe:after!==null&&after.indexOf(probe)>-1});
}catch(e){results.push({id,ERR:String(e).slice(0,80)});}}
commit("kg_apply_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
