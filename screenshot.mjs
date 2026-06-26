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
function tbl(h,rows){let t='<table style="width:450px;" cellspacing="0">\n<tr><td style="'+TD+'"><b>'+h[0]+'</b></td><td style="'+TD+'"><b>'+h[1]+'</b></td></tr>\n';rows.forEach(r=>{t+='<tr><td style="'+TD+'">'+r[0]+'</td><td style="'+TD+'">'+r[1]+'</td></tr>\n';});return t+'</table>\n';}
function wrap(inner,note){return MARK+'\n'+STY+'<div class="b2b-black">'+inner+'<p>'+note+'</p></div>';}
const N200A='Pilnavertis pa\u0161aras suaugusioms kat\u0117ms. Kiekiai orientaciniai \u2014 pritaikykite pagal aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Mi\u0161riai \u0161eriant prie 200 g konserv\u0173 prid\u0117kite ~50 g sauso \u0117dalo. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
const N85A='Pilnavertis pa\u0161aras suaugusioms kat\u0117ms. Kiekiai orientaciniai \u2014 pritaikykite pagal aktyvum\u0105 ir k\u016bno b\u016bkl\u0119. Mi\u0161riai \u0161eriant prie 85 g konserv\u0173 prid\u0117kite ~20 g sauso \u0117dalo. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
const N200K='Pa\u0161aras augan\u010dioms kat\u0117ms iki 12 m\u0117n. Kiekiai orientaciniai \u2014 pritaikykite pagal augimo tarpsn\u012f. Mi\u0161riai \u0161eriant prie 200 g konserv\u0173 prid\u0117kite ~50 g sauso \u0117dalo. Visada \u0161vie\u017eio vandens.';
const N85K='Pa\u0161aras augan\u010dioms kat\u0117ms iki 12 m\u0117n. Kiekiai orientaciniai \u2014 pritaikykite pagal augimo tarpsn\u012f. Mi\u0161riai \u0161eriant prie 85 g konserv\u0173 prid\u0117kite ~20 g sauso \u0117dalo. Visada \u0161vie\u017eio vandens.';
const NFIL='Papildomas pa\u0161aras (fil\u0117). Derinkite su pilnaver\u010diu sausu arba konservuotu \u0117dalu; kiekiai orientaciniai, pritaikykite pagal aktyvum\u0105. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio vandens.';
const NSOUP='Papildomas pa\u0161aras (sriuba) skys\u010di\u0173 papildymui. Derinkite su pilnaver\u010diu \u0117dalu. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio vandens.';
const B={
 "200A":()=>wrap(tbl(["Kat\u0117s svoris","Skardini\u0173 (200g) per par\u0105"],[["2"+D+"3 kg","0,75"+D+"1"],["3"+D+"4 kg","1"+D+"1,25"],["4"+D+"5 kg","1,25"+D+"1,5"],["5"+D+"7 kg","1,5"+D+"1,75"]]),N200A),
 "85A":()=>wrap(tbl(["Kat\u0117s svoris","Skardini\u0173 (85g) per par\u0105"],[["2"+D+"3 kg","2"+D+"2,5"],["3"+D+"4 kg","2,5"+D+"3"],["4"+D+"5 kg","3"+D+"3,5"],["5"+D+"7 kg","3,5"+D+"4"]]),N85A),
 "200K":()=>wrap(tbl(["Ka\u010diuko am\u017eius","Skardini\u0173 (200g) per par\u0105"],[["4"+D+"6 m\u0117n.","1"+D+"1,25"],["6"+D+"8 m\u0117n.","1,25"+D+"1,75"],["8"+D+"12 m\u0117n.","1,75"+D+"2"]]),N200K),
 "85K":()=>wrap(tbl(["Ka\u010diuko am\u017eius","Skardini\u0173 (85g) per par\u0105"],[["4"+D+"6 m\u0117n.","2,5"+D+"3"],["6"+D+"8 m\u0117n.","3"+D+"4"],["8"+D+"12 m\u0117n.","4"+D+"4,5"]]),N85K),
 "FIL":()=>wrap(tbl(["Kat\u0117s svoris","Kiekis per par\u0105"],[["4 kg","1"+D+"2 pak. + 20 g sauso \u0117dalo (arba 2"+D+"3 pak. tik fil\u0117)"]]),NFIL),
 "SOUP":()=>wrap(tbl(["Kat\u0117s svoris","Kiekis per par\u0105"],[["4 kg","1 pak. sriubos + 55 g sauso \u0117dalo"]]),NSOUP),
};
const PROBE={"200A":'">0,75'+D+'1</td>',"85A":'">2'+D+'2,5</td>',"200K":'4'+D+'6 m\u0117n.</td><td style="'+TD+'">1'+D+'1,25',"85K":'4'+D+'6 m\u0117n.</td><td style="'+TD+'">2,5'+D+'3',"FIL":'tik fil\u0117)',"SOUP":'sriubos + 55'};
function matchDiv(T,iStart){let depth=0,i=iStart;while(i<T.length){const no=T.indexOf("<div",i),nc=T.indexOf("</div>",i);if(nc<0)return -1;if(no>=0&&no<nc){depth++;i=no+4;}else{depth--;i=nc+6;if(depth===0)return nc+6;}}return -1;}
const cntDiv=s=>[(s.split("<div").length-1),(s.split("</div>").length-1)];
const CFG=[
[21838,"W2","85A"],[21836,"W2","85A"],[21832,"W2","85A"],[21830,"W2","85A"],[21828,"W2","85A"],[20427,"W2","85A"],[20504,"W2","85A"],
[21860,"W2","85K"],[21858,"W2","85K"],[21856,"W2","85K"],[21854,"W2","85K"],[21834,"W2","85K"],
[21677,"W2","200K"],[21671,"W2","200K"],[18071,"W2","200K"],[18068,"W2","200K"],
[20416,"W2","FIL"],
[21335,"W1","200A"],[21333,"W1","200A"],[21329,"W1","200A"],[21327,"W1","200A"],[21325,"W1","200A"],
[21331,"W1","200K"],
[20432,"W1","85A"],[20429,"W1","85A"],[20424,"W1","85A"],
[20435,"W1","85K"],
[20421,"W1","FIL"],[20418,"W1","FIL"],[20413,"W1","FIL"],[20410,"W1","FIL"],
[20437,"W1","SOUP"]];
const res=[];
for(const [id,mode,type] of CFG){try{
  const T=readRaw(id);if(T===null){res.push({id,ERR:"read"});continue;}
  const block=B[type]();const probe=PROBE[type];let newT;
  if(mode==="W1"){
    const iH=T.indexOf("Rekomenduojamas kiekis per par");if(iH<0){res.push({id,type,SKIP:"no_legacy"});continue;}
    const iStart=T.lastIndexOf("<div",iH);const iEnd=matchDiv(T,iStart);if(iStart<0||iEnd<0){res.push({id,type,SKIP:"no_match"});continue;}
    const chunk=T.slice(iStart,iEnd);const[co,cc]=cntDiv(chunk);
    if(co!==cc||chunk.indexOf("<table")<0){res.push({id,type,SKIP:"chunk_bad",co,cc});continue;}
    newT=T.slice(0,iStart)+block+T.slice(iEnd);
  } else { if(T.indexOf(MARK)>-1){res.push({id,type,SKIP:"has_mark"});continue;} newT=T+"\n"+block; }
  const[no,nc]=cntDiv(newT),[to,tc]=cntDiv(T);
  const g={single:(newT.split(MARK).length-1)===1,probe:newT.indexOf(probe)>-1,sud:newT.indexOf("Sud\u0117tis")>-1,anal:newT.indexOf("Analitin")>-1,divok:((no-nc)-(to-tc))===(mode==="W2"?1:0),rekgone:mode==="W2"?true:newT.indexOf("Rekomenduojamas kiekis per par")<0,base:mode==="W2"?newT.indexOf(T)===0:true};
  if(!g.single||!g.probe||!g.sud||!g.anal||!g.divok||!g.rekgone||!g.base){res.push({id,type,mode,SKIP:"guard",g});continue;}
  const wc=writeRaw(id,newT);const af=readRaw(id);
  res.push({id,type,mode,act:"OK",ok:(wc==="200"&&af!==null&&md5(af)===md5(newT)&&(af.split(MARK).length-1)===1&&af.indexOf(probe)>-1&&(mode==="W2"||af.indexOf("Rekomenduojamas kiekis per par")<0))});
}catch(e){res.push({id,ERR:String(e).slice(0,70)});}}
commit("catwet_build_"+Date.now()+".json", JSON.stringify(res,null,1));
const okc=res.filter(x=>x.ok).length;
console.log("DONE ok="+okc+"/"+res.length);
