process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyNSddKSA/ICRfR0VUWydwc19yMjI1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyNScpOwogJGxhdWtpYW1hcyA9ICczY2QxZmVmZjMzMzY0YTMyNDdiNDBiYmFkNGI5MjgwMCc7CiAkdXJsID0gJ2h0dHBzOi8vcmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbS9yYWltaXMwNzktY3JlYXRvci9wZXRzaG9wLWJyaWRnZS8wOGNmZGY4MGExODlmODQ4OWVlZjliNWRkMTBkZDg5NTYwZjhlYjY0L2RlcGxveS9wZXRzaG9wLXhtbC5waHAnOwogJHIgPSB3cF9yZW1vdGVfZ2V0KCR1cmwsIGFycmF5KCd0aW1lb3V0Jz0+NjApKTsKIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydrbGFpZGEnXT0kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTsgfQogZWxzZSB7CiAgICRrb2RhcyA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsKICAgJG9bJ21kNV9vayddPShtZDUoJGtvZGFzKT09PSRsYXVraWFtYXMpOwogICBpZigkb1snbWQ1X29rJ10pewogICAgICR0ID0gQHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7CiAgICAgJG9bJ3NpbnRha3NlJ10gPSBpc19hcnJheSgkdCkgPyAnT0snIDogJ0tMQUlEQSc7CiAgICAgaWYoaXNfYXJyYXkoJHQpKXsKICAgICAgICRmID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL3BldHNob3AteG1sLnBocCc7CiAgICAgICAkYmRpciA9IFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICAgICAgIGlmKCFpc19kaXIoJGJkaXIpKSBAd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgICAkb1snYmFrJ10gPSBAY29weSgkZiwkYmRpci4nL3BldHNob3AteG1sLicuZ21kYXRlKCdZbWQtSGlzJykuJy5iYWsucGhwJykgPyAnT0snOidORSc7CiAgICAgICAkb1snaXJhc3l0YSddID0gKCRvWydiYWsnXT09PSdPSycpID8gKGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRrb2RhcykhPT1mYWxzZSA/ICdPSyc6J05FJykgOiAnUFJBTEVJU1RBJzsKICAgICAgIGNsZWFyc3RhdGNhY2hlKCk7ICRvWydzdXRhbXBhJ109KG1kNV9maWxlKCRmKT09PSRsYXVraWFtYXMpOwogICAgIH0KICAgfQogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDEzMSk7CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZigoaXNzZXQoJF9HRVRbJ3BzX3IyMjViJ10pID8gJF9HRVRbJ3BzX3IyMjViJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyNWInKTsKICRvWydmdW5rY2lqYSddID0gZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3htbF90ZWtzdGFzJykgPyAneXJhJyA6ICdORVJBJzsKIGlmKGZ1bmN0aW9uX2V4aXN0cygncGV0c2hvcF94bWxfdGVrc3RhcycpKXsKICAgJG9bJ3Rlc3RhaSddID0gYXJyYXkoCiAgICAgJ2VpbHV0ZScgICAgICA9PiBwZXRzaG9wX3htbF90ZWtzdGFzKCdCaW92ZXRlcmluYXJ5JyksCiAgICAgJ21hc3l2YXMnICAgICA9PiBwZXRzaG9wX3htbF90ZWtzdGFzKGFycmF5KCdIYXUmTWlhdScsJ0Jpb3ZldGVyaW5hcnknKSksCiAgICAgJ2dpbHVzJyAgICAgICA9PiBwZXRzaG9wX3htbF90ZWtzdGFzKGFycmF5KCdhJz0+YXJyYXkoJ0tvbnNlcnZhaScsJ1N1bmltcycpKSksCiAgICAgJ3R1c2NpYXMnICAgICA9PiBwZXRzaG9wX3htbF90ZWtzdGFzKCcnKSwKICAgICAnbnVsbCcgICAgICAgID0+IHBldHNob3BfeG1sX3Rla3N0YXMobnVsbCksCiAgICAgJ3N1X3R1c2NpYWlzJyA9PiBwZXRzaG9wX3htbF90ZWtzdGFzKGFycmF5KCcnLCdNb25nZScsJycpKSwKICAgICAnZHVibGlrYXRhaScgID0+IHBldHNob3BfeG1sX3Rla3N0YXMoYXJyYXkoJ01vbmdlJywnTW9uZ2UnKSksCiAgICk7CiB9CiAkb1sndmFydGFpJ10gPSBhcnJheSgKICAgJ2Jsb2NrX3piX2NyZWF0ZScgPT4gZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3htbF9ibG9ja196Yl9jcmVhdGUnKSA/ICd5cmEnOidORVJBJywKICAgJ2lzX2tvbnNlcnZhcycgICAgPT4gZnVuY3Rpb25fZXhpc3RzKCdwZXRzaG9wX3htbF90ZXh0X2lzX2tvbnNlcnZhcycpID8gJ3lyYSc6J05FUkEnLAogKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R225'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'ZZ R225 XML eilutes',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r225=GO'); const tt=await rr.text();
    try{ out.DEPLOY=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,400); }
    await miegok(4000);
    const r2=await fetch(WP+'/?ps_r225b=GO'); try{ out.PATIKRA=JSON.parse(await r2.text()); }catch(e){ out.PATIKRA='klaida'; }
    for(const [v,k] of [['pradzia','/'],['parduotuve','/parduotuve/']]){
      const q=await fetch(WP+k); const h=await q.text();
      out[v]={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r225.json', Buffer.from(JSON.stringify(out,null,1)), 'r225 xml eilutes');
