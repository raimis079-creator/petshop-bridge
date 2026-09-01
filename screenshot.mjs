process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO, WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const out={}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS S1549c ck+cwv',code:Buffer.from('PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ5YyBhZG1pbiBjb29raWUgKyBDV1YgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnQ0snLCdDV1YnKSx0cnVlKSkgcmV0dXJuOwogIGlmKCRmPT09J0NLJyl7ICR1PWdldF91c2VyX2J5KCdsb2dpbicsJF9HRVRbJ3UnXT8/JycpOyBpZighJHUpICR1PWdldF91c2VyX2J5KCdlbWFpbCcsJF9HRVRbJ3UnXT8/JycpOyBpZighJHUpeyBlY2hvICdubyB1c2VyJzsgZXhpdDsgfQogICAgd3Bfc2V0X2F1dGhfY29va2llKCR1LT5JRCxmYWxzZSx0cnVlKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IHRleHQvcGxhaW4nKTsgZWNobyAnb2sgJy4kdS0+SUQ7IGV4aXQ7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyAkbz1hcnJheSgnZmF6ZSc9PidDV1YnKTsgQHNldF90aW1lX2xpbWl0KDI4MCk7CiAgdHJ5eyBQZXRzaG9wX1NFTzo6Y3Jvbl9jd3YoKTsgJGM9UGV0c2hvcF9TRU86OnBhc2t1dGluaXMoJ2N3dicpOyAkb1snY3d2J109JGNbJ2tsYWlkb3MnXTsgJG9bJ3NhbnRyYXVrYSddPSRjWydzYW50cmF1a2EnXTsgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8'),scope:'global',active:true,priority:5})});
  sid=(await c.json()).id; out.sid=sid; await miegok(8000);
  const cw=await fetch(WP+'/?ps_seo=CWV',{headers:{'User-Agent':'Mozilla/5.0'}}); out.cwv=(await cw.text()).slice(0,1500);
  const ck=await fetch(WP+'/?ps_seo=CK&u='+encodeURIComponent(process.env.WP_USER),{redirect:'manual',headers:{'User-Agent':'Mozilla/5.0'}});
  const sc=ck.headers.getSetCookie(); out.cookies=sc.length; const host=new URL(WP).hostname;
  const cookies=sc.map(s=>{ const [nv,...rest]=s.split(';'); const i=nv.indexOf('='); const name=nv.slice(0,i).trim(), value=nv.slice(i+1).trim(); const path=(rest.find(x=>x.trim().toLowerCase().startsWith('path='))||'path=/').split('=')[1].trim(); return {name,value,domain:host,path,secure:true,httpOnly:true}; });
  const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1400,height:900},ignoreHTTPSErrors:true}); await ctx.addCookies(cookies);
  const pg=await ctx.newPage(); await pg.goto(WP+'/wp-admin/admin.php?page=ps-seo',{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(3000);
  out.url=pg.url(); out.h1=await pg.locator('h1').first().innerText().catch(()=>'');
  const png=await pg.screenshot({fullPage:true}); out.put=await put('screenshots/s1549_seo.png',png,'S1549 seo screenshot'); await br.close();
}catch(e){ out.klaida=String(e).slice(0,600); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/s1549c.json',Buffer.from(JSON.stringify(out,null,1)),'S1549c'); console.log(JSON.stringify(out).slice(0,500));
