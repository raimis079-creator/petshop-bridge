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
function consume(T,iStart){let pos=iStart,first=true,removed=[];while(true){const ws=(T.slice(pos).match(/^\s*/)||[""])[0];const b=pos+ws.length;if(T.slice(b,b+2)!=="<p"){break;}const e=T.indexOf("</p>",b);if(e<0)break;const inner=T.slice(b,e+4);const isFeed=first||(inner.split("&nbsp;").length-1)>=2||inner.indexOf("Rekomenduojamas kiekis apskai")>-1;if(!isFeed)break;removed.push(inner.replace(/<[^>]+>/g,'').replace(/&nbsp;/g,' ').replace(/\s+/g,' ').trim().slice(0,45));pos=e+4;first=false;}return {iEnd:pos,removed};}
const ROWS_88=[["Svoris","Neaktyvus / senyvas","Normaliai aktyvus","Aktyvus"],["10 kg","75 g","100 g","130 g"],["20 kg","125 g","170 g","215 g"],["30 kg","170 g","230 g","290 g"],["40 kg","210 g","290 g","365 g"],["60 kg","285 g","390 g","490 g"],["80 kg","355 g","480 g","610 g"]];
const NOTE_88='Nurodyti kiekiai \u2014 gramais per par\u0105 vienam suaugusiam \u0161uniui, atsi\u017evelgiant \u012f aktyvum\u0105. Vaikingoms/\u017eindan\u010dioms kal\u0117ms (6.'+D+'9. n\u0117\u0161tumo sav.): 20 kg 395'+D+'415 g, 30 kg 550'+D+'590 g, 40 kg 700'+D+'720 g, 60 kg 995'+D+'1060 g, 80 kg 1180'+D+'1330 g; \u017eindymo metu galima \u0161erti iki soties (ad libitum). Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio vandens.';
const ROWS_22=[["Svoris","1,5"+D+"2 m\u0117n.","3"+D+"4 m\u0117n.","5"+D+"6 m\u0117n.","7"+D+"8 m\u0117n.",">8 m\u0117n./suaug\u0119s"],["2 kg","25"+D+"45 g","40"+D+"55 g","50"+D+"65 g","55"+D+"60 g","35"+D+"50 g"],["4 kg","35"+D+"75 g","70"+D+"90 g","85"+D+"105 g","90"+D+"100 g","60"+D+"85 g"],["6 kg","35"+D+"90 g","85"+D+"110 g","100"+D+"125 g","115"+D+"120 g","65"+D+"90 g"],["8 kg","40"+D+"110 g","105"+D+"135 g","130"+D+"170 g","155"+D+"160 g","70"+D+"110 g"],["10 kg","50"+D+"120 g","110"+D+"140 g","135"+D+"175 g","140"+D+"165 g","85"+D+"130 g"]];
const NOTE_22='Nurodyti kiekiai \u2014 gramais per par\u0105 augan\u010diam \u0161uniui pagal svor\u012f ir am\u017e\u012f (stulpeliai \u2014 am\u017eius m\u0117nesiais). Pritaikykite pagal \u0161uns k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
const JOB={18088:{rows:ROWS_88,note:NOTE_88,gone:"vidutini\u0161kai aktyvus",probe:'"><b>Neaktyvus / senyvas</b>',dataval:'">355 g</td>'},18022:{rows:ROWS_22,note:NOTE_22,gone:"Am\u017eius (m\u0117n.)",probe:'"><b>Svoris</b>',dataval:'">85'+D+'130 g</td>'}};
const res=[];
for(const id of [18088,18022]){try{
  const j=JOB[id];const T=readRaw(id);if(T===null){res.push({id,ERR:"read"});continue;}
  const iH=T.indexOf("\u0160\u0117rimo rekomendacij");if(iH<0){res.push({id,SKIP:"no_head"});continue;}
  const iStart=T.lastIndexOf("<p",iH);const {iEnd,removed}=consume(T,iStart);
  if(removed.length<4){res.push({id,SKIP:"consume_short",removed});continue;}
  const block=buildDogN(j.rows,j.note);const newT=T.slice(0,iStart)+block+T.slice(iEnd);
  const g={single:(newT.split(MARK).length-1)===1,rekgone:newT.indexOf("\u0160\u0117rimo rekomendacij")<0,garbgone:newT.indexOf(j.gone)<0,probe:newT.indexOf(j.probe)>-1,dataval:newT.indexOf(j.dataval)>-1,sud:newT.indexOf("Sud\u0117tis")>-1};
  if(!g.single||!g.rekgone||!g.garbgone||!g.probe||!g.dataval||!g.sud){res.push({id,SKIP:"guard",g,removed});continue;}
  const wc=writeRaw(id,newT);const af=readRaw(id);
  res.push({id,act:"BUILT",removed,write:wc,lossless:af!==null&&md5(af)===md5(newT),ver_single:af!==null&&(af.split(MARK).length-1)===1,ver_garbgone:af!==null&&af.indexOf(j.gone)<0,ver_dataval:af!==null&&af.indexOf(j.dataval)>-1});
}catch(e){res.push({id,ERR:String(e).slice(0,80)});}}
commit("dog2garb_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE");
