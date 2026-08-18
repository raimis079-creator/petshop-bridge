process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDI3J10pPyRfR0VUWydwc19oMDI3J106Jyc7IGlmKCRhIT09J1NFVCcmJiRhIT09J0FUU1RBVFlUSScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDI3JywnYSc9PiRhKTsKICRpZHM9YXJyYXkoNzIsNzApOyAvKiA3MiA9IFNhdXNhcyBtYWlzdGFzIHN1bmltcyAobGFwaW5lKSwgNzAgPSBTVU5JTVMgKGh1YikgKi8KCiBpZigkYT09PSdTRVQnKXsKICAgJGtvcGlqYT1hcnJheSgpOwogICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJHQ9Z2V0X3Rlcm0oJGlkLCdwcm9kdWN0X2NhdCcpOyAka29waWphWyRpZF09JHQmJiFpc193cF9lcnJvcigkdCk/JHQtPmRlc2NyaXB0aW9uOicnOyB9CiAgIHVwZGF0ZV9vcHRpb24oJ3BzX2gwMjdfa29waWphJywka29waWphLGZhbHNlKTsKICAgJHR1cmlueXM9YmFzZTY0X2RlY29kZSgnUEhBK1UyRjFjMkZ6SUcxaGFYTjBZWE1neGFGMWJtbHRjeUI1Y21FZ1pHSEZ2bTVwWVhWemFXRnpJR3RoYzJScFpXN0VsM01nYldsMGVXSnZjeUJ3WVhOcGNtbHVhMmx0WVhNNklHckVyeUJ3WVhSdlozVWdaRzk2ZFc5MGFTd2diR0ZwYTNsMGFTQnBjaUIyWmNXK2RHbHpMaUJCYzI5eWRHbHRaVzUwWlNCeVlYTnBkR1VnYzJ0cGNuUnBibWZGc3lCcmJHRnphY1d6SUhCaHhhRmhjblZ6TENCdWRXOGdhMkZ6WkdsbGJtbkZzeUJwYTJrZ2MybGhkWEpsYzI3RWwzTWdjR0Z6YTJseWRHbGxjeUJ5WldObGNIVEZxM0xGc3l3Z2RHOWt4SmRzSUhKcGJtdDBhWE1nZG1WeWRHRWdibVVnY0dGbllXd2djR0ZyZFc5MHhKa3NJRzhnY0dGbllXd2djM1ZreEpkMHhLOGdhWElneGFGMWJuTWdjRzl5WldscnhLOHVQQzl3UGdvOGFETStVR0ZuWVd3Z2E4U0ZJSEpwYm10MGFYTThMMmd6UGdvOGNENVFhWEp0YVdGMWMybGhJTVcrYWNXcmNtbHRZU0RFcnlCbmVYWmxibWx0YnlCbGRHRnd4SVV1SU1XZ2RXNXBkV3RoYlhNZ2NtVnBhMmxoSUdSaGRXZHBZWFVnWW1Gc2RIbHR4Yk1nYVhJZ2EyRnNZMmx2SUdGMVoybHRkV2tzSUhOMVlYVm5kWE5wWlcxeklPS0FreUJ6ZEdGaWFXeGhkWE1nWW1Gc1lXNXpieXdnYnlCMmVYSmxjMjVwWlcxeklHUmh4YjV1WVdrZ2RHbHVhMkVnYkdWdVozWnBZWFVnZG1seXhhRnJhVzVoYlc5eklISmxZMlZ3ZE1XcmNtOXpMaUJCYm5SeVlYTWdhM0pwZEdWeWFXcDFjeUI1Y21FZ2RtVnBjMnpFbDNNZ1pIbGthWE02SUdkeVlXNTFiTVNYY3lCa2VXUnBjeUJwY2lCbGJtVnlaMmxxYjNNZ2RHRnVhMmx6SUcxaHhiN0ZzeUJwY2lCa2FXUmxiR25Gc3lCMlpXbHpiR25Gc3lCd1ljV2hZWEoxYjNObElITnJhWEpwWVhOcExqd3ZjRDRLUEhWc1BnbzhiR2srUEhOMGNtOXVaejVLWVhWMGNta2dkbWx5eGFGcmFXNXBiVzhnYzJsemRHVnRZVHd2YzNSeWIyNW5QaURpZ0pNZ2NtbGliM1JoY3lCcGJtZHlaV1JwWlc1MHhiTWdjMnRoYWNTTmFYVnpMQ0JrWWNXK2JtRnBJSFpwWlc1aGN5QmlZV3gwZVcxdklNV2hZV3gwYVc1cGN5NDhMMnhwUGdvOGJHaytQSE4wY205dVp6NUtZWFYwY21rZ2IyUmhJR2x5SUd0aGFXeHBjend2YzNSeWIyNW5QaURpZ0pNZ2NtVmpaWEIweGF0eWIzTWdjM1VneGI1MWRtbHRhU0JoY21KaElNU1hjbWxsYm1Fc0lIQnlZWFIxY25ScGJuUnZjeUJ5YVdWaVlXekZzeUJ5eGF0bnhhRjBhVzFwY3k0OEwyeHBQZ284YkdrK1BITjBjbTl1Wno1VGRHVnlhV3hwZW5WdmRHbGxiWE1nYVhJZ2JHbHVhM1Z6YVdWdGN5QjBkV3QwYVR3dmMzUnliMjVuUGlEaWdKTWdiV0hGdm1WemJtbHpJR3RoYkc5eWFXNW5kVzFoY3l3Z1pHRjFaMmxoZFNCemEyRnBaSFZzeGJNdVBDOXNhVDRLUEd4cFBqeHpkSEp2Ym1jK1FXdDBlWFpwWlcxelBDOXpkSEp2Ym1jK0lPS0FreUJrYVdSbGMyNXBjeUJsYm1WeVoybHFiM01nZEdGdWEybHpJRzFoeGI1bGMyNXBZVzFsSUd0cFpXdDVhbVV1UEM5c2FUNEtQQzkxYkQ0S1BHZ3pQbE4xWk1TWGRHbHpMQ0RFcnlCcmRYSnB4SVVnZG1WeWRHRWdjR0hGdm1uRnEzTEVsM1JwUEM5b016NEtQSEErVTNWa1pXUmhiVzl6YVc5eklHUmhiSGx6SUc1MWNtOWtiMjF2Y3lCdFljVyt4SmRxWVc3RWpXbGhJSFIyWVhKcllTd2dkRzlreEpkc0lIQnBjbTF2YzJsdmN5QndiM3BwWTJscWIzTWdjR0Z5YjJSdkxDQnJZWE1nY0dIRm9XRnlaU0J6ZFdSaGNtOGdaR2xreGI1cFlYVnphY1NGSUdSaGJNU3ZMaUJXWlhKMFlTQmhkR3R5Wldsd2RHa2daTVNYYldWenhLOHNJR0Z5SUczRWwzTnZjeURGb1dGc2RHbHVhWE1neEs5MllYSmtlWFJoY3lCcmIyNXJjbVhFaldsaGFTd2dZWElnWW1WdVpISnBibVVnWm05eWJYVnNkVzkwWlM0Z1FtVm5jc1dyWkdseklIQmh4YUZoY21GeklHN0VsM0poSUdGMWRHOXRZWFJweGFGcllXa2dkR2x1YTJGdFpYTnVhWE1nWVd4bGNtZHB4YUZyWVcwZ3hhRjFibWwxYVNEaWdKTWdjbVZwYThXaGJjU1hjeUIwZFhKcElHdHZibXR5WlhSMWN5QmlZV3gwZVcxdklNV2hZV3gwYVc1cGN5d2dieUJ1WlNCbmNzV3JaTVd6SUdKMWRtbHRZWE11UEM5d1BnbzhhRE0rVUdWeXhKZHFhVzFoY3lCd2NtbGxJRzVoZFdwdklHMWhhWE4wYnp3dmFETStDanh3UGs1aGRXckVoU0J3WWNXaFlYTEVoU0RFcjNCeVlYTjBZU0RFcjNabGMzUnBJSEJoYkdGcGNITnVhWFZwTENCd1pYSWdOK0tBa3pFd0lHUnBaVzdGc3l3Z2EyRnpaR2xsYmlCa2FXUnBibUZ1ZENCcWJ5QmtZV3pFcnk0Z1UzUmhhV2QxY3lCclpXbDBhVzFoY3lCa1ljVytibWxoZFhOcFlXa2dZbUZwWjJsaGMya2dkbWx5eGFGcmFXNXBiVzhnYzNWMGNtbHJhVzFoYVhNc0lHNWxkQ0JxWldrZ2JtRjFhbUZ6SUhCaHhhRmhjbUZ6SUhseVlTQnJiMnQ1WW1uRm9XdGxjMjVwY3lCMXhiNGdZVzVyYzNSbGMyN0VyeTQ4TDNBK0NqeG9NejVMYVdWcklHMWhhWE4wYnlCeVpXbHJhV0VnY0dWeUlHUnBaVzdFaFR3dmFETStDanh3UGtkaGJXbHVkRzlxYnlCc1pXNTBaV3pFbHlCaGJuUWdjR0ZyZFc5MHhKZHpJSGx5WVNCaGRITnJZV2wwYjNNZ2RHSEZvV3RoY3l3Z2JtVWdkR2xyYzJ4cElHNXZjbTFoTGlCU1pXRnNkWE1nYTJsbGEybHpJSEJ5YVd0c1lYVnpieUJ1ZFc4Z1lXdDBlWFoxYlc4c0lHRnR4YjVwWVhWekxDQnpkR1Z5YVd4cGVtRmphV3B2Y3lCcGNpQjBieXdnYTJsbGF5REZvWFZ2SUdkaGRXNWhJSE5yWVc3RWwzTjB4Yk11SUZCeVlXdDBhV3R2YW1VZ2NISmhaR1ZrWVcxaElHNTFieUJzWlc1MFpXekVsM01nZG1sa2RYSnBieUJwY2lCcmIzSmxaM1Z2YW1GdFlTQndZV2RoYkNCemRtOXl4SzhnWW1WcElHdkZxMjV2SUdMRnEydHN4SmtnY0dWeUlHdGxiR2xoY3lCellYWmhhWFJsY3k0Z1NtVnBJTVdoZFc4Z1oyRjFibUVnYVhJZ2EyOXVjMlZ5ZHNXekxDQnpZWFZ6YnlCdFlXbHpkRzhnY0c5eVkybHFZU0JoZEdsMGFXNXJZVzFoYVNCdFljVythVzVoYldFc0lHdHBkR0ZwY0NCa2FXVnViM01nYTJGc2IzSnBibWQxYldGeklHNWxjR0Z6ZEdWaWFXMWhhU0JweGFGaGRXZGhMand2Y0Q0S1BHZ3pQa3hoYVd0NWJXRnpQQzlvTXo0S1BIQStRWFJwWkdGeWVYVEVoU0J0WVduRm9jU0ZJR2RsY21saGRYTnBZU0JzWVdscmVYUnBJSE5oYm1SaGNtbGhhU0IxeGI1a1lYSjVkTVNGTENCMnhKZHphVzlxWlNCcGNpQnpZWFZ6YjJwbElIWnBaWFJ2YW1Vc0lHOXlhV2RwYm1Gc2FXOXFaU0J3WVd0MWIzVEVsMnBsSU9LQWt5QnFhU0JoY0hOaGRXZHZJRzUxYnlCeWFXVmlZV3pGc3lCdmEzTnBaR0ZqYVdwdmN5NGdVR1Z5YzJsd2FXeGhiblFneEs4Z1lYUjJhWExFaFNCcGJtVEVoU0JuY21GdWRXekVsM01nWjNKbGFjU05hV0YxSUhCeVlYSmhibVJoSUd0MllYREVoU3dnYnlCcllYSjBkU0JwY2lERWwyUmhiWFZ0eElVdVBDOXdQZ284Y0Q1S1pXa2dhV1hGb1d0dmRHVWdjMmxoZFhKbGMyNXBieUJ6Y0hKbGJtUnBiVzhzSU1XK2FjV3Jjc1NYYTJsMFpTQThZU0JvY21WbVBTSXZhMkYwWldkdmNtbHFZUzl6ZFc1cGJYTXZiV0ZwYzNSaGN5MXpkVzVwYlhNdmEyOXVjMlZ5ZG1GcExYTjFibWx0Y3k4aVBtdHZibk5sY25aMWN5REZvWFZ1YVcxelBDOWhQaUJoY21KaElEeGhJR2h5WldZOUlpOXJZWFJsWjI5eWFXcGhMM04xYm1sdGN5OXphMkZ1WlhOMFlXa3RjM1Z1YVcxekx5SStjMnRoYnNTWGMzUjFjeURGb1hWdWFXMXpQQzloUGk0OEwzQStDZz09Jyk7CiAgIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAgICRyPXdwX3VwZGF0ZV90ZXJtKCRpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdkZXNjcmlwdGlvbic9PiR0dXJpbnlzKSk7CiAgICAgJG9bJ2lyYXN5dGEnXVskaWRdPWlzX3dwX2Vycm9yKCRyKT8kci0+Z2V0X2Vycm9yX21lc3NhZ2UoKTonb2snOwogICB9CiAgICRvWydrb3BpamFfaXNzYXVnb3RhJ109YXJyYXlfbWFwKCdzdHJsZW4nLCRrb3BpamEpOwogfSBlbHNlIHsKICAgJGtvcGlqYT1nZXRfb3B0aW9uKCdwc19oMDI3X2tvcGlqYScsYXJyYXkoKSk7CiAgIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAgICRzZW5hPWlzc2V0KCRrb3BpamFbJGlkXSk/JGtvcGlqYVskaWRdOicnOwogICAgICRyPXdwX3VwZGF0ZV90ZXJtKCRpZCwncHJvZHVjdF9jYXQnLGFycmF5KCdkZXNjcmlwdGlvbic9PiRzZW5hKSk7CiAgICAgJG9bJ2F0c3RhdHl0YSddWyRpZF09aXNfd3BfZXJyb3IoJHIpPyRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOnN0cmxlbigkc2VuYSk7CiAgIH0KICAgZGVsZXRlX29wdGlvbigncHNfaDAyN19rb3BpamEnKTsKIH0KIGZvcmVhY2goJGlkcyBhcyAkaWQpewogICAkdD1nZXRfdGVybSgkaWQsJ3Byb2R1Y3RfY2F0Jyk7CiAgICRvWydkYWJhciddWyRpZF09YXJyYXkoJ3ZhcmRhcyc9PiR0LT5uYW1lLCdpbGdpcyc9PnN0cmxlbigkdC0+ZGVzY3JpcHRpb24pLCd1cmwnPT5nZXRfdGVybV9saW5rKCR0KSk7CiB9CiAkd3BkYi0+cXVlcnkoIlVQREFURSB7JFB9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H027'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
let snipId=null;
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H027 kategorijos testas',code,scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  snipId=j?j.id:null; out.snip=snipId||('KLAIDA '+cr.s+' '+cr.t.slice(0,200));
  await new Promise(r=>setTimeout(r,9000));

  const s1=await fetch(WP+'/?ps_h027=SET'); const t1=await s1.text();
  try{ out.set=JSON.parse(t1); }catch(e){ out.set_zalias=t1.slice(0,500); }
  await new Promise(r=>setTimeout(r,4000));

  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  out.matavimai={};
  const taikiniai=[['lapine',72],['hub',70]];
  for(const [zyme,id] of taikiniai){
    const url=(out.set&&out.set.dabar&&out.set.dabar[id])?out.set.dabar[id].url:null;
    if(!url) continue;
    for(const [rez,w,h] of [['desktop',1400,1100],['mobile',390,844]]){
      const ctx=await br.newContext({viewport:{width:w,height:h},ignoreHTTPSErrors:true,
        isMobile:(rez==='mobile'),hasTouch:(rez==='mobile'),
        userAgent: rez==='mobile'?'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1':undefined});
      const pg=await ctx.newPage();
      const r=await pg.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
      await pg.waitForTimeout(2500);
      /* slapuku juosta salin, kad netrukdytu */
      try{ await pg.evaluate(()=>{document.querySelectorAll('#cmplz-cookiebanner-container,.cmplz-cookiebanner').forEach(e=>e.remove());}); }catch(e){}
      await pg.waitForTimeout(600);
      const m=await pg.evaluate(()=>{
        const q=(s)=>document.querySelector(s);
        const kand=['.category-description','.term-description','.taxonomy-description','.woocommerce-product-category .term-description','.page-title-inner + .term-description','.shop-container .term-description'];
        let el=null,sel=null;
        for(const s of kand){ const e=q(s); if(e&&e.innerText.trim().length>50){ el=e; sel=s; break; } }
        if(!el){ /* fallback: bet kuris blokas su musu tekstu */
          const visi=[...document.querySelectorAll('div,section')];
          el=visi.find(e=>e.children.length<12 && e.innerText.includes('Pagal ką rinktis'));
          sel=el?(el.className||el.tagName):null;
        }
        const grid=q('.products')||q('ul.products')||q('.shop-container .row');
        const h1=q('h1');
        const rect=(e)=>e?{top:Math.round(e.getBoundingClientRect().top+window.scrollY),h:Math.round(e.getBoundingClientRect().height)}:null;
        return {
          selektorius:sel,
          aprasymas:rect(el),
          prekiu_tinklelis:rect(grid),
          h1:rect(h1),
          puslapio_aukstis:document.body.scrollHeight,
          lango_aukstis:window.innerHeight,
          teksto_pradzia:el?el.innerText.trim().slice(0,80):null,
          nuorodu_tekste:el?el.querySelectorAll('a').length:0,
          h3_tekste:el?el.querySelectorAll('h3').length:0
        };
      });
      const md=await pg.evaluate(()=>{const m=document.querySelector('meta[name="description"]');return m?m.content:'';});
      m.meta_description=md.slice(0,300); m.meta_ilgis=md.length;
      m.http=r?r.status():0;
      out.matavimai[zyme+'_'+rez]=m;
      const png=await pg.screenshot({fullPage:false});
      await put('screenshots/h027_'+zyme+'_'+rez+'.png',png,'h027 '+zyme+' '+rez);
      await ctx.close();
    }
  }
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
/* VISADA atstatom */
try{
  const s2=await fetch(WP+'/?ps_h027=ATSTATYTI'); const t2=await s2.text();
  try{ out.atstatymas=JSON.parse(t2); }catch(e){ out.atstatymas_zalias=t2.slice(0,400); }
}catch(e){ out.atstatymo_klaida=String(e).slice(0,200); }
try{ if(snipId) await api('/wp-json/code-snippets/v1/snippets/'+snipId,{method:'POST',body:JSON.stringify({id:snipId,active:false})}); }catch(e){}
const zlib=await import('zlib');
await put('screenshots/h027.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h027 kategorijos testas');
