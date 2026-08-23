process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjOSddKSB8fCAkX0dFVFsncHNfcmVjOSddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J1JFQzknKTsKIC8qIDEuIEFyIHRpZWtpbW8gbGVudGVsZW4gaWRldGEgZWlsdXRlIHZpcyBkYXIgcGF0ZW5rYSBpIGRyb3BzaGlwIGxhaXNrYT8gKi8KICRyZz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9BVl9Ecm9wc2hpcCcsJ2dydXB1b3RpJyk7ICRyZy0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRnPSRyZy0+aW52b2tlKG51bGwsYXJyYXkoMzUwNjYpKTsKICRUWydncnVwdW90aV8zNTA2NiddPWFycmF5KCk7CiBmb3JlYWNoKCRnIGFzICRzcmM9PiR1eil7IGZvcmVhY2goJHV6IGFzICRvaWQ9PiRkKXsgJFRbJ2dydXB1b3RpXzM1MDY2J11bJHNyY109YXJyYXlfbWFwKGZ1bmN0aW9uKCRlKXtyZXR1cm4gJGVbJ3BhdiddLicgw5cnLiRlWydxdHknXTt9LCRkWydlaWx1dGVzJ10pOyB9IH0KIC8qIDIuIEFyIFBldHNob3BfQVZfVGlla2ltYXMgdHVyaSBtZXRvZGEsIGt1cmlzIHBhenltaSBlaWx1dGUgKi8KIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9BVl9UaWVraW1hcycpKXsKICAgJHJjPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfQVZfVGlla2ltYXMnKTsKICAgJFRbJ3RpZWtpbWFzX21ldG9kYWknXT1hcnJheSgpOwogICBmb3JlYWNoKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtKXsgaWYoJG0tPmNsYXNzPT09J1BldHNob3BfQVZfVGlla2ltYXMnKSAkVFsndGlla2ltYXNfbWV0b2RhaSddW109JG0tPmdldE5hbWUoKTsgfQogfQogLyogMy4gRWlsdXRlcyA3MDAgbWV0YSAqLwogJG89d2NfZ2V0X29yZGVyKDM1MDY2KTsKICRpdD0kby0+Z2V0X2l0ZW0oNzAwKTsKICRUWydlaWx1dGVfNzAwX21ldGEnXT1hcnJheSgpOwogZm9yZWFjaCgkaXQtPmdldF9tZXRhX2RhdGEoKSBhcyAkbSl7ICRkPSRtLT5nZXRfZGF0YSgpOyAkVFsnZWlsdXRlXzcwMF9tZXRhJ11bJGRbJ2tleSddXT1pc19zY2FsYXIoJGRbJ3ZhbHVlJ10pPyRkWyd2YWx1ZSddOmpzb25fZW5jb2RlKCRkWyd2YWx1ZSddKTsgfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo=';
const out={v:'REC9'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v12 (dvigubo uzsakymo rizika)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec9=RUN');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/rec9.json', Buffer.from(JSON.stringify(out,null,1)), 'REC9');
