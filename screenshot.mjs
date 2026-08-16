process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdWQVIxJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkbz1hcnJheSgndic9PidQMFQtVkFSSUtMSVMnKTsKCiAvKiAxLiBLYWlwIE04IHNrYWl0byBwcm9kdWt0byBwb3p5bWl1cyDigJQgaXMgcHJvZHVjdF9wYXlsb2FkIGlyIGlzX2Zvb2RfZm9yICovCiAkaz1AZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1tOC1mb29kLnBocCcpOwogZm9yZWFjaCAoYXJyYXkoJ3Byb2R1Y3RfcGF5bG9hZCcsJ2lzX2Zvb2RfZm9yJywnc3BlY2llc19jYXQnKSBhcyAkZm4pIHsKICAgaWYgKHByZWdfbWF0Y2goJy9mdW5jdGlvblxzKycuJGZuLidccypcKFteKV0qXClccypcey8nLCRrLCRtLFBSRUdfT0ZGU0VUX0NBUFRVUkUpKSB7CiAgICAgJG9bJ2ZuXycuJGZuXT1zdWJzdHIoJGssJG1bMF1bMV0sMTYwMCk7CiAgIH0KIH0KCiAvKiAyLiBBa3R1YWxpb3MgdGFrc29ub21pam9zIGlyIHRlcm1pbmFpICovCiBmb3JlYWNoIChhcnJheSgncGFfc3BlY2lhbGlfbWl0eWJhJywncGFfYW16aXVzJywncGFfZ3l2dW5vX3J1c2lzJywncGFfYmFsdHltdV9zYWx0aW5pcycsJ3BhX2JlX2dydWR1JywncGFfbW9ub3Byb3RlaW5hcycpIGFzICR0eCkgewogICBpZiAoIXRheG9ub215X2V4aXN0cygkdHgpKSB7ICRvWyd0YXgnXVskdHhdPSdORVJBJzsgY29udGludWU7IH0KICAgJHRzPWdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4kdHgsJ2hpZGVfZW1wdHknPT5mYWxzZSwnbnVtYmVyJz0+NjApKTsKICAgJHI9YXJyYXkoKTsgZm9yZWFjaCgoYXJyYXkpJHRzIGFzICR0KXsgJHJbXT0kdC0+c2x1Zy4nOicuJHQtPmNvdW50OyB9CiAgICRvWyd0YXgnXVskdHhdPSRyOwogfQoKIC8qIDMuIFNlcmltbyBsZW50ZWxpdSBhcHJlcGlhbXVtYXM6IHZlcmlmaWVkIG1hcCB4IHB1Ymxpc2ggeCBzdG9jaywgcGFnYWwgcnVzaSAqLwogJG9bJ2ZlZWRpbmdfY292ZXInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIgogICBTRUxFQ1QgdHJfcnVzLnNsdWcgcnVzaXMsIENPVU5UKERJU1RJTkNUIHAuSUQpIG4KICAgRlJPTSB7JFB9cG9zdHMgcAogICBKT0lOIHskUH1wc19mZWVkaW5nX21hcCBmbSBPTiBmbS5wcm9kdWN0X2lkPXAuSUQgQU5EIGZtLmlzX2FjdGl2ZT0xCiAgIEpPSU4geyRQfXBzX2ZlZWRpbmdfdGFibGVzIGZ0IE9OIGZ0LmlkPWZtLmZlZWRpbmdfdGFibGVfaWQgQU5EIGZ0LnN0YXR1cz0ndmVyaWZpZWQnIEFORCBmdC5pc19hY3RpdmU9MQogICBMRUZUIEpPSU4geyRQfXRlcm1fcmVsYXRpb25zaGlwcyB0cnIgT04gdHJyLm9iamVjdF9pZD1wLklECiAgIExFRlQgSk9JTiB7JFB9dGVybV90YXhvbm9teSB0dF9ydXMgT04gdHRfcnVzLnRlcm1fdGF4b25vbXlfaWQ9dHJyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0X3J1cy50YXhvbm9teT0ncGFfZ3l2dW5vX3J1c2lzJwogICBMRUZUIEpPSU4geyRQfXRlcm1zIHRyX3J1cyBPTiB0cl9ydXMudGVybV9pZD10dF9ydXMudGVybV9pZAogICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnCiAgIEdST1VQIEJZIHRyX3J1cy5zbHVnIiwgQVJSQVlfQSk7CgogLyogNC4gcHJpbWFyeV9uZWVkIHJlaWtzbWVzIE04IGtvZGUgKGVudW0pICovCiBpZiAocHJlZ19tYXRjaF9hbGwoIi8nKGRpZ2VzdGlvbnx3ZWlnaHRfY29udHJvbHxwaWNreV9lYXRlcnxza2luX2NvYXR8am9pbnRzfHVyaW5hcnl8ZGVudGFsfHN0ZXJpbGlzZWR8bm9uZSknLyIsJGssJHBtKSkgewogICAkb1snbmVlZF9rb2RlJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkcG1bMV0pKTsKIH0KICRrcD1AZmlsZV9nZXRfY29udGVudHMoV1BfQ09OVEVOVF9ESVIuJy9wbHVnaW5zL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1wZXQtcHJvZmlsZS5waHAnKTsKIGlmICgka3AgJiYgcHJlZ19tYXRjaCgnL3ByaW1hcnlfbmVlZFteKV17MCw0MDB9L3MnLCRrcCwkbm0pKSAkb1snbmVlZF9wcm9maWxlJ109c3Vic3RyKCRubVswXSwwLDM4MCk7CgogLyogNS4gamF1dHJ1bXUgem9keW5hcyBhbmtldG9qZSAocGV0LWZvcm0uanMgcGlsbCB2YWx1ZXMpICovCiAkanM9QGZpbGVfZ2V0X2NvbnRlbnRzKFdQX0NPTlRFTlRfRElSLicvcGx1Z2lucy9wZXRzaG9wLWNvcmUvYXNzZXRzL3BldC1mb3JtLmpzJyk7CiBpZiAoJGpzICYmIHByZWdfbWF0Y2hfYWxsKCIvJyhjaGlja2VufGJlZWZ8bGFtYnxmaXNofGRhaXJ5fGdyYWluc3xlZ2d8cG9ya3xzYWxtb258dHVya2V5fGR1Y2spJy8iLCRqcywkam0pKSB7CiAgICRvWydzZW5zX3VpJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkam1bMV0pKTsKIH0KIC8qIGJhbHR5bXUgc2FsdGluaW8gdGVybWludSBwYXZ5emR6aWFpIGplaSB0YWtzb25vbWlqYSBraXRhICovCiAkdmlzb3M9Z2V0X3RheG9ub21pZXMoYXJyYXkoKSwnbmFtZXMnKTsKICRvWydwYV92aXNvcyddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoJHZpc29zLGZ1bmN0aW9uKCR0KXtyZXR1cm4gc3RycG9zKCR0LCdwYV8nKT09PTA7fSkpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'P0T-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0t.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0t variklis recon',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0t.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  // 1. isjungiam visus likusius TEMP snippetus
  const lst=await api('/wp-json/code-snippets/v1/snippets');
  let arr=[]; try{arr=JSON.parse(lst.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of arr){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); out.temp_isjungta.push(s.id); } }
  // 2. recon snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0T VARIKLIS',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,7000));
  try{ const r=await fetch(WP+'/?ps_p0=VAR1'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
