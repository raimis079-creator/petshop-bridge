process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import https from 'node:https';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjE5NSddKSA/ICRfR0VUWydwc19yMTk1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKICRvID0gYXJyYXkoJ3YnPT4nUjE5NScpOwogJGtvZGFzID0gYmFzZTY0X2RlY29kZSgnUEQ5d2FIQUtMeW9nVWpFNU5DQmtaWFl1WVhabGMyRXViSFFnYldGeWMzSjFkR2w2WVhSdmNtbDFjeUIyTVM0eElPS0FsQ0JzWVdscmFXNWhjeUJwYTJrZ1JFNVRJSEJsY21wMWJtZHBiVzh1Q2lBZ0lFRndkR0Z5Ym1GMWFtRWdkbWx6WVNCemRtVjBZV2x1WlNBb2MzUmhkR2xyWVNBcklGQklVQ2tnYVhNZ2NHVjBjMmh2Y0M1c2RDQnJZWFJoYkc5bmJ5NGdLaThLSkdKaGMyVWdQU0FuTDJodmJXVXZaM2wyZFc1aGFUSXZaRzl0WVdsdWN5OXdaWFJ6YUc5d0xteDBMM0IxWW14cFkxOW9kRzFzSnpzS0pIVnlhU0FnUFNCd1lYSnpaVjkxY213b0pGOVRSVkpXUlZKYkoxSkZVVlZGVTFSZlZWSkpKMTBnUHo4Z0p5OG5MQ0JRU0ZCZlZWSk1YMUJCVkVncE93b2tkWEpwSUNBOUlISmhkM1Z5YkdSbFkyOWtaU2dvYzNSeWFXNW5LU1IxY21rcE93cHBaaUFvSkhWeWFTQTlQVDBnSnljZ2ZId2dKSFZ5YVZzd1hTQWhQVDBnSnk4bktTQjdJQ1IxY21rZ1BTQW5MeWN1SkhWeWFUc2dmUW9rYTJWc2FXRnpJRDBnY21WaGJIQmhkR2dvSkdKaGMyVWdMaUFrZFhKcEtUc0thV1lnS0NSclpXeHBZWE1nSVQwOUlHWmhiSE5sSUNZbUlHbHpYMlJwY2lna2EyVnNhV0Z6S1NrZ2V5QWthMlZzYVdGeklEMGdjbVZoYkhCaGRHZ29KR3RsYkdsaGN5QXVJQ2N2YVc1a1pYZ3VjR2h3SnlrN0lDUjFjbWtnUFNCeWRISnBiU2drZFhKcExDY3ZKeWt1Snk5cGJtUmxlQzV3YUhBbk95QjlDaThxSUhOaGRXZHBhMnhwWVdrZ0tpOEtKR0pzYjJkaGN5QTlJQ2drYTJWc2FXRnpJRDA5UFNCbVlXeHpaU2tLSUNCOGZDQnpkSEp1WTIxd0tDUnJaV3hwWVhNc0lDUmlZWE5sTENCemRISnNaVzRvSkdKaGMyVXBLU0FoUFQwZ01Bb2dJSHg4SUdKaGMyVnVZVzFsS0NSclpXeHBZWE1wSUQwOVBTQW5kM0F0WTI5dVptbG5MbkJvY0NjS0lDQjhmQ0J6ZEhKd2IzTW9ZbUZ6Wlc1aGJXVW9KR3RsYkdsaGN5a3NJQ2N1YUhRbktTQTlQVDBnTUFvZ0lIeDhJR0poYzJWdVlXMWxLQ1JyWld4cFlYTXBJRDA5UFNBbmNHVnlhMlZzZEdrdGNqRTROaTV3YUhBbk93cHBaaUFvSkdKc2IyZGhjeWtnZXdvZ0lDOHFJRzVsSUdaaGFXeGhjeURpZ0pRZ2NHVnlaSFZ2WkdGdElGZHZjbVJRY21WemN5Qm1jbTl1ZENCamIyNTBjbTlzYkdWeWFYVnBJQ2huY21GNmRYTWdWVkpNTENCM2NDMXFjMjl1TENBME1EUWdjSE5zTGlrZ0tpOEtJQ0FrYTJWc2FXRnpJRDBnSkdKaGMyVWdMaUFuTDJsdVpHVjRMbkJvY0NjN0NpQWdKRjlUUlZKV1JWSmJKMU5EVWtsUVZGOUdTVXhGVGtGTlJTZGRJRDBnSkd0bGJHbGhjenNLSUNBa1gxTkZVbFpGVWxzblUwTlNTVkJVWDA1QlRVVW5YU0E5SUNjdmFXNWtaWGd1Y0dod0p6c0tJQ0FrWDFORlVsWkZVbHNuVUVoUVgxTkZURVluWFNBOUlDY3ZhVzVrWlhndWNHaHdKenNLSUNCamFHUnBjaWdrWW1GelpTazdDaUFnY21WeGRXbHlaU0FrYTJWc2FXRnpPd29nSUdWNGFYUTdDbjBLQ2lSbGVIUWdQU0J6ZEhKMGIyeHZkMlZ5S0hCaGRHaHBibVp2S0NSclpXeHBZWE1zSUZCQlZFaEpUa1pQWDBWWVZFVk9VMGxQVGlrcE93cHBaaUFvSkdWNGRDQTlQVDBnSjNCb2NDY3BJSHNLSUNBa1gxTkZVbFpGVWxzblUwTlNTVkJVWDBaSlRFVk9RVTFGSjEwZ1BTQWthMlZzYVdGek93b2dJQ1JmVTBWU1ZrVlNXeWRUUTFKSlVGUmZUa0ZOUlNkZElEMGdKSFZ5YVRzS0lDQWtYMU5GVWxaRlVsc25VRWhRWDFORlRFWW5YU0E5SUNSMWNtazdDaUFnWTJoa2FYSW9aR2x5Ym1GdFpTZ2thMlZzYVdGektTazdDaUFnY21WeGRXbHlaU0FrYTJWc2FXRnpPd29nSUdWNGFYUTdDbjBLSkcxcGJXVWdQU0JoY25KaGVTZ0tJQ2RqYzNNblBUNG5kR1Y0ZEM5amMzTW5MQ2RxY3ljOVBpZGhjSEJzYVdOaGRHbHZiaTlxWVhaaGMyTnlhWEIwSnl3bmJXcHpKejArSjJGd2NHeHBZMkYwYVc5dUwycGhkbUZ6WTNKcGNIUW5MQW9nSjNCdVp5YzlQaWRwYldGblpTOXdibWNuTENkcWNHY25QVDRuYVcxaFoyVXZhbkJsWnljc0oycHdaV2NuUFQ0bmFXMWhaMlV2YW5CbFp5Y3NKMmRwWmljOVBpZHBiV0ZuWlM5bmFXWW5MQ2QzWldKd0p6MCtKMmx0WVdkbEwzZGxZbkFuTENkaGRtbG1KejArSjJsdFlXZGxMMkYyYVdZbkxBb2dKM04yWnljOVBpZHBiV0ZuWlM5emRtY3JlRzFzSnl3bmFXTnZKejArSjJsdFlXZGxMM2d0YVdOdmJpY3NKM2R2Wm1ZblBUNG5abTl1ZEM5M2IyWm1KeXduZDI5bVpqSW5QVDRuWm05dWRDOTNiMlptTWljc0ozUjBaaWM5UGlkbWIyNTBMM1IwWmljc0oyOTBaaWM5UGlkbWIyNTBMMjkwWmljc0oyVnZkQ2M5UGlkaGNIQnNhV05oZEdsdmJpOTJibVF1YlhNdFptOXVkRzlpYW1WamRDY3NDaUFuYW5OdmJpYzlQaWRoY0hCc2FXTmhkR2x2Ymk5cWMyOXVKeXduZUcxc0p6MCtKM1JsZUhRdmVHMXNKeXduZEhoMEp6MCtKM1JsZUhRdmNHeGhhVzRuTENkb2RHMXNKejArSjNSbGVIUXZhSFJ0YkNjc0oyaDBiU2M5UGlkMFpYaDBMMmgwYld3bkxDZHdaR1luUFQ0bllYQndiR2xqWVhScGIyNHZjR1JtSnl3S0lDZHRjRFFuUFQ0bmRtbGtaVzh2YlhBMEp5d25kMlZpYlNjOVBpZDJhV1JsYnk5M1pXSnRKeXduYlhBekp6MCtKMkYxWkdsdkwyMXdaV2NuTENkNmFYQW5QVDRuWVhCd2JHbGpZWFJwYjI0dmVtbHdKeXduWjNvblBUNG5ZWEJ3YkdsallYUnBiMjR2WjNwcGNDY3NKMjFoY0NjOVBpZGhjSEJzYVdOaGRHbHZiaTlxYzI5dUp5d0tLVHNLYUdWaFpHVnlLQ2REYjI1MFpXNTBMVlI1Y0dVNklDY3VLR2x6YzJWMEtDUnRhVzFsV3lSbGVIUmRLU0EvSUNSdGFXMWxXeVJsZUhSZElEb2dKMkZ3Y0d4cFkyRjBhVzl1TDI5amRHVjBMWE4wY21WaGJTY3BLVHNLYUdWaFpHVnlLQ2REYjI1MFpXNTBMVXhsYm1kMGFEb2dKeTVtYVd4bGMybDZaU2drYTJWc2FXRnpLU2s3Q21obFlXUmxjaWduUTJGamFHVXRRMjl1ZEhKdmJEb2djSFZpYkdsakxDQnRZWGd0WVdkbFBUTTJNREFuS1RzS0pHMTBJRDBnWm1sc1pXMTBhVzFsS0NSclpXeHBZWE1wT3dwb1pXRmtaWElvSjB4aGMzUXRUVzlrYVdacFpXUTZJQ2N1WjIxa1lYUmxLQ2RFTENCa0lFMGdXU0JJT21rNmN5Y3NJQ1J0ZENrdUp5QkhUVlFuS1RzS2FXWWdLR2x6YzJWMEtDUmZVMFZTVmtWU1d5ZElWRlJRWDBsR1gwMVBSRWxHU1VWRVgxTkpUa05GSjEwcElDWW1JSE4wY25SdmRHbHRaU2drWDFORlVsWkZVbHNuU0ZSVVVGOUpSbDlOVDBSSlJrbEZSRjlUU1U1RFJTZGRLU0ErUFNBa2JYUXBJSHNnYUhSMGNGOXlaWE53YjI1elpWOWpiMlJsS0RNd05DazdJR1Y0YVhRN0lIMEtjbVZoWkdacGJHVW9KR3RsYkdsaGN5azdDbVY0YVhRN0NnPT0nKTsKICR0ID0gQHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7CiBpZighaXNfYXJyYXkoJHQpKXsgJG9bJ2lyYXN5dGEnXT0nU0lOVEFLU0VTIEtMQUlEQSc7IH0KIGVsc2UgewogICAkayA9ICcvaG9tZS9neXZ1bmFpMi9kb21haW5zL2F2ZXNhLmx0L3B1YmxpY19odG1sL2Rldi9kZXYtcm91dGVyLnBocCc7CiAgICRvWydpcmFzeXRhJ10gPSBmaWxlX3B1dF9jb250ZW50cygkaywka29kYXMpICE9PSBmYWxzZSA/ICdPSyAnLnN0cmxlbigka29kYXMpLicgQicgOiAnTkVQQVZZS08nOwogICAkb1snbWQ1J10gPSBtZDVfZmlsZSgkaykgPT09IG1kNSgka29kYXMpID8gJ1NVVEFNUEEnIDogJ05FJzsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK'; const IP='79.98.29.24';
const out={versija:'RUN10-R195b'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
function ipReq(host, path, opt={}){
  return new Promise((resolve)=>{
    const body = opt.body || null;
    const hdr = {Host:host,'User-Agent':'ps-run10',...(opt.headers||{})};
    if(body) hdr['Content-Length'] = Buffer.byteLength(body);
    const req=https.request({host:IP, port:443, path, method:opt.method||'GET', servername:host, rejectUnauthorized:false, headers:hdr}, (res)=>{
      let d=''; res.on('data',c=>{ if(d.length<8000) d+=c; }); res.on('end',()=>resolve({s:res.statusCode, t:d}));
    });
    req.on('error',(e)=>resolve({s:0,t:String(e).slice(0,200)}));
    req.setTimeout(30000,()=>{req.destroy(); resolve({s:0,t:'timeout'});});
    if(body) req.write(body);
    req.end();
  });
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
try{
  /* 1. AUTH diagnostika per petshop.lt */
  const d1=await ipReq('petshop.lt','/wp-json/wp/v2/users/me',{headers:A});
  out.users_me={s:d1.s, t:String(d1.t).slice(0,180)};
  const d2=await ipReq('petshop.lt','/index.php?rest_route=/wp/v2/users/me',{headers:A});
  out.users_me_rr={s:d2.s, t:String(d2.t).slice(0,180)};

  /* 2. Snippeto kurimas per veikianti kelia */
  const kunas=JSON.stringify({name:'TEMP R195 Router v1.1',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5});
  let j=null, kelias=null;
  for(const p of ['/wp-json/code-snippets/v1/snippets','/index.php?rest_route=/code-snippets/v1/snippets']){
    const c=await ipReq('petshop.lt',p,{method:'POST',headers:A,body:kunas});
    out['post_'+(kelias===null?'a':'b')]={s:c.s, t:String(c.t).slice(0,180)};
    try{ const jj=JSON.parse(c.t); if(jj&&jj.id){ j=jj; kelias=p; break; } }catch(e){}
    kelias='bandyta';
  }
  out.snippet_id = j&&j.id ? j.id : 'NEPAVYKO';
  if(j&&j.id){
    await miegok(8000);
    /* 3. Trigeris per dev wp-load stub — be canonical redirect */
    const rA=await fetch(WP+'/wp-load.php?ps_r195=GO'); const tA=await rA.text();
    try{ out.DEPLOY=JSON.parse(tA); }catch(e){ out.DEPLOY={ZALIAS:tA.slice(0,300), s:rA.status}; }
    await miegok(3000);
    /* 4. dev REST atgijo? */
    const f2=await fetch(WP+'/wp-json/code-snippets/v1/snippets',{headers:A});
    let s2=[]; try{s2=JSON.parse(await f2.text());}catch(e){}
    out.dev_rest={s:f2.status, kiek:Array.isArray(s2)?s2.length:'?'};
    /* 5. deaktyvuojam TEMP */
    if(Array.isArray(s2)&&s2.length){ for(const s of s2){ if(String(s.name||'').startsWith('TEMP')&&s.active){ await fetch(WP+'/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); out.deaktyvuota=(out.deaktyvuota||[]).concat(s.id); } } }
    /* 6. pilnos dev patikros */
    const f3=await fetch(WP+'/parduotuve/',{redirect:'manual'}); const h3=await f3.text();
    out.parduotuve={s:f3.status, dev_nuorodu:(h3.match(/dev\.avesa\.lt/g)||[]).length};
    const f4=await fetch(WP+'/product/duvoplius-zaislas-suniui-pliusinis-melynasis-banginis-27x8x7cm/',{redirect:'manual'}); const h4=await f4.text();
    out.preke={s:f4.status, title:(h4.match(/<title>[^<]{0,80}/)||[''])[0]};
    const f5=await fetch(WP+'/wp-json/wp/v2/product?per_page=1');
    out.wp_v2={s:f5.status};
    const f6=await fetch(WP+'/nesamas-kelias-xyz/',{redirect:'manual'}); const h6=await f6.text();
    out.wp404={s:f6.status, wp_puslapis:h6.includes('<html')?'TAIP':'ne'};
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/r195b.json', Buffer.from(JSON.stringify(out,null,1)), 'r195b router fix per petshop REST');
