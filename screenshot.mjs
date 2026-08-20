process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE2OSddKSA/ICRfR0VUWydwc19oMTY5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogJG89YXJyYXkoJ3YnPT4nSDE2OScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKSwnUkVaSU1BUyc9PidESUFHTk9TVElLQScpOwogJF9HRVRbJ3BhZ2UnXT0ncHMta2F0YWxvZ2FzJzsgJF9HRVRbJ2tydXZhJ109J3ByZWt5Ym9qZSc7CiAkX0dFVFsndmlldyddPSd6ZW1pYXVfcmlib3MnOyAkX0dFVFsncSddPSdleGNsdXMnOwoKICRmID0gYXJyYXkoCiAgICdrcnV2YSc9PidwcmVreWJvamUnLCd2aWV3Jz0+J3plbWlhdV9yaWJvcycsJ3NhbmQnPT4nJywna2F0Jz0+JycsJ2JyYW5kJz0+JycsCiAgICdsaWt1dGlzJz0+JycsJ21hcnphJz0+JycsJ3RpcGFzJz0+JycsJ3EnPT4nZXhjbHVzJywnc2FsJz0+JycsCiAgICd2YWl6ZGFzJz0+JycsJ3NvcnQnPT4nJywna3J5cCc9PicnLCdwZXInPT41MCwncHNsJz0+MSwKICk7CiAkc2FyID0gYXJyYXkoJ2thdGVnb3Jpam9zJz0+YXJyYXkoJ0thdMSXbXMnKSwnYnJlbmRhaSc9PmFycmF5KCdFeGNsdXNpb24nLCdNb25nZScpKTsKICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0thdGFsb2dhcycpOwogJG09JHJjLT5nZXRNZXRob2QoJ2ZpbHRyYWknKTsgJG0tPnNldEFjY2Vzc2libGUodHJ1ZSk7CiBvYl9zdGFydCgpOwogdHJ5IHsgJG0tPmludm9rZShudWxsLCRmLCRzYXIsJycsJycsNTApOyB9IGNhdGNoKFRocm93YWJsZSAkZSl7IGVjaG8gJ0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAkaHRtbD1vYl9nZXRfY2xlYW4oKTsKCiAkb1snaHRtbF9pbGdpcyddPXN0cmxlbigkaHRtbCk7CiAkb1sncm9kb19maWx0cnVfbmVyYSddID0gKG1iX3N0cnBvcygkaHRtbCwnZmlsdHLFsyBuxJdyYScpIT09ZmFsc2UpID8gJ1RBSVAgKEJMT0dBSSknIDogJ25lIChnZXJhaSknOwogJG9bJ3JvZG9fcGFpZXNrYSddICAgICA9IChtYl9zdHJwb3MoJGh0bWwsJ3BhaWXFoWthOiBleGNsdXMnKSE9PWZhbHNlKSA/ICdUQUlQIChnZXJhaSknIDogJ05FIChibG9nYWkpJzsKICRvWydyb2RvX2VpbGUnXSAgICAgICAgPSAobWJfc3RycG9zKCRodG1sLCfFvmVtaWF1IG1hcsW+b3Mgcmlib3MnKSE9PWZhbHNlKSA/ICdUQUlQIChnZXJhaSknIDogJ05FIChibG9nYWkpJzsKIC8qIGFyIElzdmFseXRpIG51aW1hIHZpZXcgKi8KIGlmKHByZWdfbWF0Y2goJy9jbGFzcz0iY2xlYXIiIGhyZWY9IihbXiJdKykiLycsJGh0bWwsJG1tKSl7CiAgICR1PWh0bWxfZW50aXR5X2RlY29kZSgkbW1bMV0pOwogICAkb1snaXN2YWx5dGlfdXJsJ109JHU7CiAgICRvWydpc3ZhbHl0aV9udWltYV92aWV3J10gPSAoc3RycG9zKCR1LCd2aWV3PScpPT09ZmFsc2UpPydUQUlQIChnZXJhaSknOidORSAoYmxvZ2FpKSc7CiAgICRvWydpc3ZhbHl0aV9udWltYV9xJ10gICAgPSAoc3RycG9zKCR1LCdxPScpPT09ZmFsc2UpPydUQUlQIChnZXJhaSknOidORSAoYmxvZ2FpKSc7CiB9IGVsc2UgeyAkb1snaXN2YWx5dGlfdXJsJ109J05FUkFTVEEnOyB9CiAvKiBzYW50cmF1a29zIGVpbHV0ZSAqLwogaWYocHJlZ19tYXRjaCgnLzxkaXYgY2xhc3M9ImZybGluZSBmcmwtc2FudCI+KC4qPyk8XC9kaXY+L3MnLCRodG1sLCRzKSl7CiAgICRvWydzYW50cmF1a2EnXT10cmltKHByZWdfcmVwbGFjZSgnL1xzKy8nLCcgJyx3cF9zdHJpcF9hbGxfdGFncygkc1sxXSkpKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H169'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H169 Monge merge APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rA=await fetch(WP+'/?ps_h169=GO'); const tA=await rA.text();
  try{ out.A=JSON.parse(tA); }catch(e){ out.A={ZALIAS:tA.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h169.json', Buffer.from(JSON.stringify(out,null,1)), 'h169 Monge merge APPLY');
