process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA0NSddKT8kX0dFVFsncHNfaDA0NSddOicnKSE9PSdIMDQ1JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNDUnKTsKCiAvKiBrb2tpYSBrYXRlZ29yaWp1IGJhetC1ICovCiAkb1sncGVybWFsaW5rcyddPWFycmF5KAogICAnY2F0ZWdvcnlfYmFzZSc9PmdldF9vcHRpb24oJ2NhdGVnb3J5X2Jhc2UnKSwKICAgJ3Byb2R1Y3RfY2F0X2Jhc2UnPT5udWxsLAogICAncGVybWFsaW5rX3N0cnVjdHVyZSc9PmdldF9vcHRpb24oJ3Blcm1hbGlua19zdHJ1Y3R1cmUnKSwKICk7CiAkcGw9Z2V0X29wdGlvbignd29vY29tbWVyY2VfcGVybWFsaW5rcycpOwogJG9bJ3djX3Blcm1hbGlua3MnXT0kcGw7CgogLyogYXIgeXJhIFBVU0xBUElTIOKAnnNwcmVuZGltYWkiIGlyIHZhaWthaSAqLwogJHA9Z2V0X3BhZ2VfYnlfcGF0aCgnc3ByZW5kaW1haScpOwogJG9bJ3NwcmVuZGltYWlfcHVzbGFwaXMnXT0kcD9hcnJheSgnaWQnPT4kcC0+SUQsJ3RpcGFzJz0+JHAtPnBvc3RfdHlwZSwnc3QnPT4kcC0+cG9zdF9zdGF0dXMsJ3RpdGxlJz0+JHAtPnBvc3RfdGl0bGUpOm51bGw7CiBpZigkcCl7CiAgICR2PWdldF9jaGlsZHJlbihhcnJheSgncG9zdF9wYXJlbnQnPT4kcC0+SUQsJ3Bvc3RfdHlwZSc9PidwYWdlJywncG9zdF9zdGF0dXMnPT4nYW55JywnbnVtYmVycG9zdHMnPT41MCkpOwogICAkb1sndmFpa2FpJ109YXJyYXkoKTsKICAgZm9yZWFjaCgkdiBhcyAkeCkgJG9bJ3ZhaWthaSddW109YXJyYXkoJ2lkJz0+JHgtPklELCdzbHVnJz0+JHgtPnBvc3RfbmFtZSwnc3QnPT4keC0+cG9zdF9zdGF0dXMsJ3QnPT4keC0+cG9zdF90aXRsZSwndXJsJz0+Z2V0X3Blcm1hbGluaygkeCkpOwogICAkb1sndmFpa3UnXT1jb3VudCgkdik7CiB9CiAvKiB2aXNpIHB1c2xhcGlhaSwga3VyaXUgc2x1ZyBzdXRhbXBhIHN1IGthdGVnb3Jpam9zIHNsdWcgKi8KICRrYXQ9Z2V0X3Rlcm1zKGFycmF5KCd0YXhvbm9teSc9Pidwcm9kdWN0X2NhdCcsJ2hpZGVfZW1wdHknPT5mYWxzZSkpOwogJHNsdWdhaT1hcnJheSgpOyBmb3JlYWNoKCRrYXQgYXMgJHQpeyBpZighaXNfd3BfZXJyb3IoJHQpKSAkc2x1Z2FpWyR0LT5zbHVnXT1hcnJheSgnaWQnPT4kdC0+dGVybV9pZCwndic9PiR0LT5uYW1lLCd1Jz0+Z2V0X3Rlcm1fbGluaygkdCkpOyB9CiAkZWlsPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSxwb3N0X3RpdGxlLHBvc3RfdHlwZSxwb3N0X3N0YXR1cyxwb3N0X3BhcmVudCBGUk9NIHskUH1wb3N0cwogICBXSEVSRSBwb3N0X3R5cGUgSU4gKCdwYWdlJywncG9zdCcpIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCciLCBBUlJBWV9BKTsKICRzdXRhbXBhPWFycmF5KCk7CiBmb3JlYWNoKCRlaWwgYXMgJHgpewogICBpZihpc3NldCgkc2x1Z2FpWyR4Wydwb3N0X25hbWUnXV0pKXsKICAgICAkc3V0YW1wYVtdPWFycmF5KCdwc2xfaWQnPT4oaW50KSR4WydJRCddLCdzbHVnJz0+JHhbJ3Bvc3RfbmFtZSddLCdwc2wnPT4keFsncG9zdF90aXRsZSddLAogICAgICAgJ3RpcGFzJz0+JHhbJ3Bvc3RfdHlwZSddLCdwc2xfdXJsJz0+Z2V0X3Blcm1hbGluaygkeFsnSUQnXSksCiAgICAgICAna2F0Jz0+JHNsdWdhaVskeFsncG9zdF9uYW1lJ11dWyd2J10sJ2thdF91cmwnPT4kc2x1Z2FpWyR4Wydwb3N0X25hbWUnXV1bJ3UnXSk7CiAgIH0KIH0KICRvWydzbHVnX3N1dGFwaW1haSddPSRzdXRhbXBhOwogJG9bJ3N1dGFwaW11J109Y291bnQoJHN1dGFtcGEpOwogJG9bJ2thdGVnb3JpanUnXT1jb3VudCgkc2x1Z2FpKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H045'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function tikr(u){
  try{
    const r=await fetch(u,{redirect:'manual'});
    if(r.status>=300&&r.status<400) return {st:r.status,loc:(r.headers.get('location')||'').replace('https://dev.avesa.lt','')};
    const h=await r.text();
    const c=h.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i);
    const t=h.match(/<title>([\s\S]*?)<\/title>/i);
    const rob=h.match(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i);
    return {st:r.status,can:c?c[1].replace('https://dev.avesa.lt',''):'',
            title:t?t[1].slice(0,70):'',rob:rob?rob[1]:''};
  }catch(e){ return {kl:String(e).slice(0,60)}; }
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H045 dublikatai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h045=H045'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }

  /* ar kategorijos pasiekiamos be /kategorija/ priesdelio */
  out.be_priesdelio=[];
  const testai=['sprendimai/jautrus-virskinimas','sunims/maistas-sunims/sausas-maistas-sunims',
                'katems/kraikai-kaciu-tualetams','sunims','sprendimai'];
  for(const p of testai){
    out.be_priesdelio.push({p, be:await tikr('https://dev.avesa.lt/'+p+'/'),
                               su:await tikr('https://dev.avesa.lt/kategorija/'+p+'/')});
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h045.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h045 dublikatai');
