import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));try{return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();}catch(e){return 'ERR';}}
function readRaw(id){for(let i=0;i<5;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wp/v2/product/${id}?context=edit&_fields=content" -o /tmp/r.json`,{encoding:'utf8',env,maxBuffer:50000000});const r=(JSON.parse(fs.readFileSync('/tmp/r.json','utf8')).content||{}).raw;if(typeof r==='string')return r;}catch(e){}execSync('sleep 3');}return null;}
const MARKTXT='\u0160\u0117rimo instrukcija';
const openerRe=/(?:\s|&lt;br ?\/?&gt;|&lt;p&gt;|&lt;span[^&]*&gt;|&lt;strong&gt;|<br ?\/?>|<p>|<span[^>]*>|<strong>)+$/;
const out={};
for(const id of [12454,12928]){const T=readRaw(id);if(T===null){out[id]={ERR:1};continue;}
  const iM=T.indexOf(MARKTXT);const pre=T.slice(0,iM);const mm=pre.match(openerRe);const iStart=mm?iM-mm[0].length:iM;
  const before=T.slice(0,iStart);
  const oPe=before.lastIndexOf('&lt;p&gt;'), cPe=before.lastIndexOf('&lt;/p&gt;');
  const oPr=before.lastIndexOf('<p>'), cPr=before.lastIndexOf('</p>');
  const oSe=before.lastIndexOf('&lt;span'), cSe=before.lastIndexOf('&lt;/span&gt;');
  out[id]={
    opener_stripped: mm?mm[0]:null,
    before_tail: before.slice(-160),
    p_enc_open: oPe>cPe, span_enc_open: oSe>cSe,
    p_real_open: oPr>cPr,
    feed_full: T.slice(iM, T.length)
  };}
commit("euk_brrecon_"+Date.now()+".json", JSON.stringify(out,null,1));
console.log("DONE");
