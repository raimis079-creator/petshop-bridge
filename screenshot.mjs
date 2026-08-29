process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJJUyBSZWNvbjIgdjEuMCAoZmFpbGFpKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J1pWMicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0JJUy1SRUNPTjItdjEuMCcpOwogIHRyeXsKICAgICRiYXNlPVdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvJzsKICAgICRmYWlsYWk9YXJyYXkoCiAgICAgICdkaXNwYXRjaCc9PiRiYXNlLidpbmNsdWRlcy9jbGFzcy1lbWFpbC1kaXNwYXRjaC5waHAnLAogICAgICAnZXZlbnRfcmVnaXN0cnknPT4kYmFzZS4naW5jbHVkZXMvY2xhc3MtZXZlbnQtcmVnaXN0cnkucGhwJywKICAgICAgJ25ld3NsZXR0ZXInPT4kYmFzZS4naW5jbHVkZXMvY2xhc3MtbmV3c2xldHRlci5waHAnLAogICAgICAncmVmaWxsX3RwbCc9PiRiYXNlLid0ZW1wbGF0ZXMvZW1haWxzL3JlZmlsbC5waHAnLAogICAgICAnY29udGFjdF9wb2xpY3knPT4kYmFzZS4naW5jbHVkZXMvY2xhc3MtY29udGFjdC1wb2xpY3kucGhwJywKICAgICk7CiAgICBmb3JlYWNoKCRmYWlsYWkgYXMgJGs9PiRmKXsKICAgICAgJG9bJGtdPWZpbGVfZXhpc3RzKCRmKT9hcnJheSgnZHlkaXMnPT5maWxlc2l6ZSgkZiksJ21kNSc9Pm1kNV9maWxlKCRmKSwnYjY0Jz0+YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkZikpKTonTkVSQSc7CiAgICB9CiAgICAvKiBrYXMga2FibyBhbnQgc3RvY2sga2FibGl1a3UgKi8KICAgIGdsb2JhbCAkd3BfZmlsdGVyOwogICAgZm9yZWFjaChhcnJheSgnd29vY29tbWVyY2VfcHJvZHVjdF9zZXRfc3RvY2tfc3RhdHVzJywnd29vY29tbWVyY2VfcHJvZHVjdF9zZXRfc3RvY2snLCd3b29jb21tZXJjZV9ub19zdG9jaycpIGFzICRoKXsKICAgICAgJGNiPWFycmF5KCk7CiAgICAgIGlmKGlzc2V0KCR3cF9maWx0ZXJbJGhdKSkgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcmlvPT4kZm5zKSBmb3JlYWNoKCRmbnMgYXMgJGZuKXsKICAgICAgICAkYz0kZm5bJ2Z1bmN0aW9uJ107CiAgICAgICAgaWYoaXNfYXJyYXkoJGMpKSAkY2JbXT0kcHJpby4nOicuKGlzX29iamVjdCgkY1swXSk/Z2V0X2NsYXNzKCRjWzBdKTokY1swXSkuJzo6Jy4kY1sxXTsKICAgICAgICBlbHNlaWYoaXNfc3RyaW5nKCRjKSkgJGNiW109JHByaW8uJzonLiRjOwogICAgICAgIGVsc2UgJGNiW109JHByaW8uJzpjbG9zdXJlJzsKICAgICAgfQogICAgICAkb1sna2FibGl1a2FzXycuJGhdPSRjYjsKICAgIH0KICAgIC8qIHNjaGVtb3Mga2F0YWxvZ2FzICovCiAgICBmb3JlYWNoKGFycmF5KCRiYXNlLidzY2hlbWFzJywkYmFzZS4naW5jbHVkZXMvc2NoZW1hcycsJGJhc2UuJ2V2ZW50cycpIGFzICRkKXsKICAgICAgaWYoaXNfZGlyKCRkKSkgJG9bJ3NjaGVtb3MnXVtzdHJfcmVwbGFjZShBQlNQQVRILCcnLCRkKV09YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYigkZC4nLyonKSk7CiAgICB9CiAgICBpZihlbXB0eSgkb1snc2NoZW1vcyddKSkgJG9bJ3NjaGVtb3MnXT0nS0FUQUxPR08gTkVSQSc7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='BIS-RECON2-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS Recon2 v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=ZV2',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2500); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/bis_failai.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
