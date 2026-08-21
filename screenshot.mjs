process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIwMiddKSA/ICRfR0VUWydwc19yMjAyJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjIwMicpOwogJGxhdWtpYW1hc19tZDUgPSAnZDFiZWI4ZjllYzQ3ZDQzMjllNTU4ZWU4NjlmM2IyZjInOwogJHVybCA9ICdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvNzk2ZWU3YWE2YjcwNmIwZjU0ZWQ1NWM3NTFlZjY4ODJlN2QxMDNlNC9kZXBsb3kvcGV0c2hvcC1sYXVrYWkucGhwJzsKCiAkciA9IHdwX3JlbW90ZV9nZXQoJHVybCwgYXJyYXkoJ3RpbWVvdXQnPT42MCkpOwogaWYoaXNfd3BfZXJyb3IoJHIpKXsgJG9bJ2tsYWlkYSddID0gJHItPmdldF9lcnJvcl9tZXNzYWdlKCk7IH0KIGVsc2UgewogICAka29kYXMgPSB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcik7CiAgICRvWydnYXV0YSddID0gc3RybGVuKCRrb2Rhcyk7CiAgICRvWydtZDUnXSA9IG1kNSgka29kYXMpOwogICAkb1snbWQ1X29rJ10gPSAobWQ1KCRrb2RhcykgPT09ICRsYXVraWFtYXNfbWQ1KTsKICAgaWYoJG9bJ21kNV9vayddKXsKICAgICAkdCA9IEB0b2tlbl9nZXRfYWxsKCRrb2RhcywgVE9LRU5fUEFSU0UpOwogICAgICRvWydzaW50YWtzZSddID0gaXNfYXJyYXkoJHQpID8gJ09LICgnLmNvdW50KCR0KS4nIHpldG9udSknIDogJ0tMQUlEQSc7CiAgICAgaWYoaXNfYXJyYXkoJHQpKXsKICAgICAgICR0aWtzbGFzID0gKGRlZmluZWQoJ1dQTVVfUExVR0lOX0RJUicpP1dQTVVfUExVR0lOX0RJUjpXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnKS4nL3BldHNob3AtbGF1a2FpLnBocCc7CiAgICAgICAkb1snc2VuYXNfbWQ1J10gPSBtZDVfZmlsZSgkdGlrc2xhcyk7CiAgICAgICAkYmRpciA9IFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICAgICAgIGlmKCFpc19kaXIoJGJkaXIpKSBAd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgICAkYmFrID0gJGJkaXIuJy9wZXRzaG9wLWxhdWthaS4nLmdtZGF0ZSgnWW1kLUhpcycpLicuYmFrLnBocCc7CiAgICAgICAkb1snYmFrJ10gPSBAY29weSgkdGlrc2xhcywkYmFrKSA/IGJhc2VuYW1lKCRiYWspIDogJ05FUEFWWUtPJzsKICAgICAgIGlmKCRvWydiYWsnXSAhPT0gJ05FUEFWWUtPJyl7CiAgICAgICAgICRvWydpcmFzeXRhJ10gPSBmaWxlX3B1dF9jb250ZW50cygkdGlrc2xhcywka29kYXMpICE9PSBmYWxzZSA/ICdPSycgOiAnTkVQQVZZS08nOwogICAgICAgICBjbGVhcnN0YXRjYWNoZSgpOwogICAgICAgICAkb1snbmF1amFzX21kNSddID0gbWQ1X2ZpbGUoJHRpa3NsYXMpOwogICAgICAgICAkb1snc3V0YW1wYSddID0gKCRvWyduYXVqYXNfbWQ1J10gPT09ICRsYXVraWFtYXNfbWQ1KTsKICAgICAgIH0KICAgICB9CiAgIH0KIH0KCiAvKiBQYWdhbGJpbmlhaSBkdW9tZW55cyB2ZXJpZmlrYWNpamFpICovCiAkb1snYXR0XzM1MDMwJ10gPSB3cF9nZXRfYXR0YWNobWVudF9pbWFnZV91cmwoMzUwMzAsJ3dvb2NvbW1lcmNlX3RodW1ibmFpbCcpOwogJG9bJ2F0dF8zNTAwNCddID0gd3BfZ2V0X2F0dGFjaG1lbnRfaW1hZ2VfdXJsKDM1MDA0LCd3b29jb21tZXJjZV90aHVtYm5haWwnKTsKICRvWydrbGFzZV92ZXJzaWphJ10gPSBjbGFzc19leGlzdHMoJ1BldHNob3BfTGF1a2FpJykgPyBQZXRzaG9wX0xhdWthaTo6VkVSU0lKQSA6ICduZXJhJzsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbywgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsKIGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'R202'};
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
  /* 0. isjungiam senus TEMP */
  const f0=await fetch(SNIP,{headers:A}); let visi=[]; try{visi=JSON.parse(await f0.text());}catch(e){}
  out.snippetu_kiek=Array.isArray(visi)?visi.length:'?';
  if(Array.isArray(visi)){ for(const s of visi){ if(String(s.name||'').startsWith('TEMP')&&s.active){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); out.isjungta=(out.isjungta||[]).concat(s.id); } } }
  /* 1. kuriam snippeta */
  const kunas=JSON.stringify({name:'TEMP R202 Laukai v1.43 deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta = j&&j.id ? j.id : {s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    await miegok(6000);
    const r=await fetch(WP+'/?ps_r202=GO'); const t=await r.text();
    try{ out.DUOM=JSON.parse(t); }catch(e){ out.DUOM={s:r.status, zalias:t.slice(0,600)}; }
    await miegok(3000);
    /* verifikacija: ar rinkinys kataloge jau turi nuotrauka */
    for(const [vardas,kelias] of [['preke','/product/test-konservu-deze-400-be-vistienos/'],['kategorija','/kategorija/rinkiniai/']]){
      const rr=await fetch(WP+kelias); const hh=await rr.text();
      out[vardas]={s:rr.status,
        placeholder:(hh.match(/woocommerce-placeholder/g)||[]).length,
        foto35030:(hh.match(/rinkinys-konservai-sunims|35030/g)||[]).length,
        deze400:hh.includes('Konservu deze 400')};
      out[vardas].img_srcs=(hh.match(/<img[^>]+class="[^"]*attachment-woocommerce_thumbnail[^"]*"[^>]*src="([^"]+)"/g)||[]).slice(0,8).map(s=>(s.match(/src="([^"]+)"/)||[])[1]);
    }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.deaktyvuota=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r202.json', Buffer.from(JSON.stringify(out,null,1)), 'r202 laukai recon');
