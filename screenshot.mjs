process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEhpZ2llbmEgRGVwbG95IHYxLjAgKFdDIG1vYmlsZSBwcm9tbyBPRkYpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICR2PWlzc2V0KCRfR0VUWydwc19iaXMnXSk/JF9HRVRbJ3BzX2JpcyddOicnOwogIGlmKCFpbl9hcnJheSgkdixhcnJheSgnSElHMScsJ0hJRzInKSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0hJRy12MS4wJywnZmFzZSc9PiR2KTsKICB0cnl7CiAgICAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWhpZ2llbmEucGhwJzsKICAgIGlmKCR2PT09J0hJRzEnKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOwogICAgICAkb1snZ3l2YXNfbWQ1J109bWQ1KCRjKTsgJG9bJ2R5ZGlzJ109c3RybGVuKCRjKTsKICAgICAgaWYoc3RycG9zKCRjLCdtb2JpbGVfbWVzc2FnaW5nJykhPT1mYWxzZSl7ICRvWydqYXVfeXJhJ109dHJ1ZTsgfQogICAgICBlbHNlewogICAgICAgICRwcmllZGFzPSJcblxuLyogUzE0NzU6IFdvb0NvbW1lcmNlIG1vYmlsaW9zaW9zIHByb2dyYW1lbGVzIHJla2xhbWEgYWRtaW4gJ05hdWphcyB1enNha3ltYXMnXG4gKiBsYWlza2UgKHdvb2NvbW1lcmNlLmNvbSBkZWVwbGluaykg4oCUIGlzanVuZ2lhbWEuIFdDX0VtYWlsX05ld19PcmRlciBrb25zdHJ1a3Rvcml1c1xuICoga2FiaW5hIG1vYmlsZV9tZXNzYWdpbmcgYW50IHdvb2NvbW1lcmNlX2VtYWlsX2Zvb3RlciBwcmlvIDkuICovXG5hZGRfYWN0aW9uKCAnd29vY29tbWVyY2VfZW1haWwnLCBmdW5jdGlvbiggXCRtYWlsZXIgKSB7XG5cdGZvcmVhY2ggKCBcJG1haWxlci0+Z2V0X2VtYWlscygpIGFzIFwkZW1haWwgKSB7XG5cdFx0aWYgKCBpc3NldCggXCRlbWFpbC0+aWQgKSAmJiAnbmV3X29yZGVyJyA9PT0gXCRlbWFpbC0+aWQgKSB7XG5cdFx0XHRyZW1vdmVfYWN0aW9uKCAnd29vY29tbWVyY2VfZW1haWxfZm9vdGVyJywgYXJyYXkoIFwkZW1haWwsICdtb2JpbGVfbWVzc2FnaW5nJyApLCA5ICk7XG5cdFx0fVxuXHR9XG59ICk7XG4iOwogICAgICAgICRuYXVqYXM9JGMuJHByaWVkYXM7CiAgICAgICAgaWYoQHRva2VuX2dldF9hbGwoJG5hdWphcyxUT0tFTl9QQVJTRSk9PT1mYWxzZSl7ICRvWydTVE9QJ109J1NJTlRBS1NFJzsgfQogICAgICAgIGVsc2V7CiAgICAgICAgICAkYmRpcj1XUF9DT05URU5UX0RJUi4nL3VwbG9hZHMvcHMtYmFja3Vwcyc7IGlmKCFpc19kaXIoJGJkaXIpKSB3cF9ta2Rpcl9wKCRiZGlyKTsKICAgICAgICAgIGNvcHkoJGYsJGJkaXIuJy9wZXRzaG9wLWhpZ2llbmEucGhwLmJha19zMTQ3NV8nLmdtZGF0ZSgnWW1kX0hpcycpKTsKICAgICAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRmLCRuYXVqYXMpOwogICAgICAgICAgJG9bJ2lyYXN5dGEnXT10cnVlOyAkb1snbmF1amFzX21kNSddPW1kNV9maWxlKCRmKTsKICAgICAgICB9CiAgICAgIH0KICAgIH0KICAgIGlmKCR2PT09J0hJRzInKXsKICAgICAgLyogYXRza2lyYSB1emtsYXVzYTogcGF0aWtyYSBhciBrYWJsaXVrYXMgbnVpbXRhcyAqLwogICAgICAkbWFpbGVyPVdDKCktPm1haWxlcigpOwogICAgICAkbm89bnVsbDsKICAgICAgZm9yZWFjaCgkbWFpbGVyLT5nZXRfZW1haWxzKCkgYXMgJGUpeyBpZihpc3NldCgkZS0+aWQpJiYkZS0+aWQ9PT0nbmV3X29yZGVyJyl7ICRubz0kZTsgYnJlYWs7IH0gfQogICAgICAkb1snbmV3X29yZGVyX3Jhc3RhcyddPShib29sKSRubzsKICAgICAgaWYoJG5vKXsKICAgICAgICAkb1sna2FibGl1a2FzX2xpa28nXT1oYXNfYWN0aW9uKCd3b29jb21tZXJjZV9lbWFpbF9mb290ZXInLGFycmF5KCRubywnbW9iaWxlX21lc3NhZ2luZycpKTsKICAgICAgICAkb1snaGlnaWVuYV9tZDUnXT1tZDVfZmlsZShXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWhpZ2llbmEucGhwJyk7CiAgICAgIH0KICAgIH0KICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAgJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg=='; const VER='HIG-v1.0'; const out={v:VER};
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
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS BIS Higiena Deploy v1.0 (back-in-stock zvalgyba)',
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  const dA=await fx(WP+'/?ps_bis=HIG1',{headers:UA},'dep');
  const tA=await dA.text(); try{ out.deploy=JSON.parse(tA); }catch(e){ out.zaliasA=tA.slice(0,1500); }
  await miegok(5000);
  const dB=await fx(WP+'/?ps_bis=HIG2',{headers:UA},'chk');
  const tB=await dB.text(); try{ out.patikra=JSON.parse(tB); }catch(e){ out.zaliasB=tB.slice(0,1500); }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put('analize/hig.json', Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
