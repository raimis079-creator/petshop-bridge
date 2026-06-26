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
const D='\u2013', EM='\u2014', DEG='\u00b0';
const TD='border-bottom: 2px solid #d3d3d3;padding: 7px;';
const STY='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style>';
const W=["5 kg","10 kg","20 kg","30 kg","40 kg"];
const NOTE_A='Nurodyti kiekiai '+EM+' vienam suaugusiam \u0161uniui per par\u0105 (pilnas dienos davinys). Pa\u0161aras pilnavertis: gali b\u016bti \u0161eriamas atskirai arba derinamas su sausu maistu (atitinkamai ma\u017einant kiek\u012f). Tiksl\u0173 kiek\u012f pritaikykite pagal \u0161uns svor\u012f, am\u017ei\u0173, aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Atidar\u0119 laikykite \u0161aldytuve (2'+D+'6 '+DEG+'C) ir su\u0161erkite per 24 val. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
function buildWetS(cells){let t='\n'+MARK+'\n'+STY+'<div class="b2b-black"><table style="width:450px;" cellspacing="0">\n';t+='<tr><td style="'+TD+'"><b>\u0160uns svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';for(let i=0;i<5;i++){t+='<tr><td style="'+TD+'">'+W[i]+'</td><td style="'+TD+'">'+cells[i]+' g</td></tr>\n';}t+='</table>\n<p>'+NOTE_A+'</p></div>';return t;}
const cntDiv=s=>[(s.split("<div").length-1),(s.split("</div>").length-1)];
const FOUR=[
 {id:20475,n:"Pure Beef",c:["320"+D+"440","540"+D+"740","910"+D+"1240","1230"+D+"1680","1520"+D+"2090"]},
 {id:20461,n:"Pure Lamb",c:["300"+D+"410","510"+D+"690","850"+D+"1170","1150"+D+"1580","1430"+D+"1960"]},
 {id:20478,n:"Pure Chicken",c:["320"+D+"430","530"+D+"730","890"+D+"1220","1210"+D+"1660","1500"+D+"2060"]},
 {id:20472,n:"Menu Duck+Pumpkin",c:["290"+D+"390","480"+D+"660","810"+D+"1100","1100"+D+"1510","1370"+D+"1870"]}
];
const results=[];
for(const r of FOUR){try{
  const block=buildWetS(r.c);const p5='7px;">'+r.c[0]+' g</td>';
  const T=readRaw(r.id);if(T===null){results.push({id:r.id,recipe:r.n,ERR:"read"});continue;}
  const iR=T.indexOf("Rekomenduojamas kiekis per par");const iStart=iR>=0?T.lastIndexOf("<div",iR):-1;const iMark=T.lastIndexOf(MARK);
  if(iR<0||iStart<0||iMark<=iR){results.push({id:r.id,recipe:r.n,SKIP:"struct",iR,iStart,iMark});continue;}
  if(T.slice(iMark-7,iMark)!=="</div>\n"){results.push({id:r.id,recipe:r.n,SKIP:"pre_mark_not_divnl",pre:T.slice(iMark-9,iMark)});continue;}
  const chunk=T.slice(iStart,iMark-7);const[co,cc]=cntDiv(chunk);
  if(co!==cc){results.push({id:r.id,recipe:r.n,SKIP:"chunk_unbalanced",co,cc});continue;}
  if(chunk.indexOf("margin-top:15px")<0||chunk.indexOf("Rekomenduojamas")<0){results.push({id:r.id,recipe:r.n,SKIP:"chunk_wrong"});continue;}
  const base0=T.slice(0,iStart)+T.slice(iMark-7);
  const idx=base0.lastIndexOf(MARK);let cut=idx;if(idx>=0&&base0[idx-1]==="\n")cut=idx-1;const base=idx>=0?base0.slice(0,cut):base0;
  const newT=base+block;const[no,nc]=cntDiv(newT);const[to,tc]=cntDiv(T);
  const g={rekom_gone:newT.indexOf("Rekomenduojamas kiekis per par")<0,sud:newT.indexOf("Sud\u0117tis")>-1,anal:newT.indexOf("Analitin")>-1,single:(newT.split(MARK).length-1)===1,p5:newT.indexOf(p5)>-1,note:newT.indexOf("geriamojo vandens")>-1,divbal:(no===nc),divdelta:((no-nc)-(to-tc))===0};
  if(!g.rekom_gone||!g.sud||!g.anal||!g.single||!g.p5||!g.note||!g.divbal||!g.divdelta){results.push({id:r.id,recipe:r.n,SKIP:"guard",g});continue;}
  const wc=writeRaw(r.id,newT);const after=readRaw(r.id);
  results.push({id:r.id,recipe:r.n,act:"REMOVED+STYLED",write:wc,lossless:after!==null&&md5(after)===md5(newT),ver_rekom_gone:after!==null&&after.indexOf("Rekomenduojamas kiekis per par")<0,ver_single:after!==null&&(after.split(MARK).length-1)===1,ver_p5:after!==null&&after.indexOf(p5)>-1});
}catch(e){results.push({id:r.id,recipe:r.n,ERR:String(e).slice(0,90)});}}
commit("four_apply_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
