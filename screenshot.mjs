process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIER5ZHppdSBadmFsZ3liYSB2MS4wICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiBpZiggKCRfR0VUWydwc19keWQnXSA/PyAnJykgIT09ICdEWUQxJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJG89Wyd2Jz0+J0RZRDEnXTsKIC8qIGtva2lvcyBkeWR6aW8gdGFrc29ub21pam9zIGVnemlzdHVvamEgKi8KICRvWyd0YWtzb25vbWlqb3MnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgICJTRUxFQ1QgdGF4b25vbXksIENPVU5UKCopIG4gRlJPTSB7JHdwZGItPnRlcm1fdGF4b25vbXl9CiAgICAgV0hFUkUgdGF4b25vbXkgTElLRSAncGFfJScgR1JPVVAgQlkgdGF4b25vbXkgT1JERVIgQlkgbiBERVNDIiwgQVJSQVlfQSk7CgogJG5hdWppPVszNTEwMiwzNTEwNCwzNTEwNiwzNTEwOCwzNTExMCwzNTExMiwzNTExNCwzNTExNiwzNTExOCwzNTEyMCwzNTEyMiwzNTEyNCwzNTEyNiwKICAgICAgICAgMzUxMjgsMzUxMzAsMzUxMzIsMzUxMzQsMzUxMzYsMzUxMzgsMzUxNDAsMzUxNDIsMzUxNDQsMzUxNDYsMzUxNDddOwogJG9bJ25hdWppJ109W107CiBmb3JlYWNoKCRuYXVqaSBhcyAkcGlkKXsKICAgJHA9Z2V0X3Bvc3QoJHBpZCk7IGlmKCEkcCkgY29udGludWU7CiAgICRhdD1bXTsgCiAgIGZvcmVhY2goJHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoCiAgICAgIlNFTEVDVCBESVNUSU5DVCB0dC50YXhvbm9teSBGUk9NIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0cgogICAgICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZAogICAgICBXSEVSRSB0ci5vYmplY3RfaWQ9JWQgQU5EIHR0LnRheG9ub215IExJS0UgJ3BhXyUlJyIsJHBpZCkpIGFzICR0eCl7CiAgICAgJGF0WyR0eF09d3BfZ2V0X29iamVjdF90ZXJtcygkcGlkLCR0eCxbJ2ZpZWxkcyc9PiduYW1lcyddKTsKICAgfQogICAka2F0PXdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J25hbWVzJ10pOwogICAkb1snbmF1amknXVtdPVsnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoJHAtPnBvc3RfdGl0bGUsMCw1OCksCiAgICAgJ2thdCc9PmlzX3dwX2Vycm9yKCRrYXQpP1tdOiRrYXQsJ2F0cmlidXRhaSc9PiRhdF07CiB9CiAvKiBrYSB0dXJpIEJST0xJQUkgdG9zZSBwYWNpb3NlIGthdGVnb3Jpam9zZSAqLwogJG9bJ2Jyb2xpYWknXT1bXTsKIGZvcmVhY2goWzE1MzEyPT4nRWJpIGthdWxhcycsMTU3NDM9Pidab2x1eCBzZXBldHlzJywxNzkwMz0+J0thdHJpbmV4JywxODc0Mz0+J01vbiBBbW9yJywxOTA4OT0+J1RyaXVzaW8gYXVzeXMnXSBhcyAkcGlkPT4kdmFyZGFzKXsKICAgJGF0PVtdOwogICBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKAogICAgICJTRUxFQ1QgRElTVElOQ1QgdHQudGF4b25vbXkgRlJPTSB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIKICAgICAgIEpPSU4geyR3cGRiLT50ZXJtX3RheG9ub215fSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQKICAgICAgV0hFUkUgdHIub2JqZWN0X2lkPSVkIEFORCB0dC50YXhvbm9teSBMSUtFICdwYV8lJSciLCRwaWQpKSBhcyAkdHgpewogICAgICRhdFskdHhdPXdwX2dldF9vYmplY3RfdGVybXMoJHBpZCwkdHgsWydmaWVsZHMnPT4nbmFtZXMnXSk7CiAgIH0KICAgJG9bJ2Jyb2xpYWknXVtdPVsnaWQnPT4kcGlkLCd2YXJkYXMnPT4kdmFyZGFzLCdhdHJpYnV0YWknPT4kYXRdOwogfQogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0sOTkpOwo='; const VER='DYD-v1.0'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS Dydziu Zvalgyba v1.0',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(9000);
  const d=await fx(WP+'/?ps_dyd=DYD1',{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},'dyd');
  const dt=await d.text(); try{ out.r=JSON.parse(dt); }catch(e){ out.zalias=dt.slice(0,1200); }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/dyd_status.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
