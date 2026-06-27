import { execSync } from "child_process";
import fs from "fs";
import crypto from "crypto";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const md5=s=>crypto.createHash('md5').update(s,'utf8').digest('hex');
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 3');}return null;}
function writeRaw(id,content){fs.writeFileSync('/tmp/body.json',JSON.stringify({content}));return execSync(`curl -sk --max-time 45 -o /dev/null -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/body.json "https://dev.avesa.lt/wp-json/wp/v2/product/${id}"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();}
function front(id){for(let i=0;i<3;i++){try{execSync(`curl -skL --max-time 45 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?p=${id}&ps_desc=1" -o /tmp/h.html`,{encoding:'utf8',env,maxBuffer:90000000});return fs.readFileSync('/tmp/h.html','utf8');}catch(e){execSync('sleep 2');}}return null;}
const MARK='<p><strong>\u0160\u0117rimo instrukcija:</strong></p>';
const MARKTXT='\u0160\u0117rimo instrukcija';
const TD='border-bottom: 2px solid #d3d3d3;padding: 7px;';
const STY='<style>.b2b-black, .b2b-black * { color:#000 !important; }</style>';
const D='\u2013';
function clean(s){return s.replace(/<!--[\s\S]*?-->/g,' ').replace(/&lt;[^&]*?&gt;/g,' ').replace(/<[^>]+>/g,' ').replace(/&amp;nbsp;|&nbsp;/g,' ').replace(/&#8211;|&ndash;/g,'\u2013').replace(/&amp;/g,'&').replace(/\s+/g,' ').trim();}
const RE='(\\d+)\\s*kg\\s*[-\u2013:*]*\\s*(\\d+)\\s*(?:[\u2013-]\\s*(\\d+))?\\s*g';
function pairs(t){const re=new RegExp(RE,'gi');const o=[];let m;while((m=re.exec(t))){o.push({w:+m[1],lo:+m[2],hi:m[3]?+m[3]:null});}return o;}
function lastEnd(t){const re=new RegExp(RE,'gi');let l=0,m;while((m=re.exec(t))){l=re.lastIndex;}return l;}
function gv(p){return p.hi?(p.lo+D+p.hi+' g'):(p.lo+' g');}
function build2(rows,note){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:100%;" cellspacing="0">\n<tr><td style="'+TD+'"><b>\u0160uns svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';rows.forEach(r=>{t+='<tr><td style="'+TD+'">'+r.label+'</td><td style="'+TD+'">'+r.val+'</td></tr>\n';});t+='</table>'+(note?'\n<p>'+note+'</p>':'')+'</div>';return t;}
function build3(rows,note){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:100%;" cellspacing="0">\n<tr><td style="'+TD+'"><b>\u0160uns svoris</b></td><td style="'+TD+'"><b>Svorio ma\u017einimui</b></td><td style="'+TD+'"><b>Svorio palaikymui</b></td></tr>\n';rows.forEach(r=>{t+='<tr><td style="'+TD+'">'+r.w+' kg</td><td style="'+TD+'">'+r.maz+'</td><td style="'+TD+'">'+r.pal+'</td></tr>\n';});t+='</table>'+(note?'\n<p>'+note+'</p>':'')+'</div>';return t;}
const openerRe=/(?:\s|&lt;br ?\/?&gt;|&lt;p&gt;|&lt;span[^&]*&gt;|&lt;strong&gt;|<br ?\/?>|<p>|<span[^>]*>|<strong>)+$/;
function applyBr(id, kind){
  const T=readRaw(id);if(T===null)return {id,ERR:"read"};
  const iM=T.indexOf(MARKTXT);if(iM<0)return {id,ERR:"no_mark"};
  const pre=T.slice(0,iM);const mm=pre.match(openerRe);const iStart=mm?iM-mm[0].length:iM;
  let before=T.slice(0,iStart);
  // close open Priedai paragraph (encoded)
  const oPe=before.lastIndexOf('&lt;p&gt;'), cPe=before.lastIndexOf('&lt;/p&gt;');
  if(!(oPe>cPe)) return {id,ERR:"expected_open_p_not_found"};
  before=before+'&lt;/p&gt;\n';
  const txt=clean(T.slice(iM));
  let block, rep;
  if(kind==='double'){
    const iMaz=txt.search(/ma\u017einimui/i), iPal=txt.search(/palaikymui/i);
    const mz=pairs(txt.slice(iMaz,iPal)), pl=pairs(txt.slice(iPal));
    const byW={};mz.forEach(p=>byW[p.w]={maz:gv(p)});pl.forEach(p=>{byW[p.w]=byW[p.w]||{};byW[p.w].pal=gv(p);});
    const rows=Object.keys(byW).map(Number).sort((a,b)=>a-b).map(w=>({w,maz:byW[w].maz||'?',pal:byW[w].pal||'?'}));
    if(rows.length<2||rows.some(r=>r.maz==='?'||r.pal==='?'))return {id,ERR:"double_parse",rows};
    const note=txt.slice(iPal+lastEnd(txt.slice(iPal))).replace(/^[\s.,*:]+/,'').trim();
    block=build3(rows,note);rep={rows,note};
  } else {
    const ps=pairs(txt);if(ps.length<2)return {id,ERR:"few",n:ps.length};
    const note=txt.slice(lastEnd(txt)).replace(/^[\s.,:]+/,'').replace(/^\*?\s*/,'').trim();
    const rows=ps.map(p=>({label:(p.w+' kg'+(p.w>25?'*':'')), val:gv(p)}));
    block=build2(rows,note);rep={rows,note};
  }
  const newT=before+block;
  const fromMark=newT.slice(newT.lastIndexOf(MARK));
  const g={single:(newT.split(MARK).length-1)===1, cleanblock:fromMark.indexOf('&lt;')<0&&fromMark.indexOf('notionvc')<0&&fromMark.indexOf('&amp;nbsp;')<0, priedai:newT.indexOf('selen')>-1, probe:newT.indexOf('<b>\u0160uns svoris</b>')>-1, closed:newT.indexOf('&lt;/p&gt;\n'+MARK)>-1};
  if(!g.single||!g.cleanblock||!g.priedai||!g.probe||!g.closed)return {id,SKIP:"guard",g,rep};
  const wc=writeRaw(id,newT);const af=readRaw(id);
  return {id,act:"BUILT",kind,write:wc,lossless:af!==null&&md5(af)===md5(newT),ver_single:af!==null&&(af.split(MARK).length-1)===1,ver_clean:af!==null&&af.slice(af.lastIndexOf(MARK)).indexOf('&lt;')<0,rep};
}
const out=[];
out.push(applyBr(12454,'single'));
out.push(applyBr(12928,'double'));
const fe={};
for(const id of [12454,12928]){const H=front(id);fe[id]=H?{panel:H.indexOf(MARKTXT)>-1,b2b:H.indexOf('b2b-black')>-1,strongcruft:H.indexOf('&lt;/strong&gt;')>-1,dval:H.indexOf('80 g')>-1||H.indexOf('45'+D+'50 g')>-1}:{ERR:1};}
commit("euk_br_"+Date.now()+".json", JSON.stringify({out,fe},null,1));
console.log("DONE");
