process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJJUyBSZWNvbjMgdjEuMCAoY2FydCB0cmFja2VyIGZhaWxhaSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoKGlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnKSE9PSdaVjMnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidCSVMtUkVDT04zLXYxLjAnKTsKICB0cnl7CiAgICAkYmFzZT1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL2luY2x1ZGVzLyc7CiAgICBmb3JlYWNoKGFycmF5KCdjYXJ0X3RyYWNrZXInPT4nY2xhc3MtY2FydC10cmFja2VyLnBocCcsJ2NhcnRfYWJhbmRvbm1lbnQnPT4nY2xhc3MtY2FydC1hYmFuZG9ubWVudC5waHAnLCdsYXlvdXQnPT4nY2xhc3MtZW1haWwtbGF5b3V0LnBocCcsJ3Vuc3Vic2NyaWJlJz0+J2NsYXNzLXVuc3Vic2NyaWJlLnBocCcpIGFzICRrPT4kZil7CiAgICAgICRmZj0kYmFzZS4kZjsKICAgICAgJG9bJGtdPWZpbGVfZXhpc3RzKCRmZik/YXJyYXkoJ2R5ZGlzJz0+ZmlsZXNpemUoJGZmKSwnbWQ1Jz0+bWQ1X2ZpbGUoJGZmKSwnYjY0Jz0+YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkZmYpKSk6J05FUkEnOwogICAgfQogICAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogICAgJG9bJ2NhcnRzX3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2NhcnRzIiwwKTsKICAgICRvWydjcm9uX2l2eWtpYWknXT1hcnJheSgpOwogICAgZm9yZWFjaChfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdHM9PiRob29rcykgZm9yZWFjaCgkaG9va3MgYXMgJGg9PiR4KSBpZihzdHJwb3MoJGgsJ3BzXycpPT09MHx8c3RycG9zKCRoLCdwZXRzaG9wJyk9PT0wKSAkb1snY3Jvbl9pdnlraWFpJ11bJGhdPWdtZGF0ZSgnSDppJywkdHMpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg=='; const VER='BIS-RECON3-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS Recon3 v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=ZV3',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2000); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/bis_r3.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
