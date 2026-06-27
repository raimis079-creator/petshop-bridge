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
function build2(rows,note){let t=MARK+'\n'+STY+'<div class="b2b-black"><table style="width:100%;" cellspacing="0">\n';
  t+='<tr><td style="'+TD+'"><b>\u0160uns svoris</b></td><td style="'+TD+'"><b>Kiekis per par\u0105</b></td></tr>\n';
  rows.forEach(r=>{t+='<tr><td style="'+TD+'">'+r.w+' kg</td><td style="'+TD+'">'+r.val+'</td></tr>\n';});
  t+='</table>'+(note?'\n<p>'+note+'</p>':'')+'</div>';return t;}
const id=12452;const report={};
try{
const T=readRaw(id);if(T===null)throw "read";
const iM=T.indexOf(MARKTXT);if(iM<0)throw "no_mark";
// strip opener run before iM (encoded+real opening tags, br, ws) - NOT closers
const openerRe=/(?:\s|&lt;br ?\/?&gt;|&lt;p&gt;|&lt;span[^&]*&gt;|&lt;strong&gt;|<br ?\/?>|<p>|<span[^>]*>|<strong>)+$/;
const pre=T.slice(0,iM);const mm=pre.match(openerRe);const iStart=mm?iM-mm[0].length:iM;
const before=T.slice(0,iStart);
report.prev_ends=before.slice(-30);
report.brShared=!/(&lt;\/p&gt;|<\/p>)\s*$/.test(before);
// parse feeding
const region=T.slice(iM, T.length);const txt=clean(region);
const ps=pairs(txt);const note=txt.slice(lastEnd(txt)).replace(/^[\s.,*:]+/,'').trim();
report.rows=ps.map(p=>({w:p.w,val:gv(p)}));report.note=note;
if(ps.length<2)throw "few_pairs";
const block=build2(ps.map(p=>({w:p.w,val:gv(p)})),note);
const newT=before+block;
const g={single:(newT.split(MARK).length-1)===1, cruftgone:newT.indexOf(MARKTXT+': &lt;/strong&gt;')<0&&newT.indexOf(MARKTXT+':&lt;/strong&gt;')<0, notionvc:newT.indexOf('notionvc')<0, sud:newT.indexOf('Sud\u0117tis')>-1, anal:newT.indexOf('Analitin')>-1, probe:newT.indexOf('<b>\u0160uns svoris</b>')>-1, dataval:newT.indexOf('40'+D+'50 g')>-1, prevclosed:!report.brShared};
report.guards=g;
if(!g.single||!g.cruftgone||!g.notionvc||!g.sud||!g.probe||!g.dataval||!g.prevclosed){report.RESULT="ABORT_guard";}
else{
  const wc=writeRaw(id,newT);const af=readRaw(id);
  report.write=wc;report.lossless=af!==null&&md5(af)===md5(newT);
  report.ver_single=af!==null&&(af.split(MARK).length-1)===1;
  report.ver_cruftgone=af!==null&&af.indexOf('&lt;/strong&gt;rekomenduojamos')<0;
  // frontend
  const H=front(id);report.fe_panel=H?H.indexOf(MARKTXT)>-1:null;report.fe_b2b=H?H.indexOf('b2b-black')>-1:null;report.fe_val=H?H.indexOf('40'+D+'50 g')>-1:null;report.fe_strongcruft=H?H.indexOf('&lt;/strong&gt;')>-1:null;
  report.RESULT="DONE";
}
}catch(e){report.FATAL=String(e).slice(0,150);}
commit("euk_one_"+Date.now()+".json", JSON.stringify(report,null,1));
console.log("DONE");
