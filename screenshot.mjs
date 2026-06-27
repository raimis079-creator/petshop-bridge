import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r_${id}.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r_'+id+'.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 2');}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body_'+id+'.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body_${id}.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
function front(id){for(let i=0;i<3;i++){try{execSync(`curl -skL --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/h_${id}.html`,{encoding:'utf8',env,maxBuffer:90000000});return fs.readFileSync('/tmp/h_'+id+'.html','utf8');}catch(e){execSync('sleep 2');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const MARKTXT='\u0160\u0117rimo instrukcija';
const STY='<style>.b2b-black,.b2b-black *{color:#000 !important;} .b2b-black table{border-collapse:collapse;width:auto;max-width:100%;} .b2b-black td,.b2b-black th{border-bottom:2px solid #d3d3d3;padding:7px;text-align:left;}</style>';
const hRe=/<h([1-6])[^>]*>\s*\u0160\u0117rimo norm[^<]*<\/h\1>/i;
const IDS=[18617,18542,18539,18536,18533];
const res=[];
for(const id of IDS){try{
  const T=readRaw(id);if(T===null){res.push({id,ERR:"read"});continue;}
  const m=T.match(hRe);if(!m){res.push({id,SKIP:"no_heading"});continue;}
  const hStart=m.index, hEnd=hStart+m[0].length;
  const tStart=T.indexOf('<table',hEnd);
  if(tStart<0||tStart-hEnd>60){res.push({id,SKIP:"table_not_adjacent",gap:tStart-hEnd});continue;}
  const tEnd=T.indexOf('</table>',tStart)+'</table>'.length;
  if(tEnd<tStart){res.push({id,SKIP:"no_table_close"});continue;}
  const tableHtml=T.slice(tStart,tEnd);
  const block=MARK+'\n'+STY+'<div class="b2b-black">\n'+tableHtml+'\n</div>';
  const newT=T.slice(0,hStart)+block+T.slice(tEnd);
  const g={single:(newT.split(MARK).length-1)===1, oldgone:newT.indexOf(m[0])<0, tbl_intact:newT.indexOf(tableHtml)>-1, b2b:newT.indexOf('b2b-black')>-1, anal:newT.indexOf('Analitin')>-1, sud:newT.indexOf('Sud\u0117tis')>-1};
  res.push({id,head:m[0],tbl_len:tableHtml.length, tbl_head:tableHtml.slice(0,120)});
  if(!g.single||!g.oldgone||!g.tbl_intact||!g.b2b){res[res.length-1].SKIP="guard";res[res.length-1].g=g;continue;}
  const wc=writeRaw(id,newT);const af=readRaw(id);
  res[res.length-1].act="BUILT";res[res.length-1].write=wc;
  res[res.length-1].lossless=af!==null&&md5(af)===md5(newT);
  res[res.length-1].ver_single=af!==null&&(af.split(MARK).length-1)===1;
  res[res.length-1].ver_tbl=af!==null&&af.indexOf(tableHtml)>-1;
}catch(e){res.push({id,ERR:String(e).slice(0,80)});}}
const fe={};
for(const id of IDS){const H=front(id);fe[id]=H?{panel:H.indexOf(MARKTXT)>-1,b2b:H.indexOf('b2b-black')>-1,table:/<table/i.test(H),norma_gone:H.indexOf('\u0160\u0117rimo norma (g')<0}:{ERR:1};}
commit("excl_fixhead_"+Date.now()+".json", JSON.stringify({res,fe},null,1));
console.log("DONE");
