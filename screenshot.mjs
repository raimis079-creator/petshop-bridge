process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3N2J10pPyRfR0VUWydwc19zdiddOicnKSE9PSdLQVM3JykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDYwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0tBUzcnLCd0cyc9PmRhdGUoJ1ktbS1kIEg6aTpzJykpOwogZGVsZXRlX3RyYW5zaWVudCgncHNfa2F0X2R1b21lbnlzJyk7CiAkZD1QZXRzaG9wX0thdGFsb2dhczo6c3VyaW5rdGkoKTsgJHByPSRkWydwcmVrZXMnXTsKICR0PWFycmF5KCdrcnV2YSc9PidwcmVreWJvamUnLCd2aWV3Jz0+J3ByX3N5bmMnLCdzYW5kJz0+JycsJ2thdCc9PicnLCdicmFuZCc9PicnLCdsaWt1dGlzJz0+JycsJ21hcnphJz0+JycsJ3RpcGFzJz0+JycsJ3EnPT4nJyk7CiAkcj1QZXRzaG9wX0thdGFsb2dhczo6ZmlsdHJ1b3RpKCRwciwkdCk7CiAkb1snbiddPWNvdW50KCRyKTsgJG9bJ3ByZWtlcyddPWFycmF5KCk7CiBmb3JlYWNoKCRyIGFzICR4KXsgJG9bJ3ByZWtlcyddW109YXJyYXkoJHhbJ2lkJ10sJHhbJ3NhbmQnXSwkeFsnc3luYyddLG1iX3N1YnN0cigkeFsnbiddLDAsNDQpKTsgfQogLyogbmF1anVqdSBsYXVrdSBwanV2aXMgKi8KICR0YT0wOyR0dj0wOyR0ej0wOyRjYT0wOyRjdD0wOwogZm9yZWFjaCgkcHIgYXMgJHgpeyBpZighZW1wdHkoJHhbJ3R1cmlfYXYnXSkpJHRhKys7IGlmKCFlbXB0eSgkeFsndHVyaV92ZiddKSkkdHYrKzsgaWYoIWVtcHR5KCR4Wyd0dXJpX3piJ10pKSR0eisrOwogICBpZigkeFsnY29zdF9hdiddIT09bnVsbCkkY2ErKzsgaWYoJHhbJ2Nvc3RfdGllayddIT09bnVsbCkkY3QrKzsgfQogJG9bJ3R1cmlfYXYnXT0kdGE7ICRvWyd0dXJpX3ZmJ109JHR2OyAkb1sndHVyaV96YiddPSR0ejsgJG9bJ2Nvc3RfYXZfbiddPSRjYTsgJG9bJ2Nvc3RfdGlla19uJ109JGN0OwogLyogbmF1am8gdmFyaWtsaW8gdGVzdGFzOiBzYXZpa2FpbmEgdHVzY2lhIElSIEFWIGxpa3V0aXMgPiAwICovCiAkdDI9JHQ7ICR0MlsndmlldyddPSd2aXNvc19rcnV2b2plJzsKICR0MlsncyddPWFycmF5KGFycmF5KCdsJz0+J2Nvc3QnLCdvcCc9Pid0dXNjaWEnKSwgYXJyYXkoJ2wnPT4nYXYnLCdvcCc9Pic+Jywncic9PjApKTsKICRvWyd0ZXN0YXNfYmVfc2F2X3N1X2xpa3VjaXUnXT1jb3VudChQZXRzaG9wX0thdGFsb2dhczo6ZmlsdHJ1b3RpKCRwciwkdDIpKTsKICR0Mz0kdDI7ICR0M1sna3J1dmEnXT0ndmlzb3MnOwogJG9bJ3Rlc3Rhc192aXNvcyddPWNvdW50KFBldHNob3BfS2F0YWxvZ2FzOjpmaWx0cnVvdGkoJHByLCR0MykpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'KAS7'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
async function off(id){ if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})}); }
try{
  const s=await snip('TEMP KAS7',B64);
  await new Promise(r=>setTimeout(r,6000));
  const t=await (await fetch(WP+'/?ps_sv=KAS7')).text();
  try{ out.rez=JSON.parse(t); }catch(e){ out.raw=t.slice(0,1500); }
  await off(s);
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('kas7.json', Buffer.from(JSON.stringify(out)), 'kas7');
console.log('ok');
