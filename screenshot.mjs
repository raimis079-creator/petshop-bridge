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
const NAT=["30"+D+"45","45"+D+"60","60"+D+"80","80"+D+"105","105"+D+"135"];
function buildAdultS(cells){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>Kat\u0117s svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';for(let i=0;i<5;i++){t+='<tr><td style="'+TD+'">'+WCAT[i]+'</td><td style="'+TD+'">'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>Nurodyti kiekiai \u2014 vienai suaugusiai katei per par\u0105 (orientaciniai). Pritaikykite pagal kat\u0117s aktyvum\u0105, am\u017e\u012f ir k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.</p></div>';return t;}
const out=[];
{const id=26381;const T=readRaw(id);
 if(T===null){out.push({id,ERR:"read"});}
 else if(T.indexOf(MARK)>-1){out.push({id,SKIP:"already_mark"});}
 else{
  const block=buildAdultS(NAT);
  const newT=T+"\n"+block;
  const probe='7px;">30'+D+'45 g</td>';
  const g={sud:newT.indexOf("Sud\u0117tis")>-1,anal:newT.indexOf("Analitin")>-1,single:(newT.split(MARK).length-1)===1,probe:newT.indexOf(probe)>-1,base_intact:newT.indexOf(T)===0};
  if(!g.sud||!g.anal||!g.single||!g.probe||!g.base_intact){out.push({id,SKIP:"guard",g});}
  else{const wc=writeRaw(id,newT);const after=readRaw(id);out.push({id,act:"ADDED",write:wc,lossless:after!==null&&md5(after)===md5(newT),ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_probe:after!==null&&after.indexOf(probe)>-1});}
 }}
commit("d3_apply_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
