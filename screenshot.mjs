import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 3');}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const TD='border-bottom: 2px solid #d3d3d3;padding: 7px;';
const STY='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style>';
const D='\u2013';
function buildDogN(rows,note){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';rows.forEach((r,ri)=>{t+='<tr>';r.forEach(c=>{t+=ri===0?'<td style="'+TD+'"><b>'+c+'</b></td>':'<td style="'+TD+'">'+c+'</td>';});t+='</tr>\n';});t+='</table>\n<p>'+note+'</p></div>';return t;}
const ROWS=[["Kal\u0117s svoris (6."+D+"9. n\u0117\u0161tumo sav.)","Kiekis per par\u0105"],["5 kg","120"+D+"130 g"],["10 kg","215"+D+"235 g"],["20 kg","390"+D+"410 g"],["30 kg","550"+D+"580 g"],["40 kg","690"+D+"710 g"],["60 kg","980"+D+"1045 g"],["80 kg","1165"+D+"1305 g"]];
const NOTE='Lentel\u0117 \u2014 vaikingoms kal\u0117ms paskutiniame n\u0117\u0161tumo tre\u010ddalyje (6.'+D+'9. sav.); kiekis priklauso nuo veisl\u0117s dyd\u017eio ir jaunikli\u0173 skai\u010diaus, venkite per\u0161\u0117rimo. \u017dindan\u010dioms kal\u0117ms pa\u0161ar\u0105 galima tiekti iki soties (ad libitum) \u2014 poreikis priklauso nuo jaunikli\u0173 skai\u010diaus ir pieno kiekio. \u0160uniukams (nuo 4 iki 8 sav.): kroketes mirkyti \u0161iltame (~37 \u00b0C) vandenyje ar Josera \u0161uniuk\u0173 piene ir tiekti keliais kartais per dien\u0105 pagal am\u017ei\u0173 bei vystym\u0105si. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
const id=25435;const res=[];
try{
  const T=readRaw(id);if(T===null)throw "read";
  if(T.indexOf(MARK)>-1){res.push({id,SKIP:"has_mark"});}
  else{
    const block=buildDogN(ROWS,NOTE);const newT=T+"\n"+block;
    const g={single:(newT.split(MARK).length-1)===1,probe:newT.indexOf('"><b>Kal\u0117s svoris')>-1,dataval:newT.indexOf('">1165'+D+'1305 g</td>')>-1,sud:newT.indexOf("Sud\u0117tis")>-1,base:newT.indexOf(T)===0};
    if(!g.single||!g.probe||!g.dataval||!g.base){res.push({id,SKIP:"guard",g});}
    else{const wc=writeRaw(id,newT);const af=readRaw(id);res.push({id,act:"ADDED",write:wc,lossless:af!==null&&md5(af)===md5(newT),ver_single:af!==null&&(af.split(MARK).length-1)===1,ver_dataval:af!==null&&af.indexOf('">1165'+D+'1305 g</td>')>-1,sud:g.sud});}
  }
}catch(e){res.push({id,ERR:String(e).slice(0,80)});}
commit("dog25435_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE");
