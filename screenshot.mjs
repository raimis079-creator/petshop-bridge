process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDAxNSddKT8kX0dFVFsncHNfaDAxNSddOicnKSE9PSdBUFBMWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg5MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDE1Jyk7CgogJGdlbj0oYXJyYXkpZ2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtZ2VuZXJhbCcpOwogJHRpdD0oYXJyYXkpZ2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtdGl0bGVzJyk7CiAkc2l0PShhcnJheSlnZXRfb3B0aW9uKCdyYW5rLW1hdGgtb3B0aW9ucy1zaXRlbWFwJyk7CiAkbW9kPShhcnJheSlnZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpOwoKIC8qIDAuIEtPUElKQSAqLwogJHVwPXdwX3VwbG9hZF9kaXIoKTsgJGRpcj0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOwogaWYoIWlzX2RpcigkZGlyKSkgQG1rZGlyKCRkaXIsMDc1NSx0cnVlKTsKICRmPSRkaXIuJy9yYW5rbWF0aF9jb25maWdfcHJpZXNfJy5kYXRlKCdZbWRfSGlzJykuJy5qc29uJzsKIEBmaWxlX3B1dF9jb250ZW50cygkZiwgd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2dlbmVyYWwnPT4kZ2VuLCd0aXRsZXMnPT4kdGl0LCdzaXRlbWFwJz0+JHNpdCwnbW9kdWxlcyc9PiRtb2QsCiAgICdpc19jb25maWd1cmVkJz0+Z2V0X29wdGlvbigncmFua19tYXRoX2lzX2NvbmZpZ3VyZWQnKSwncmVnaXN0cmF0aW9uX3NraXAnPT5nZXRfb3B0aW9uKCdyYW5rX21hdGhfcmVnaXN0cmF0aW9uX3NraXAnKSkpKTsKICRvWydrb3BpamEnXT1AZmlsZV9leGlzdHMoJGYpP2Jhc2VuYW1lKCRmKTonTkVQQVZZS08nOwoKIC8qIDEuIFZBUlRBSSDigJQgdGlrc2xpYWkgdGllIHJha3RhaSwga3VyaXVvcyByYXNvIHBhdHMgdmVkbHlzICovCiB1cGRhdGVfb3B0aW9uKCdyYW5rX21hdGhfcmVnaXN0cmF0aW9uX3NraXAnLCB0cnVlLCBmYWxzZSk7CiB1cGRhdGVfb3B0aW9uKCdyYW5rX21hdGhfaXNfY29uZmlndXJlZCcsIHRydWUsIGZhbHNlKTsKICRvWyd2YXJ0YWknXT1hcnJheSgncmVnaXN0cmF0aW9uX3NraXAnPT5nZXRfb3B0aW9uKCdyYW5rX21hdGhfcmVnaXN0cmF0aW9uX3NraXAnKSwKICAgICAgICAgICAgICAgICAgICAnaXNfY29uZmlndXJlZCc9PmdldF9vcHRpb24oJ3JhbmtfbWF0aF9pc19jb25maWd1cmVkJykpOwoKIC8qIDIuIE1PRFVMSUFJIOKAlCBzYWxpbmFtIG5lcmVpa2FsaW5ndXMsIElEIG5la3VyaWFtIHBhdHlzICovCiAkc2FsaW50aT1hcnJheSgnbGluay1jb3VudGVyJywnYW5hbHl0aWNzJywnc2VvLWFuYWx5c2lzJywnYnVkZHlwcmVzcycsJ2JicHJlc3MnLCdhY2YnLAogICAgICAgICAgICAgICAgJ3dlYi1zdG9yaWVzJywnY29udGVudC1haScsJ2luc3RhbnQtaW5kZXhpbmcnLCdhaS12aXNpYmlsaXR5Jyk7CiAkbmF1amFzPWFycmF5X3ZhbHVlcyhhcnJheV9kaWZmKCRtb2QsJHNhbGludGkpKTsKIHVwZGF0ZV9vcHRpb24oJ3JhbmtfbWF0aF9tb2R1bGVzJywkbmF1amFzKTsKICRvWydtb2R1bGlhaSddPWFycmF5KCdidXZvJz0+JG1vZCwnbGlrbyc9PiRuYXVqYXMpOwoKIC8qIDMuIFRJVExFUyAqLwogJHRwPWFycmF5KAogICAvKiBrYXRlZ29yaWpvcyBpciBicmVuZGFpIOKAlCBsYXVrZWxpcyBhZG1pbmlzdHJhY2lqb2plICovCiAgICd0YXhfcHJvZHVjdF9jYXRfYWRkX21ldGFfYm94Jz0+J29uJywKICAgJ3RheF9wcm9kdWN0X2JyYW5kX2FkZF9tZXRhX2JveCc9PidvbicsCiAgIC8qIHZpZGluaWFpIENQVCBpcyBHb29nbGUgbGF1ayAqLwogICAncHRfYmxvY2tzX3JvYm90cyc9Pidub2luZGV4JywgICAgICAgICAgICAncHRfYmxvY2tzX2N1c3RvbV9yb2JvdHMnPT4nb24nLAogICAncHRfZmVhdHVyZWRfaXRlbV9yb2JvdHMnPT4nbm9pbmRleCcsICAgICAncHRfZmVhdHVyZWRfaXRlbV9jdXN0b21fcm9ib3RzJz0+J29uJywKICAgJ3RheF9mZWF0dXJlZF9pdGVtX2NhdGVnb3J5X3JvYm90cyc9Pidub2luZGV4JywndGF4X2ZlYXR1cmVkX2l0ZW1fY2F0ZWdvcnlfY3VzdG9tX3JvYm90cyc9PidvbicsCiAgICd0YXhfZmVhdHVyZWRfaXRlbV90YWdfcm9ib3RzJz0+J25vaW5kZXgnLCd0YXhfZmVhdHVyZWRfaXRlbV90YWdfY3VzdG9tX3JvYm90cyc9PidvbicsCiAgIC8qIGF0cmlidXR1IGFyY2h5dmFzIOKAlCBwbG9uYXMgdHVyaW55cyAqLwogICAndGF4X3BhX3ZlaXNsZXNfZHlkaXNfcm9ib3RzJz0+J25vaW5kZXgnLCAndGF4X3BhX3ZlaXNsZXNfZHlkaXNfY3VzdG9tX3JvYm90cyc9PidvbicsCiApOwogJG9bJ3RpdGxlc19wYWtlaXN0YSddPWFycmF5KCk7CiBmb3JlYWNoKCR0cCBhcyAkaz0+JHYpewogICAkc2VuYT1pc3NldCgkdGl0WyRrXSk/JHRpdFska106bnVsbDsKICAgaWYoaXNfYXJyYXkoJHNlbmEpKSAkc2VuYT1pbXBsb2RlKCcsJywkc2VuYSk7CiAgIC8qIHJvYm90cyBsYXVrYXMgUk0gc2F1Z28ga2FpcCBtYXN5dmEgKi8KICAgaWYoc3Vic3RyKCRrLC03KT09PSdfcm9ib3RzJyl7ICR0aXRbJGtdPWFycmF5KCR2KTsgfQogICBlbHNlIHsgJHRpdFska109JHY7IH0KICAgJG9bJ3RpdGxlc19wYWtlaXN0YSddWyRrXT1hcnJheSgnYnV2byc9PiRzZW5hLCd0YXBvJz0+JHYpOwogfQogdXBkYXRlX29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtdGl0bGVzJywkdGl0KTsKCiAvKiA0LiBTSVRFTUFQICovCiAkc3A9YXJyYXkoCiAgICd0YXhfcHJvZHVjdF9jYXRfc2l0ZW1hcCc9PidvbicsCiAgICd0YXhfcHJvZHVjdF9icmFuZF9zaXRlbWFwJz0+J29uJywKICAgJ3B0X2Jsb2Nrc19zaXRlbWFwJz0+J29mZicsCiAgICdwdF9mZWF0dXJlZF9pdGVtX3NpdGVtYXAnPT4nb2ZmJywKICAgJ2F1dGhvcnNfc2l0ZW1hcCc9PidvZmYnLAogICAnaHRtbF9zaXRlbWFwJz0+J29mZicsCiAgICdwdF9hdHRhY2htZW50X3NpdGVtYXAnPT4nb2ZmJywKICk7CiAkb1snc2l0ZW1hcF9wYWtlaXN0YSddPWFycmF5KCk7CiBmb3JlYWNoKCRzcCBhcyAkaz0+JHYpewogICAkb1snc2l0ZW1hcF9wYWtlaXN0YSddWyRrXT1hcnJheSgnYnV2byc9Pmlzc2V0KCRzaXRbJGtdKT8kc2l0WyRrXTpudWxsLCd0YXBvJz0+JHYpOwogICAkc2l0WyRrXT0kdjsKIH0KIHVwZGF0ZV9vcHRpb24oJ3JhbmstbWF0aC1vcHRpb25zLXNpdGVtYXAnLCRzaXQpOwoKIC8qIDUuIEdFTkVSQUwg4oCUIFVSTCBzdHJ1a3R1cmEgTkVMSUVDSUFNQSwgdXpmaWtzdW9qYW0gcGVyIHByaWV2YXJ0YSAqLwogJHVnPWFycmF5KCdzdHJpcF9jYXRlZ29yeV9iYXNlJz0+J29mZicsJ3djX3JlbW92ZV9wcm9kdWN0X2Jhc2UnPT4nb2ZmJywKICAgICAgICAgICAnd2NfcmVtb3ZlX2NhdGVnb3J5X2Jhc2UnPT4nb2ZmJywnd2NfcmVtb3ZlX2NhdGVnb3J5X3BhcmVudF9zbHVncyc9PidvZmYnLAogICAgICAgICAgICdyZW1vdmVfc2hvcF9zbmlwcGV0X2RhdGEnPT4nb24nLCdicmVhZGNydW1icyc9PidvZmYnKTsKICRvWydnZW5lcmFsX3V6cmFraW50YSddPWFycmF5KCk7CiBmb3JlYWNoKCR1ZyBhcyAkaz0+JHYpewogICAkb1snZ2VuZXJhbF91enJha2ludGEnXVska109YXJyYXkoJ2J1dm8nPT5pc3NldCgkZ2VuWyRrXSk/JGdlblska106bnVsbCwndGFwbyc9PiR2KTsKICAgJGdlblska109JHY7CiB9CiB1cGRhdGVfb3B0aW9uKCdyYW5rLW1hdGgtb3B0aW9ucy1nZW5lcmFsJywkZ2VuKTsKCiAvKiA2LiBzaXRlbWFwIHRhaXN5a2xlcyAqLwogdXBkYXRlX29wdGlvbigncmFua19tYXRoX2ZsdXNoX3Jld3JpdGUnLDEpOwogZmx1c2hfcmV3cml0ZV9ydWxlcyhmYWxzZSk7CgogLyogNy4gcGF0aWtyYSBpcyBrYXJ0byAqLwogJG9bJ3BhdGlrcmEnXT1hcnJheSgKICAgJ2lzX2NvbmZpZ3VyZWQnPT5jbGFzc19leGlzdHMoJ1JhbmtNYXRoXFxIZWxwZXInKT8oUmFua01hdGhcSGVscGVyOjppc19jb25maWd1cmVkKCk/MTowKTpudWxsLAogICAnYmxvZ19wdWJsaWMnPT5nZXRfb3B0aW9uKCdibG9nX3B1YmxpYycpLAogICAnbW9kdWxpYWlfZGFiYXInPT5nZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpLAogKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H015'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
function galva(h){
  const g=(re)=>{const m=h.match(re);return m?m[1]:''};
  return {
    title:g(/<title>([\s\S]*?)<\/title>/i).slice(0,150),
    description:g(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i).slice(0,220),
    og_title:g(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i).slice(0,120),
    og_image:g(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i)?1:0,
    robots:g(/<meta[^>]+name=["']robots["'][^>]+content=["']([^"']*)["']/i),
    canonical:g(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    ldjson:(h.match(/application\/ld\+json/gi)||[]).length,
    rm_zyme:/Rank Math/i.test(h)?1:0
  };
}
const URLS={
  namai:'https://dev.avesa.lt/',
  su_meta:'https://dev.avesa.lt/product/ambrosia-junior-begrudis-su-sviezia-vistiena-ir-lasisa-sausas-maistas-dideliu-veisliu-jauniems-suniukams-fresh-chicken-salmon-12-kg/',
  kategorija:'https://dev.avesa.lt/product-category/sausas-maistas-sunims/'
};
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H015 RM konfiguracija',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h015=APPLY'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.http=r.status; out.zalias=t.slice(0,800); }
  await new Promise(r=>setTimeout(r,4000));
  out.galvos={};
  for(const [k,u] of Object.entries(URLS)){
    try{ const x=await fetch(u); const h=await x.text(); out.galvos[k]={http:x.status,...galva(h)}; }
    catch(e){ out.galvos[k]={klaida:String(e).slice(0,120)}; }
  }
  out.sitemapai={};
  for(const u of ['/sitemap_index.xml','/wp-sitemap.xml','/product-sitemap.xml','/product_cat-sitemap.xml']){
    try{ const x=await fetch(WP+u); const b=(await x.text()).slice(0,300); out.sitemapai[u]={http:x.status,pr:b.replace(/\s+/g,' ').slice(0,180)}; }
    catch(e){ out.sitemapai[u]={klaida:String(e).slice(0,80)}; }
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h015.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h015 rm konfiguracija');
