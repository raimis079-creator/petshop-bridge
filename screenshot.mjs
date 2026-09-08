process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNjM5eiB2ZXJ0aW1haSB2MS4yIGRlcGxveSArIGdldHRleHQgdGVzdGFzICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPShpc3NldCgkX0dFVFsncHNfbzgnXSk/JF9HRVRbJ3BzX284J106JycpOyBpZigkZiE9PSdHTycmJiRmIT09J0NMJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE2Mzl6JywnZmF6ZSc9PiRmKTsKICB0cnl7CiAgICAkdD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXZlcnRpbWFpLnBocCc7CiAgICBpZigkZj09PSdHTycpewogICAgICAkcz0oc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCR0KTsKICAgICAgaWYobWQ1KCRzKSE9PSczMDI1YzAyYTVkMDljYTVlZjc1Y2U5Y2Y2YjJmNDQ4ZicpIHRocm93IG5ldyBFeGNlcHRpb24oJ2d5dmFzIHBhc2lrZWl0ZTogJy5tZDUoJHMpKTsKICAgICAgJGI2ND0nClBEOXdhSEFLTHlvcUNpQXFJRkJzZFdkcGJpQk9ZVzFsT2lCUVpYUnphRzl3SUhabGNuUnBiV0ZwQ2lBcUlFUmxjMk55YVhCMGFXOXVPaUJVY3NXcmEzTjBZVzFwSUZkdmIwTnZiVzFsY21ObEwwWnNZWFJ6YjIxbElHeDBYMHhVSUhabGNuUnBiV0ZwSUNoc1lXbkZvV3RoYVN3Z2NHRnBaY1doYTI5eklHRnVkSEpoeGFGMHhKZHpLUzRnVkdscklHVnBiSFYweEpkekxDQnJkWEpweGJNZ2JzU1hjbUVnYjJacFkybGhiR2wxYjNObElDNXRieTRLSUNvZ1ZtVnljMmx2YmpvZ01TNHlJQ2hUTVRZek9Td2dNakF5Tmkwd09TMHdPRG9nS3lCbmNzU0Z4YjVwYm1sdGJ5QnNZV25Gb1d0dklITmhhMmx1YVdGcElPS0FsQ0JsYldGcGJGOXBiWEJ5YjNabGJXVnVkSE1nWW05a2VTQnNkRjlNVkNCMlpYSjBhVzF2SUc3RWwzSmhMQ0J0WVhSNWRHRWdkR1Z6ZEdVZ0l6TTFPRFl6S1FvZ0tpOEthV1lnS0NBaElHUmxabWx1WldRb0lDZEJRbE5RUVZSSUp5QXBJQ2tnWlhocGREc0tZV1JrWDJacGJIUmxjaWdnSjJkbGRIUmxlSFJmZDI5dlkyOXRiV1Z5WTJVbkxDQm1kVzVqZEdsdmJpZ2dKSFJ5WVc1emJHRjBaV1FzSUNSMFpYaDBMQ0FrWkc5dFlXbHVJQ2tnZXdvSmMzUmhkR2xqSUNSdFlYQWdQU0JoY25KaGVTZ0tDUWt2THlCMk1TNHlPaUJuY3NTRnhiNXBibWx0YnlCc1lXbkZvV3RoY3lBb1pXMWhhV3hmYVcxd2NtOTJaVzFsYm5SektRb0pDU2RaYjNWeUlHOXlaR1Z5SUdaeWIyMGdKWE1nYUdGeklHSmxaVzRnY0dGeWRHbGhiR3g1SUhKbFpuVnVaR1ZrTGljZ1BUNGdKMHAxYlhNZ1ozTEVoY1crYVc1MFlTQmtZV3hwY3lCd2FXNXBaOFd6SUhYRnZpQjF4YjV6WVd0NWJjU0ZJSEJoY21SMWIzUjFkc1NYYW1VZ0pYTXVKeXdLQ1FrbldXOTFjaUJ2Y21SbGNpQm1jbTl0SUNWeklHaGhjeUJpWldWdUlISmxablZ1WkdWa0xpY2dQVDRnSjBwMWJYTWdaM0xFaGNXK2FXNTBhU0J3YVc1cFoyRnBJSFhGdmlCMXhiNXpZV3Q1YmNTRklIQmhjbVIxYjNSMWRzU1hhbVVnSlhNdUp5d0tDUWtuV1c5MWNpQnZjbVJsY2lCdmJpQWxjeUJvWVhNZ1ltVmxiaUJ3WVhKMGFXRnNiSGtnY21WbWRXNWtaV1F1SUZSb1pYSmxJR0Z5WlNCdGIzSmxJR1JsZEdGcGJITWdZbVZzYjNjZ1ptOXlJSGx2ZFhJZ2NtVm1aWEpsYm1ObE9pY2dQVDRnSjBwMWJYTWdaM0xFaGNXK2FXNTBZU0JrWVd4cGN5QndhVzVwWjhXeklIWEZ2aUIxeGI1ellXdDViY1NGSUhCaGNtUjFiM1IxZHNTWGFtVWdKWE11SUVSbGRHRnN4SmR6SU1XK1pXMXBZWFU2Snl3S0NRa25XVzkxY2lCdmNtUmxjaUJ2YmlBbGN5Qm9ZWE1nWW1WbGJpQnlaV1oxYm1SbFpDNGdWR2hsY21VZ1lYSmxJRzF2Y21VZ1pHVjBZV2xzY3lCaVpXeHZkeUJtYjNJZ2VXOTFjaUJ5WldabGNtVnVZMlU2SnlBOVBpQW5TblZ0Y3lCbmNzU0Z4YjVwYm5ScElIQnBibWxuWVdrZ2RjVytJSFhGdm5OaGEzbHR4SVVnY0dGeVpIVnZkSFYyeEpkcVpTQWxjeTRnUkdWMFlXekVsM01neGI1bGJXbGhkVG9uTEFvSkNTZFZibVp2Y25SMWJtRjBaV3g1TENCMGFHVWdjR0Y1YldWdWRDQm1iM0lnYjNKa1pYSWdJeVV4SkhNZ1puSnZiU0FsTWlSeklHaGhjeUJtWVdsc1pXUXVJRlJvWlNCdmNtUmxjaUIzWVhNZ1lYTWdabTlzYkc5M2N6b25JRDArSUNkRVpXcGhMQ0IxeGI1ellXdDViVzhnSXlVeEpITWdLSEJwY212RWwycGhjeUFsTWlSektTQmhjRzF2YThTWGFtbHRZWE1nYm1Wd1lYWjVhMjh1SUZYRnZuTmhhM2x0YnlCcGJtWnZjbTFoWTJscVlUb25MQW9KQ1NKWFpWeDRSVEpjZURnd1hIZzVPWEpsSUdkbGRIUnBibWNnYVc0Z2RHOTFZMmdnZEc4Z2JHVjBJSGx2ZFNCcmJtOTNJSFJvWVhRZ2IzSmtaWElnSXlVeFhDUnpJR1p5YjIwZ0pUSmNKSE1nYUdGeklHSmxaVzRnWTJGdVkyVnNiR1ZrTGlJZ1BUNGdKMUJ5WVc1bHhhRmhiV1VzSUd0aFpDQjF4YjV6WVd0NWJXRnpJQ01sTVNSeklDaHdhWEpyeEpkcVlYTWdKVElrY3lrZ1luVjJieUJoZE1XaFlYVnJkR0Z6TGljc0Nna0pKMDl5WkdWeUlFWmhhV3hsWkRvZ0pYTW5JRDArSUNkVnhiNXpZV3Q1Ylc4Z1lYQnRiMnZFbDNScElHNWxjR0YyZVd0dk9pQWxjeWNzQ2drSkowNWxkeUJQY21SbGNqb2dJeVZ6SnlBOVBpQW5UbUYxYW1GeklIWEZ2bk5oYTNsdFlYTTZJQ01sY3ljc0Nna3BPd29KYVdZZ0tDQWtkSEpoYm5Oc1lYUmxaQ0E5UFQwZ0pIUmxlSFFnSmlZZ2FYTnpaWFFvSUNSdFlYQmJJQ1IwWlhoMElGMGdLU0FwSUhKbGRIVnliaUFrYldGd1d5QWtkR1Y0ZENCZE93b0pjbVYwZFhKdUlDUjBjbUZ1YzJ4aGRHVmtPd3A5TENBeE1Dd2dNeUFwT3dwaFpHUmZabWxzZEdWeUtDQW5aMlYwZEdWNGRGOW1iR0YwYzI5dFpTY3NJR1oxYm1OMGFXOXVLQ0FrZEhKaGJuTnNZWFJsWkN3Z0pIUmxlSFFzSUNSa2IyMWhhVzRnS1NCN0NnbHpkR0YwYVdNZ0pHMWhjQ0E5SUdGeWNtRjVLQW9KQ1NkUVlXZGxjeUJtYjNWdVpDY2dJQ0FnUFQ0Z0oxSmhjM1JwSUhCMWMyeGhjR2xoYVNjc0Nna0pKMUJ5YjJSMVkzUnpJR1p2ZFc1a0p5QTlQaUFuVW1GemRHOXpJSEJ5Wld2RWwzTW5MQW9KQ1NkUWIzTjBjeUJtYjNWdVpDY2dJQ0FnUFQ0Z0oxSmhjM1JwSU1TdmNtSEZvV0ZwSnl3S0NTazdDZ2xwWmlBb0lDUjBjbUZ1YzJ4aGRHVmtJRDA5UFNBa2RHVjRkQ0FtSmlCcGMzTmxkQ2dnSkcxaGNGc2dKSFJsZUhRZ1hTQXBJQ2tnY21WMGRYSnVJQ1J0WVhCYklDUjBaWGgwSUYwN0NnbHlaWFIxY200Z0pIUnlZVzV6YkdGMFpXUTdDbjBzSURFd0xDQXpJQ2s3Q2c9PSc7CiAgICAgICRjb2RlPWJhc2U2NF9kZWNvZGUodHJpbSgkYjY0KSx0cnVlKTsKICAgICAgaWYoJGNvZGU9PT1mYWxzZXx8bWQ1KCRjb2RlKSE9PSc1ODA2ZWRiZjJjZjBhYzIzZmJiOTFjOTEyOTA0MDgwMycpIHRocm93IG5ldyBFeGNlcHRpb24oJ2I2NC9tZDUnKTsKICAgICAgJHRrPUB0b2tlbl9nZXRfYWxsKCRjb2RlLFRPS0VOX1BBUlNFKTsgaWYoIWlzX2FycmF5KCR0ayl8fGNvdW50KCR0ayk8MzApIHRocm93IG5ldyBFeGNlcHRpb24oJ3Rva2VuJyk7CiAgICAgICRvWydyYXN5dGEnXT1maWxlX3B1dF9jb250ZW50cygkdCwkY29kZSk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpeyBAb3BjYWNoZV9pbnZhbGlkYXRlKCR0LHRydWUpOyB9CiAgICAgICRvWydwb19tZDUnXT1tZDVfZmlsZSgkdCk7CiAgICB9IGVsc2UgewogICAgICAkb1snbWQ1J109bWQ1X2ZpbGUoJHQpOwogICAgICAkb1snZ2V0dGV4dF9kYWxpbmlzJ109X18oJ1lvdXIgb3JkZXIgZnJvbSAlcyBoYXMgYmVlbiBwYXJ0aWFsbHkgcmVmdW5kZWQuJywnd29vY29tbWVyY2UnKTsKICAgICAgJG9bJ2dldHRleHRfcGlsbmFzJ109X18oJ1lvdXIgb3JkZXIgZnJvbSAlcyBoYXMgYmVlbiByZWZ1bmRlZC4nLCd3b29jb21tZXJjZScpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-074424';
const GKEY='ps_o8';
const PHASES=["GO", "CL"];
const OUT='analize/s1639_z.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
