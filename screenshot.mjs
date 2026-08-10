process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcmVzJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3JzMnY5aycpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgLy8ga3VyIHNrYWljaXVvamFtYXMgY291cmllcl9vbmx5CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgaWYoc3RycG9zKCRjLCdjb3VyaWVyX29ubHknKT09PWZhbHNlKSBjb250aW51ZTsKICAgICRsaW5lcz1leHBsb2RlKCJcbiIsJGMpOyAkaGl0cz1bXTsKICAgIGZvcmVhY2goJGxpbmVzIGFzICRpPT4kTCl7CiAgICAgIGlmKHByZWdfbWF0Y2goIi9jb3VyaWVyX29ubHlccyonP1xdP1xzKj1bXj1dLyIsJEwpfHxzdHJwb3MoJEwsIidjb3VyaWVyX29ubHknID0+IikhPT1mYWxzZSkKICAgICAgICAkaGl0c1tdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRMLDAsMTQwKSk7CiAgICB9CiAgICBpZigkaGl0cykgJG91dFsncHJpc2t5cmltYWknXVtiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRoaXRzLDAsOCk7CiAgfQogIC8vIGFyIHJlc29sdmVyaXMgeXJhIGtsYXNlL2Z1bmtjaWphCiAgZm9yZWFjaChbJ1BldHNob3BfRnVsZmlsbG1lbnQnLCdwZXRzaG9wX2Z1bGZpbGxtZW50X3Jlc29sdmUnLCdQZXRzaG9wX0FWX1NvdXJjZSddIGFzICR4KXsKICAgICRvdXRbJ2VnemlzdHVvamEnXVskeF09KGNsYXNzX2V4aXN0cygkeCl8fGZ1bmN0aW9uX2V4aXN0cygkeCkpPyd0YWlwJzonbmUnOwogIH0KICAvLyBzbmlwcGV0dW9zZQogICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBjb2RlIExJS0UgJyVjb3VyaWVyX29ubHklJyIsIEFSUkFZX0EpOwogICRvdXRbJ2FrdHl2dXNfc25pcHBldGFpJ109JHNuOwogIGZvcmVhY2goJHNuIGFzICRzKXsKICAgICRjb2RlPSR3cGRiLT5nZXRfdmFyKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPSVkIiwkc1snaWQnXSkpOwogICAgJGxpbmVzPWV4cGxvZGUoIlxuIiwkY29kZSk7ICRoPVtdOwogICAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRMKXsgaWYoc3RycG9zKCRMLCdjb3VyaWVyX29ubHknKSE9PWZhbHNlKSAkaFtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRMLDAsMTMwKSk7IH0KICAgICRvdXRbJ3NuaXBwZXRvXycuJHNbJ2lkJ11dPWFycmF5X3NsaWNlKCRoLDAsMTApOwogIH0KICAvLyB0ZXN0YXM6IGthaXAgcmVzb2x2ZXJpcyBhdHNha28ga29ua3JlY2lhaSBwcmVrZWkgKHR1YWxldGFzKQogICR0dWFsPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBJRCBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvc3RfdGl0bGUgTElLRSAnJXR1YWxldGFzJScgQU5EIHBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBMSU1JVCAxIik7CiAgaWYoJHR1YWwgJiYgY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1NvdXJjZScpKXsKICAgICRtPWdldF9jbGFzc19tZXRob2RzKCdQZXRzaG9wX0FWX1NvdXJjZScpOwogICAgJG91dFsnYXZfc291cmNlX21ldG9kYWknXT0kbTsKICAgIGZvcmVhY2goWydyZXNvbHZlJywnZ2F1dGknLCdmdWxmaWxsbWVudCddIGFzICRtbSl7CiAgICAgIGlmKGluX2FycmF5KCRtbSwoYXJyYXkpJG0sdHJ1ZSkpewogICAgICAgIHRyeXsgJG91dFsndHVhbGV0b19yZXNvbHZlcmlzJ109UGV0c2hvcF9BVl9Tb3VyY2U6OiRtbSgkdHVhbCk7IH1jYXRjaChUaHJvd2FibGUgJHQpeyAkb3V0Wyd0dWFsZXRvX3Jlc29sdmVyaXMnXT0na2xhaWRhOiAnLiR0LT5nZXRNZXNzYWdlKCk7IH0KICAgICAgICBicmVhazsKICAgICAgfQogICAgfQogIH0KICAkb3V0Wyd0dWFsZXRvX2lkJ109JHR1YWw7CiAgJG91dFsndHVhbGV0b19zdm9yaXMnXT0kdHVhbD9nZXRfcG9zdF9tZXRhKCR0dWFsLCdfd2VpZ2h0Jyx0cnVlKTonJzsKICAkb3V0Wyd0dWFsZXRvX21hdG1lbnlzJ109JHR1YWw/W2dldF9wb3N0X21ldGEoJHR1YWwsJ19sZW5ndGgnLHRydWUpLGdldF9wb3N0X21ldGEoJHR1YWwsJ193aWR0aCcsdHJ1ZSksZ2V0X3Bvc3RfbWV0YSgkdHVhbCwnX2hlaWdodCcsdHJ1ZSldOltdOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'kurj', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP res', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/res.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_res=1&k=rs2v9k`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/res.json', out);
}
main().catch(async e=>{ await putResult('analize/res.json',{klaida:String(e)}); });
