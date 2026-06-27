import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}
function readRaw(id){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});return (JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw||'';}catch(e){execSync('sleep 3');}}return null;}
function cells(rowHtml){let out=[];let parts=rowHtml.split(/<t[dh][^>]*>/);for(let i=1;i<parts.length;i++){let c=parts[i].split(/<\/t[dh]>/)[0];out.push(c.replace(/&nbsp;/g,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());}return out;}
function parseRows(tbl){let rows=[];let trs=tbl.split(/<tr[^>]*>/);for(let i=1;i<trs.length;i++){let r=trs[i].split('</tr>')[0];const c=cells(r);if(c.length)rows.push(c);}return rows;}
const IDS=[18014,18112,18046,18018,18000,17995,17978];
const out=[];
for(const id of IDS){const T=readRaw(id);if(T===null){out.push({id,ERR:1});continue;}
  const iH=T.indexOf("\u0160\u0117rimo rekomendacij");if(iH<0){out.push({id,SKIP:"no_head"});continue;}
  const iStart=T.lastIndexOf("<p",iH);const iTab=T.indexOf("<table",iH);const iTabEnd=iTab>=0?T.indexOf("</table>",iTab):-1;
  if(iStart<0||iTab<0||iTabEnd<0){out.push({id,SKIP:"bounds",iStart,iTab,iTabEnd});continue;}
  const tbl=T.slice(iTab,iTabEnd+8);const rows=parseRows(tbl);
  const oldBlock=T.slice(iStart,iTabEnd+8);
  out.push({id,nRows:rows.length,header:rows[0],row1:rows[1],rowL:rows[rows.length-1],
    headOnly:T.slice(iStart,iTab).replace(/\s+/g,' ').slice(0,80),
    oldTail:oldBlock.slice(-40)});
}
commit("dog7_dry_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
