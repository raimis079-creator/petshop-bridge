import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;for(let a=0;a<5;a++){try{const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'xd '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));const r=execSync('curl -s -w "\\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000});if(/HTTP:20[01]/.test(r))return true;}catch(e){}execSync('sleep 3');}return false;}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP=Buffer.from("LyoqCiAqIFBldHNob3AgQ29tcGxpYW56IFggPSBBdG1lc3RpIHYxCiAqIFggKGNsb3NlKSBteWd0dWthcyBlbGdpYXNpIGthaXAgQVRNRVNUSSAodXpmaWtzdW9qYSBwaWxuYSBkZW55IHBlciAuY21wbHotZGVueSksCiAqIG8gbmUgdHVzY2lhcyBkaXNtaXNzLiBDYXB0dXJlLXBoYXNlIGthZCBwcmVlbXB0aW50dSBDb21wbGlhbnogaGFuZGxlcmkuCiAqIENvbnNlbnQgQnJpZGdlICgjNjE5KSBuZWxpZXN0YXMuCiAqLwppZiAoICEgZGVmaW5lZCggJ0FCU1BBVEgnICkgKSB7IHJldHVybjsgfQoKYWRkX2FjdGlvbiggJ3dwX2Zvb3RlcicsIGZ1bmN0aW9uICgpIHsKCWlmICggaXNfYWRtaW4oKSApIHsgcmV0dXJuOyB9CgllY2hvICI8c2NyaXB0IGlkPVwicGV0c2hvcC1jbXBsei14LWRlbnlcIj4oZnVuY3Rpb24oKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsZnVuY3Rpb24oZSl7dmFyIHQ9ZS50YXJnZXQ7dmFyIHg9KHQmJnQuY2xvc2VzdCk/dC5jbG9zZXN0KCcuY21wbHotY29va2llYmFubmVyIC5jbXBsei1jbG9zZScpOm51bGw7aWYoIXgpcmV0dXJuO3ZhciBkPWRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5jbXBsei1jb29raWViYW5uZXIgLmNtcGx6LWRlbnknKTtpZihkKXtlLnByZXZlbnREZWZhdWx0KCk7ZS5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtkLmNsaWNrKCk7fX0sdHJ1ZSk7fSkoKTs8L3NjcmlwdD5cbiI7Cn0sIDEwMCApOwo=",'base64').toString('utf8');
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -w "\\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:ERR';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
(async()=>{const R={};try{
  const list=api('GET','/wp-json/code-snippets/v1/snippets?limit=300');
  let ex=null;try{ex=JSON.parse(list.body).find(s=>/Complianz X = Atmesti/i.test(s.name));}catch(e){}
  const payload={name:'Petshop Complianz X = Atmesti v1',desc:'X (close) elgiasi kaip ATMESTI (deny). Front-end.',code:PHP,scope:'front-end',active:true,priority:10};
  const c=ex?api('POST','/wp-json/code-snippets/v1/snippets/'+ex.id,payload):api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let snip=null;try{snip=JSON.parse(c.body);}catch(e){}
  const id=snip&&snip.id?snip.id:(ex&&ex.id);
  L('X-deny snippet id='+id+' active='+(snip?snip.active:'?')+' HTTP '+c.code+' code_len='+(snip?(snip.code||'').length:'?'));
  // readback + activate jei reikia
  if(id){const rb=api('GET','/wp-json/code-snippets/v1/snippets/'+id);try{const s=JSON.parse(rb.body);L('  readback active='+s.active+' has_deny='+/cmplz-deny/.test(s.code||''));if(!s.active){const a=api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/activate',{});L('  activate -> '+a.code);}}catch(e){L('  rb parse: '+rb.body.slice(0,150));}}
  R.snippet_id=id;
  L('DONE');
}catch(e){L('!!! '+(e&&e.stack?e.stack:e));}finally{putText('cmplz_xdeny_deploy.json',JSON.stringify(R,null,2));putText('_run6_log.txt',out);}})();
