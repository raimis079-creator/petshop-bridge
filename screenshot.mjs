process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIyMCddKSA/ICRfR0VUWydwc19yMjIwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIyMCcpOwogJGYgPSBnZXRfc3R5bGVzaGVldF9kaXJlY3RvcnkoKS4nL2Z1bmN0aW9ucy5waHAnOwogJG9bJ2ZhaWxhcyddID0gYXJyYXkoJ2tlbGlhcyc9PiRmLCAnZHlkaXMnPT5AZmlsZXNpemUoJGYpLCAnbWQ1Jz0+QG1kNV9maWxlKCRmKSwKICAgJ2tlaXN0YSc9PkBnbWRhdGUoJ1ktbS1kIEg6aScsIGZpbGVtdGltZSgkZikpKTsKICRvWydiNjQnXSA9IGJhc2U2NF9lbmNvZGUoKHN0cmluZylAZmlsZV9nZXRfY29udGVudHMoJGYpKTsKIC8qIFdDIG1va2VzY2l1IHJvZHltYXMgKi8KICRvWyd0YXgnXSA9IGFycmF5KAogICAnZGlzcGxheV9jYXJ0JyA9PiBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV90YXhfZGlzcGxheV9jYXJ0JyksCiAgICdkaXNwbGF5X3Nob3AnID0+IGdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3RheF9kaXNwbGF5X3Nob3AnKSwKICAgJ3ByaWNlc19pbmNsdWRlX3RheCcgPT4gZ2V0X29wdGlvbignd29vY29tbWVyY2VfcHJpY2VzX2luY2x1ZGVfdGF4JyksCiAgICdjYWxjX3RheGVzJyA9PiBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV9jYWxjX3RheGVzJyksCiApOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R220'};
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
  const kunas=JSON.stringify({name:'ZZ R220 Temos failas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r220=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,600); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r220.json', Buffer.from(JSON.stringify(out,null,1)), 'r220 mokestis + a11y');
