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
const DOGNOTE='Nurodyti kiekiai \u2014 gramais per par\u0105 vienam suaugusiam \u0161uniui, atsi\u017evelgiant \u012f aktyvum\u0105. Pritaikykite pagal \u0161uns k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
function cells(rowHtml){let out=[];let parts=rowHtml.split(/<t[dh][^>]*>/);for(let i=1;i<parts.length;i++){let c=parts[i].split(/<\/t[dh]>/)[0];out.push(c.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());}return out;}
function parseRows(tbl){let rows=[];let trs=tbl.split(/<tr[^>]*>/);for(let i=1;i<trs.length;i++){let r=trs[i].split('</tr>')[0];const c=cells(r);if(c.length)rows.push(c);}return rows;}
function buildDog(rows){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';rows.forEach((r,ri)=>{t+='<tr>';r.forEach(c=>{t+=ri===0?'<td style="'+TD+'"><b>'+c+'</b></td>':'<td style="'+TD+'">'+c+'</td>';});t+='</tr>\n';});t+='</table>\n<p>'+DOGNOTE+'</p></div>';return t;}
function matchDiv(T,iStart){let depth=0,i=iStart;while(i<T.length){const no=T.indexOf("<div",i),nc=T.indexOf("</div>",i);if(nc<0)return -1;if(no>=0&&no<nc){depth++;i=no+4;}else{depth--;i=nc+6;if(depth===0)return nc+6;}}return -1;}
const cntDiv=s=>[(s.split("<div").length-1),(s.split("</div>").length-1)];
const id=20440;const res=[];
try{
  const T=readRaw(id);if(T===null)throw "read";
  const iH=T.indexOf("Rekomenduojamas kiekis");const iStart=T.lastIndexOf("<div",iH);const iEnd=matchDiv(T,iStart);
  if(iH<0||iStart<0||iEnd<0)throw "bounds";
  const chunk=T.slice(iStart,iEnd);const[co,cc]=cntDiv(chunk);
  const iTab=chunk.indexOf("<table");const iTabEnd=chunk.indexOf("</table>");
  if(co!==cc||iTab<0)throw "chunk";
  const rows=parseRows(chunk.slice(iTab,iTabEnd+8));
  if(rows.length<4||rows[0].length<2)throw "parse";
  const block=buildDog(rows);const newT=T.slice(0,iStart)+block+T.slice(iEnd);
  const lastVal=rows[rows.length-1][rows[0].length-1];
  const[no,nc]=cntDiv(newT),[to,tc]=cntDiv(T);
  const g={single:(newT.split(MARK).length-1)===1,rekgone:newT.indexOf("Rekomenduojamas kiekis per par")<0,probe:newT.indexOf('"><b>Svoris</b>')>-1,lastval:newT.indexOf('">'+lastVal+'</td>')>-1,sud:newT.indexOf("Sud\u0117tis")>-1,divok:((no-nc)-(to-tc))===0};
  if(!g.single||!g.rekgone||!g.probe||!g.lastval||!g.divok){res.push({id,SKIP:"guard",g,rows0:rows[0],rowsN:rows.length});}
  else{const wc=writeRaw(id,newT);const af=readRaw(id);res.push({id,act:"CONVERTED",nRows:rows.length,header:rows[0],write:wc,lossless:af!==null&&md5(af)===md5(newT),ver_rekgone:af!==null&&af.indexOf("Rekomenduojamas kiekis per par")<0,ver_lastval:af!==null&&af.indexOf('">'+lastVal+'</td>')>-1});}
}catch(e){res.push({id,ERR:String(e).slice(0,70)});}
commit("dog20440_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE");
