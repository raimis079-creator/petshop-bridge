process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfaTEnXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnaTFmNnIzJykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkb3V0PVsnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpXTsKICAkcm93PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxvcHRpb25zIEZST00geyR3cGRiLT5wcmVmaXh9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTEiLCBBUlJBWV9BKTsKICBpZighJHJvdyl7IHdwX3NlbmRfanNvbihbJ2tsYWlkYSc9PicjMSBuZXJhc3RhcyddKTsgfQogICRvPUB1bnNlcmlhbGl6ZSgkcm93WydvcHRpb25zJ10pOwogIGlmKCFpc19hcnJheSgkbykpeyB3cF9zZW5kX2pzb24oWydrbGFpZGEnPT4ndW5zZXJpYWxpemUgbmVwYXZ5a28g4oCUIE5FS0VJU1RBJ10pOyB9CgogIC8vIEFUU0FSR0lORSBLT1BJSkEKICB1cGRhdGVfb3B0aW9uKCdwc193cGFpMV9iYWtfJy5kYXRlKCdZbWQnKSwgYmFzZTY0X2VuY29kZSgkcm93WydvcHRpb25zJ10pLCBmYWxzZSk7CiAgJG91dFsnYXRzYXJnaW5lJ109c3RybGVuKCRyb3dbJ29wdGlvbnMnXSkuJyBCJzsKCiAgJHByaWVzPVsKICAgICd1cGRhdGVfYWxsX2RhdGEnPT4kb1sndXBkYXRlX2FsbF9kYXRhJ10/P251bGwsCiAgICAnaXNfdXBkYXRlX2NhdGVnb3JpZXMnPT4kb1snaXNfdXBkYXRlX2NhdGVnb3JpZXMnXT8/bnVsbCwKICAgICd1cGRhdGVfY2F0ZWdvcmllc19sb2dpYyc9PiRvWyd1cGRhdGVfY2F0ZWdvcmllc19sb2dpYyddPz9udWxsLAogICAgJ2lzX3VwZGF0ZV9hdHRyaWJ1dGVzJz0+JG9bJ2lzX3VwZGF0ZV9hdHRyaWJ1dGVzJ10/P251bGwsCiAgICAndXBkYXRlX2F0dHJpYnV0ZXNfbG9naWMnPT4kb1sndXBkYXRlX2F0dHJpYnV0ZXNfbG9naWMnXT8/bnVsbCwKICBdOwogICRvdXRbJ1BSSUVTJ109JHByaWVzOwoKICAvKiBVenN1a2FtIGNpYXVwYTogaW1wb3J0YXMgbmViZWxpZWNpYSB0YWtzb25vbWlqdSBpciBhdHJpYnV0dS4KICAgICBUYXMgcGF0cyBudXN0YXR5bWFzLCBrYWlwICMyLCAjMywgIzUsICM3IGphdSB0dXJpLiAqLwogICRvWydpc191cGRhdGVfY2F0ZWdvcmllcyddPTA7CiAgJG9bJ2lzX3VwZGF0ZV9hdHRyaWJ1dGVzJ109MDsKICAvKiB1cGRhdGVfYWxsX2RhdGE9eWVzIHJlaXNraWEgImF0bmF1amludGkgdmlza2EiIOKAlCBzdSBqdW8gcGlybWkgZHUKICAgICBudXN0YXR5bWFpIGdhbGkgYnV0aSBpZ25vcnVvamFtaSwgdG9kZWwgamkgaXJnaSBudWltYW0uICovCiAgJG9bJ3VwZGF0ZV9hbGxfZGF0YSddPSdubyc7CgogICRzZXI9c2VyaWFsaXplKCRvKTsKICAkYXRnYWw9QHVuc2VyaWFsaXplKCRzZXIpOwogIGlmKCFpc19hcnJheSgkYXRnYWwpKXsgd3Bfc2VuZF9qc29uKFsna2xhaWRhJz0+J3NlcmlhbGl6ZSBwYXRpa3JhIG5lcHJhZWpvIOKAlCBORUtFSVNUQSddKTsgfQoKICAkdXBkPSR3cGRiLT51cGRhdGUoJHdwZGItPnByZWZpeC4ncG14aV9pbXBvcnRzJyxbJ29wdGlvbnMnPT4kc2VyXSxbJ2lkJz0+MV0pOwogICRvdXRbJ2RiX3VwZCddPSR1cGQ7CgogIC8vIFBBVElLUkEgaXMgbmF1am8gaXMgREIKICAkcm93Mj0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIG9wdGlvbnMgRlJPTSB7JHdwZGItPnByZWZpeH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9MSIsIEFSUkFZX0EpOwogICRvMj1AdW5zZXJpYWxpemUoJHJvdzJbJ29wdGlvbnMnXSk7CiAgJG91dFsnUE8nXT1bCiAgICAndW5zZXJpYWxpemUnPT5pc19hcnJheSgkbzIpPydUQUlQJzonTkUnLAogICAgJ3VwZGF0ZV9hbGxfZGF0YSc9PiRvMlsndXBkYXRlX2FsbF9kYXRhJ10/P251bGwsCiAgICAnaXNfdXBkYXRlX2NhdGVnb3JpZXMnPT4kbzJbJ2lzX3VwZGF0ZV9jYXRlZ29yaWVzJ10/P251bGwsCiAgICAnaXNfdXBkYXRlX2F0dHJpYnV0ZXMnPT4kbzJbJ2lzX3VwZGF0ZV9hdHRyaWJ1dGVzJ10/P251bGwsCiAgICAvLyBraXRpIG51c3RhdHltYWkgTkVQQUxJRVNUST8KICAgICdpc191cGRhdGVfY3VzdG9tX2ZpZWxkcyc9PiRvMlsnaXNfdXBkYXRlX2N1c3RvbV9maWVsZHMnXT8/bnVsbCwKICAgICd1cGRhdGVfY3VzdG9tX2ZpZWxkc19sb2dpYyc9PiRvMlsndXBkYXRlX2N1c3RvbV9maWVsZHNfbG9naWMnXT8/bnVsbCwKICAgICdjcmVhdGVfbmV3X3JlY29yZHMnPT4kbzJbJ2NyZWF0ZV9uZXdfcmVjb3JkcyddPz9udWxsLAogIF07CiAgLy8gUGFseWdpbmFtIHZpc3UgS0lUVSByYWt0dSBraWVraSDigJQgYXIgbmlla28gbmVkaW5nbwogICRvdXRbJ3Jha3R1X3ByaWVzJ109Y291bnQoJG8pOyAkb3V0WydyYWt0dV9wbyddPWNvdW50KCRvMik7CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'imp1 fix', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP imp1 fix', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/imp1.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_i1=1&k=i1f6r3`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  await putResult('analize/imp1.json', out);
}
main().catch(async e=>{ await putResult('analize/imp1.json',{klaida:String(e)}); });
