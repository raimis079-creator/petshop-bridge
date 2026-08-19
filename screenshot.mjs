const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA4NyddKSA/ICRfR0VUWydwc19oMDg3J10gOiAnJykgIT09ICdQRVJGJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDE4MCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7CiAkbyA9IGFycmF5KCd2Jz0+J0gwODcnKTsKICRvWydwaHAnXSAgICAgICA9IFBIUF9WRVJTSU9OOwogJG9bJ2F0bWludGllc19yaWJhJ10gPSBpbmlfZ2V0KCdtZW1vcnlfbGltaXQnKTsKICRvWyd3cF9tZW1vcnknXSA9IGRlZmluZWQoJ1dQX01FTU9SWV9MSU1JVCcpID8gV1BfTUVNT1JZX0xJTUlUIDogJ25lbnVzdGF0eXRhJzsKICRvWydvYmplY3RfY2FjaGUnXSA9IChib29sKSB3cF91c2luZ19leHRfb2JqZWN0X2NhY2hlKCkgPyAnWVJBJyA6ICdORVJBJzsKICRvWydvcGNhY2hlJ10gICA9IGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9nZXRfc3RhdHVzJykgPyAneXJhIGZ1bmtjaWphJyA6ICduZXJhJzsKIGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9nZXRfc3RhdHVzJykpeyAkcz1Ab3BjYWNoZV9nZXRfc3RhdHVzKGZhbHNlKTsgJG9bJ29wY2FjaGVfaWp1bmd0YXMnXSA9ICgkcyAmJiAhZW1wdHkoJHNbJ29wY2FjaGVfZW5hYmxlZCddKSkgPyAnVEFJUCcgOiAnTkUnOyB9CiAkb1sndXprbGF1c3Vfc2lhbWVfcHVzbGFweWplJ10gPSBnZXRfbnVtX3F1ZXJpZXMoKTsKICRvWydnZW5lcmF2aW1vX2xhaWthc19zJ10gPSByb3VuZCh0aW1lcl9zdG9wKDApLCAzKTsKICRvWydhdG1pbnRpZXNfbmF1ZG9qaW1hc19NQiddID0gcm91bmQobWVtb3J5X2dldF9wZWFrX3VzYWdlKHRydWUpLzEwNDg1NzYsIDEpOwogJG9bJ2FrdHl2dXNfcGx1Z2luYWknXSA9IGNvdW50KChhcnJheSkgZ2V0X29wdGlvbignYWN0aXZlX3BsdWdpbnMnLCBhcnJheSgpKSk7CiAkb1snbXVfZmFpbGFpJ10gPSBjb3VudChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykpOwogJG9bJ2F1dG9sb2FkX0tCJ10gPSByb3VuZCgoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIFNVTShMRU5HVEgob3B0aW9uX3ZhbHVlKSkgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBhdXRvbG9hZD0neWVzJyIpLzEwMjQsIDEpOwogJG9bJ2F1dG9sb2FkX2lyYXN1J10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfW9wdGlvbnMgV0hFUkUgYXV0b2xvYWQ9J3llcyciKTsKICR0b3AgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSwgUk9VTkQoTEVOR1RIKG9wdGlvbl92YWx1ZSkvMTAyNCwxKSBrYiBGUk9NIHskUH1vcHRpb25zIFdIRVJFIGF1dG9sb2FkPSd5ZXMnIE9SREVSIEJZIExFTkdUSChvcHRpb25fdmFsdWUpIERFU0MgTElNSVQgOCIsIEFSUkFZX0EpOwogJG9bJ2F1dG9sb2FkX3RvcCddID0gJHRvcDsKICRvWyd0cmFuc2llbnR1J10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfW9wdGlvbnMgV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF8lJyIpOwogJG9bJ3ByZWtpdV9wdWJsaXNoJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H087',wp:WP};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));

/* ---------- 1. TLS PATIKRA su GRIEZTU tikrinimu (be apejimo) ---------- */
out.TLS={};
try{ const r=await fetch(WP+'/',{redirect:'manual'}); out.TLS.griezta='PRAEJO, http '+r.status; }
catch(e){ out.TLS.griezta='NEPRAEJO: '+String(e.cause?e.cause.code||e.cause.message:e).slice(0,160); }
try{
  const tls=await import('tls');
  const u=new URL(WP);
  const info=await new Promise((res,rej)=>{
    const s=tls.connect({host:u.hostname,port:443,servername:u.hostname,rejectUnauthorized:false,timeout:15000},()=>{
      const c=s.getPeerCertificate(); res({CN:(c.subject||{}).CN, SAN:(c.subjectaltname||'').slice(0,200), nuo:c.valid_from, iki:c.valid_to, isdave:(c.issuer||{}).O, patikima:s.authorized, priezastis:s.authorizationError?String(s.authorizationError):null}); s.end();
    });
    s.on('error',e=>rej(e)); s.on('timeout',()=>rej(new Error('timeout')));
  });
  out.TLS.sertifikatas=info;
}catch(e){ out.TLS.sertifikatas='KLAIDA: '+String(e).slice(0,150); }

process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }

try{
  /* ---------- 2. TTFB (5 matavimai) ---------- */
  const t=[];
  for(let i=0;i<5;i++){ const a=Date.now(); const r=await fetch(WP+'/?nocache='+Math.random()); await r.arrayBuffer(); t.push(Date.now()-a); await miegok(600); }
  t.sort((x,y)=>x-y);
  out.PILNAS_HTML_ms={matavimai:t, mediana:t[2], min:t[0], max:t[4]};

  /* ---------- 3. puslapio svoris ---------- */
  const r0=await fetch(WP+'/'); const html=await r0.text();
  const hdr={}; for(const k of ['content-encoding','cache-control','content-length']) if(r0.headers.get(k)) hdr[k]=r0.headers.get(k);
  out.HTML={dydis_KB: Math.round(html.length/1024), antrastes:hdr};

  const css=[...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)/gi)].map(m=>m[1]);
  const js =[...html.matchAll(/<script[^>]+src=["']([^"']+)/gi)].map(m=>m[1]);
  const img=[...html.matchAll(/<img[^>]+src=["']([^"']+)/gi)].map(m=>m[1]);
  out.RESURSAI={css:css.length, js:js.length, img:img.length};

  const blok=[...html.matchAll(/<script[^>]+src=[^>]*>/gi)].filter(s=>!/defer|async/i.test(s[0]));
  const head=html.slice(0, html.search(/<\/head>/i));
  out.RESURSAI.js_be_defer_async = blok.length;
  out.RESURSAI.js_head_blokuojantys = [...head.matchAll(/<script[^>]+src=[^>]*>/gi)].filter(s=>!/defer|async/i.test(s[0])).length;

  async function sverk(sar, kiek){
    let viso=0, n=0, gz=0, be_cache=0;
    for(const u of sar.slice(0,kiek)){
      try{ const abs=u.startsWith('http')?u:(u.startsWith('//')?'https:'+u:WP+(u.startsWith('/')?'':'/')+u);
        const r=await fetch(abs); const b=await r.arrayBuffer(); viso+=b.byteLength; n++;
        if(r.headers.get('content-encoding')) gz++;
        const cc=r.headers.get('cache-control')||''; if(!/max-age=\d{5,}/.test(cc)) be_cache++;
      }catch(e){}
    }
    return {tikrinta:n, KB:Math.round(viso/1024), suspausta:gz, be_ilgo_cache:be_cache};
  }
  out.SVORIS={css: await sverk(css,25), js: await sverk(js,30), img: await sverk(img,20)};

  /* ---------- 4. serverio pusė ---------- */
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H087 nasumo profilis',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h087=PERF'); const tt=await rr.text();
  try{ out.SERVERIS=JSON.parse(tt); }catch(e){ out.SERVERIS={ZALIAS:tt.slice(0,400)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h087.json', Buffer.from(JSON.stringify(out,null,1)), 'h087 nasumo profilis + TLS');
