process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3NyddKT8kX0dFVFsncHNfaDA3NyddOicnKSE9PSdIMDc3JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNzcnKTsKIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy9wbHVnaW4ucGhwJzsKIHJlcXVpcmVfb25jZSBBQlNQQVRILid3cC1hZG1pbi9pbmNsdWRlcy91cGRhdGUucGhwJzsKCiAkb1snd3AnXT1hcnJheSgndmVyc2lqYSc9PmdldF9ibG9naW5mbygndmVyc2lvbicpLCdwaHAnPT5QSFBfVkVSU0lPTiwKICAgJ215c3FsJz0+JHdwZGItPmRiX3ZlcnNpb24oKSwnd2MnPT5kZWZpbmVkKCdXQ19WRVJTSU9OJyk/V0NfVkVSU0lPTjpudWxsKTsKCiAvKiBwcml2ZXJzdGluYWkgcGVya3JhdXRpIGF0bmF1amluaW11IGR1b21lbmlzICovCiB3cF9jbGVhbl9wbHVnaW5zX2NhY2hlKHRydWUpOwogd3BfdXBkYXRlX3BsdWdpbnMoKTsKIHdwX3ZlcnNpb25fY2hlY2soKTsKIHdwX3VwZGF0ZV90aGVtZXMoKTsKCiAkdT1nZXRfc2l0ZV90cmFuc2llbnQoJ3VwZGF0ZV9wbHVnaW5zJyk7CiAkb1snbGF1a2lhX2F0bmF1amluaW1vJ109YXJyYXkoKTsKIGlmKCR1ICYmICFlbXB0eSgkdS0+cmVzcG9uc2UpKXsKICAgJHZpc2k9Z2V0X3BsdWdpbnMoKTsKICAgZm9yZWFjaCgkdS0+cmVzcG9uc2UgYXMgJGY9PiR4KXsKICAgICAkYWt0PWlzX3BsdWdpbl9hY3RpdmUoJGYpOwogICAgICRvWydsYXVraWFfYXRuYXVqaW5pbW8nXVtdPWFycmF5KAogICAgICAgJ2ZhaWxhcyc9PiRmLCd2YXJkYXMnPT5pc3NldCgkdmlzaVskZl1bJ05hbWUnXSk/JHZpc2lbJGZdWydOYW1lJ106JGYsCiAgICAgICAnZGFiYXInPT5pc3NldCgkdmlzaVskZl1bJ1ZlcnNpb24nXSk/JHZpc2lbJGZdWydWZXJzaW9uJ106bnVsbCwKICAgICAgICduYXVqYSc9Pmlzc2V0KCR4LT5uZXdfdmVyc2lvbik/JHgtPm5ld192ZXJzaW9uOm51bGwsCiAgICAgICAnYWt0eXZ1cyc9PiRha3Q/MTowLAogICAgICAgJ3Rlc3R1b3RhX2lraSc9Pmlzc2V0KCR4LT50ZXN0ZWQpPyR4LT50ZXN0ZWQ6bnVsbCwKICAgICAgICdyZWlraWFfcGhwJz0+aXNzZXQoJHgtPnJlcXVpcmVzX3BocCk/JHgtPnJlcXVpcmVzX3BocDpudWxsKTsKICAgfQogfQogJG9bJ2xhdWtpYV9raWVrJ109Y291bnQoJG9bJ2xhdWtpYV9hdG5hdWppbmltbyddKTsKICRvWydwbHVnaW51X3Zpc28nXT1jb3VudChnZXRfcGx1Z2lucygpKTsKICRvWydha3R5dml1J109Y291bnQoKGFycmF5KWdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJykpOwoKIC8qIFdQIGJyYW5kdW9seXMgKi8KICRjPWdldF9zaXRlX3RyYW5zaWVudCgndXBkYXRlX2NvcmUnKTsKIGlmKCRjICYmICFlbXB0eSgkYy0+dXBkYXRlcykpewogICAkb1snYnJhbmR1b2x5cyddPWFycmF5KCk7CiAgIGZvcmVhY2goYXJyYXlfc2xpY2UoJGMtPnVwZGF0ZXMsMCwzKSBhcyAkeCkKICAgICAkb1snYnJhbmR1b2x5cyddW109YXJyYXkoJ2F0c2FrYXMnPT4keC0+cmVzcG9uc2UsJ3ZlcnNpamEnPT4keC0+Y3VycmVudCwncGhwJz0+aXNzZXQoJHgtPnBocF92ZXJzaW9uKT8keC0+cGhwX3ZlcnNpb246bnVsbCk7CiB9CiAvKiB0ZW1vcyAqLwogJHQ9Z2V0X3NpdGVfdHJhbnNpZW50KCd1cGRhdGVfdGhlbWVzJyk7CiAkb1sndGVtb3MnXT0oJHQgJiYgIWVtcHR5KCR0LT5yZXNwb25zZSkpP2FycmF5X2tleXMoJHQtPnJlc3BvbnNlKTphcnJheSgpOwoKIC8qIFdvb0NvbW1lcmNlIERCICovCiBpZihjbGFzc19leGlzdHMoJ1dDX0luc3RhbGwnKSl7CiAgICRvWyd3Y19kYiddPWFycmF5KCdkYl92ZXJzaWphJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZGJfdmVyc2lvbicpLAogICAgICdyZWlraWFfZGJfdXBkYXRlJz0+Z2V0X29wdGlvbignd29vY29tbWVyY2VfZGJfdmVyc2lvbicpIT09V0NfVkVSU0lPTj8xOjApOwogfQogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H077'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H077 atnaujinimai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h077=H077'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h077.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h077 atnaujinimai');
