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
const DOGNOTE='Nurodyti kiekiai \u2014 gramais per par\u0105 vienam suaugusiam \u0161uniui, atsi\u017evelgiant \u012f aktyvum\u0105. Pritaikykite pagal \u0161uns k\u016bno b\u016bkl\u0119. Visada u\u017etikrinkite prieig\u0105 prie \u0161vie\u017eio geriamojo vandens.';
function cells(rowHtml){let out=[];let parts=rowHtml.split(/<t[dh][^>]*>/);for(let i=1;i<parts.length;i++){let c=parts[i].split(/<\/t[dh]>/)[0];out.push(c.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());}return out;}
function parseRows(tbl){let rows=[];let trs=tbl.split(/<tr[^>]*>/);for(let i=1;i<trs.length;i++){let r=trs[i].split('</tr>')[0];const c=cells(r);if(c.length)rows.push(c);}return rows;}
function buildDog(rows){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';rows.forEach((r,ri)=>{t+='<tr>';r.forEach(c=>{t+=ri===0?'<td style="'+TD+'"><b>'+c+'</b></td>':'<td style="'+TD+'">'+c+'</td>';});t+='</tr>\n';});t+='</table>\n<p>'+DOGNOTE+'</p></div>';return t;}
const IDS=[18014,18112,18046,18018,18000,17995,17978];
const res=[];
for(const id of IDS){try{
  const T=readRaw(id);if(T===null){res.push({id,ERR:"read"});continue;}
  const iH=T.indexOf("\u0160\u0117rimo rekomendacij");if(iH<0){res.push({id,SKIP:"no_head"});continue;}
  const iStart=T.lastIndexOf("<p",iH);const iTab=T.indexOf("<table",iH);const iTabEnd=iTab>=0?T.indexOf("</table>",iTab):-1;
  if(iStart<0||iTab<0||iTabEnd<0){res.push({id,SKIP:"bounds"});continue;}
  const rows=parseRows(T.slice(iTab,iTabEnd+8));
  if(rows.length<4||!rows[0]||rows[0].length<2){res.push({id,SKIP:"parse",n:rows.length});continue;}
  const block=buildDog(rows);const newT=T.slice(0,iStart)+block+T.slice(iTabEnd+8);
  const lastVal=rows[rows.length-1][rows[0].length-1];
  const g={single:(newT.split(MARK).length-1)===1,rekgone:newT.indexOf("\u0160\u0117rimo rekomendacij")<0,probe:newT.indexOf('"><b>\u0160uns svoris</b>')>-1,lastval:newT.indexOf('">'+lastVal+'</td>')>-1,sud:newT.indexOf("Sud\u0117tis")>-1};
  if(!g.single||!g.rekgone||!g.probe||!g.lastval||!g.sud){res.push({id,SKIP:"guard",g});continue;}
  const wc=writeRaw(id,newT);const af=readRaw(id);
  res.push({id,act:"RESTYLED",nRows:rows.length,write:wc,lossless:af!==null&&md5(af)===md5(newT),ver_single:af!==null&&(af.split(MARK).length-1)===1,ver_rekgone:af!==null&&af.indexOf("\u0160\u0117rimo rekomendacij")<0,ver_lastval:af!==null&&af.indexOf('">'+lastVal+'</td>')>-1});
}catch(e){res.push({id,ERR:String(e).slice(0,70)});}}
commit("dog7_apply_"+Date.now()+".json", JSON.stringify(res,null,1));
console.log("DONE ok="+res.filter(x=>x.act==="RESTYLED"&&x.lossless&&x.ver_rekgone&&x.ver_lastval).length+"/"+res.length);
