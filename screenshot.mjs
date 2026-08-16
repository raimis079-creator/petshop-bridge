process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const D64=''; const V64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdTSUdDJykgcmV0dXJuOwogJG89YXJyYXkoJ3YnPT4nU0lHJyk7CiBmb3JlYWNoIChhcnJheShhcnJheSgnUGV0c2hvcF9QZXRfUHJvZmlsZScsJ2NyZWF0ZV9wZXRfcmVzdWx0JyksYXJyYXkoJ1BldHNob3BfTWFnaWNfTG9naW4nLCdjbGFpbV9kcmFmdCcpLGFycmF5KCdQZXRzaG9wX1BldF9EcmFmdHMnLCdiZWdpbl9jbGFpbScpKSBhcyAkeCkgewogICB0cnl7CiAgICAgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJHhbMF0sJHhbMV0pOwogICAgICRwcz1hcnJheSgpOwogICAgIGZvcmVhY2goJHItPmdldFBhcmFtZXRlcnMoKSBhcyAkcCl7CiAgICAgICAkdD0kcC0+Z2V0VHlwZSgpOyAkcHNbXT0oJHQ/KChzdHJpbmcpJHQpLicgJzonJykuJyQnLiRwLT5nZXROYW1lKCkuKCRwLT5pc09wdGlvbmFsKCk/Jz1vcHQnOicnKTsKICAgICB9CiAgICAgJG9bJHhbMV1dPWFycmF5KCdwcml2YXR1cyc9PiRyLT5pc1ByaXZhdGUoKSwnc3RhdGluaXMnPT4kci0+aXNTdGF0aWMoKSwncGFyYW0nPT4kcHMpOwogICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJHhbMV1dPSdORVJBOiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0KIH0KICRrPUBmaWxlX2dldF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLXBldC1wcm9maWxlLnBocCcpOwogaWYoJGsgJiYgcHJlZ19tYXRjaCgnL2Z1bmN0aW9uXHMrY3JlYXRlX3BldF9yZXN1bHRccypcKFteKV0qXClbXntdKlx7LycsJGssJG0sUFJFR19PRkZTRVRfQ0FQVFVSRSkpewogICAkb1snY3JlYXRlX3BldF9yZXN1bHRfa3VuYXMnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRrLCRtWzBdWzFdLDgwMCkpOwogfQogJGttPUBmaWxlX2dldF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4nL3BsdWdpbnMvcGV0c2hvcC1jb3JlL2luY2x1ZGVzL2NsYXNzLW1hZ2ljLWxvZ2luLnBocCcpOwogaWYoJGttICYmIHByZWdfbWF0Y2goJy9mdW5jdGlvblxzK2NsYWltX2RyYWZ0XHMqXChbXildKlwpW157XSpcey8nLCRrbSwkbTIsUFJFR19PRkZTRVRfQ0FQVFVSRSkpewogICAkb1snY2xhaW1fZHJhZnRfa3VuYXMnXT1wcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3Vic3RyKCRrbSwkbTJbMF1bMV0sMTQwMCkpOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'P1C-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1c4.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0z ivykiai deploy+verify',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p1c4.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s2=await snip('TEMP P1C MAGICTEST',V64);
  await new Promise(r=>setTimeout(r,7000));
  try{ {const _t=await (await fetch(WP+'/?ps_p0=SIGC')).text(); try{out.verify=JSON.parse(_t);}catch(e){out.raw=_t.slice(0,1500);}} }catch(e){ out.e2=String(e).slice(0,300); }
  await off(s2);
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
