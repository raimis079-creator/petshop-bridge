import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const U=process.env.WP_USER, P=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}

const IDS=[17138,17188,17179,17176,17159,17156,17173,17144,17141,17135,17191,17185,17182,17170,17153,17165,17150];
execSync('rm -rf /tmp/c && mkdir -p /tmp/c',{env});
fs.writeFileSync('/tmp/ids.txt', IDS.join("\n"));
try{execSync(`cat /tmp/ids.txt | xargs -P 8 -I{} curl -sk --max-time 40 -u "${U}:${P}" "https://dev.avesa.lt/wp-json/wp/v2/product/{}?context=edit&_fields=id,content,status" -o /tmp/c/{}.json`,{env,maxBuffer:200000000});}catch(e){}

const HEAD=/\u0160\u0117rimo\s+(?:rekomendacij|instrukcij)/i;
function clean(s){
  s=s.replace(/<!--[\s\S]*?-->/g,' ');
  s=s.replace(/<[^>]+>/g,' ');
  s=s.replace(/&lt;\s*\/?[a-zA-Z][^&]*?&gt;/g,' ');
  s=s.replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&micro;/g,'\u00b5').replace(/&amp;/g,'&');
  s=s.replace(/&lt;\s*(?=\d)/g,'< ').replace(/&gt;\s*(?=\d)/g,'> ');
  s=s.replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  return s.replace(/\s+/g,' ').trim();
}
const ROW=/(<|>)?\s*(\d+(?:,\d+)?)\s*(?:[-\u2013]\s*(\d+(?:,\d+)?))?\s*kg\s+(\d+(?:,\d+)?)\s*(?:[-\u2013]\s*(\d+(?:,\d+)?))?\s*g\s*(\+)?/gi;
function wlabel(b,lo,hi){if(b==='<')return 'iki '+lo+' kg';if(b==='>')return 'vir\u0161 '+lo+' kg';if(hi)return lo+'\u2013'+hi+' kg';return lo+' kg';}
function glabel(lo,hi,plus){let s=hi?(lo+'\u2013'+hi+' g'):(lo+' g');if(plus)s+='+';return s;}
function parseRows(txt){const rows=[];let m;const re=new RegExp(ROW);while((m=re.exec(txt))){rows.push({w:wlabel(m[1],m[2],m[3]),g:glabel(m[4],m[5],m[6])});}return rows;}
function findEnd(T,START){const reP=/<p[^>]*>([\s\S]*?)<\/p>/g;reP.lastIndex=START;let m,end=-1,prevEnd=START;
  while((m=reP.exec(T))){ if(end>-1 && (m.index-prevEnd)>14) break; const inner=clean(m[1]);
    const isFeed=/\d\s*kg/i.test(inner)||/(Svoris\s*\(kg\)|[\u0160\u0161Ss]uns\s+svoris|dienos\s+nor|paros\s+doz|\u0160\u0117rim)/i.test(inner);
    if(isFeed){end=reP.lastIndex;prevEnd=reP.lastIndex;} else {break;} }
  return end;}

const MARK='<p><strong>\u0160\u0117rimo rekomendacija:</strong></p>';
const STY='<style>.b2b-black,.b2b-black *{color:#000 !important;} .b2b-black table{border-collapse:collapse;width:auto;max-width:100%;} .b2b-black td,.b2b-black th{border-bottom:2px solid #d3d3d3;padding:7px;text-align:left;}</style>';

const results=[];
for(const id of IDS){
  let o={};try{o=JSON.parse(fs.readFileSync('/tmp/c/'+id+'.json','utf8'));}catch(e){results.push({id,ERR:'read'});continue;}
  const T=(o.content||{}).raw||"";const st=o.status;
  const hm=T.match(HEAD);if(!hm){results.push({id,ERR:'nohead'});continue;}
  const pos=hm.index;
  let START=-1;for(const tag of ['<p>','<p ','<h2','<h3','<h4']){const i=T.lastIndexOf(tag,pos);if(i>START)START=i;}
  if(START<0){results.push({id,ERR:'nostart'});continue;}
  const ot=T.slice(START).match(/^<(p|h2|h3|h4)[^>]*>/i);if(!ot){results.push({id,ERR:'notag'});continue;}
  const tn=ot[1].toLowerCase();
  const closeIdx=T.indexOf('</'+tn+'>',START);
  const headInner=clean(T.slice(START+ot[0].length, closeIdx));
  let note=headInner.replace(/^.*?(?:rekomendacija|instrukcija):\s*/i,'').trim();
  if(/^\u0160\u0117rim/i.test(note)||note.length<6)note='';
  const END=findEnd(T,START);
  if(END<0||END<=START){results.push({id,ERR:'noend'});continue;}
  const removed=T.slice(START,END);
  const rows=parseRows(clean(removed));
  // build
  const trs=rows.map(r=>'<tr><td>'+r.w+'</td><td>'+r.g+'</td></tr>').join('');
  const NEW=MARK+(note?('<p>'+note+'</p>'):'')+STY+'<div class="b2b-black"><table><tbody><tr><td><strong>\u0160uns svoris</strong></td><td><strong>Paros doz\u0117</strong></td></tr>'+trs+'</tbody></table></div>';
  const newT=T.slice(0,START)+NEW+T.slice(END);
  // GUARDS
  const g={};
  g.rows=rows.length;
  g.headOne=((newT.match(/\u0160\u0117rimo\s+rekomendacij/gi)||[]).length===1);
  g.table=newT.includes('<div class="b2b-black"><table>');
  g.dataval=rows.every(r=>newT.includes('<td>'+r.g+'</td>')&&newT.includes('<td>'+r.w+'</td>'));
  g.compSafe=!/(Sud\u0117t|Analitin|Metaboliz|Priedai|sud\u0117tis)/i.test(removed); // didn't eat composition
  g.newClean=!/&lt;|notionvc|&amp;nbsp;|&nbsp;/.test(NEW);
  g.compIntact=['Analitin','Metaboliz','Sud\u0117t'].every(s=>T.includes(s)?newT.includes(s):true);
  const ok = g.rows>=2 && g.headOne && g.table && g.dataval && g.compSafe && g.newClean && g.compIntact;
  if(!ok){results.push({id,status:st,SKIP:1,g,note});continue;}
  // WRITE
  fs.writeFileSync('/tmp/w.json',JSON.stringify({content:newT,status:st}));
  let code='000',rb='';
  try{code=execSync(`curl -sk -o /tmp/wr.json -w "%{http_code}" -X POST -u "${U}:${P}" -H "Content-Type: application/json" --data @/tmp/w.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=id,content"`,{env,maxBuffer:200000000}).trim();}catch(e){code='ERR';}
  let lossless=false;try{rb=JSON.parse(fs.readFileSync('/tmp/wr.json','utf8')).content.raw;lossless=(md5(rb)===md5(newT));}catch(e){}
  results.push({id,status:st,WROTE:1,code,lossless,rows:rows.length,note:note.slice(0,60),g});
}
commit("ont_A_apply_"+Date.now()+".json", JSON.stringify(results,null,1));
console.log("DONE");
