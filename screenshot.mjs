process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEJJUyBEZXBsb3kgdjEuMCAoZGllZ2ltYXMgKyBFMkUgZHJ5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2JpcyddKT8kX0dFVFsncHNfYmlzJ106JycpIT09J0RFUDEnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0JJUy1ERVBMT1ktdjEuMCcpOwogIHRyeXsKICAgICRmYWlsYWk9YXJyYXkoCiAgICAgICdtb2R1bGlzJz0+YXJyYXkoJ3NyYyc9PidkZXBsb3kvcGV0c2hvcC1hdHNhcmd1LWxhdWtpbWFzLnBocC5iNjQnLCdkc3QnPT5XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWF0c2FyZ3UtbGF1a2ltYXMucGhwJywnbWQ1Jz0+J2M3NDA0YTVkOGVlMWJhMzcwMGI3ODY2MTFhM2IxMjY3JyksCiAgICAgICdzYWJsb25hcyc9PmFycmF5KCdzcmMnPT4nZGVwbG95L2JhY2staW4tc3RvY2sucGhwLmI2NCcsJ2RzdCc9PldQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscy9iYWNrLWluLXN0b2NrLnBocCcsJ21kNSc9PidjZmE1NWUwZjY1ZTY0ODVhZDBhZDYyODIyMDg1ZWE5OCcpLAogICAgKTsKICAgIGZvcmVhY2goJGZhaWxhaSBhcyAkaz0+JGYpewogICAgICAkdXJsPSdodHRwczovL3Jhdy5naXRodWJ1c2VyY29udGVudC5jb20vcmFpbWlzMDc5LWNyZWF0b3IvcGV0c2hvcC1icmlkZ2UvbWFpbi8nLiRmWydzcmMnXS4nP3Y9Jy4kZlsnbWQ1J10uJy0nLnRpbWUoKTsKICAgICAgJHI9d3BfcmVtb3RlX2dldCgkdXJsLGFycmF5KCd0aW1lb3V0Jz0+MzAsJ2hlYWRlcnMnPT5hcnJheSgnQ2FjaGUtQ29udHJvbCc9Piduby1jYWNoZScpKSk7CiAgICAgIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWyRrXT0nUEFSU0lVTlRJTU8gS0xBSURBOiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBjb250aW51ZTsgfQogICAgICAka29kYXM9YmFzZTY0X2RlY29kZSh0cmltKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKSkpOwogICAgICBpZihtZDUoJGtvZGFzKSE9PSRmWydtZDUnXSl7ICRvWyRrXT0nTUQ1IE5FU1VUQU1QQTogZ2F1dGEgJy5tZDUoJGtvZGFzKS4nIGxhdWt0YSAnLiRmWydtZDUnXTsgY29udGludWU7IH0KICAgICAgJHRvaz1AdG9rZW5fZ2V0X2FsbCgka29kYXMsIFRPS0VOX1BBUlNFKTsKICAgICAgaWYoJHRvaz09PWZhbHNlKXsgJG9bJGtdPSdQSFAgU0lOVEFLU0VTIEtMQUlEQSc7IGNvbnRpbnVlOyB9CiAgICAgIGlmKGZpbGVfZXhpc3RzKCRmWydkc3QnXSkpewogICAgICAgICRiZGlyPVdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzJzsKICAgICAgICBpZighaXNfZGlyKCRiZGlyKSkgd3BfbWtkaXJfcCgkYmRpcik7CiAgICAgICAgY29weSgkZlsnZHN0J10sICRiZGlyLicvJy5iYXNlbmFtZSgkZlsnZHN0J10pLicuYmFrX2Jpc18nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgfQogICAgICBmaWxlX3B1dF9jb250ZW50cygkZlsnZHN0J10sICRrb2Rhcyk7CiAgICAgICRvWyRrXT1hcnJheSgnaXJhc3l0YSc9Pm1kNV9maWxlKCRmWydkc3QnXSk9PT0kZlsnbWQ1J10/J09LJzonTUQ1IFBPIElSQVNZTU8gTkVTVVRBTVBBJywnZHlkaXMnPT5maWxlc2l6ZSgkZlsnZHN0J10pKTsKICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK'; const VER='BIS-DEPLOY-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS Deploy v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const d=await fx(WP+'/?ps_bis=DEP1',{headers:UA},'chk');
  const dt=await d.text(); try{ out.rez=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,2500); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/bis_deploy.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
