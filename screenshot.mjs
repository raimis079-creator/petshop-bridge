import { execSync } from 'child_process';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMzcg4oCUIG1hZ2ljLWxvZ2luIGRyYWZ0X2lkIHByaXJpc2ltYXMKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX21sNyddKSApIHJldHVybjsKICAgICR2ID0gJF9HRVRbJ3BzX21sNyddOwogICAgbm9jYWNoZV9oZWFkZXJzKCk7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgICAkciA9IGFycmF5KCdWRVJTSUpBJz0+J21hZ2ljLWRyYWZ0LXYxJyk7CiAgICAkTSA9IFBFVFNIT1BfQ09SRV9ESVIuJ2luY2x1ZGVzL2NsYXNzLW1hZ2ljLWxvZ2luLnBocCc7CiAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRNKTsKICAgICRwID0gYXJyYXkoCiAgICAgICdBJz0+YXJyYXkoYmFzZTY0X2RlY29kZSgnQ1FrSkoyRnlaM01uSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRDArSUdGeWNtRjVLQW9KQ1FrSkoyVnRZV2xzSnlBOVBpQmhjbkpoZVNnZ0ozSmxjWFZwY21Wa0p5QTlQaUIwY25WbExDQW5kSGx3WlNjZ1BUNGdKM04wY21sdVp5Y2dLU3dLQ1FrSktTdz0nKSwgYmFzZTY0X2RlY29kZSgnQ1FrSkoyRnlaM01uSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJRDArSUdGeWNtRjVLQW9KQ1FrSkoyVnRZV2xzSnlBOVBpQmhjbkpoZVNnZ0ozSmxjWFZwY21Wa0p5QTlQaUIwY25WbExDQW5kSGx3WlNjZ1BUNGdKM04wY21sdVp5Y2dLU3dLQ1FrSkNTOHZJRk16TXpjNklFNUZVRkpKVmtGTVQwMUJVeTRnUVc1dmJtbHRhVzVwYnlCa2NtRm1kRzhnS0ZNek1qZ3ZVek16TmlrZ1ZWVkpSQzRLQ1FrSkNTOHZJRTVsY0dGMFpXbHJkWE1nNG9DVUlHVnNaM05sYm1FZ1NVUkZUbFJKVTB0QklITmxibUZxWVdrdUNna0pDUWtuWkhKaFpuUmZhV1FuSUQwK0lHRnljbUY1S0NBbmNtVnhkV2x5WldRbklEMCtJR1poYkhObExDQW5kSGx3WlNjZ1BUNGdKM04wY21sdVp5Y2dLU3dLQ1FrSktTdz0nKSksCiAgICAgICdCJz0+YXJyYXkoYmFzZTY0X2RlY29kZSgnQ1Fra2RHOXJaVzRnUFNCd2MxOW5aVzVsY21GMFpWOTBiMnRsYmlnZ1lYSnlZWGtvQ2drSkNTZHdkWEp3YjNObEp5QWdJQ0FnSUNBOVBpQnpaV3htT2pwVVQwdEZUbDlRVlZKUVQxTkZMQW9KQ1FrbmMzVmlhbVZqZEY5cFpDY2dJQ0FnUFQ0Z0pIVnpaWElnUHlBb2FXNTBLU0FrZFhObGNpMCtTVVFnT2lBd0xBb0pDUWtuYzNWaWFtVmpkRjlsYldGcGJDY2dQVDRnSkdWdFlXbHNMQW9KQ1FrbmRIUnNYM05sWTI5dVpITW5JQ0FnUFQ0Z2MyVnNaam82VkU5TFJVNWZWRlJNTEFvSkNRa25ZV04wYVc5dUp5QWdJQ0FnSUNBZ1BUNGdKR052Ym5SbGVIUXNDZ2tKS1NBcE93PT0nKSwgYmFzZTY0X2RlY29kZSgnQ1Frdkx5QlRNek0zT2lCaGJtOXVhVzFwYm1sdklHUnlZV1owYnlCd2NtbHlhWE5wYldGekxpQmdjbVZ6YjNWeVkyVmZhV1JnSUhseVlTQkpVaUJ3WVhOcGNtRnplWFJoYldVS0NRa3ZMeUIwYjJ0bGJpZHZJSEJoZVd4dllXUW5aU0FvU0UxQlF5MVRTRUV5TlRZcExDQkpVaUJFUWlCbGFXeDFkR1ZxWlNEaWdKUWdkRzlrWld3Z1lIQnliMk5sYzNOZmJHOW5hVzVnQ2drSkx5OGdaMkYxY3lCVVNVc2dkR0VnWkhKaFpuUmZhV1FzSUd0MWNta2dVMFZTVmtWU1NWTWdjM1Z6YVdWcWJ5QnpkU0J6YVhWdklIUnZhMlZ1SjNVdUNna0pMeThnWkhKaFpuUmZhV1FnU1ZNZ1ZWSk1JSEYxWlhKNUlITjBjbWx1WnlCT1NVVkxRVVJCSUc1bGJtRjFaRzlxWVcxaGN5NEtDUWtrWkhKaFpuUmZhV1FnUFNCelpXeG1PanB5WlhOdmJIWmxYMlJ5WVdaMFgyWnZjbDlsYldGcGJDZ2dKSEpsY1hWbGMzUXRQbWRsZEY5d1lYSmhiU2dnSjJSeVlXWjBYMmxrSnlBcExDQWtaVzFoYVd3Z0tUc0tDZ2tKSkhSdmEyVnVJRDBnY0hOZloyVnVaWEpoZEdWZmRHOXJaVzRvSUdGeWNtRjVLQW9KQ1FrbmNIVnljRzl6WlNjZ0lDQWdJQ0FnUFQ0Z2MyVnNaam82VkU5TFJVNWZVRlZTVUU5VFJTd0tDUWtKSjNOMVltcGxZM1JmYVdRbklDQWdJRDArSUNSMWMyVnlJRDhnS0dsdWRDa2dKSFZ6WlhJdFBrbEVJRG9nTUN3S0NRa0pKM04xWW1wbFkzUmZaVzFoYVd3bklEMCtJQ1JsYldGcGJDd0tDUWtKSjNSMGJGOXpaV052Ym1Sekp5QWdJRDArSUhObGJHWTZPbFJQUzBWT1gxUlVUQ3dLQ1FrSkoyRmpkR2x2YmljZ0lDQWdJQ0FnSUQwK0lDUmpiMjUwWlhoMExBb0pDUWtuY21WemIzVnlZMlZmYVdRbklDQWdQVDRnSkdSeVlXWjBYMmxrTEFvSkNTa2dLVHM9JykpLAogICAgICAnQyc9PmFycmF5KGJhc2U2NF9kZWNvZGUoJ0NTOHFLZ29KSUNvZ1VFOVRWQ0F2Y0dWMGMyaHZjQzkyTVM5dFlXZHBZeTFzYjJkcGJpOXlaWEYxWlhOMENna2dLaUJXYVhOaFpHRWdaM0poZW1sdVlTQjBZU0J3WVhScElHRjBjMkZyZVcxaElDaGxiblZ0WlhKaGRHbHZiaUJoY0hOaGRXZGhLUzRLQ1NBcUx3PT0nKSwgYmFzZTY0X2RlY29kZSgnQ1M4cUtnb0pJQ29nVXpNek56b2dWRkpKUjFWQ1FTQmtjbUZtZEc4Z2NHRjBhV3R5WVNCd2NtbGxjeUJ3Y21seWFYTmhiblFnYW1rZ2NISnBaU0J0WVdkcFl5MXNiMmRwYmlCMGIydGxiaWR2TGdvSklDb0tDU0FxSUVkeVlYcHBibUVnWkhKaFpuUmZhV1FnVkVsTElHcGxhU0JXU1ZOUFV5QnpZV3g1WjI5eklIUmxibXRwYm1GdGIzTTZDZ2tnS2lBZ0lERXVJR1p2Y20xaGRHRnpJT0tBbENCbllXeHBiMnBoYm5ScGN5QlZWVWxFSUhZME93b0pJQ29nSUNBeUxpQmtjbUZtZEdGeklFVkhXa2xUVkZWUFNrRTdDZ2tnS2lBZ0lETXVJR1J5WVdaMGJ5QmdaVzFoYVd4ZmFHRnphR0FnVTFWVVFVMVFRU0J6ZFNCdWIzSnRZV3hwZW5WdmRHOGdjR0YwWldscmRHOGdaV3d1SUhCaGMzUnZJRWhOUVVNN0Nna2dLaUFnSURRdUlITjBZWFIxYzJGeklHQmhZM1JwZG1WZ0lDaE9SU0JqYkdGcGJXbHVaeTlqYkdGcGJXVmtMMlY0Y0dseVpXUXBPd29KSUNvZ0lDQTFMaUJnWlhod2FYSmxjMTloZEdBZ1pHRnlJRzVsY0hKaFpXcHZMZ29KSUNvS0NTQXFJT0tZaFNCT1JVRlVTVlJKUzFWVElPS0FsQ0JuY21GNmFXNWhiU0FuSnlCcGNpQnNZV2x6YTJGeklITnBkVzVqYVdGdFlYTWdRa1VnWkhKaFpuUnZJQ2h3WVhCeVlYTjBZWE1LQ1NBcUlDQWdiV0ZuYVdNZ2JHOW5hVzRwTGlCT1JVZFNRVnBKVGtGTklHdHNZV2xrYjNNNklHdHBkR0ZwY0NCaGRITmhhM2x0WVhNZ1lYUnphMnhsYVhOMGRTd2dZWElnZEc5cmN3b0pJQ29nSUNCa2NtRm1kR0Z6SUdWbmVtbHpkSFZ2YW1FZ2FYSWdhMkZ0SUdwcGN5QndjbWxyYkdGMWMyOGdLR1Z1ZFcxbGNtRjBhVzl1S1M0S0NTQXFDZ2tnS2lEaW1JVWdVMGxUSUUxRlZFOUVRVk1nVGtWTFZWSkpRU0J3WlhRc0lFNUZVRkpCUkVWRVFTQmpiR0ZwYlNCcGNpQk9SVXRGU1VOSlFTQmtjbUZtZEc4Z1luVnpaVzV2Y3k0S0NTQXFMd29KY0hKcGRtRjBaU0J6ZEdGMGFXTWdablZ1WTNScGIyNGdjbVZ6YjJ4MlpWOWtjbUZtZEY5bWIzSmZaVzFoYVd3b0lDUmtjbUZtZEY5cFpDd2dKR1Z0WVdsc0lDa2dld29KQ1NSa2NtRm1kRjlwWkNBOUlHbHpYM04wY21sdVp5Z2dKR1J5WVdaMFgybGtJQ2tnUHlCMGNtbHRLQ0FrWkhKaFpuUmZhV1FnS1NBNklDY25Pd29KQ1dsbUlDZ2dKeWNnUFQwOUlDUmtjbUZtZEY5cFpDQXBJSHNLQ1FrSmNtVjBkWEp1SUNjbk93b0pDWDBLQ1Frdkx5QXhLU0JtYjNKdFlYUmhjeURpZ0pRZ2NISnBaWE1nWW1WMElHdHZhMmtnUkVJZ2MydGhhWFI1YmRDd0Nna0phV1lnS0NBaElIQnlaV2RmYldGMFkyZ29JQ2N2WGxzd0xUbGhMV1pkZXpoOUxWc3dMVGxoTFdaZGV6UjlMVFJiTUMwNVlTMW1YWHN6ZlMxYk9EbGhZbDFiTUMwNVlTMW1YWHN6ZlMxYk1DMDVZUzFtWFhzeE1uMGtMMmtuTENBa1pISmhablJmYVdRZ0tTQXBJSHNLQ1FrSmNtVjBkWEp1SUNjbk93b0pDWDBLQ1FscFppQW9JQ0VnWTJ4aGMzTmZaWGhwYzNSektDQW5VR1YwYzJodmNGOVFaWFJmUkhKaFpuUnpKeUFwSUNrZ2V3b0pDUWx5WlhSMWNtNGdKeWM3Q2drSmZRb0pDUzh2SURJcElHVm5lbWx6ZEdGMmFXMWhjd29KQ1NSeWIzY2dQU0JRWlhSemFHOXdYMUJsZEY5RWNtRm1kSE02T21kbGRDZ2dKR1J5WVdaMFgybGtJQ2s3Q2drSmFXWWdLQ0FoSUNSeWIzY2dLU0I3Q2drSkNYSmxkSFZ5YmlBbkp6c0tDUWw5Q2drSkx5OGdNeWtnYzJGMmFXNXBibXRoY3lEaWdKUWdTRTFCUXlCd1lXeDVaMmx1YVcxaGN5d2dhR0Z6YUY5bGNYVmhiSE1nS0hScGJXbHVaeTF6WVdabEtRb0pDU1JvWVhOb0lEMGdVR1YwYzJodmNGOVFaWFJmUkhKaFpuUnpPanBsYldGcGJGOW9ZWE5vS0NBa1pXMWhhV3dnS1RzS0NRbHBaaUFvSUNjbklEMDlQU0FrYUdGemFDQjhmQ0FoSUdoaGMyaGZaWEYxWVd4ektDQW9jM1J5YVc1bktTQWtjbTkzTFQ1bGJXRnBiRjlvWVhOb0xDQWthR0Z6YUNBcElDa2dld29KQ1FseVpYUjFjbTRnSnljN0Nna0pmUW9KQ1M4dklEUXBJSE4wWVhSMWMyRnpDZ2tKYVdZZ0tDQW5ZV04wYVhabEp5QWhQVDBnSkhKdmR5MCtjM1JoZEhWeklDa2dld29KQ1FseVpYUjFjbTRnSnljN0Nna0pmUW9KQ1M4dklEVXBJR2RoYkdsdmFtbHRZWE1LQ1FscFppQW9JSE4wY25SdmRHbHRaU2dnS0hOMGNtbHVaeWtnSkhKdmR5MCtaWGh3YVhKbGMxOWhkQ0FwSUR3Z2RHbHRaU2dwSUNrZ2V3b0pDUWx5WlhSMWNtNGdKeWM3Q2drSmZRb0pDWEpsZEhWeWJpQWtaSEpoWm5SZmFXUTdDZ2w5Q2dvSkx5b3FDZ2tnS2lCUVQxTlVJQzl3WlhSemFHOXdMM1l4TDIxaFoybGpMV3h2WjJsdUwzSmxjWFZsYzNRS0NTQXFJRlpwYzJGa1lTQm5jbUY2YVc1aElIUmhJSEJoZEdrZ1lYUnpZV3Q1YldFZ0tHVnVkVzFsY21GMGFXOXVJR0Z3YzJGMVoyRXBMZ29KSUNvdicpKSwKICAgICk7CiAgICBmb3JlYWNoICgkcCBhcyAkaz0+JHgpIHsgJHJbJ2lua2FyYWknXVska10gPSBzdWJzdHJfY291bnQoJGMsICR4WzBdKTsgfQogICAgJHJbJ2phdSddID0gKHN0cnBvcygkYywncmVzb2x2ZV9kcmFmdF9mb3JfZW1haWwnKSAhPT0gZmFsc2UpOwogICAgaWYgKCR2PT09J2RyeScpIHsgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgIGlmICgkdj09PSdhcHBseScpIHsKICAgICAgICBpZiAoJHJbJ2phdSddKSB7ICRyWydWRVJESUtUQVMnXT0nSkFVIElESUVHVEEnOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7IH0KICAgICAgICBmb3JlYWNoICgkclsnaW5rYXJhaSddIGFzICRrPT4kbikgeyBpZiAoJG4hPT0xKSB7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQgaW5rYXJhcyAnLiRrLic9Jy4kbjsgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0OyB9IH0KICAgICAgICAkbiA9ICRjOwogICAgICAgIGZvcmVhY2ggKCRwIGFzICR4KSB7ICRuID0gc3RyX3JlcGxhY2UoJHhbMF0sICR4WzFdLCAkbik7IH0KICAgICAgICAkb2s9dHJ1ZTsgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuLFRPS0VOX1BBUlNFKTt9Y2F0Y2goXFBhcnNlRXJyb3IgJGUpeyRvaz1mYWxzZTskclsna2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKTt9CiAgICAgICAgJHJbJ3NpbnRha3NlJ109JG9rOwogICAgICAgIGlmICgkb2spIHsgY29weSgkTSwkTS4nLmJha19TMzM3Jyk7IGZpbGVfcHV0X2NvbnRlbnRzKCRNLCRuKTsgJHJbJ1ZFUkRJS1RBUyddPSdJRElFR1RBJzsgJHJbJ2R5ZGlzJ109ZmlsZXNpemUoJE0pOyB9CiAgICAgICAgZWxzZSB7ICRyWydWRVJESUtUQVMnXT0nU1VTVEFCRFlUQSDigJQgc2ludGFrc2UnOyB9CiAgICAgICAgJHJbJ3NpdGUnXSA9IHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKHdwX3JlbW90ZV9nZXQoaG9tZV91cmwoJy8nKSwgYXJyYXkoJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UpKSk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('magicdraft.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_ml7=dry"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.dry=uzk(1);
sh('sleep 3');
const a=sh('curl -sSk -m 50 "'+SITE+'/?ps_ml7=apply"');
try{ O.apply=JSON.parse(a.out); }catch(e){ O.apply_raw=a.out.slice(0,800); }
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('magicdraft.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
