process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA2NiddKT8kX0dFVFsncHNfaDA2NiddOicnKSE9PSdIMDY2JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNjYnKTsKCiAvKiAxLiBTRVJJTU8gU0tBSUNJVU9LTEUg4oCUIHBsYWNpYXUgbmVpIHNsdWcgKi8KICRvWydza2FpY2l1b2tsZSddPWFycmF5KCk7CiAkb1snc2thaWNpdW9rbGUnXVsncGFnYWxfcGF2YWRpbmltYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfdHlwZSxwb3N0X25hbWUscG9zdF90aXRsZSxwb3N0X3N0YXR1cwogICBGUk9NIHskUH1wb3N0cyBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgQU5EIChwb3N0X3RpdGxlIExJS0UgJyVrYWnEjWl1b2tsJScgT1IgcG9zdF90aXRsZSBMSUtFICcla2FpY2l1b2tsJScgT1IgcG9zdF9uYW1lIExJS0UgJyVza2FpY2l1b2tsJScpIiwgQVJSQVlfQSk7CiAkb1snc2thaWNpdW9rbGUnXVsncGFnYWxfc2hvcnRjb2RlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90eXBlLHBvc3RfbmFtZSxMRUZUKHBvc3RfdGl0bGUsNDApIHQKICAgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3R5cGUgSU4gKCdwYWdlJywncG9zdCcsJ2Jsb2NrcycpCiAgIEFORCAocG9zdF9jb250ZW50IExJS0UgJyVbcHNfJScgT1IgcG9zdF9jb250ZW50IExJS0UgJyVzZXJpbSUnIE9SIHBvc3RfY29udGVudCBMSUtFICclZmVlZGluZyUnKSIsIEFSUkFZX0EpOwogJG9bJ3NrYWljaXVva2xlJ11bJ2xlbnRlbGVfcHNfZmVlZGluZ19tYXAnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTSE9XIFRBQkxFUyBMSUtFICd7JFB9cHNfZmVlZGluZ19tYXAnIik/MToKICAgKChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGluZm9ybWF0aW9uX3NjaGVtYS50YWJsZXMgV0hFUkUgdGFibGVfbmFtZSBMSUtFICclZmVlZGluZyUnIikpOwoKIC8qIDIuIFBSQURJTklTIFBVU0xBUElTICovCiAkcGY9KGludClnZXRfb3B0aW9uKCdwYWdlX29uX2Zyb250Jyk7CiAkb1sncHJhZGluaXMnXT1hcnJheSgnaWQnPT4kcGYsJ3BhdmFkaW5pbWFzJz0+JHBmP2dldF90aGVfdGl0bGUoJHBmKTpudWxsLAogICAncm1fdGl0bGUnPT4kcGY/Z2V0X3Bvc3RfbWV0YSgkcGYsJ3JhbmtfbWF0aF90aXRsZScsdHJ1ZSk6bnVsbCwKICAgJ3JtX2Rlc2MnPT4kcGY/Z2V0X3Bvc3RfbWV0YSgkcGYsJ3JhbmtfbWF0aF9kZXNjcmlwdGlvbicsdHJ1ZSk6bnVsbCk7CiAkdD0oYXJyYXkpZ2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtdGl0bGVzJyk7CiAkb1sncHJhZGluaXMnXVsnaG9tZXBhZ2VfdGl0bGVfc2FibG9uYXMnXT1pc3NldCgkdFsnaG9tZXBhZ2VfdGl0bGUnXSk/JHRbJ2hvbWVwYWdlX3RpdGxlJ106bnVsbDsKICRvWydvZ19pbWFnZSddPWlzc2V0KCR0WydvcGVuX2dyYXBoX2ltYWdlJ10pPyR0WydvcGVuX2dyYXBoX2ltYWdlJ106bnVsbDsKICRvWydvZ19pbWFnZV9pZCddPWlzc2V0KCR0WydvcGVuX2dyYXBoX2ltYWdlX2lkJ10pPyR0WydvcGVuX2dyYXBoX2ltYWdlX2lkJ106bnVsbDsKCiAvKiAzLiBJTkRFS1NBVklNQVMgKi8KICRvWydibG9nX3B1YmxpYyddPWdldF9vcHRpb24oJ2Jsb2dfcHVibGljJyk7CgogLyogNC4gNiBTTFVHIEtPTkZMSUtUQUkg4oCUIGFyIHRpdGxlIHZpcyBkYXIgdmllbm9kaSAqLwogJG9bJ3NsdWdfa29uZmxpa3RhaSddPWFycmF5KCk7CiBmb3JlYWNoKGFycmF5KCdzcHJlbmRpbWFpJywncGFzaXVseW1haScsJ25hdWphcy1zdW5pdWthcycsJ25hdWphcy1rYWNpdWthcycsJ2phdXRydXMtdmlyc2tpbmltYXMnLCdkYXVnaWF1LXBpZ2lhdScpIGFzICRzKXsKICAgJHA9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCxwb3N0X3RpdGxlIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfbmFtZT0lcyBBTkQgcG9zdF90eXBlPSdwYWdlJyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIExJTUlUIDEiLCRzKSxBUlJBWV9BKTsKICAgJHR0PWdldF90ZXJtX2J5KCdzbHVnJywkcywncHJvZHVjdF9jYXQnKTsKICAgJG9bJ3NsdWdfa29uZmxpa3RhaSddWyRzXT1hcnJheSgKICAgICAncHNsX3JtX3RpdGxlJz0+JHA/Z2V0X3Bvc3RfbWV0YSgkcFsnSUQnXSwncmFua19tYXRoX3RpdGxlJyx0cnVlKTpudWxsLAogICAgICdwc2xfcGF2Jz0+JHA/JHBbJ3Bvc3RfdGl0bGUnXTpudWxsLAogICAgICdrYXRfcm1fdGl0bGUnPT4kdHQ/Z2V0X3Rlcm1fbWV0YSgkdHQtPnRlcm1faWQsJ3JhbmtfbWF0aF90aXRsZScsdHJ1ZSk6bnVsbCwKICAgICAna2F0X3Bhdic9PiR0dD8kdHQtPm5hbWU6bnVsbCk7CiB9CgogLyogNS4gS0FURUdPUklKVSBJUiBQUkVLSVUgU0VPIEJVS0xFICovCiAkb1sna2F0ZWdvcmlqdV9zdV9hcHJhc3ltdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH10ZXJtX3RheG9ub215CiAgIFdIRVJFIHRheG9ub215PSdwcm9kdWN0X2NhdCcgQU5EIFRSSU0oQ09BTEVTQ0UoZGVzY3JpcHRpb24sJycpKTw+JyciKTsKICRvWydrYXRlZ29yaWp1X3N1X21ldGEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9dGVybW1ldGEKICAgV0hFUkUgbWV0YV9rZXk9J3JhbmtfbWF0aF9kZXNjcmlwdGlvbicgQU5EIG1ldGFfdmFsdWU8PicnIik7CiAkb1sncHJla2l1X3B1Ymxpc2gnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAkb1sncHJla2l1X3N1X3JtX2Rlc2MnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdG1ldGEgbSBKT0lOIHskUH1wb3N0cyBwIE9OIHAuSUQ9bS5wb3N0X2lkCiAgIFdIRVJFIG0ubWV0YV9rZXk9J3JhbmtfbWF0aF9kZXNjcmlwdGlvbicgQU5EIG0ubWV0YV92YWx1ZTw+JycgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKCiAvKiA2LiAzMDEgemVtZWxhcGlzICovCiAkej1qc29uX2RlY29kZShAZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJyksdHJ1ZSk7CiAkb1snemVtZWxhcHlqZSddPWlzX2FycmF5KCR6KT9jb3VudCgkeik6MDsKCiAvKiA3LiBzZW5vcyBudW9yb2RvcyBsaWt1c2lvcyAqLwogJG9bJ2xpa3VzaW9zX3Nlbm9zX251b3JvZG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF90eXBlLENPVU5UKCopIG4gRlJPTSB7JFB9cG9zdHMKICAgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X2NvbnRlbnQgTElLRSAnJS8vcGV0c2hvcC5sdC8lJyBHUk9VUCBCWSBwb3N0X3R5cGUiLCBBUlJBWV9BKTsKCiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H066'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H066 seo busena',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h066=H066'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  /* sitemap + pradinis gyvai */
  out.gyvai={};
  for(const u of ['/sitemap_index.xml','/']){
    const x=await fetch('https://dev.avesa.lt'+u); const h=await x.text();
    out.gyvai[u]={http:x.status, title:(h.match(/<title>([\s\S]*?)<\/title>/i)||['',''])[1].slice(0,70),
      og:(h.match(/og:image/g)||[]).length};
  }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h066.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h066 seo busena');
