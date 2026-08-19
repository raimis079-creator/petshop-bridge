process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDYwJ10pPyRfR0VUWydwc19oMDYwJ106Jyc7CiBpZighaW5fYXJyYXkoJGEsYXJyYXkoJ0RSWScsJ0FQUExZJyksdHJ1ZSkpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCg2MDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidIMDYwJywnYSc9PiRhKTsKCiAkaGlnPWdldF90ZXJtKDgyLCdwcm9kdWN0X2NhdCcpOyAkc3VrPWdldF90ZXJtKDc1LCdwcm9kdWN0X2NhdCcpOwogaWYoISRoaWd8fGlzX3dwX2Vycm9yKCRoaWcpfHwhJHN1a3x8aXNfd3BfZXJyb3IoJHN1aykpeyAkb1snS0xBSURBJ109J3Rlcm1pbnUgbmVyYSc7CiAgIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAkdV9oaWc9cGFyc2VfdXJsKGdldF90ZXJtX2xpbmsoJGhpZyksUEhQX1VSTF9QQVRIKTsKICR1X3N1az1wYXJzZV91cmwoZ2V0X3Rlcm1fbGluaygkc3VrKSxQSFBfVVJMX1BBVEgpOwogJG9bJ3RhaWtpbmlhaSddPWFycmF5KCdoaWdpZW5hJz0+JHVfaGlnLCdzdWtvcyc9PiR1X3N1ayk7CgogJGVpbD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X25hbWUscG9zdF9jb250ZW50IEZST00geyRQfXBvc3RzCiAgIFdIRVJFIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF9jb250ZW50IExJS0UgJyVwcmlleml1cm9zLXByaWVtb25lcyUnIiwgQVJSQVlfQSk7CiAkb1snaXJhc3UnXT1jb3VudCgkZWlsKTsKCiBpZigkYT09PSdBUFBMWScpewogICAkdXA9d3BfdXBsb2FkX2RpcigpOyAkZD0kdXBbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRkKSkgQG1rZGlyKCRkLDA3NTUsdHJ1ZSk7CiAgICRrPWFycmF5KCk7IGZvcmVhY2goJGVpbCBhcyAkcikgJGtbJHJbJ0lEJ11dPSRyWydwb3N0X2NvbnRlbnQnXTsKICAgQGZpbGVfcHV0X2NvbnRlbnRzKCRkLicvcHJpZXppdXJvc19wcmllc18nLmRhdGUoJ1ltZF9IaXMnKS4nLmpzb24nLCB3cF9qc29uX2VuY29kZSgkaykpOwogfQoKICRwYWs9MDsgJHN1a29zX3ByaWRldGE9MDsgJHVwZD0wOyAkZGV0PWFycmF5KCk7CiBmb3JlYWNoKCRlaWwgYXMgJHIpewogICAkYz0kclsncG9zdF9jb250ZW50J107ICRzPSRjOyAkbj0wOwogICAvKiAxLiBzZW5hcyBrZWxpYXMgLT4gaGlnaWVub3MgcHJpZW1vbmVzICovCiAgICRjPXByZWdfcmVwbGFjZV9jYWxsYmFjaygnI2h0dHBzPzovLyg/Ond3d1wuKT9wZXRzaG9wXC5sdC9zdW5pbXMvcHJpZXppdXJvcy1wcmllbW9uZXMvPyNpJywKICAgICBmdW5jdGlvbigkbSkgdXNlICgkdV9oaWcsJiRuKXsgJG4rKzsgcmV0dXJuICR1X2hpZzsgfSwgJGMpOwogICAkYz1wcmVnX3JlcGxhY2VfY2FsbGJhY2soJyMoPzw9Iikvc3VuaW1zL3ByaWV6aXVyb3MtcHJpZW1vbmVzLz8oPz0iKSNpJywKICAgICBmdW5jdGlvbigkbSkgdXNlICgkdV9oaWcsJiRuKXsgJG4rKzsgcmV0dXJuICR1X2hpZzsgfSwgJGMpOwogICAvKiAyLiBzdWtvcyBiZSBudW9yb2RvcyAtPiBzdXNpZXRpICovCiAgICRzaz0wOwogICBpZihzdHJwb3MoJGMsJHVfc3VrKT09PWZhbHNlKXsKICAgICAkYz1wcmVnX3JlcGxhY2VfY2FsbGJhY2soJyM8bGk+XHMqKMWgdWtvc1tePF17MCw2MH0/KSg/PVxzKlvigJMtXSkjdScsCiAgICAgICBmdW5jdGlvbigkbSkgdXNlICgkdV9zdWssJiRzayl7ICRzaysrOyByZXR1cm4gJzxsaT48YSBocmVmPSInLiR1X3N1ay4nIj4nLnRyaW0oJG1bMV0pLic8L2E+ICc7IH0sICRjLCAxKTsKICAgfQogICAkcGFrKz0kbjsgJHN1a29zX3ByaWRldGErPSRzazsKICAgaWYoJGMhPT0kcyl7CiAgICAgaWYoJGE9PT0nQVBQTFknKXsgJHdwZGItPnVwZGF0ZSgkUC4ncG9zdHMnLGFycmF5KCdwb3N0X2NvbnRlbnQnPT4kYyksYXJyYXkoJ0lEJz0+JHJbJ0lEJ10pKTsgY2xlYW5fcG9zdF9jYWNoZSgkclsnSUQnXSk7IH0KICAgICAkdXBkKys7CiAgIH0KICAgaWYoJG58fCRzaykgJGRldFtdPWFycmF5KCdzbHVnJz0+JHJbJ3Bvc3RfbmFtZSddLCdoaWdpZW5hJz0+JG4sJ3N1a29zJz0+JHNrKTsKIH0KICRvWydwYWtlaXN0YV9oaWdpZW5hJ109JHBhazsgJG9bJ3ByaWRldGFfc3Vrb3MnXT0kc3Vrb3NfcHJpZGV0YTsgJG9bJ2lyYXN1X3BhbGllc3RhJ109JHVwZDsKICRvWydkZXRhbGVzJ109YXJyYXlfc2xpY2UoJGRldCwwLDIwKTsKIGlmKCRhPT09J0FQUExZJyl7CiAgICRvWydsaWtvX3NlbnUnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMKICAgICBXSEVSRSBwb3N0X3N0YXR1cz0ncHVibGlzaCcgQU5EIHBvc3RfY29udGVudCBMSUtFICclL3N1bmltcy9wcmlleml1cm9zLXByaWVtb25lcyUnIik7CiAgICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H060'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H060 prieziuros nuorodos',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  snipId=j?j.id:null; out.snip=snipId||'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const rd=await fetch(WP+'/?ps_h060=DRY'); const td=await rd.text();
  try{ out.dry=JSON.parse(td); }catch(e){ out.dry_zalias=td.slice(0,300); }
  const ra=await fetch(WP+'/?ps_h060=APPLY'); const ta=await ra.text();
  try{ out.apply=JSON.parse(ta); }catch(e){ out.apply_zalias=ta.slice(0,300); }
  await new Promise(r=>setTimeout(r,3000));
  out.patikra=[];
  for(const s of ['biglis','cvergsnauceris','dzeko-raselo-terjeras']){
    const x=await fetch('https://dev.avesa.lt/'+s+'/'); const h=await x.text();
    out.patikra.push({s,http:x.status,
      higiena:(h.match(/higienos-priemones-sunims/g)||[]).length,
      sukos:(h.match(/sukos-sepeciai-zirkles-sunims/g)||[]).length,
      senos:(h.match(/prieziuros-priemones/g)||[]).length});
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
try{ if(snipId) await api('/wp-json/code-snippets/v1/snippets/'+snipId,{method:'POST',body:JSON.stringify({id:snipId,active:false})}); }catch(e){}
const zlib=await import('zlib');
await put('screenshots/h060.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h060 prieziuros nuorodos');
