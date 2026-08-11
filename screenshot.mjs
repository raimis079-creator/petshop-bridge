process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19qdW9kciddKSkgcmV0dXJuOwogIEBzZXRfdGltZV9saW1pdCgzMDApOwogIGdsb2JhbCAkd3BkYjsKICAkYXBwbHkgPSBpc3NldCgkX0dFVFsnYXBwbHknXSk7CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidKVU9EUicsJ3JlemltYXMnPT4kYXBwbHk/J0FQUExZJzonRFJZJyk7CgogIC8qIFRJSyBWRiBpciBaQi4gQVYgbmVsaWVjaWFtb3MgKHNhdmluaW5rbyBzcHJlbmRpbWFzIDIwMjYtMDgtMTEpLiAqLwogICRlaWw9JHdwZGItPmdldF9yZXN1bHRzKAogICAgIlNFTEVDVCBwLklELCBwLnBvc3RfdGl0bGUsIHAucG9zdF9jb250ZW50LAogICAgICAgICAgICBzbS5tZXRhX3ZhbHVlIHNhbmQsCiAgICAgICAgICAgIChTRUxFQ1QgbWV0YV92YWx1ZSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIHBvc3RfaWQ9cC5JRCBBTkQgbWV0YV9rZXk9J190aHVtYm5haWxfaWQnKSB0aWQKICAgICAgIEZST00geyR3cGRiLT5wb3N0c30gcAogICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzbSBPTiBzbS5wb3N0X2lkPXAuSUQgQU5EIHNtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnCiAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCcKICAgICAgICBBTkQgTE9XRVIoc20ubWV0YV92YWx1ZSkgSU4gKCd2ZicsJ3piJykiLCBBUlJBWV9BKTsKCiAgJG91dFsndGlrcmludGEnXT1jb3VudCgkZWlsKTsKICAka2VsaWF1cz1hcnJheSgpOyAkbGlla2E9MDsKICBmb3JlYWNoKCRlaWwgYXMgJHIpewogICAgLyogRGFsaXMgYXByYXN5bXUgREIgeXJhIGR1a2FydCB1emtvZHVvdGkgKCZsdDtwJmd0OyksIHRvZGVsIHByaWVzCiAgICAgICBtYXR1b2phbnQgaWxnaSBidXRpbmFzIGRla29kYXZpbWFzIOKAlCBraXRhaXAgdGFnYWkgc2thaWNpdW9qYW1pCiAgICAgICBrYWlwIHR1cmlueXMuICovCiAgICAkdCA9IHRyaW0oIHdwX3N0cmlwX2FsbF90YWdzKCBodG1sX2VudGl0eV9kZWNvZGUoIChzdHJpbmcpJHJbJ3Bvc3RfY29udGVudCddLCBFTlRfUVVPVEVTLCAnVVRGLTgnICkgKSApOwogICAgJGJlX2FwciA9ICggbWJfc3RybGVuKCR0KSA8IDEyMCApOwogICAgJGJlX2ZvdG8gPSAoIChpbnQpJHJbJ3RpZCddIDw9IDAgKTsKICAgIGlmKCRiZV9hcHIgfHwgJGJlX2ZvdG8pewogICAgICAka2VsaWF1c1tdPWFycmF5KCdpZCc9PihpbnQpJHJbJ0lEJ10sJ3Bhdic9Pm1iX3N1YnN0cigkclsncG9zdF90aXRsZSddLDAsNDIpLAogICAgICAgICdzYW5kJz0+c3RydG9sb3dlcigkclsnc2FuZCddKSwnaWxnaXMnPT5tYl9zdHJsZW4oJHQpLAogICAgICAgICdiZV9hcHJhc3ltbyc9PiRiZV9hcHIsJ2JlX251b3RyYXVrb3MnPT4kYmVfZm90byk7CiAgICB9IGVsc2UgeyAkbGlla2ErKzsgfQogIH0KICAkb3V0WydrZWxpYXVzJ109Y291bnQoJGtlbGlhdXMpOwogICRvdXRbJ2xpZWthX3ByZWt5Ym9qZSddPSRsaWVrYTsKICAkcGFnYWw9YXJyYXkoJ3ZmJz0+MCwnemInPT4wKTsgJHByej1hcnJheSgndGlrX2Fwcic9PjAsJ3Rpa19mb3RvJz0+MCwnYWJ1Jz0+MCk7CiAgZm9yZWFjaCgka2VsaWF1cyBhcyAkayl7CiAgICAkcGFnYWxbJGtbJ3NhbmQnXV09aXNzZXQoJHBhZ2FsWyRrWydzYW5kJ11dKT8kcGFnYWxbJGtbJ3NhbmQnXV0rMToxOwogICAgaWYoJGtbJ2JlX2FwcmFzeW1vJ10gJiYgJGtbJ2JlX251b3RyYXVrb3MnXSkgJHByelsnYWJ1J10rKzsKICAgIGVsc2VpZigka1snYmVfYXByYXN5bW8nXSkgJHByelsndGlrX2FwciddKys7CiAgICBlbHNlICRwcnpbJ3Rpa19mb3RvJ10rKzsKICB9CiAgJG91dFsncGFnYWxfc2FuZGVsaSddPSRwYWdhbDsKICAkb3V0WydwcmllemFzdHlzJ109JHByejsKICAkb3V0WydwdnonXT1hcnJheV9zbGljZSgka2VsaWF1cywwLDgpOwoKICBpZigkYXBwbHkpewogICAgJGlkcz1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiAkeFsnaWQnXTt9LCRrZWxpYXVzKTsKICAgIC8qIEFUU1RBVFlNVUk6IElEIHNhcmFzYXMgaXNsaWVrYSBvcGNpam9qZS4gKi8KICAgIHVwZGF0ZV9vcHRpb24oJ3BzX2p1b2RyX2Jha18nLmRhdGUoJ1ltZF9IaXMnKSwgd3BfanNvbl9lbmNvZGUoJGlkcyksICdubycpOwogICAgJG9rPTA7CiAgICBmb3JlYWNoKCRpZHMgYXMgJHBpZCl7CiAgICAgICRyPXdwX3VwZGF0ZV9wb3N0KGFycmF5KCdJRCc9PiRwaWQsJ3Bvc3Rfc3RhdHVzJz0+J2RyYWZ0JyksIHRydWUpOwogICAgICBpZighaXNfd3BfZXJyb3IoJHIpKXsKICAgICAgICB1cGRhdGVfcG9zdF9tZXRhKCRwaWQsJ19wc19pX2p1b2RyYXN0aScsJ3Ryxatrc3RhIGFwcmHFoXltbyBhciBudW90cmF1a29zIMK3ICcuY3VycmVudF90aW1lKCdteXNxbCcpKTsKICAgICAgICAkb2srKzsKICAgICAgfQogICAgfQogICAgJG91dFsncGVya2VsdGEnXT0kb2s7CiAgICBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSl7IGZvcmVhY2goYXJyYXlfc2xpY2UoJGlkcywwLDUwKSBhcyAkcCl7IHdjX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMoJHApOyB9IH0KICAgIC8qIFBBVElLUkEgKi8KICAgICRvdXRbJ2xpa29fcHVibGlzaF92Zl96YiddPShpbnQpJHdwZGItPmdldF92YXIoCiAgICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBwCiAgICAgICAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBzbSBPTiBzbS5wb3N0X2lkPXAuSUQgQU5EIHNtLm1ldGFfa2V5PSdfcHNfc2FuZGVsaXMnCiAgICAgICBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBMT1dFUihzbS5tZXRhX3ZhbHVlKSBJTiAoJ3ZmJywnemInKSIpOwogICAgJG91dFsnanVvZHJhc2NpdV9kYWJhciddPShpbnQpJHdwZGItPmdldF92YXIoCiAgICAgICJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RzfSBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0nZHJhZnQnIik7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'j1', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP j1', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await jsonSafe(r)||{};
  await pause(2500);
  let resp=await fetch(`${WP}/?ps_juodr=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.dry=await jsonSafe(resp);
  await pause(1500);
  resp=await fetch(`${WP}/?ps_juodr=1&apply=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.apply=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await jsonSafe(r);
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.name);
  await putRaw('analize/juodr.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'j1');
}
main().catch(e=>{});
