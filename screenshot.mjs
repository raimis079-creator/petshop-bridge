import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'e3 '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("LyoqCiAqIFBldHNob3AgU2xhcHVrdSBQb2xpdGlrYSBFUyAzMDEgdjEgKExJVkUpCiAqIFNlbmFzIENvbXBsaWFueiAtZXMgVVJMIDMwMSAtPiBzdmFydXMgL3NsYXB1a3UtcG9saXRpa2EvIChwYWdlIHJlZGlyZWN0LAogKiBuZXMgV1AgbmF0aXZlIF93cF9vbGRfc2x1ZyBuZXZlaWtpYSBwdXNsYXBpYW1zKS4KICovCmlmICggISBkZWZpbmVkKCAnQUJTUEFUSCcgKSApIHsgcmV0dXJuOyB9CgphZGRfYWN0aW9uKCAndGVtcGxhdGVfcmVkaXJlY3QnLCBmdW5jdGlvbiAoKSB7CglpZiAoIGlzX2FkbWluKCkgKSB7IHJldHVybjsgfQoJJHBhdGggPSBpc3NldCggJF9TRVJWRVJbJ1JFUVVFU1RfVVJJJ10gKSA/IChzdHJpbmcpIHdwX3BhcnNlX3VybCggJF9TRVJWRVJbJ1JFUVVFU1RfVVJJJ10sIFBIUF9VUkxfUEFUSCApIDogJyc7CgkkcGF0aCA9IHVudHJhaWxpbmdzbGFzaGl0KCAkcGF0aCApOwoJaWYgKCAkcGF0aCA9PT0gJy9zbGFwdWt1LXBvbGl0aWthLWVzJyApIHsKCQl3cF9zYWZlX3JlZGlyZWN0KCBob21lX3VybCggJy9zbGFwdWt1LXBvbGl0aWthLycgKSwgMzAxICk7CgkJZXhpdDsKCX0KfSwgMSApOwo=",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
function trace(p){const r=sh('curl -s -k -I -A "Mozilla/5.0" -o /tmp/h.txt -w "%{http_code}" "'+BASE+p+'"');let h='';try{h=fs.readFileSync('/tmp/h.txt','utf8');}catch(e){}const loc=(h.match(/^location:\s*([^\r\n]+)/im)||[])[1]||'';return {code:r.trim(),loc:loc.trim()};}
(async()=>{const R={};try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let ex=null;try{ex=JSON.parse(list.body).find(s=>/Slapuku Politika ES 301/i.test(s.name));}catch(e){}
  const payload={name:'Petshop Slapuku Politika ES 301 v1 (LIVE)',desc:'senas -es URL 301 -> svarus',code:PHP,scope:'front-end',active:true,priority:10};
  const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let snip=null;try{snip=JSON.parse(c.body);}catch(e){}const id=snip&&snip.id?snip.id:(ex&&ex.id);
  L('ES301 snippet id='+id+' active='+(snip?snip.active:'?')+' HTTP '+c.code);
  R.snippet_id=id;
  if(id){const rb=api('GET','/wp-json/code-snippets/v1/snippets/'+id);try{const s=JSON.parse(rb.body);if(!s.active){const a=api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/activate',{});L('activate -> '+a.code);}else L('  jau aktyvus');}catch(e){}}
  execSync('sleep 2');
  L('=== GALUTINE URL patikra ===');
  for(const p of ['/slapuku-politika/','/slapuku-politika-es/']){const t=trace(p);L('  '+p+' -> '+t.code+(t.loc?' -> '+t.loc:''));R['url_'+p]=t;}
  L('DONE');
}catch(e){L('!!! '+(e&&e.stack?e.stack:e));}finally{putText('cmplz_es301.json',JSON.stringify(R,null,2));putText('_run12_log.txt',out);}})();
