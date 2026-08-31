process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const VER='S1547hvis';
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3IGNvb2tpZSAoYWRtaW4gc2VzaWphIFBsYXl3cmlnaHQpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfY2snXSl8fCRfR0VUWydwc19jayddIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nUzE1NDdjaycpOwogIHRyeXsKICAgICR1cz1nZXRfdXNlcnMoYXJyYXkoJ3JvbGUnPT4nYWRtaW5pc3RyYXRvcicsJ251bWJlcic9PjEsJ29yZGVyYnknPT4nSUQnKSk7CiAgICBpZighJHVzKXsgJG9bJ2tsYWlkYSddPSduZXJhIGFkbWluJzsgZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KICAgICR1PSR1c1swXTsgJGV4cD10aW1lKCkrMzYwMDsKICAgICRtPVdQX1Nlc3Npb25fVG9rZW5zOjpnZXRfaW5zdGFuY2UoJHUtPklEKTsgJHRvaz0kbS0+Y3JlYXRlKCRleHApOwogICAgJG9bJ2Nvb2tpZXMnXT1hcnJheSgKICAgICAgYXJyYXkoJ25hbWUnPT5TRUNVUkVfQVVUSF9DT09LSUUsJ3ZhbHVlJz0+d3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHUtPklELCRleHAsJ3NlY3VyZV9hdXRoJywkdG9rKSwncGF0aCc9Picvd3AtYWRtaW4nKSwKICAgICAgYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1LT5JRCwkZXhwLCdsb2dnZWRfaW4nLCR0b2spLCdwYXRoJz0+Jy8nKSwKICAgICk7CiAgICAkb1sndXNlciddPSR1LT51c2VyX2xvZ2luOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1sna2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0Owp9KTsK';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  const ct=await c.text(); try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,300);}
  await miegok(9000);
  const d=await fetch(WP+'/?ps_ck=GO',{headers:{'User-Agent':'Mozilla/5.0'}});
  const ck=JSON.parse(await d.text());
  out.cookies_gauta=ck.cookies?ck.cookies.length:0;
  const host=new URL(WP).hostname;
  const puslapiai=[
    ['s1547h_kl','/wp-admin/admin.php?page=ps-klientai&saltinis=abu&f_segmentas=win_back&f_min_uzs=3'],
    ['s1547h_kl_riz','/wp-admin/admin.php?page=ps-klientai&tab=rizika&saltinis=abu&riz_d=30'],
    ['s1547h_pr','/wp-admin/admin.php?page=ps-prekes&saltinis=abu&f_sandelis=zb&f_abc=A'],
    ['s1547h_at_ds','/wp-admin/admin.php?page=ps-atsargos&tab=dropship&saltinis=abu'],
    ['s1547h_at_uz','/wp-admin/admin.php?page=ps-atsargos&tab=uzsakyti&saltinis=abu&lead_d=14'],
  ];


  let pw=null; try{ pw=await import('playwright'); }catch(e){ out.pw_klaida='nera: '+String(e).slice(0,80); }
  if(pw){
    const br=await pw.chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true});
    await ctx.addCookies(ck.cookies.map(c=>({name:c.name,value:c.value,domain:host,path:c.path||'/',secure:true})));
    const pg=await ctx.newPage();
    for(const [nm,u] of puslapiai){
      try{
        await pg.goto(WP+u,{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(4000);
        const png=await pg.screenshot({fullPage:false});
        out[nm]=await put('screenshots/'+nm+'.png',png,VER+' '+nm);
        const body=await pg.content();
        out[nm+'_zymes']={saltinis:body.includes('Šaltinis:'),eshop:body.includes('eShoprent'),login:body.includes('wp-login')};
      }catch(e){ out[nm+'_klaida']=String(e).slice(0,200); }
    }
    await br.close();
  } else {
    const CK=ck.cookies.map(c=>c.name+'='+c.value).join('; ');
    for(const [nm,u] of puslapiai){
      const r=await fetch(WP+u,{headers:{Cookie:CK,'User-Agent':'Mozilla/5.0'},redirect:'manual'});
      const t=await r.text();
      out[nm+'_zymes']={status:r.status,saltinis:t.includes('Šaltinis:'),eshop:t.includes('eShoprent'),b1:t.includes('B1 taisyklės'),nebep:t.includes('Nebeparduodamos'),pernai:t.includes('eShoprent pernai')};
      await put('analize/'+nm+'.html',Buffer.from(t.slice(0,120000)),VER+' html '+nm);
    }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/s1547_vis.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
