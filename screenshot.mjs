process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import crypto from 'crypto';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX2c4MTQnXSk/JF9HRVRbJ3BzX2c4MTQnXTonJykgIT09ICdHODE0JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0c4MTQnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aScpKTsKCiAkY2hrMTM9ZnVuY3Rpb24oJGQxMil7ICRzPTA7IGZvcigkaT0wOyRpPDEyOyRpKyspeyAkcyArPSAoKGludCkkZDEyWyRpXSkgKiAoKCRpJTIpPzM6MSk7IH0gcmV0dXJuIChzdHJpbmcpKCgxMC0kcyUxMCklMTApOyB9OwogJG9rMTM9ZnVuY3Rpb24oJHYpIHVzZSgkY2hrMTMpeyByZXR1cm4gKHN0cmxlbigkdik9PT0xMyAmJiBjdHlwZV9kaWdpdCgkdikgJiYgJGNoazEzKHN1YnN0cigkdiwwLDEyKSk9PT1zdWJzdHIoJHYsMTIsMSkpOyB9OwogJG9rMTI9ZnVuY3Rpb24oJHYpeyBpZihzdHJsZW4oJHYpIT09MTIgfHwgIWN0eXBlX2RpZ2l0KCR2KSkgcmV0dXJuIGZhbHNlOyAkcz0wOyBmb3IoJGk9MDskaTwxMTskaSsrKXsgJHMgKz0gKChpbnQpJHZbJGldKSAqICgoJGklMj09PTApPzM6MSk7IH0gcmV0dXJuICgoMTAtJHMlMTApJTEwKT09PShpbnQpJHZbMTFdOyB9OwogJG9rOD1mdW5jdGlvbigkdil7IGlmKHN0cmxlbigkdikhPT04IHx8ICFjdHlwZV9kaWdpdCgkdikpIHJldHVybiBmYWxzZTsgJHM9MDsgZm9yKCRpPTA7JGk8NzskaSsrKXsgJHMgKz0gKChpbnQpJHZbJGldKSAqICgoJGklMj09PTApPzM6MSk7IH0gcmV0dXJuICgoMTAtJHMlMTApJTEwKT09PShpbnQpJHZbN107IH07CgogLyogdmlzb3MgcHVibGlzaCBwcmVrZXMgKyBqdSBrb2RhaSAqLwogJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwgcC5wb3N0X3RpdGxlLCBwLnBvc3Rfc3RhdHVzLAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfemJfZWFuJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHpiLAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfZWFuJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIGVhbiwKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX2dsb2JhbF91bmlxdWVfaWQnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgZ3VpZCwKICAgIE1BWChDQVNFIFdIRU4gbS5tZXRhX2tleT0nX3ZmX2JhcmNvZGUnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgdmYsCiAgICBNQVgoQ0FTRSBXSEVOIG0ubWV0YV9rZXk9J19za3UnIFRIRU4gbS5tZXRhX3ZhbHVlIEVORCkgc2t1LAogICAgTUFYKENBU0UgV0hFTiBtLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBUSEVOIG0ubWV0YV92YWx1ZSBFTkQpIHN0b2sKICBGUk9NIHskUH1wb3N0cyBwIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRAogICAgQU5EIG0ubWV0YV9rZXkgSU4gKCdfemJfZWFuJywnX2VhbicsJ19nbG9iYWxfdW5pcXVlX2lkJywnX3ZmX2JhcmNvZGUnLCdfc2t1JywnX3N0b2NrX3N0YXR1cycpCiAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJwogIEdST1VQIEJZIHAuSUQiLCBBUlJBWV9BKTsKCiAkc3Q9YXJyYXkoJ3Zpc28nPT4wLCdqYXVfZ2VyYXMnPT4wLCd2Zl9hdGt1cnRhJz0+MCwnbGVuMTJfYXRrdXJ0YSc9PjAsJ3VwYzEyX3BhbGlla2FtJz0+MCwnZWFuOF9wYWxpZWthbSc9PjAsJ25lcmFfc2FsdGluaW8nPT4wLCduZXR2YXJraW5nYXMnPT4wLCdrb25mbGlrdGFzJz0+MCwnbmVzaWtlaWNpYSc9PjAsJ2tlaXNpcyc9PjApOwogJHZhbD1hcnJheSgndGlrcmludGEnPT4wLCdzdXRhcG8nPT4wLCduZXN1dGFwbyc9PjAsJ25lc3V0YXBpbXVfcHZ6Jz0+YXJyYXkoKSk7CiAkc2l0ZWw9YXJyYXkoKTsgJHB2ej1hcnJheSgpOwogJG5ybT1mdW5jdGlvbigkdil7IHJldHVybiBwcmVnX3JlcGxhY2UoJy9bXjAtOV0vJywnJywgKHN0cmluZykkdik7IH07CgogZm9yZWFjaCgkcm93cyBhcyAkcil7CiAgICRzdFsndmlzbyddKys7CiAgICR6Yj0kbnJtKCRyWyd6YiddKTsgJGVhbj0kbnJtKCRyWydlYW4nXSk7ICRndWlkPSRucm0oJHJbJ2d1aWQnXSk7ICR2Zj0kbnJtKCRyWyd2ZiddKTsKICAgLyogVkFMSURBQ0lKQTogVkYgYXRrdXJpbWFzIHByaWVzIHppbm9tYSB0ZWlzaW5nYSAxMyAqLwogICBpZigkdmYhPT0nJyAmJiBzdHJsZW4oJHZmKT09PTEyKXsKICAgICAkZXRhbG9uYXM9Jyc7IGlmKCRvazEzKCR6YikpICRldGFsb25hcz0kemI7IGVsc2VpZigkb2sxMygkZWFuKSkgJGV0YWxvbmFzPSRlYW47IGVsc2VpZigkb2sxMygkZ3VpZCkpICRldGFsb25hcz0kZ3VpZDsKICAgICBpZigkZXRhbG9uYXMhPT0nJyl7CiAgICAgICAkdmFsWyd0aWtyaW50YSddKys7CiAgICAgICBpZigkdmYuJGNoazEzKCR2Zik9PT0kZXRhbG9uYXMpICR2YWxbJ3N1dGFwbyddKys7CiAgICAgICBlbHNlIHsgJHZhbFsnbmVzdXRhcG8nXSsrOyBpZihjb3VudCgkdmFsWyduZXN1dGFwaW11X3B2eiddKTwxMikgJHZhbFsnbmVzdXRhcGltdV9wdnonXVtdPWFycmF5KCdpZCc9PiRyWydJRCddLCd2Zic9PiR2ZiwnYXRrdXJ0YSc9PiR2Zi4kY2hrMTMoJHZmKSwnZXRhbG9uYXMnPT4kZXRhbG9uYXMpOyB9CiAgICAgfQogICB9CiAgIC8qIFNQUkVORElNQVMgKi8KICAgJG5hdWphcz0nJzsgJGtvZGVsPScnOwogICAkZ2VyaTEzPWFycmF5KCk7CiAgIGZvcmVhY2goYXJyYXkoJ3piJz0+JHpiLCdlYW4nPT4kZWFuLCdndWlkJz0+JGd1aWQpIGFzICRrPT4kdil7IGlmKCRvazEzKCR2KSkgJGdlcmkxM1skdl09JGs7IH0KICAgaWYoY291bnQoJGdlcmkxMyk+MCl7CiAgICAgJG5hdWphcz1hcnJheV9rZXlfZmlyc3QoJGdlcmkxMyk7ICRrb2RlbD0namF1X2dlcmFzJzsKICAgICBpZihjb3VudCgkZ2VyaTEzKT4xKXsgJHN0Wydrb25mbGlrdGFzJ10rKzsgJGtvZGVsPSdrb25mbGlrdGFzX3lyYV9nZXJhcyc7IH0KICAgICAkc3RbJ2phdV9nZXJhcyddKys7CiAgIH0gZWxzZWlmKCR2ZiE9PScnICYmIHN0cmxlbigkdmYpPT09MTIpewogICAgICRuYXVqYXM9JHZmLiRjaGsxMygkdmYpOyAka29kZWw9J3ZmX2F0a3VydGEnOyAkc3RbJ3ZmX2F0a3VydGEnXSsrOwogICB9IGVsc2UgewogICAgICRrMTI9Jyc7IGZvcmVhY2goYXJyYXkoJHpiLCRlYW4sJGd1aWQpIGFzICR2KXsgaWYoc3RybGVuKCR2KT09PTEyKXsgJGsxMj0kdjsgYnJlYWs7IH0gfQogICAgICRrOD0nJzsgZm9yZWFjaChhcnJheSgkemIsJGVhbiwkZ3VpZCkgYXMgJHYpeyBpZigkb2s4KCR2KSl7ICRrOD0kdjsgYnJlYWs7IH0gfQogICAgIGlmKCRrMTIhPT0nJyl7CiAgICAgICBpZigkb2sxMigkazEyKSl7ICRuYXVqYXM9JGsxMjsgJGtvZGVsPSd1cGMxMl9wYWxpZWthbSc7ICRzdFsndXBjMTJfcGFsaWVrYW0nXSsrOyB9CiAgICAgICBlbHNlIHsgJG5hdWphcz0kazEyLiRjaGsxMygkazEyKTsgJGtvZGVsPSdsZW4xMl9hdGt1cnRhJzsgJHN0WydsZW4xMl9hdGt1cnRhJ10rKzsgfQogICAgIH0gZWxzZWlmKCRrOCE9PScnKXsgJG5hdWphcz0kazg7ICRrb2RlbD0nZWFuOF9wYWxpZWthbSc7ICRzdFsnZWFuOF9wYWxpZWthbSddKys7IH0KICAgICBlbHNlaWYoJHpiPT09JycgJiYgJGVhbj09PScnICYmICRndWlkPT09JycgJiYgJHZmPT09JycpeyAka29kZWw9J25lcmFfc2FsdGluaW8nOyAkc3RbJ25lcmFfc2FsdGluaW8nXSsrOyB9CiAgICAgZWxzZSB7ICRrb2RlbD0nbmV0dmFya2luZ2FzJzsgJHN0WyduZXR2YXJraW5nYXMnXSsrOyB9CiAgIH0KICAgaWYoJG5hdWphcyE9PScnICYmICRuYXVqYXMhPT0kZ3VpZCl7ICRzdFsna2Vpc2lzJ10rKzsgJHNpdGVsW109YXJyYXkoJ2lkJz0+KGludCkkclsnSUQnXSwnc2t1Jz0+JHJbJ3NrdSddLCdzZW5hcyc9PiRndWlkLCduYXVqYXMnPT4kbmF1amFzLCdrb2RlbCc9PiRrb2RlbCk7CiAgICAgaWYoY291bnQoJHB2eik8MjUpICRwdnpbXT1hcnJheSgnaWQnPT4kclsnSUQnXSwncGF2Jz0+bWJfc3Vic3RyKCRyWydwb3N0X3RpdGxlJ10sMCw0MiksJ3NlbmFzJz0+JGd1aWQsJ25hdWphcyc9PiRuYXVqYXMsJ2tvZGVsJz0+JGtvZGVsKTsKICAgfSBlbHNlIHsgJHN0WyduZXNpa2VpY2lhJ10rKzsgfQogfQogLyogUE8gVEFJU1lNTzoga2llayB0dXJldHUgZ2FsaW9qYW50aSBHVElOICovCiAkcG89MDsgJG1hcD1hcnJheSgpOyBmb3JlYWNoKCRzaXRlbCBhcyAkeCkgJG1hcFskeFsnaWQnXV09JHhbJ25hdWphcyddOwogZm9yZWFjaCgkcm93cyBhcyAkcil7ICRnID0gaXNzZXQoJG1hcFsoaW50KSRyWydJRCddXSkgPyAkbWFwWyhpbnQpJHJbJ0lEJ11dIDogJG5ybSgkclsnZ3VpZCddKTsgaWYoJG9rMTMoJGcpfHwkb2sxMigkZyl8fCRvazgoJGcpKSAkcG8rKzsgfQogJHN0Wydwb190YWlzeW1vX2dhbGlvamEnXT0kcG87CgogJG9bJ3N0YXRpc3Rpa2EnXT0kc3Q7ICRvWyd2YWxpZGFjaWphJ109JHZhbDsgJG9bJ3Bhdnl6ZHppYWknXT0kcHZ6OwogJG9bJ3NhcmFzYXNfYjY0J109YmFzZTY0X2VuY29kZShnemVuY29kZSh3cF9qc29uX2VuY29kZSgkc2l0ZWwpLDYpKTsKICRvWydzYXJhc2FzX24nXT1jb3VudCgkc2l0ZWwpOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'G814'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} out.snip_status=cr.s; return j?j.id:null; }

/* ---- A. GOOGLE PRIEIGOS ZVALGYBA (tik skaitymas) ---- */
out.google={};
try{
  const raw=process.env.GTM_SA_JSON||'';
  out.google.sa_yra = raw ? 1 : 0;
  if(raw){
    const sa=JSON.parse(raw);
    out.google.client_email=sa.client_email; out.google.project=sa.project_id;
    const scopes='https://www.googleapis.com/auth/content';
    const now=Math.floor(Date.now()/1000);
    const hdr=Buffer.from(JSON.stringify({alg:'RS256',typ:'JWT'})).toString('base64url');
    const cl=Buffer.from(JSON.stringify({iss:sa.client_email,scope:scopes,aud:'https://oauth2.googleapis.com/token',exp:now+3600,iat:now})).toString('base64url');
    const sig=crypto.createSign('RSA-SHA256').update(hdr+'.'+cl).sign(sa.private_key).toString('base64url');
    const tr=await fetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},
      body:'grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion='+hdr+'.'+cl+'.'+sig});
    const tj=await tr.json();
    out.google.token_status=tr.status;
    if(tj.access_token){
      const AT=tj.access_token;
      const ai=await fetch('https://shoppingcontent.googleapis.com/content/v2.1/accounts/authinfo',{headers:{Authorization:'Bearer '+AT}});
      out.google.authinfo_status=ai.status;
      const ait=await ai.text(); out.google.authinfo=ait.slice(0,900);
      try{
        const aj=JSON.parse(ait);
        const ids=(aj.accountIdentifiers||[]);
        out.google.paskyros=ids;
        for(const it of ids.slice(0,3)){
          const mid=it.merchantId||it.aggregatorId;
          if(!mid) continue;
          const pr=await fetch(`https://shoppingcontent.googleapis.com/content/v2.1/${mid}/products?maxResults=1`,{headers:{Authorization:'Bearer '+AT}});
          const pt=await pr.text();
          out.google['prekes_'+mid]={status:pr.status, atsakas:pt.slice(0,400)};
          const ac=await fetch(`https://shoppingcontent.googleapis.com/content/v2.1/accounts/${mid}/${mid}`,{headers:{Authorization:'Bearer '+AT}});
          out.google['paskyra_'+mid]={status:ac.status, atsakas:(await ac.text()).slice(0,600)};
        }
      }catch(e){ out.google.parse=String(e).slice(0,150); }
    } else { out.google.token_klaida=JSON.stringify(tj).slice(0,400); }
  }
}catch(e){ out.google.klaida=String(e).slice(0,300); }

/* ---- B. GTIN DRY-RUN ---- */
try{
  const s=await snip('TEMP G814 GTIN dry-run',B64);
  await new Promise(r=>setTimeout(r,8000));
  const t=await (await fetch(WP+'/?ps_g814=G814')).text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,600); }
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('g814.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'g814 gtin dryrun + google probe');
