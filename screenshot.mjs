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
const SENIOR=["25"+D+"40","40"+D+"55","55"+D+"70","70"+D+"95","95"+D+"120"];
function buildAdultS(cells,extra){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';for(let i=0;i<5;i++){t+='<tr><td style="'+TD+'">'+WCAT[i]+'</td><td style="'+TD+'">'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>Nurodyti kiekiai \u2014 vienai suaugusiai katei per par\u0105 (orientaciniai). Pritaikykite pagal kat\u0117s aktyvum\u0105, am\u017e\u012f ir k\u016bno b\u016bkl\u0119. '+extra+'Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
function stripTags(b){return b.replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&ndash;/g,"\u2013").replace(/&scaron;/g,"\u0161").replace(/\s+/g," ").trim();}
function isFeed(s){return /^\d/.test(s)&&/g$/.test(s)&&s.length<70;}
const out={d2:null,d3:{}};
// D2 17989
{const id=17989;const T=readRaw(id);
 if(T===null){out.d2={id,ERR:"read"};}
 else{
  const iR=T.indexOf("vienam augintiniui per dien");
  if(iR<0){out.d2={id,SKIP:"no_anchor"};}
  else{
   const iStart=T.lastIndexOf("<p",iR);
   let pos=iStart,consumed=0,first=true,rems=[];
   while(consumed<14){const ws=(T.slice(pos).match(/^\s*/)||[""])[0];const bstart=pos+ws.length;if(T.slice(bstart,bstart+2)!=="<p")break;const endP=T.indexOf("</p>",bstart);if(endP<0)break;const inner=stripTags(T.slice(bstart,endP+4));const keep=first||isFeed(inner)||inner===""||inner==="\u2013";if(!keep)break;rems.push(inner.slice(0,42));pos=endP+4;consumed++;first=false;}
   const iEnd=pos;
   const block=buildAdultS(SENIOR,'Netinka vaikingoms, \u017eindan\u010dioms ir augan\u010dioms kat\u0117ms. ');
   const newT=T.slice(0,iStart)+block+T.slice(iEnd);
   const probe='7px;">25'+D+'40 g</td>';
   const g={anchor_gone:newT.indexOf("vienam augintiniui per dien")<0,sud:newT.indexOf("Sud\u0117tis")>-1,anal:newT.indexOf("Analitin")>-1,single:(newT.split(MARK).length-1)===1,probe:newT.indexOf(probe)>-1};
   if(consumed<4||!g.anchor_gone||!g.sud||!g.anal||!g.single||!g.probe){out.d2={id,SKIP:"guard",g,consumed,rems};}
   else{const wc=writeRaw(id,newT);const after=readRaw(id);out.d2={id,act:"CONVERTED",consumed,rem0:rems[0],remL:rems[rems.length-1],write:wc,lossless:after!==null&&md5(after)===md5(newT),ver_anchor_gone:after!==null&&after.indexOf("vienam augintiniui per dien")<0,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_probe:after!==null&&after.indexOf(probe)>-1};}
  }}}
// D3 26381 recon
{const id=26381;const T=readRaw(id);if(T===null){out.d3={ERR:1};}else{
  const iA=T.indexOf("Analitin");
  out.d3={id,len:T.length,nTab:T.split("<table").length-1,hasSud:T.indexOf("Sud\u0117tis")>-1,hasMark:T.indexOf(MARK)>-1,tail:T.slice(Math.max(0,T.length-700)),analctx:iA>=0?T.slice(iA,iA+400):"NO_ANAL"};
}}
commit("d2d3_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
