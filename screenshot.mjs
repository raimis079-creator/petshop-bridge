process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfbW9ubyddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdtbjZyMngnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwoKICAvLyAxLiBLaWVrIGlzIHp1cm5hbG8geXJhIG1vbm9wcm90ZWluCiAgJHo9Z2V0X29wdGlvbigncHNfcGFyc2VyaW9fenVybmFsYXMnLFtdKTsKICAkbW9ubz1bXTsgJGtpdGk9MDsKICBmb3JlYWNoKChhcnJheSkkeiBhcyAkZSl7IGlmKCgkZVsndGF4J10/PycnKT09PSdwYV9tb25vcHJvdGVpbicpICRtb25vW109JGU7IGVsc2UgJGtpdGkrKzsgfQogICRvdXRbJ3p1cm5hbGVfdmlzbyddPWNvdW50KCR6KTsKICAkb3V0Wyd6dXJuYWxlX21vbm9wcm90ZWluJ109Y291bnQoJG1vbm8pOwogICRvdXRbJ3p1cm5hbGVfa2l0aSddPSRraXRpOwogICRwYWdhbD1bXTsgZm9yZWFjaCgkbW9ubyBhcyAkbSl7ICRyPSRtWydyZWlrc21lJ107ICRwYWdhbFskcl09KCRwYWdhbFskcl0/PzApKzE7IH0KICAkb3V0Wydtb25vX3BhZ2FsX3JlaWtzbWUnXT0kcGFnYWw7CgogIC8vIDIuIEtpZWsgaXMgIlRhaXAiIHR1cmkgR0xJVElNTyBncnVkdSDigJQgUmFpbWlvIHRhaXN5a2xlCiAgJGdsaXRpbWFzPVsna3ZpZcSNaWFpJywna3ZpZcSNacWzJywna3ZpZXRpbicsJ21pZcW+aWFpJywnbWllxb5pxbMnLCdydWdpJywnYXZpxb5vcycsJ2F2acW+xbMnLCdnbGl0aW0nLCdnbHV0ZW4nXTsKICAkdGlrcmludGE9MDsgJHN1X2dsaXRpbXU9MDsgJHB2ej1bXTsKICBmb3JlYWNoKCRtb25vIGFzICRtKXsKICAgIGlmKCRtWydyZWlrc21lJ10hPT0nVGFpcCcpIGNvbnRpbnVlOwogICAgJHRpa3JpbnRhKys7CiAgICBpZigkdGlrcmludGE+NDAwKSBicmVhazsKICAgICRwbz1nZXRfcG9zdCgkbVsncGlkJ10pOyBpZighJHBvKSBjb250aW51ZTsKICAgICR0PXdwX3N0cmlwX2FsbF90YWdzKChzdHJpbmcpJHBvLT5wb3N0X2NvbnRlbnQpOwogICAgJHN1ZD1QZXRzaG9wX1BhcnNlcmlzOjpzdWRldGllc19zZWtjaWphKCR0KTsKICAgICRrdXI9JHN1ZCE9PW51bGw/JHN1ZDokdDsKICAgICRyYWRvPW51bGw7CiAgICBmb3JlYWNoKCRnbGl0aW1hcyBhcyAkZyl7ICRmPVBldHNob3BfUGFyc2VyaXM6OnJhc3RpKCRrdXIsWyRnXSk7IGlmKCRmKXsgJHJhZG89JGc7IGJyZWFrOyB9IH0KICAgIGlmKCRyYWRvKXsKICAgICAgJHN1X2dsaXRpbXUrKzsKICAgICAgaWYoY291bnQoJHB2eik8MTApICRwdnpbXT1bJ3Bhdic9Pm1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoJHBvLT5wb3N0X3RpdGxlKSwwLDQ0KSwnZ2xpdGltYXMnPT4kcmFkbywKICAgICAgICAnc3VkZXRpcyc9Pm1iX3N1YnN0cigkc3VkPz8nKG7El3JhIHN1ZMSXdGllcyknLDAsMTEwKV07CiAgICB9CiAgfQogICRvdXRbJ1RBSVBfdGlrcmludGEnXT0kdGlrcmludGE7CiAgJG91dFsnVEFJUF9zdV9nbGl0aW11J109JHN1X2dsaXRpbXU7CiAgJG91dFsncHZ6X3N1X2dsaXRpbXUnXT0kcHZ6OwoKICAvLyAzLiBEYWJhcnRpbmlzIHBhZGVuZ2ltYXMKICAkb3V0WydkYWJhcl9wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHRyLm9iamVjdF9pZCkgRlJPTSB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIKICAgIElOTkVSIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgQU5EIHR0LnRheG9ub215PSdwYV9tb25vcHJvdGVpbicKICAgIElOTkVSIEpPSU4geyR3cGRiLT5wb3N0c30gcCBPTiBwLklEPXRyLm9iamVjdF9pZCBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciKTsKICAkb3V0WydwYWdhbF90ZXJtaW5hJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdG0ubmFtZSwgdHQuY291bnQgRlJPTSB7JHdwZGItPnRlcm1zfSB0bQogICAgSU5ORVIgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1faWQ9dG0udGVybV9pZCBBTkQgdHQudGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyIsIEFSUkFZX0EpOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'mono', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP mono', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/mono.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_mono=1&k=mn6r2x`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,900); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/mono.json', out);
}
main().catch(async e=>{ await putResult('analize/mono.json',{klaida:String(e)}); });
