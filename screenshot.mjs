process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRtPWlzc2V0KCRfR0VUWydwc19zZCddKT8kX0dFVFsncHNfc2QnXTonJzsgaWYoJG09PT0nJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsKICR0bXA9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLXNhcmdhcy50bXAnOwogaWYoJG09PT0nUkVDVicpewogICRiPWZpbGVfZ2V0X2NvbnRlbnRzKCdwaHA6Ly9pbnB1dCcpOyBmaWxlX3B1dF9jb250ZW50cygkdG1wLCRiKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdnYXV0YSc9PnN0cmxlbigkYiksJ21kNSc9Pm1kNSgkYikpKTsgZXhpdDsKIH0KIGlmKCRtPT09J0FQUExZJyl7CiAgJGV4cD1pc3NldCgkX0dFVFsnbWQ1J10pPyRfR0VUWydtZDUnXTonJzsgJG89YXJyYXkoKTsKICBpZighZmlsZV9leGlzdHMoJHRtcCl8fG1kNV9maWxlKCR0bXApIT09JGV4cCl7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2tsYWlkYSc9PidtZDUvdG1wJykpOyBleGl0OyB9CiAgJGNvZGU9ZmlsZV9nZXRfY29udGVudHMoJHRtcCk7CiAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRjb2RlLCBUT0tFTl9QQVJTRSk7IH1jYXRjaChcVGhyb3dhYmxlICRlKXsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgna2xhaWRhJz0+J3NpbnRha3NlOiAnLiRlLT5nZXRNZXNzYWdlKCkpKTsgZXhpdDsgfQogICR0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atc2FyZ2FzLnBocCc7CiAgJGI9V1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRiKSkgbWtkaXIoJGIsMDc1NSx0cnVlKTsKICBpZihmaWxlX2V4aXN0cygkdCkpIGNvcHkoJHQsJGIuJy9wZXRzaG9wLXNhcmdhcy5waHAuYmFrJyk7CiAgZmlsZV9wdXRfY29udGVudHMoJHQsJGNvZGUpOyBjb3B5KCR0LCRiLicvcGV0c2hvcC1zYXJnYXMucGhwLmJha19zNzEzJyk7CiAgJG9bJ2lyYXN5dGEnXT1tZDVfZmlsZSgkdCk7ICRvWydvayddPSgkb1snaXJhc3l0YSddPT09JGV4cCk7IEB1bmxpbmsoJHRtcCk7CiAgdXBkYXRlX29wdGlvbigncHNfc2FyZ2FzX3Bhc3RhcycsJ3RlcnJhQGd5dnVuYWkubHQnKTsKICBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKIH0KIGlmKCRtPT09J0NIRUNLJyl7CiAgJG89YXJyYXkoJ2tsYXNlJz0+Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX1NhcmdhcycpPydZUkEnOidORVJBJyk7CiAgJGx0PSRQLidwc19zYXJnYXNfa2xhaWRvcyc7CiAgJG9bJ2xlbnRlbGUnXT0oJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJyRsdCciKT09PSRsdCk/J1lSQSc6J05FUkEnOwogIGlmKCRvWydsZW50ZWxlJ109PT0nWVJBJyl7CiAgICAkb1snc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSBgJGx0YCIpOwogICAgJG9bJ3ZhcmlrbGlzJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBlbmdpbmUgRlJPTSBpbmZvcm1hdGlvbl9zY2hlbWEudGFibGVzIFdIRVJFIHRhYmxlX3NjaGVtYT1EQVRBQkFTRSgpIEFORCB0YWJsZV9uYW1lPSckbHQnIik7CiAgICAkb1snZWlsdWNpdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkbHRgIik7CiAgfQogICRvWydjcm9uX2thc2RpZW4nXT13cF9uZXh0X3NjaGVkdWxlZCgncHNfc2FyZ2FzX2thc2RpZW4nKT9kYXRlKCdZLW0tZCBIOmknLHdwX25leHRfc2NoZWR1bGVkKCdwc19zYXJnYXNfa2FzZGllbicpKTonTkVTVVBMQU5VT1RBJzsKICAkb1snY3Jvbl9zYXZhaXRpbmlzJ109d3BfbmV4dF9zY2hlZHVsZWQoJ3BzX3Nhcmdhc19zYXZhaXRpbmlzJyk/ZGF0ZSgnWS1tLWQgSDppJyx3cF9uZXh0X3NjaGVkdWxlZCgncHNfc2FyZ2FzX3NhdmFpdGluaXMnKSk6J05FU1VQTEFOVU9UQSc7CiAgJG9bJ3Bhc3RhcyddPWdldF9vcHRpb24oJ3BzX3Nhcmdhc19wYXN0YXMnKTsKICAkb1snbGF1a2lhbWknXT1nZXRfb3B0aW9uKCdwc19zYXJnYXNfY3Jvbl9sYXVraWFtJyxhcnJheSgpKTsKICAkb1snbGF1a2lhbXVfc2snXT1pc19hcnJheSgkb1snbGF1a2lhbWknXSk/Y291bnQoJG9bJ2xhdWtpYW1pJ10pOjA7CiAgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7CiB9CiBpZigkbT09PSdURVNUQVMnKXsKICAvKiAxLiBhciBrbGFpZHUgZ2F1ZHltYXMgcmVhbGlhaSByYXNvICovCiAgJGx0PSRQLidwc19zYXJnYXNfa2xhaWRvcyc7CiAgJHByaWVzPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkbHRgIik7CiAgQHRyaWdnZXJfZXJyb3IoJ1BFVFNIT1AgU0FSR0FTIHRlc3RpbmlzIGlyYXNhcyBTNzEzJywgRV9VU0VSX1dBUk5JTkcpOwogICRwbz0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSBgJGx0YCIpOwogICRvPWFycmF5KCdrbGFpZHVfcHJpZXMnPT4kcHJpZXMsJ2tsYWlkdV9wbyc9PiRwbywnZ2F1ZG8nPT4oJHBvPiRwcmllcykpOwogICRvWydpcmFzYXMnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGx5Z2lzLHppbnV0ZSxmYWlsYXMsZWlsdXRlLGtpZWsgRlJPTSBgJGx0YCBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLCBBUlJBWV9BKTsKICAvKiAyLiB0ZXN0aW5pcyBsYWlza2FzICovCiAgJG9rPXdwX21haWwoZ2V0X29wdGlvbigncHNfc2FyZ2FzX3Bhc3RhcycpLCdbUGV0c2hvcCBzYXJnYXNdIFRlc3RhcyDigJQgc2FyZ2FzIGlkaWVndGFzJywKICAgICJTdmVpa2ksXG5cblNpcyBsYWlza2FzIHBhdHZpcnRpbmEsIGthZCBQZXRzaG9wIHNhcmdhcyBpZGllZ3RhcyBpciB2ZWlraWEuXG5cbiIKICAgIC4iSWRpZWd0YTogIi5jdXJyZW50X3RpbWUoJ215c3FsJykuIlxuIgogICAgLiJMYXVraWFtaSBjcm9uJ2FpOiAiLmNvdW50KChhcnJheSlnZXRfb3B0aW9uKCdwc19zYXJnYXNfY3Jvbl9sYXVraWFtJyxhcnJheSgpKSkuIlxuIgogICAgLiJLYXNkaWVuaXMgdGlrcmluaW1hczogMDc6MDBcblNhdmFpdGluZSBzdXZlc3RpbmU6IHBpcm1hZGllbmlhaXMgMDg6MDBcblxuIgogICAgLiJOdW8gc2lvbCBsYWlza3UgZ2F1c2l0ZSBUSUsgdGFkYSwga2FpIHJlaWtlcyB2ZWlrc21vLCBwbGl1cyB2aWVuYVxuIgogICAgLiJzdXZlc3RpbmUgcGVyIHNhdmFpdGUuIEplaSBzdXZlc3RpbmUgbmVhdGVpcyDigJQgc2FyZ2FzIG5ldmVpa2lhLlxuXG4iCiAgICAuIkplaSBzaXMgbGFpc2thcyBhdHNpZHVyZSBzbGFtc3RlIOKAlCBwcmFuZXNraXRlLCB0YWkgcmVpc2tpYSBTUEYvREtJTSBwcm9ibGVtYS5cbiIsCiAgICBhcnJheSgnQ29udGVudC1UeXBlOiB0ZXh0L3BsYWluOyBjaGFyc2V0PVVURi04JykpOwogICRvWydsYWlza2FzX2lzdmVzdGFzJ109JG9rPyd0YWlwJzonTkUnOwogIC8qIGlzdmFsb20gdGVzdGluaSBpcmFzYSAqLwogICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00gYCRsdGAgV0hFUkUgemludXRlIExJS0UgJyVTQVJHQVMgdGVzdGluaXMgaXJhc2FzIFM3MTMlJyIpOwogICRvWydpc3ZhbHl0YSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIGAkbHRgIik7CiAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OwogfQp9LCAxMzEpOwo=';
const MD5='72a3a827f1809de1653cb1ee8baf8a82';
const out={versija:'S714'};
async function put(name,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/${name}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
async function snip(n,b64){ const code=Buffer.from(b64,'base64').toString('utf8'); const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:n,code,scope:'global',active:true,priority:5})}); let j=null; try{j=JSON.parse(cr.t);}catch(e){} return j?j.id:null; }
const J=async(u,o)=>{ const t=await (await fetch(WP+u,o)).text(); try{return JSON.parse(t);}catch(e){ return {zalias:t.slice(0,200)}; } };
try{
  const fr=await fetch(`https://api.github.com/repos/${REPO}/contents/deploy/petshop-sargas.php`,{headers:{'Authorization':'Bearer '+TOK,'Accept':'application/vnd.github.raw','User-Agent':'b'}});
  const fbuf=Buffer.from(await fr.arrayBuffer()); out.failas=fbuf.length;
  const s=await snip('TEMP S714',B64);
  await new Promise(r=>setTimeout(r,7000));
  out.recv=await J('/?ps_sd=RECV',{method:'POST',body:fbuf});
  out.apply=await J('/?ps_sd=APPLY&md5='+MD5);
  await new Promise(r=>setTimeout(r,4000));
  out.check=await J('/?ps_sd=CHECK');
  if(s) await api('/wp-json/code-snippets/v1/snippets/'+s,{method:'POST',body:JSON.stringify({id:s,active:false})});
  /* REALI savaitine suvestine - kad savininkas pamatytu tikra formatavima */
  const s2=await snip('TEMP S714B', Buffer.from(
    "add_action('wp_loaded',function(){ if((isset($_GET['ps_sv2'])?$_GET['ps_sv2']:'')!=='SV2') return;"
    +" global $wpdb; $P=$wpdb->prefix;"
    +" $o=array('klase'=>class_exists('Petshop_Sargas')?'YRA':'NERA');"
    +" if(class_exists('Petshop_Sargas')){ Petshop_Sargas::savaitine_suvestine(); $o['issiusta']='taip'; }"
    +" $wpdb->query(\"UPDATE {$P}snippets SET active=0 WHERE name LIKE 'TEMP%'\");"
    +" header('Content-Type: application/json'); echo wp_json_encode($o); exit; },131);"
  ).toString('base64'));
  await new Promise(r=>setTimeout(r,6000));
  out.suvestine=await J('/?ps_sv2=SV2');
  if(s2) await api('/wp-json/code-snippets/v1/snippets/'+s2,{method:'POST',body:JSON.stringify({id:s2,active:false})});
  out.parduotuve=(await fetch(WP+'/')).status;
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('s714.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 's714 sargas v1.1');
