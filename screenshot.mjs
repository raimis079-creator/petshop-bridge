process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaW52MiddKSB8fCAkX0dFVFsncHNfaW52MiddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J0lOVjInKTsKICRmPWdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvd29vY29tbWVyY2UtZGVsaXZlcnktbm90ZXMvYmFzZS5waHAnOwogJFRbJ3lyYSddPWZpbGVfZXhpc3RzKCRmKTsKIGlmKCRUWyd5cmEnXSl7CiAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgJFRbJ21kNSddPW1kNSgkYyk7ICRUWydiYWl0YWknXT1zdHJsZW4oJGMpOwogICAkVFsndHVyaW55c19iNjQnXT1iYXNlNjRfZW5jb2RlKCRjKTsKIH0KIC8vIGRvbXBkZiBrb25maWd1cmFjaWphCiBpZihjbGFzc19leGlzdHMoJ0RvbXBkZlxcT3B0aW9ucycpKXsKICAgJFRbJ2RvbXBkZl9rbGFzZSddPXRydWU7CiB9CiAkdT13cF91cGxvYWRfZGlyKCk7CiAkbGc9J2h0dHBzOi8vZGV2LmF2ZXNhLmx0L3dwLWNvbnRlbnQvdXBsb2Fkcy8yMDI2LzA1L1BpbG5vLWxvZ290aXBvLXNwYWx2b3RhLXZlcnNpamEtMTAwLTIuanBnJzsKICRyZWw9c3RyX3JlcGxhY2UoJHVbJ2Jhc2V1cmwnXS4nLycsJycsJGxnKTsKICRwYXRoPSR1WydiYXNlZGlyJ10uJy8nLiRyZWw7CiAkVFsnbG9nbyddPWFycmF5KCd1cmwnPT4kbGcsJ2tlbGlhcyc9PiRwYXRoLCd5cmEnPT5maWxlX2V4aXN0cygkcGF0aCksCiAgICdkeWRpcyc9PmZpbGVfZXhpc3RzKCRwYXRoKT9maWxlc2l6ZSgkcGF0aCk6MCwKICAgJ21pbWUnPT5maWxlX2V4aXN0cygkcGF0aCk/KGZ1bmN0aW9uX2V4aXN0cygnbWltZV9jb250ZW50X3R5cGUnKT9taW1lX2NvbnRlbnRfdHlwZSgkcGF0aCk6J24vYScpOiduL2EnKTsKIC8vIGFyIGRvbXBkZiBnYWxpIHBhaW10aSBwZXIgVVJMCiAkcj13cF9yZW1vdGVfZ2V0KCRsZyxhcnJheSgndGltZW91dCc9PjEwLCdzc2x2ZXJpZnknPT50cnVlKSk7CiAkVFsndXJsX3NzbHZlcmlmeV90cnVlJ109aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOndwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICRyMj13cF9yZW1vdGVfZ2V0KCRsZyxhcnJheSgndGltZW91dCc9PjEwLCdzc2x2ZXJpZnknPT5mYWxzZSkpOwogJFRbJ3VybF9zc2x2ZXJpZnlfZmFsc2UnXT1pc193cF9lcnJvcigkcjIpPyRyMi0+Z2V0X2Vycm9yX21lc3NhZ2UoKTp3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcjIpOwogJGN0eD1AZmlsZV9nZXRfY29udGVudHMoJGxnLGZhbHNlLHN0cmVhbV9jb250ZXh0X2NyZWF0ZShhcnJheSgnaHR0cCc9PmFycmF5KCd0aW1lb3V0Jz0+MTApKSkpOwogJFRbJ2ZpbGVfZ2V0X2NvbnRlbnRzX3VybCddPSgkY3R4PT09ZmFsc2UpPydGQUxTRSc6c3RybGVuKCRjdHgpOwogJFRbJ2FsbG93X3VybF9mb3BlbiddPWluaV9nZXQoJ2FsbG93X3VybF9mb3BlbicpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCA1KTsK';
const out={v:'INV2'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP INV Read v1 (base.php)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_inv2=RUN');
    const t=await d.text();
    let R=null; try{ R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,600); }
    if(R){
      if(R.turinys_b64){ await put('deploy/wcdn-base.php', Buffer.from(R.turinys_b64,'base64'), 'base.php snapshot'); delete R.turinys_b64; }
      out.R=R;
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/inv2.json', Buffer.from(JSON.stringify(out,null,1)), 'INV2 read');
