process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjIxOSddKSA/ICRfR0VUWydwc19yMjE5J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIGdsb2JhbCAkd3BkYiwgJHdwX2ZpbHRlcjsKICRvID0gYXJyYXkoJ3YnPT4nUjIxOScpOwoKIC8qIDEuIE1va2VzY2lvIHV6ZGFyaW55cyDigJQgaXMga3VyIGlyIGtva3Mga29kYXMgKi8KIGlmKCFlbXB0eSgkd3BfZmlsdGVyWyd3b29jb21tZXJjZV9jYXJ0X2NhbGN1bGF0ZV9mZWVzJ10pKXsKICAgZm9yZWFjaCgkd3BfZmlsdGVyWyd3b29jb21tZXJjZV9jYXJ0X2NhbGN1bGF0ZV9mZWVzJ10tPmNhbGxiYWNrcyBhcyAkcHI9PiRjYnMpewogICAgIGZvcmVhY2goJGNicyBhcyAkY2IpewogICAgICAgJGYgPSAkY2JbJ2Z1bmN0aW9uJ107CiAgICAgICBpZigkZiBpbnN0YW5jZW9mIENsb3N1cmUpewogICAgICAgICAkcmYgPSBuZXcgUmVmbGVjdGlvbkZ1bmN0aW9uKCRmKTsKICAgICAgICAgJGZhaWxhcyA9ICRyZi0+Z2V0RmlsZU5hbWUoKTsgJG51byA9ICRyZi0+Z2V0U3RhcnRMaW5lKCk7ICRpa2kgPSAkcmYtPmdldEVuZExpbmUoKTsKICAgICAgICAgJGVpbCA9IEBmaWxlKCRmYWlsYXMpOwogICAgICAgICAkb1sndXpkYXJpbnlzJ10gPSBhcnJheSgKICAgICAgICAgICAnZmFpbGFzJyA9PiAkZmFpbGFzLCAnZWlsdXRlcycgPT4gJG51by4nLScuJGlraSwKICAgICAgICAgICAna29kYXMnID0+ICRlaWwgPyBpbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkZWlsLCBtYXgoMCwkbnVvLTMpLCAoJGlraS0kbnVvKSs2KSkgOiAnbmVwZXJza2FpdHl0YScsCiAgICAgICAgICk7CiAgICAgICB9CiAgICAgfQogICB9CiB9CgogLyogMi4gRHUg4oCeRlRBICh0ZW1wKSIgc25pcHBldGFpICovCiAkdCA9ICR3cGRiLT5wcmVmaXguJ3NuaXBwZXRzJzsKICRvWydmdGEnXSA9IGFycmF5KCk7CiBmb3JlYWNoKCR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsYWN0aXZlLHNjb3BlLHByaW9yaXR5LGNvZGUgRlJPTSAkdCBXSEVSRSBpZCBJTiAoMTY1NSwxNjU2KSIsIEFSUkFZX0EpIGFzICRzKXsKICAgJG9bJ2Z0YSddW10gPSBhcnJheSgnaWQnPT4kc1snaWQnXSwnbmFtZSc9PiRzWyduYW1lJ10sJ2FjdGl2ZSc9PiRzWydhY3RpdmUnXSwKICAgICAnc2NvcGUnPT4kc1snc2NvcGUnXSwncHJpb3JpdHknPT4kc1sncHJpb3JpdHknXSwKICAgICAnaWxnaXMnPT5zdHJsZW4oJHNbJ2NvZGUnXSksICdrb2Rhcyc9Pm1iX3N1YnN0cigkc1snY29kZSddLDAsMTQwMCkpOwogfQoKIC8qIDMuIEtpdGkgYWt0eXZ1cyBzbmlwcGV0YWkgc3Ug4oCedGVtcCIgdmFyZGUgKi8KICRvWyd0ZW1wX2FrdHl2dXMnXSA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgQ09OQ0FUKGlkLCcgwrcgJyxuYW1lKSBGUk9NICR0CiAgIFdIRVJFIGFjdGl2ZT0xIEFORCAobmFtZSBMSUtFICcldGVtcCUnIE9SIG5hbWUgTElLRSAnJVRFU1QlJyBPUiBuYW1lIExJS0UgJyVsYWlrJScpIik7CgogLyogNC4gTmF1amllbmxhaXNraW8gdmFybmVsZSDigJQga3VyIGppIGdpbXN0YSAqLwogJHJhZG8gPSBhcnJheSgpOwogJG11ID0gZGVmaW5lZCgnV1BNVV9QTFVHSU5fRElSJykgPyBXUE1VX1BMVUdJTl9ESVIgOiBXUF9DT05URU5UX0RJUi4nL211LXBsdWdpbnMnOwogZm9yZWFjaChhcnJheV9tZXJnZSgoYXJyYXkpZ2xvYigkbXUuJy8qLnBocCcpLCAoYXJyYXkpZ2xvYigkbXUuJy8qLyoucGhwJykpIGFzICRmKXsKICAgJGMgPSBAZmlsZV9nZXRfY29udGVudHMoJGYpOyBpZigkYz09PWZhbHNlKSBjb250aW51ZTsKICAgaWYoc3RycG9zKCRjLCdwc25sLWNoZWNrJykhPT1mYWxzZSkgJHJhZG9bJ01VOiAnLmJhc2VuYW1lKCRmKV0gPSAxOwogfQogZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NICR0IFdIRVJFIGNvZGUgTElLRSAnJXBzbmwtY2hlY2slJyIsIEFSUkFZX0EpIGFzICRzKXsKICAgJHJhZG9bJ1NOSVAgJy4kc1snaWQnXS4nICcuKCRzWydhY3RpdmUnXT8nQUtUWVZVUyc6J2lzanVuZ3RhcycpXSA9ICRzWyduYW1lJ107CiB9CiAkb1sndmFybmVsZSddID0gJHJhZG87CgogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7CiBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'R219'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const kunas=JSON.stringify({name:'ZZ R219 Mokescio kodas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  const c=await fetch(SNIP,{method:'POST',headers:A,body:kunas});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const rr=await fetch(WP+'/?ps_r219=GO'); const tt=await rr.text();
    try{ out.DUOM=JSON.parse(tt); }catch(e){ out.zalias=tt.slice(0,600); }
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r219.json', Buffer.from(JSON.stringify(out,null,1)), 'r219 mokestis + a11y');
