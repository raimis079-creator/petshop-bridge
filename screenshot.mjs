process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRhPWlzc2V0KCRfR0VUWydwc19oMDU3J10pPyRfR0VUWydwc19oMDU3J106Jyc7IGlmKCFpbl9hcnJheSgkYSxhcnJheSgnVEFJS1lUSScsJ05VT1RSQVVLT1MnKSx0cnVlKSkgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDkwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNTcnLCdhJz0+JGEpOwoKIGlmKCRhPT09J05VT1RSQVVLT1MnKXsKICAgLyogVklTQVMgdHVyaW55cyBzdSBzZW5vcyBzdmV0YWluZXMgcGF2ZWlrc2xhaXMgKi8KICAgJGVpbD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X3R5cGUscG9zdF9uYW1lLHBvc3RfdGl0bGUscG9zdF9jb250ZW50IEZST00geyRQfXBvc3RzCiAgICAgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCAocG9zdF9jb250ZW50IExJS0UgJyVwZXRzaG9wLmx0L2ltYWdlLyUnCiAgICAgICAgT1IgcG9zdF9jb250ZW50IExJS0UgJyVwZXRzaG9wLmx0L2NhY2hlLyUnKSIsIEFSUkFZX0EpOwogICAkb1snaXJhc3UnXT1jb3VudCgkZWlsKTsgJG9bJ2RldGFsZXMnXT1hcnJheSgpOyAkdmlzbz0wOyAkdW5paz1hcnJheSgpOwogICBmb3JlYWNoKCRlaWwgYXMgJHIpewogICAgIHByZWdfbWF0Y2hfYWxsKCcjaHR0cHM/Oi8vKD86d3d3XC4pP3BldHNob3BcLmx0KC8oPzppbWFnZXxjYWNoZSkvW14iXCdccz4pXSspI2knLCRyWydwb3N0X2NvbnRlbnQnXSwkbSk7CiAgICAgJG49Y291bnQoJG1bMV0pOyAkdmlzbys9JG47CiAgICAgZm9yZWFjaCgkbVsxXSBhcyAkdSkgJHVuaWtbJHVdPTE7CiAgICAgJG9bJ2RldGFsZXMnXVtdPWFycmF5KCdpZCc9PihpbnQpJHJbJ0lEJ10sJ3RpcGFzJz0+JHJbJ3Bvc3RfdHlwZSddLCdzbHVnJz0+JHJbJ3Bvc3RfbmFtZSddLAogICAgICAgJ3Bhdic9Pm1iX3N1YnN0cigkclsncG9zdF90aXRsZSddLDAsNDQpLCdudW90cmF1a3UnPT4kbiwncHZ6Jz0+YXJyYXlfc2xpY2UoJG1bMV0sMCwyKSk7CiAgIH0KICAgJG9bJ251b3RyYXVrdV92aXNvJ109JHZpc287ICRvWyd1bmlrYWxpdSddPWNvdW50KCR1bmlrKTsKICAgJG9bJ3VuaWtfc2FyYXNhcyddPWFycmF5X3NsaWNlKGFycmF5X2tleXMoJHVuaWspLDAsNjApOwogICAvKiBhciB0b3MgcGFjaW9zIG51b3RyYXVrb3MgamF1IHlyYSBtZWRpYXRla29qZSBwYWdhbCBmYWlsbyB2YXJkYSAqLwogICAkcmFzdGE9MDsKICAgZm9yZWFjaChhcnJheV9rZXlzKCR1bmlrKSBhcyAkdSl7CiAgICAgJGY9cHJlZ19yZXBsYWNlKCcvLVxkK3hcZCsoX1xkKyk/KFwuXHcrKSQvJywnJDInLCBiYXNlbmFtZSgkdSkpOwogICAgICRmPXByZWdfcmVwbGFjZSgnL1wuXHcrJC8nLCcnLCRmKTsKICAgICAkeD0kd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIElEIEZST00geyRQfXBvc3RzIFdIRVJFIHBvc3RfdHlwZT0nYXR0YWNobWVudCcKICAgICAgIEFORCBwb3N0X25hbWUgTElLRSAlcyBMSU1JVCAxIiwgJyUnLiR3cGRiLT5lc2NfbGlrZShzdWJzdHIoJGYsMCw0MCkpLiclJykpOwogICAgIGlmKCR4KSAkcmFzdGErKzsKICAgfQogICAkb1snamF1X21lZGlhdGVrb2plJ109JHJhc3RhOwogfQoKIGlmKCRhPT09J1RBSUtZVEknKXsKICAgJHplbT1qc29uX2RlY29kZShAZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLW1hcC5qc29uJyksIHRydWUpOwogICBpZighaXNfYXJyYXkoJHplbSkpICR6ZW09YXJyYXkoKTsKICAgJGVpbD0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBJRCxwb3N0X25hbWUscG9zdF9jb250ZW50IEZST00geyRQfXBvc3RzCiAgICAgV0hFUkUgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwb3N0X3R5cGUgSU4gKCdwYWdlJywncG9zdCcpCiAgICAgQU5EIHBvc3RfY29udGVudCBMSUtFICclLy9wZXRzaG9wLmx0LyUnIiwgQVJSQVlfQSk7CiAgICR1cD13cF91cGxvYWRfZGlyKCk7ICRkPSR1cFsnYmFzZWRpciddLicvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGQpKSBAbWtkaXIoJGQsMDc1NSx0cnVlKTsKICAgJGtvcD1hcnJheSgpOwogICBmb3JlYWNoKCRlaWwgYXMgJHIpICRrb3BbJHJbJ0lEJ11dPWFycmF5KCdzbHVnJz0+JHJbJ3Bvc3RfbmFtZSddLCd0dXJpbnlzJz0+JHJbJ3Bvc3RfY29udGVudCddKTsKICAgJGY9JGQuJy9zdHJhaXBzbml1X3R1cmlueXNfcHJpZXNfJy5kYXRlKCdZbWRfSGlzJykuJy5qc29uJzsKICAgQGZpbGVfcHV0X2NvbnRlbnRzKCRmLCB3cF9qc29uX2VuY29kZSgka29wKSk7CiAgICRvWydrb3BpamEnXT1AZmlsZV9leGlzdHMoJGYpP2Jhc2VuYW1lKCRmKTonTkVQQVZZS08nOwogICBpZigkb1sna29waWphJ109PT0nTkVQQVZZS08nKXsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7IH0KCiAgICRwYWs9MDsgJGlyYXN1PTA7ICRsaWtvPTA7CiAgIGZvcmVhY2goJGVpbCBhcyAkcil7CiAgICAgJGM9JHJbJ3Bvc3RfY29udGVudCddOyAkc2VuYXM9JGM7CiAgICAgcHJlZ19tYXRjaF9hbGwoJyNodHRwcz86Ly8oPzp3d3dcLik/cGV0c2hvcFwubHQoL1teIlwnXHM+KV0qKSNpJywkYywkbSk7CiAgICAgZm9yZWFjaChhcnJheV91bmlxdWUoJG1bMF0pIGFzICRpPT4kcGlsbmFzKXsKICAgICAgICRrZWxpYXM9cGFyc2VfdXJsKCRwaWxuYXMsUEhQX1VSTF9QQVRIKTsKICAgICAgIGlmKHByZWdfbWF0Y2goJyNeLyhpbWFnZXxjYWNoZSkvIycsJGtlbGlhcykpIHsgJGxpa28rKzsgY29udGludWU7IH0gIC8qIG51b3RyYXVrb3MgTkVMSUVDSUFNT1MgKi8KICAgICAgICRzdz1zdHJ0b2xvd2VyKHRyaW0oc3RydG9rKCRrZWxpYXMsJz8nKSwnLycpKTsKICAgICAgIGlmKCRzdz09PScnKXsgJGM9c3RyX3JlcGxhY2UoJHBpbG5hcywnLycsJGMpOyAkcGFrKys7IGNvbnRpbnVlOyB9CiAgICAgICBpZighaXNzZXQoJHplbVskc3ddKSl7ICRsaWtvKys7IGNvbnRpbnVlOyB9CiAgICAgICAkdj0kemVtWyRzd107ICR0PW51bGw7CiAgICAgICBpZihzdHJwb3MoJHYsJ19fVEVSTV9fJyk9PT0wKXsgJHR0PWdldF90ZXJtKChpbnQpc3Vic3RyKCR2LDgpLCdwcm9kdWN0X2NhdCcpOwogICAgICAgICBpZigkdHQgJiYgIWlzX3dwX2Vycm9yKCR0dCkpICR0PXBhcnNlX3VybChnZXRfdGVybV9saW5rKCR0dCksUEhQX1VSTF9QQVRIKTsgfQogICAgICAgZWxzZSAkdD0kdjsKICAgICAgIGlmKCEkdCl7ICRsaWtvKys7IGNvbnRpbnVlOyB9CiAgICAgICAkYz1zdHJfcmVwbGFjZSgkcGlsbmFzLCR0LCRjKTsgJHBhaysrOwogICAgIH0KICAgICBpZigkYyE9PSRzZW5hcyl7CiAgICAgICAkd3BkYi0+dXBkYXRlKCRQLidwb3N0cycsYXJyYXkoJ3Bvc3RfY29udGVudCc9PiRjKSxhcnJheSgnSUQnPT4kclsnSUQnXSkpOwogICAgICAgY2xlYW5fcG9zdF9jYWNoZSgkclsnSUQnXSk7ICRpcmFzdSsrOwogICAgIH0KICAgfQogICAkb1sncGFrZWlzdGFfbnVvcm9kdSddPSRwYWs7ICRvWydpcmFzdV9hdG5hdWppbnRhJ109JGlyYXN1OyAkb1snbGlrb19uZXBhbGllc3R1J109JGxpa287CiAgICRvWydkYXJfc3Vfc2Vub21pcyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH1wb3N0cwogICAgIFdIRVJFIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG9zdF90eXBlIElOICgncGFnZScsJ3Bvc3QnKSBBTkQgcG9zdF9jb250ZW50IExJS0UgJyUvL3BldHNob3AubHQvJSciKTsKICAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H057'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H057 nuorodu taisymas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  snipId=j?j.id:null; out.snip=snipId||'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const rn=await fetch(WP+'/?ps_h057=NUOTRAUKOS'); const tn=await rn.text();
  try{ out.nuotraukos=JSON.parse(tn); }catch(e){ out.nuotr_zalias=tn.slice(0,300); }
  const rt=await fetch(WP+'/?ps_h057=TAIKYTI'); const tt=await rt.text();
  try{ out.taikymas=JSON.parse(tt); }catch(e){ out.taik_zalias=tt.slice(0,300); }
  await new Promise(r=>setTimeout(r,3000));
  /* patikra: keliu straipsniu nuorodos gyvai */
  out.patikra=[];
  for(const s of ['jorksyro-terjeras','taksas','monoproteininis-maistas-sunims-kas-tai-ir-kada-verta-rinktis']){
    try{
      const x=await fetch('https://dev.avesa.lt/'+s+'/'); const h=await x.text();
      const sen=(h.match(/https?:\/\/(www\.)?petshop\.lt\//g)||[]).length;
      const kat=(h.match(/href="\/kategorija\//g)||[]).length;
      const pr=(h.match(/href="\/product\//g)||[]).length;
      const gam=(h.match(/href="\/gamintojas\//g)||[]).length;
      out.patikra.push({s,http:x.status,senos:sen,i_kat:kat,i_prekes:pr,i_gam:gam});
    }catch(e){ out.patikra.push({s,kl:String(e).slice(0,60)}); }
  }
}catch(e){ out.klaida=String(e).slice(0,300); }
try{ if(snipId) await api('/wp-json/code-snippets/v1/snippets/'+snipId,{method:'POST',body:JSON.stringify({id:snipId,active:false})}); }catch(e){}
const zlib=await import('zlib');
await put('screenshots/h057.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h057 nuorodu taisymas');
