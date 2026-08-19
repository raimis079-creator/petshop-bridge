process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA4NiddKSA/ICRfR0VUWydwc19oMDg2J10gOiAnJykgIT09ICdGSVgnKSByZXR1cm47CiBAc2V0X3RpbWVfbGltaXQoMjQwKTsKIGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsKICRvID0gYXJyYXkoJ3YnPT4nSDA4NicpOwogJHVwID0gd3BfdXBsb2FkX2RpcigpOwogJGJrID0gdHJhaWxpbmdzbGFzaGl0KCR1cFsnYmFzZWRpciddKS4ncHMtYmFja3Vwcyc7CiBpZighaXNfZGlyKCRiaykpIEBta2RpcigkYmssIDA3NTUsIHRydWUpOwoKIC8qIC0tLS0tLS0tLS0gMS4gd3AtY29uZmlnLnBocCAtLS0tLS0tLS0tICovCiAkd2MgPSBBQlNQQVRILid3cC1jb25maWcucGhwJzsKICR0ICA9IEBmaWxlX2dldF9jb250ZW50cygkd2MpOwogaWYoJHQgPT09IGZhbHNlKXsgJG9bJ3dwX2NvbmZpZyddID0gJ05FUEFWWUtPIFBFUlNLQUlUWVRJJzsgfQogZWxzZSB7CiAgICRvWyd3cF9jb25maWdfZHlkaXNfcHJpZXMnXSA9IHN0cmxlbigkdCk7CiAgICRrb3AgPSAkYmsuJy93cC1jb25maWcucGhwLmJha19oMDg2JzsKICAgQGZpbGVfcHV0X2NvbnRlbnRzKCRrb3AsICR0KTsKICAgJG9bJ2tvcGlqYSddID0gZmlsZV9leGlzdHMoJGtvcCkgPyBmaWxlc2l6ZSgka29wKSA6ICdORVBBVllLTyc7CgogICAkcmVpa2lhID0gYXJyYXkoKTsKICAgaWYoc3RycG9zKCR0LCdESVNBTExPV19GSUxFX0VESVQnKSA9PT0gZmFsc2UpICRyZWlraWFbXSA9ICJkZWZpbmUoJ0RJU0FMTE9XX0ZJTEVfRURJVCcsIHRydWUpOyI7CiAgIGlmKHN0cnBvcygkdCwnV1BfREVCVUdfRElTUExBWScpICAgPT09IGZhbHNlKSAkcmVpa2lhW10gPSAiZGVmaW5lKCdXUF9ERUJVR19ESVNQTEFZJywgZmFsc2UpOyI7CiAgICRvWydrb190cnVrbyddID0gZW1wdHkoJHJlaWtpYSkgPyAnbmlla28g4oCUIGphdSBidXZvJyA6ICRyZWlraWE7CgogICBpZighZW1wdHkoJHJlaWtpYSkgJiYgZmlsZV9leGlzdHMoJGtvcCkpewogICAgICRibG9rYXMgPSAiXG4vKiBQZXRzaG9wIHNhdWdhIChIMDg2LCAyMDI2LTA4LTE5KSAqL1xuIi5pbXBsb2RlKCJcbiIsICRyZWlraWEpLiJcbiI7CiAgICAgJGl2ZXN0ID0gZmFsc2U7ICRuYXVqYXMgPSAkdDsKICAgICBmb3JlYWNoKGFycmF5KCIvKiBUaGF0J3MgYWxsLCBzdG9wIGVkaXRpbmciLCAiLyoqIFRoYXQncyBhbGwsIHN0b3AgZWRpdGluZyIsICJyZXF1aXJlX29uY2UgQUJTUEFUSCAuICd3cC1zZXR0aW5ncy5waHAnIiwgInJlcXVpcmVfb25jZSggQUJTUEFUSCAuICd3cC1zZXR0aW5ncy5waHAnIikgYXMgJHp5bWUpewogICAgICAgJHBveiA9IHN0cnBvcygkdCwgJHp5bWUpOwogICAgICAgaWYoJHBveiAhPT0gZmFsc2UpeyAkbmF1amFzID0gc3Vic3RyKCR0LDAsJHBveikuJGJsb2thcy4iXG4iLnN1YnN0cigkdCwkcG96KTsgJGl2ZXN0ID0gdHJ1ZTsgJG9bJ3p5bWUnXSA9ICR6eW1lOyBicmVhazsgfQogICAgIH0KICAgICAkb1sndmlldGFfcmFzdGEnXSA9ICRpdmVzdDsKICAgICBpZigkaXZlc3QpewogICAgICAgJG9rID0gdHJ1ZTsgJGtsPScnOwogICAgICAgdHJ5IHsgdG9rZW5fZ2V0X2FsbCgkbmF1amFzLCBUT0tFTl9QQVJTRSk7IH0gY2F0Y2ggKFBhcnNlRXJyb3IgJGUpIHsgJG9rPWZhbHNlOyAka2w9JGUtPmdldE1lc3NhZ2UoKTsgfQogICAgICAgJG9bJ3NpbnRha3NlJ10gPSAkb2sgPyAnT0snIDogKCdLTEFJREE6ICcuJGtsKTsKICAgICAgIGlmKCRvayl7CiAgICAgICAgIEBmaWxlX3B1dF9jb250ZW50cygkd2MsICRuYXVqYXMpOwogICAgICAgICAkb1snd3BfY29uZmlnX2R5ZGlzX3BvJ10gPSBmaWxlc2l6ZSgkd2MpOwogICAgICAgICAkciA9IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSwgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOwogICAgICAgICAkb1snbG9vcGJhY2tfcG9fY29uZmlnJ10gPSBpc193cF9lcnJvcigkcikgPyAoJ1dQX0VSUk9SOiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpKSA6IChpbnQpIHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKTsKICAgICAgICAgaWYoJG9bJ2xvb3BiYWNrX3BvX2NvbmZpZyddICE9PSAyMDApewogICAgICAgICAgIEBmaWxlX3B1dF9jb250ZW50cygkd2MsICR0KTsKICAgICAgICAgICAkb1snQVRTQVVLVEFfQ09ORklHJ10gPSAnZ3JhemludGEgaXMga29waWpvcyc7CiAgICAgICAgIH0KICAgICAgIH0KICAgICB9CiAgIH0KIH0KCiAvKiAtLS0tLS0tLS0tIDIuIGhpZ2llbm9zIG11LXBsdWdpbiAtLS0tLS0tLS0tICovCiAkbXUgPSBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWhpZ2llbmEucGhwJzsKICRrb2QgPSBiYXNlNjRfZGVjb2RlKCdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lFaHBaMmxsYm1FS0lDb2dSR1Z6WTNKcGNIUnBiMjQ2SUU1bGNtOWtieUJYYjNKa1VISmxjM01nZG1WeWMybHFiM01nYVhJZ2JtVnlaV2xyWVd4cGJtZkZzeUJoYm5SeVljV2h4STFweGJNdUlGWmxjbk5wYW05eklHRjBjMnRzWldsa2FXMWhjeUJzWldsa3hiNXBZU0JweGFFZ2EyRnlkRzhnWVhSeWFXNXJkR2tnYzNabGRHRnBibVZ6SUhCaFoyRnNJTVcrYVc1dmJXRnpJSE53Y21GbllYTXVDaUFxSUZabGNuTnBiMjQ2SURFdU1DNHdDaUFxTHdwcFppQW9JV1JsWm1sdVpXUW9KMEZDVTFCQlZFZ25LU2tnWlhocGREc0tDaTh2SUR4dFpYUmhJRzVoYldVOUltZGxibVZ5WVhSdmNpSWdZMjl1ZEdWdWREMGlWMjl5WkZCeVpYTnpJSGd1ZVM1NklqNEtjbVZ0YjNabFgyRmpkR2x2YmlnbmQzQmZhR1ZoWkNjc0lDZDNjRjluWlc1bGNtRjBiM0luS1RzS1lXUmtYMlpwYkhSbGNpZ25kR2hsWDJkbGJtVnlZWFJ2Y2ljc0lDZGZYM0psZEhWeWJsOWxiWEIwZVY5emRISnBibWNuS1RzS0NpOHZJRkpsWVd4c2VTQlRhVzF3YkdVZ1JHbHpZMjkyWlhKNUlHbHlJRmRwYm1SdmQzTWdUR2wyWlNCWGNtbDBaWElnNG9DVUlHNWxibUYxWkc5cVlXMXBMQ0JpWlhRZ2MydGxiR0pwWVNCMlpYSnphV3JFaFFweVpXMXZkbVZmWVdOMGFXOXVLQ2QzY0Y5b1pXRmtKeXdnSjNKelpGOXNhVzVySnlrN0NuSmxiVzkyWlY5aFkzUnBiMjRvSjNkd1gyaGxZV1FuTENBbmQyeDNiV0Z1YVdabGMzUmZiR2x1YXljcE93b0tMeThnV0MxUWFXNW5ZbUZqYXlCaGJuUnlZY1doZE1TWENtRmtaRjltYVd4MFpYSW9KM2R3WDJobFlXUmxjbk1uTENCbWRXNWpkR2x2YmlBb0pHZ3BJSHNnZFc1elpYUW9KR2hiSjFndFVHbHVaMkpoWTJzblhTazdJSEpsZEhWeWJpQWthRHNnZlNrN0NnPT0nKTsKICRvazIgPSB0cnVlOyAka2wyPScnOwogdHJ5IHsgdG9rZW5fZ2V0X2FsbCgka29kLCBUT0tFTl9QQVJTRSk7IH0gY2F0Y2ggKFBhcnNlRXJyb3IgJGUpIHsgJG9rMj1mYWxzZTsgJGtsMj0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAkb1snaGlnaWVuYV9zaW50YWtzZSddID0gJG9rMiA/ICdPSycgOiAoJ0tMQUlEQTogJy4ka2wyKTsKIGlmKCRvazIpewogICBAZmlsZV9wdXRfY29udGVudHMoJG11LCAka29kKTsKICAgJG9bJ2hpZ2llbmFfbWQ1J10gPSBmaWxlX2V4aXN0cygkbXUpID8gbWQ1X2ZpbGUoJG11KSA6IG51bGw7CiAgICRyMiA9IHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSwgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCkpOwogICAkb1snbG9vcGJhY2tfcG9faGlnaWVub3MnXSA9IGlzX3dwX2Vycm9yKCRyMikgPyAoJ1dQX0VSUk9SOiAnLiRyMi0+Z2V0X2Vycm9yX21lc3NhZ2UoKSkgOiAoaW50KSB3cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcjIpOwogICBpZigkb1snbG9vcGJhY2tfcG9faGlnaWVub3MnXSAhPT0gMjAwKXsgQHVubGluaygkbXUpOyAkb1snQVRTQVVLVEFfSElHSUVOQSddPTE7IH0KICAgZWxzZSB7CiAgICAgJGggPSB3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkcjIpOwogICAgICRvWydnZW5lcmF0b3JfbGlrbyddID0gKHN0cmlwb3MoJGgsICduYW1lPSJnZW5lcmF0b3IiJykgIT09IGZhbHNlKSA/ICdUQUlQJyA6ICduZSc7CiAgIH0KIH0KCiAvKiAtLS0tLS0tLS0tIDMuIHJlYWRtZS5odG1sIC8gbGljZW5zZS50eHQgLS0tLS0tLS0tLSAqLwogZm9yZWFjaChhcnJheSgncmVhZG1lLmh0bWwnLCdsaWNlbnNlLnR4dCcpIGFzICRmKXsKICAgJHAgPSBBQlNQQVRILiRmOwogICBpZihmaWxlX2V4aXN0cygkcCkpewogICAgIEByZW5hbWUoJHAsICRiay4nLycuJGYuJy5iYWtfaDA4NicpOwogICAgICRvWydpc3RyYXVrdGEnXVskZl0gPSBmaWxlX2V4aXN0cygkcCkgPyAnTElLTycgOiAncGVya2VsdGEgaSBwcy1iYWNrdXBzJzsKICAgfSBlbHNlIHsgJG9bJ2lzdHJhdWt0YSddWyRmXSA9ICduZWJ1dm8nOyB9CiB9CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H086',wp:WP};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
async function tikr(p){ try{ const r=await fetch(WP+p,{redirect:'manual'}); return {http:r.status}; }catch(e){ return {klaida:String(e).slice(0,80)}; } }

try{
  /* ================= 1. SAUGOS PATAISOS ================= */
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H086 saugos pataisos',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:('KLAIDA '+cr.s);
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h086=FIX'); const tt=await rr.text();
  try{ out.PATAISOS=JSON.parse(tt); }catch(e){ out.PATAISOS={ZALIAS:tt.slice(0,500)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});

  out.PO_PATAISU = { frontas: await tikr('/'), readme: await tikr('/readme.html'), license: await tikr('/license.txt') };
  const hp = await (await fetch(WP+'/')).text();
  out.PO_PATAISU.generator = /name="generator"/i.test(hp) ? 'DAR YRA' : 'pasalintas';

  /* ================= 2. GREITIS ================= */
  const cp=await import('child_process');
  try{ cp.execSync('npm i lighthouse chrome-launcher --no-audit --no-fund --silent',{stdio:'ignore',timeout:240000}); out.lh_diegimas='ok'; }
  catch(e){ out.lh_diegimas='NEPAVYKO: '+String(e).slice(0,150); }

  let chromePath=null;
  try{ const pw=await import('playwright'); chromePath=pw.chromium.executablePath(); out.chromium=chromePath; }catch(e){ out.chromium='NERA: '+String(e).slice(0,100); }

  if(out.lh_diegimas==='ok' && chromePath){
    try{
      const {default:lighthouse}=await import('lighthouse');
      const cl=await import('chrome-launcher');
      for(const ff of ['mobile','desktop']){
        try{
          const chrome=await cl.launch({chromePath,chromeFlags:['--headless=new','--no-sandbox','--disable-gpu','--ignore-certificate-errors']});
          const cfg={ logLevel:'error', output:'json', onlyCategories:['performance'], port:chrome.port,
            formFactor: ff,
            screenEmulation: ff==='desktop' ? {mobile:false,width:1350,height:940,deviceScaleFactor:1,disabled:false}
                                            : {mobile:true,width:412,height:823,deviceScaleFactor:1.75,disabled:false},
            throttling: ff==='desktop' ? {rttMs:40,throughputKbps:10240,cpuSlowdownMultiplier:1}
                                       : {rttMs:150,throughputKbps:1638.4,cpuSlowdownMultiplier:4} };
          const r=await lighthouse(WP+'/',cfg);
          const L=r.lhr, a=L.audits||{};
          out['LH_'+ff]={ skoras: Math.round(L.categories.performance.score*100),
            LCP:(a['largest-contentful-paint']||{}).displayValue, FCP:(a['first-contentful-paint']||{}).displayValue,
            TBT:(a['total-blocking-time']||{}).displayValue, CLS:(a['cumulative-layout-shift']||{}).displayValue,
            SI:(a['speed-index']||{}).displayValue, TTFB:(a['server-response-time']||{}).displayValue,
            svoris_KB: Math.round(((a['total-byte-weight']||{}).numericValue||0)/1024),
            top: (((a['diagnostics']||{}).details||{}).items||[{}])[0] };
          const g=[]; for(const k of ['unused-javascript','unused-css-rules','render-blocking-resources','modern-image-formats','uses-text-compression','offscreen-images','uses-responsive-images']){
            const x=a[k]; if(x && x.numericValue>0) g.push(k+': '+(x.displayValue||Math.round(x.numericValue)));
          }
          out['LH_'+ff].galimybes=g;
          await chrome.kill();
        }catch(e){ out['LH_'+ff]={klaida:String(e).slice(0,250)}; }
      }
    }catch(e){ out.lh_klaida=String(e).slice(0,250); }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h086.json', Buffer.from(JSON.stringify(out,null,1)), 'h086 saugos pataisos + lighthouse');
