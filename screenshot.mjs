process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA4NSddKSA/ICRfR0VUWydwc19oMDg1J10gOiAnJykgIT09ICdTRUMnKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMTgwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICRvID0gYXJyYXkoJ3YnPT4nSDA4NScpOwoKIC8qIC0tLSBrb25zdGFudG9zIC0tLSAqLwogZm9yZWFjaChhcnJheSgnRElTQUxMT1dfRklMRV9FRElUJywnRElTQUxMT1dfRklMRV9NT0RTJywnRk9SQ0VfU1NMX0FETUlOJywnV1BfREVCVUcnLCdXUF9ERUJVR19ESVNQTEFZJywnV1BfREVCVUdfTE9HJywnQVVUT01BVElDX1VQREFURVJfRElTQUJMRUQnKSBhcyAkayl7CiAgICRvWydrb25zdGFudG9zJ11bJGtdID0gZGVmaW5lZCgkaykgPyAodmFyX2V4cG9ydChjb25zdGFudCgkayksIHRydWUpKSA6ICdORU5VU1RBVFlUQSc7CiB9CgogLyogLS0tIGFkbWluaXN0cmF0b3JpYWkgLS0tICovCiAkYWRtID0gZ2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdmaWVsZHMnPT5hcnJheSgnSUQnLCd1c2VyX2xvZ2luJywndXNlcl9lbWFpbCcpKSk7CiAkb1snYWRtaW51X2tpZWsnXSA9IGNvdW50KCRhZG0pOwogJG9bJ2FkbWluYWknXSA9IGFycmF5KCk7CiBmb3JlYWNoKCRhZG0gYXMgJHUpewogICAkb1snYWRtaW5haSddW10gPSBhcnJheSgKICAgICAnaWQnPT4kdS0+SUQsCiAgICAgJ2xvZ2luJz0+JHUtPnVzZXJfbG9naW4sCiAgICAgJ2xvZ2luX2x5Z3VzX2Rpc3BsYXknPT4gKGdldF90aGVfYXV0aG9yX21ldGEoJ2Rpc3BsYXlfbmFtZScsJHUtPklEKSA9PT0gJHUtPnVzZXJfbG9naW4pID8gJ1RBSVAgKGF0c2tsZWlkemlhKScgOiAnbmUnLAogICApOwogfQogJG9bJ3ZhcnRvdG9qdV92aXNvJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXVzZXJzIik7CiAkb1snYWRtaW5fdmFyZHVfYWRtaW4nXSA9IChpbnQpICR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9dXNlcnMgV0hFUkUgdXNlcl9sb2dpbiBJTiAoJ2FkbWluJywnYWRtaW5pc3RyYXRvcicsJ3Jvb3QnLCd0ZXN0JykiKTsKCiAvKiAtLS0gYXBwIHNsYXB0YXpvZHppYWkgLS0tICovCiAkYXAgPSAoaW50KSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXVzZXJtZXRhIFdIRVJFIG1ldGFfa2V5PSdfYXBwbGljYXRpb25fcGFzc3dvcmRzJyIpOwogJG9bJ3ZhcnRvdG9qdV9zdV9hcHBfc2xhcHRhem9kemlhaXMnXSA9ICRhcDsKCiAvKiAtLS0gc2F1Z3VtbyBwbHVnaW5haSAtLS0gKi8KICRhcDIgPSAoYXJyYXkpIGdldF9vcHRpb24oJ2FjdGl2ZV9wbHVnaW5zJywgYXJyYXkoKSk7CiAkc2F1Z2EgPSBhcnJheSgpOwogZm9yZWFjaCgkYXAyIGFzICRwKXsgaWYocHJlZ19tYXRjaCgnI3dvcmRmZW5jZXxpdGhlbWVzfHN1Y3VyaXxsaW1pdC1sb2dpbnxsb2dpbi1sb2NrZG93bnx0d28tZmFjdG9yfHdwcy1oaWRlfGFsbC1pbi1vbmUtd3Atc2VjdXJpdHl8c29saWQtc2VjdXJpdHkjaScsJHApKSAkc2F1Z2FbXT0kcDsgfQogJG9bJ3NhdWd1bW9fcGx1Z2luYWknXSA9IGVtcHR5KCRzYXVnYSkgPyAnTkUgVklFTk8nIDogJHNhdWdhOwoKIC8qIC0tLSBmYWlsdSB0ZWlzZXMgLS0tICovCiAkb1snd3BfY29uZmlnX3RlaXNlcyddID0gZmlsZV9leGlzdHMoQUJTUEFUSC4nd3AtY29uZmlnLnBocCcpID8gc3Vic3RyKHNwcmludGYoJyVvJywgZmlsZXBlcm1zKEFCU1BBVEguJ3dwLWNvbmZpZy5waHAnKSksIC00KSA6ICduZXJhJzsKICRvWydkZWJ1Z19sb2dfeXJhJ10gICAgPSBmaWxlX2V4aXN0cyhXUF9DT05URU5UX0RJUi4nL2RlYnVnLmxvZycpID8gZmlsZXNpemUoV1BfQ09OVEVOVF9ESVIuJy9kZWJ1Zy5sb2cnKSA6ICduZXJhJzsKCiAvKiAtLS0gc2NoZW1hIC8gU0VPIC0tLSAqLwogJG9bJ2Jsb2dfcHVibGljJ10gID0gZ2V0X29wdGlvbignYmxvZ19wdWJsaWMnKTsKICRvWydyYW5rbWF0aF9zY2hlbWEnXSA9IGdldF9vcHRpb24oJ3JhbmtfbWF0aF9tb2R1bGVzJykgPyBpbXBsb2RlKCcsJywgKGFycmF5KSBnZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpKSA6ICduZXJhJzsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H085',wp:WP};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
async function tikr(p,opt={}){ try{ const r=await fetch(WP+p,{redirect:'manual',...opt}); const h={}; for(const k of ['x-frame-options','strict-transport-security','x-content-type-options','content-security-policy','referrer-policy','server','x-powered-by','location']) if(r.headers.get(k)) h[k]=r.headers.get(k).slice(0,90); const t=await r.text(); return {http:r.status, ilgis:t.length, antrastes:h, pradzia:t.slice(0,110).replace(/\s+/g,' ')}; }catch(e){ return {klaida:String(e).slice(0,90)}; } }
try{
  /* ---------- 1. SAUGA is isores ---------- */
  out.SAUGA_ISORE = {};
  out.SAUGA_ISORE.xmlrpc        = await tikr('/xmlrpc.php',{method:'POST',body:'<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName></methodCall>'});
  out.SAUGA_ISORE.author_1      = await tikr('/?author=1');
  out.SAUGA_ISORE.rest_users    = await tikr('/wp-json/wp/v2/users');
  out.SAUGA_ISORE.uploads_listing = await tikr('/wp-content/uploads/');
  out.SAUGA_ISORE.debug_log     = await tikr('/wp-content/debug.log');
  out.SAUGA_ISORE.readme        = await tikr('/readme.html');
  out.SAUGA_ISORE.wp_config_bak = await tikr('/wp-config.php.bak');
  out.SAUGA_ISORE.env           = await tikr('/.env');
  out.SAUGA_ISORE.wp_login      = await tikr('/wp-login.php');
  out.SAUGA_ISORE.frontas       = await tikr('/');

  /* ---------- 2. robots.txt ---------- */
  const rb = await fetch(WP+'/robots.txt'); const rbt = await rb.text();
  out.ROBOTS = {http:rb.status, turinys: rbt.slice(0,700)};

  /* ---------- 3. schema.org vitrinoje ---------- */
  const hp = await (await fetch(WP+'/')).text();
  const ld = [...hp.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]);
  out.SCHEMA = {blokai: ld.length, tipai: []};
  for(const b of ld){ try{ const j=JSON.parse(b); const g=j['@graph']||[j]; for(const x of g) if(x['@type']) out.SCHEMA.tipai.push(Array.isArray(x['@type'])?x['@type'].join('/'):x['@type']); }catch(e){ out.SCHEMA.tipai.push('NEPARSINTA'); } }
  out.SCHEMA.generator = (hp.match(/<meta name="generator"[^>]*>/i)||['nera'])[0].slice(0,120);
  out.SCHEMA.canonical = (hp.match(/<link rel="canonical"[^>]*>/i)||['nera'])[0].slice(0,140);
  out.SCHEMA.robots_meta = (hp.match(/<meta name="robots"[^>]*>/i)||['nera'])[0].slice(0,120);

  /* prekes puslapis — Product schema */
  const pr = await (await fetch(WP+'/?post_type=product&orderby=rand')).text().catch(()=>'');
  out.SCHEMA.produktas_Product = /"@type"\s*:\s*"Product"/.test(pr) ? 'yra' : 'nerasta (arba puslapis ne prekes)';

  /* ---------- 4. PageSpeed Insights ---------- */
  for(const st of ['mobile','desktop']){
    try{
      const u='https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url='+encodeURIComponent(WP+'/')+'&strategy='+st+'&category=performance';
      const r=await fetch(u); const j=await r.json();
      if(j.error){ out['PSI_'+st]={klaida:String(j.error.message).slice(0,200), http:r.status}; }
      else{
        const L=j.lighthouseResult||{}; const a=L.audits||{};
        out['PSI_'+st]={
          skoras: Math.round(((L.categories||{}).performance||{}).score*100),
          LCP:  (a['largest-contentful-paint']||{}).displayValue,
          FCP:  (a['first-contentful-paint']||{}).displayValue,
          TBT:  (a['total-blocking-time']||{}).displayValue,
          CLS:  (a['cumulative-layout-shift']||{}).displayValue,
          SI:   (a['speed-index']||{}).displayValue,
          TTFB: (a['server-response-time']||{}).displayValue
        };
      }
    }catch(e){ out['PSI_'+st]={klaida:String(e).slice(0,180)}; }
  }

  /* ---------- 5. serverio pusė ---------- */
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H085 saugos patikra',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j2=null; try{j2=JSON.parse(cr.t);}catch(e){}
  out.snip=j2?j2.id:('KLAIDA '+cr.s);
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h085=SEC'); const tt=await rr.text();
  try{ out.SERVERIS=JSON.parse(tt); }catch(e){ out.SERVERIS={ZALIAS:tt.slice(0,400)}; }
  if(j2&&j2.id) await api('/wp-json/code-snippets/v1/snippets/'+j2.id,{method:'POST',body:JSON.stringify({id:j2.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h085.json', Buffer.from(JSON.stringify(out,null,1)), 'h085 sauga greitis robots schema');
