process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import https from 'node:https';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfcjE5NCddKSA/ICRfR0VUWydwc19yMTk0J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxMjApOwogJG8gPSBhcnJheSgndic9PidSMTk0Jyk7CiAkZGV2ID0gJy9ob21lL2d5dnVuYWkyL2RvbWFpbnMvYXZlc2EubHQvcHVibGljX2h0bWwvZGV2JzsKICRiZGlyID0gV1BfQ09OVEVOVF9ESVIuJy91cGxvYWRzL3BzLWJhY2t1cHMnOwogQG1rZGlyKCRiZGlyLDA3NTUsdHJ1ZSk7CgogLyogMS4gd3AtY29uZmlnIGRpbmFtaW5pcyBXUF9IT01FL1dQX1NJVEVVUkwgcGFnYWwgaG9zdGEgKi8KICR3cGMgPSBydHJpbShBQlNQQVRILCcvJykuJy93cC1jb25maWcucGhwJzsKICRjID0gZmlsZV9nZXRfY29udGVudHMoJHdwYyk7CiAkb1snd3Bjb25maWcnXSA9IGFycmF5KCdwcmllc19tZDUnPT5tZDUoJGMpKTsKIGlmKHN0cnBvcygkYywgJ1IxOTQgZGV2IHZlaWRyb2RpcycpICE9PSBmYWxzZSl7CiAgICRvWyd3cGNvbmZpZyddWydpcmFzeXRhJ10gPSAnSkFVIFlSQSc7CiB9IGVsc2UgewogICAkYmxva2FzID0gIlxuLyogUjE5NCBkZXYgdmVpZHJvZGlzIOKAlCBsYWlraW5hcyBpa2kgRE5TIHBlcmp1bmdpbW8sIHBvIGpvIGlzdHJpbnRpICovXG4iCiAgICAgLiJpZiAoIGlzc2V0KCBcJF9TRVJWRVJbJ0hUVFBfSE9TVCddICkgJiYgc3RydG9sb3dlciggXCRfU0VSVkVSWydIVFRQX0hPU1QnXSApID09PSAnZGV2LmF2ZXNhLmx0JyApIHtcbiIKICAgICAuIlx0ZGVmaW5lKCAnV1BfSE9NRScsICdodHRwczovL2Rldi5hdmVzYS5sdCcgKTtcbiIKICAgICAuIlx0ZGVmaW5lKCAnV1BfU0lURVVSTCcsICdodHRwczovL2Rldi5hdmVzYS5sdCcgKTtcbiIKICAgICAuIn1cbiI7CiAgICRwb3MgPSBzdHJwb3MoJGMsICc8P3BocCcpOwogICAkbmF1amFzID0gc3Vic3RyKCRjLCAwLCAkcG9zKzUpIC4gJGJsb2thcyAuIHN1YnN0cigkYywgJHBvcys1KTsKICAgJHQgPSBAdG9rZW5fZ2V0X2FsbCgkbmF1amFzLCBUT0tFTl9QQVJTRSk7CiAgIGlmKCFpc19hcnJheSgkdCkpeyAkb1snd3Bjb25maWcnXVsnaXJhc3l0YSddID0gJ1NJTlRBS1NFUyBLTEFJREEg4oCUIE5FTElFU1RBJzsgfQogICBlbHNlIHsKICAgICBAY29weSgkd3BjLCAkYmRpci4nL3dwLWNvbmZpZ19yMTk0XycuZGF0ZSgnWW1kX0hpcycpLicucGhwLmJhaycpOwogICAgICRvWyd3cGNvbmZpZyddWydpcmFzeXRhJ10gPSBmaWxlX3B1dF9jb250ZW50cygkd3BjLCAkbmF1amFzKSAhPT0gZmFsc2UgPyAnT0snIDogJ05FUEFWWUtPJzsKICAgICAkb1snd3Bjb25maWcnXVsncG9fZHlkaXMnXSA9IGZpbGVzaXplKCR3cGMpOwogICB9CiB9CgogLyogMi4gZGV2LXJvdXRlci5waHAgKyB2ZWlkcm9kemlvIG11LXBsdWdpbiArIG5hdWphcyBkZXYgLmh0YWNjZXNzICovCiAkZmFpbGFpID0gYXJyYXkoCiAgICRkZXYuJy9kZXYtcm91dGVyLnBocCcgPT4gYmFzZTY0X2RlY29kZSgnUEQ5d2FIQUtMeW9nVWpFNU5DQmtaWFl1WVhabGMyRXViSFFnYldGeWMzSjFkR2w2WVhSdmNtbDFjeURpZ0pRZ2JHRnBhMmx1WVhNZ2FXdHBJRVJPVXlCd1pYSnFkVzVuYVcxdkxnb2dJQ0JCY0hSaGNtNWhkV3BoSUhacGMyRWdjM1psZEdGcGJtVWdLSE4wWVhScGEyRWdLeUJRU0ZBcElHbHpJSEJsZEhOb2IzQXViSFFnYTJGMFlXeHZaMjh1SUNvdkNpUmlZWE5sSUQwZ0p5OW9iMjFsTDJkNWRuVnVZV2t5TDJSdmJXRnBibk12Y0dWMGMyaHZjQzVzZEM5d2RXSnNhV05mYUhSdGJDYzdDaVIxY21rZ0lEMGdjR0Z5YzJWZmRYSnNLQ1JmVTBWU1ZrVlNXeWRTUlZGVlJWTlVYMVZTU1NkZElEOC9JQ2N2Snl3Z1VFaFFYMVZTVEY5UVFWUklLVHNLSkhWeWFTQWdQU0J5WVhkMWNteGtaV052WkdVb0tITjBjbWx1Wnlra2RYSnBLVHNLYVdZZ0tDUjFjbWtnUFQwOUlDY25JSHg4SUNSMWNtbGJNRjBnSVQwOUlDY3ZKeWtnZXlBa2RYSnBJRDBnSnk4bkxpUjFjbWs3SUgwS0pHdGxiR2xoY3lBOUlISmxZV3h3WVhSb0tDUmlZWE5sSUM0Z0pIVnlhU2s3Q21sbUlDZ2thMlZzYVdGeklDRTlQU0JtWVd4elpTQW1KaUJwYzE5a2FYSW9KR3RsYkdsaGN5a3BJSHNnSkd0bGJHbGhjeUE5SUhKbFlXeHdZWFJvS0NSclpXeHBZWE1nTGlBbkwybHVaR1Y0TG5Cb2NDY3BPeUFrZFhKcElEMGdjblJ5YVcwb0pIVnlhU3duTHljcExpY3ZhVzVrWlhndWNHaHdKenNnZlFvdktpQnpZWFZuYVd0c2FXRnBJQ292Q2lSaWJHOW5ZWE1nUFNBb0pHdGxiR2xoY3lBOVBUMGdabUZzYzJVcENpQWdmSHdnYzNSeWJtTnRjQ2drYTJWc2FXRnpMQ0FrWW1GelpTd2djM1J5YkdWdUtDUmlZWE5sS1NrZ0lUMDlJREFLSUNCOGZDQmlZWE5sYm1GdFpTZ2thMlZzYVdGektTQTlQVDBnSjNkd0xXTnZibVpwWnk1d2FIQW5DaUFnZkh3Z2MzUnljRzl6S0dKaGMyVnVZVzFsS0NSclpXeHBZWE1wTENBbkxtaDBKeWtnUFQwOUlEQUtJQ0I4ZkNCaVlYTmxibUZ0WlNna2EyVnNhV0Z6S1NBOVBUMGdKM0JsY210bGJIUnBMWEl4T0RZdWNHaHdKenNLYVdZZ0tDUmliRzluWVhNcElIc2dhSFIwY0Y5eVpYTndiMjV6WlY5amIyUmxLRFF3TkNrN0lHaGxZV1JsY2lnblEyOXVkR1Z1ZEMxVWVYQmxPaUIwWlhoMEwzQnNZV2x1T3lCamFHRnljMlYwUFhWMFppMDRKeWs3SUdWamFHOGdKMDVsY21GemRHRW5PeUJsZUdsME95QjlDZ29rWlhoMElEMGdjM1J5ZEc5c2IzZGxjaWh3WVhSb2FXNW1ieWdrYTJWc2FXRnpMQ0JRUVZSSVNVNUdUMTlGV0ZSRlRsTkpUMDRwS1RzS2FXWWdLQ1JsZUhRZ1BUMDlJQ2R3YUhBbktTQjdDaUFnSkY5VFJWSldSVkpiSjFORFVrbFFWRjlHU1V4RlRrRk5SU2RkSUQwZ0pHdGxiR2xoY3pzS0lDQWtYMU5GVWxaRlVsc25VME5TU1ZCVVgwNUJUVVVuWFNBOUlDUjFjbWs3Q2lBZ0pGOVRSVkpXUlZKYkoxQklVRjlUUlV4R0oxMGdQU0FrZFhKcE93b2dJR05vWkdseUtHUnBjbTVoYldVb0pHdGxiR2xoY3lrcE93b2dJSEpsY1hWcGNtVWdKR3RsYkdsaGN6c0tJQ0JsZUdsME93cDlDaVJ0YVcxbElEMGdZWEp5WVhrb0NpQW5ZM056SnowK0ozUmxlSFF2WTNOekp5d25hbk1uUFQ0bllYQndiR2xqWVhScGIyNHZhbUYyWVhOamNtbHdkQ2NzSjIxcWN5YzlQaWRoY0hCc2FXTmhkR2x2Ymk5cVlYWmhjMk55YVhCMEp5d0tJQ2R3Ym1jblBUNG5hVzFoWjJVdmNHNW5KeXduYW5Cbkp6MCtKMmx0WVdkbEwycHdaV2NuTENkcWNHVm5KejArSjJsdFlXZGxMMnB3WldjbkxDZG5hV1luUFQ0bmFXMWhaMlV2WjJsbUp5d25kMlZpY0NjOVBpZHBiV0ZuWlM5M1pXSndKeXduWVhacFppYzlQaWRwYldGblpTOWhkbWxtSnl3S0lDZHpkbWNuUFQ0bmFXMWhaMlV2YzNabkszaHRiQ2NzSjJsamJ5YzlQaWRwYldGblpTOTRMV2xqYjI0bkxDZDNiMlptSnowK0oyWnZiblF2ZDI5bVppY3NKM2R2Wm1ZeUp6MCtKMlp2Ym5RdmQyOW1aakluTENkMGRHWW5QVDRuWm05dWRDOTBkR1luTENkdmRHWW5QVDRuWm05dWRDOXZkR1luTENkbGIzUW5QVDRuWVhCd2JHbGpZWFJwYjI0dmRtNWtMbTF6TFdadmJuUnZZbXBsWTNRbkxBb2dKMnB6YjI0blBUNG5ZWEJ3YkdsallYUnBiMjR2YW5OdmJpY3NKM2h0YkNjOVBpZDBaWGgwTDNodGJDY3NKM1I0ZENjOVBpZDBaWGgwTDNCc1lXbHVKeXduYUhSdGJDYzlQaWQwWlhoMEwyaDBiV3duTENkb2RHMG5QVDRuZEdWNGRDOW9kRzFzSnl3bmNHUm1KejArSjJGd2NHeHBZMkYwYVc5dUwzQmtaaWNzQ2lBbmJYQTBKejArSjNacFpHVnZMMjF3TkNjc0ozZGxZbTBuUFQ0bmRtbGtaVzh2ZDJWaWJTY3NKMjF3TXljOVBpZGhkV1JwYnk5dGNHVm5KeXduZW1sd0p6MCtKMkZ3Y0d4cFkyRjBhVzl1TDNwcGNDY3NKMmQ2SnowK0oyRndjR3hwWTJGMGFXOXVMMmQ2YVhBbkxDZHRZWEFuUFQ0bllYQndiR2xqWVhScGIyNHZhbk52Ymljc0NpazdDbWhsWVdSbGNpZ25RMjl1ZEdWdWRDMVVlWEJsT2lBbkxpaHBjM05sZENna2JXbHRaVnNrWlhoMFhTa2dQeUFrYldsdFpWc2taWGgwWFNBNklDZGhjSEJzYVdOaGRHbHZiaTl2WTNSbGRDMXpkSEpsWVcwbktTazdDbWhsWVdSbGNpZ25RMjl1ZEdWdWRDMU1aVzVuZEdnNklDY3VabWxzWlhOcGVtVW9KR3RsYkdsaGN5a3BPd3BvWldGa1pYSW9KME5oWTJobExVTnZiblJ5YjJ3NklIQjFZbXhwWXl3Z2JXRjRMV0ZuWlQwek5qQXdKeWs3Q2lSdGRDQTlJR1pwYkdWdGRHbHRaU2drYTJWc2FXRnpLVHNLYUdWaFpHVnlLQ2RNWVhOMExVMXZaR2xtYVdWa09pQW5MbWR0WkdGMFpTZ25SQ3dnWkNCTklGa2dTRHBwT25NbkxDQWtiWFFwTGljZ1IwMVVKeWs3Q21sbUlDaHBjM05sZENna1gxTkZVbFpGVWxzblNGUlVVRjlKUmw5TlQwUkpSa2xGUkY5VFNVNURSU2RkS1NBbUppQnpkSEowYjNScGJXVW9KRjlUUlZKV1JWSmJKMGhVVkZCZlNVWmZUVTlFU1VaSlJVUmZVMGxPUTBVblhTa2dQajBnSkcxMEtTQjdJR2gwZEhCZmNtVnpjRzl1YzJWZlkyOWtaU2d6TURRcE95QmxlR2wwT3lCOUNuSmxZV1JtYVd4bEtDUnJaV3hwWVhNcE93cGxlR2wwT3dvPScpLAogICBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWRldi12ZWlkcm9kaXMucGhwJyA9PiBiYXNlNjRfZGVjb2RlKCdQRDl3YUhBS0x5b3FDaUFxSUZCc2RXZHBiaUJPWVcxbE9pQlFaWFJ6YUc5d0lFUmxkaUJXWldsa2NtOWthWE1nZGpFdU1DQW9VakU1TkNrS0lDb2dSR1Z6WTNKcGNIUnBiMjQ2SUdSbGRpNWhkbVZ6WVM1c2RDQnNZVzVyZVhSdmFtRnRjeUJ3WlhKeVlYTnZJSEJsZEhOb2IzQXViSFFnYm5WdmNtOWtZWE1nYVNCa1pYWXVZWFpsYzJFdWJIUWdhWElnY0hKcFpHVmtZU0J1YjJsdVpHVjRMaUJNUVVsTFNVNUJVeURpZ0pRZ2RISnBiblJwSUhCdklFUk9VeUJ3WlhKcWRXNW5hVzF2TGdvZ0tpOEthV1lnS0NGa1pXWnBibVZrS0NkQlFsTlFRVlJJSnlrcElHVjRhWFE3Q21sbUlDaHBjM05sZENna1gxTkZVbFpGVWxzblNGUlVVRjlJVDFOVUoxMHBJQ1ltSUhOMGNuUnZiRzkzWlhJb0pGOVRSVkpXUlZKYkowaFVWRkJmU0U5VFZDZGRLU0E5UFQwZ0oyUmxkaTVoZG1WellTNXNkQ2NwSUhzS0lDQm9aV0ZrWlhJb0oxZ3RVbTlpYjNSekxWUmhaem9nYm05cGJtUmxlQ3dnYm05bWIyeHNiM2NuTENCMGNuVmxLVHNLSUNCdllsOXpkR0Z5ZENobWRXNWpkR2x2Ymlna2FIUnRiQ2w3Q2lBZ0lDQnBaaUFvSVdselgzTjBjbWx1Wnlna2FIUnRiQ2tnZkh3Z0pHaDBiV3dnUFQwOUlDY25LU0J5WlhSMWNtNGdKR2gwYld3N0NpQWdJQ0FrYUhSdGJDQTlJSE4wY2w5eVpYQnNZV05sS0Nkb2RIUndjem92TDNCbGRITm9iM0F1YkhRbkxDQW5hSFIwY0hNNkx5OWtaWFl1WVhabGMyRXViSFFuTENBa2FIUnRiQ2s3Q2lBZ0lDQWthSFJ0YkNBOUlITjBjbDl5WlhCc1lXTmxLQ2RvZEhSd09pOHZjR1YwYzJodmNDNXNkQ2NzSUNkb2RIUndjem92TDJSbGRpNWhkbVZ6WVM1c2RDY3NJQ1JvZEcxc0tUc0tJQ0FnSUNSb2RHMXNJRDBnYzNSeVgzSmxjR3hoWTJVb0oyaDBkSEJ6T2x3dlhDOXdaWFJ6YUc5d0xteDBKeXdnSjJoMGRIQnpPbHd2WEM5a1pYWXVZWFpsYzJFdWJIUW5MQ0FrYUhSdGJDazdDaUFnSUNBa2FIUnRiQ0E5SUhOMGNsOXlaWEJzWVdObEtDZG9kSFJ3T2x3dlhDOXdaWFJ6YUc5d0xteDBKeXdnSjJoMGRIQnpPbHd2WEM5a1pYWXVZWFpsYzJFdWJIUW5MQ0FrYUhSdGJDazdDaUFnSUNBa2FIUnRiQ0E5SUhOMGNsOXlaWEJzWVdObEtDY3ZMM0JsZEhOb2IzQXViSFF2Snl3Z0p5OHZaR1YyTG1GMlpYTmhMbXgwTHljc0lDUm9kRzFzS1RzS0lDQWdJSEpsZEhWeWJpQWthSFJ0YkRzS0lDQjlLVHNLZlFvPScpLAogICAkZGV2LicvLmh0YWNjZXNzJyA9PiBiYXNlNjRfZGVjb2RlKCdVbVYzY21sMFpVVnVaMmx1WlNCUGJncFNaWGR5YVhSbFFtRnpaU0F2Q2xKbGQzSnBkR1ZTZFd4bElDNHFJQzBnVzBVOVNGUlVVRjlCVlZSSVQxSkpXa0ZVU1U5T09pVjdTRlJVVURwQmRYUm9iM0pwZW1GMGFXOXVmVjBLVW1WM2NtbDBaVU52Ym1RZ0pYdFNSVkZWUlZOVVgwWkpURVZPUVUxRmZTQWhMV1lLVW1WM2NtbDBaVkoxYkdVZ0xpQXZaR1YyTFhKdmRYUmxjaTV3YUhBZ1cweGRDZz09JyksCiApOwogZm9yZWFjaCgkZmFpbGFpIGFzICRrZWxpYXM9PiRrb2Rhcyl7CiAgIGlmKHN1YnN0cigka2VsaWFzLC00KT09PScucGhwJyl7CiAgICAgJHQgPSBAdG9rZW5fZ2V0X2FsbCgka29kYXMsIFRPS0VOX1BBUlNFKTsKICAgICBpZighaXNfYXJyYXkoJHQpKXsgJG9bJ2ZhaWxhaSddWyRrZWxpYXNdPSdTSU5UQUtTRVMgS0xBSURBJzsgY29udGludWU7IH0KICAgfQogICAkciA9IGZpbGVfcHV0X2NvbnRlbnRzKCRrZWxpYXMsICRrb2Rhcyk7CiAgICRvWydmYWlsYWknXVtiYXNlbmFtZSgka2VsaWFzKV0gPSAoJHIgIT09IGZhbHNlID8gJ09LICcuJHIuJyBCJyA6ICdORVBBVllLTycpOwogfQogJG9bJ2Rldl90dXJpbnlzJ10gPSBhcnJheV92YWx1ZXMoYXJyYXlfZGlmZigoYXJyYXkpc2NhbmRpcigkZGV2KSwgYXJyYXkoJy4nLCcuLicpKSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg=='; const IP='79.98.29.24';
const out={versija:'RUN8-R194'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
function ipReq(host, path){
  return new Promise((resolve)=>{
    const req=https.request({host:IP, port:443, path, method:'GET', servername:host, rejectUnauthorized:false, headers:{Host:host,'User-Agent':'ps-run8'}}, (res)=>{
      let d=''; res.on('data',c=>{ d+=c; }); res.on('end',()=>resolve({s:res.statusCode, t:d}));
    });
    req.on('error',(e)=>resolve({s:0,t:String(e).slice(0,200)}));
    req.setTimeout(30000,()=>{req.destroy(); resolve({s:0,t:'timeout'});});
    req.end();
  });
}
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP R194 Dev veidrodis deploy',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snippet_id=j&&j.id?j.id:('KLAIDA '+cr.s);
  await miegok(8000);
  const rA=await fetch(WP+'/?ps_r194=GO',{redirect:'manual'}); const tA=await rA.text();
  try{ out.DEPLOY=JSON.parse(tA); }catch(e){ out.DEPLOY={ZALIAS:tA.slice(0,900), s:rA.status}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  await miegok(4000);

  /* dev.avesa.lt patikros per tikra DNS */
  out.DEV={};
  const f1=await fetch(WP+'/',{redirect:'manual'}); const h1=await f1.text();
  out.DEV.titulinis={s:f1.status, loc:f1.headers.get('location'), dev_nuorodu:(h1.match(/dev\.avesa\.lt/g)||[]).length, petshop_liko:(h1.match(/petshop\.lt/g)||[]).length, title:(h1.match(/<title>[^<]{0,80}/)||[''])[0]};
  const f2=await fetch(WP+'/wp-login.php',{redirect:'manual'}); const h2=await f2.text();
  out.DEV.wplogin={s:f2.status, forma_i_dev:h2.includes('dev.avesa.lt/wp-login.php')?'TAIP':'ne'};
  const f3=await fetch(WP+'/wp-admin/',{redirect:'manual'});
  out.DEV.wpadmin={s:f3.status, loc:(f3.headers.get('location')||'').slice(0,120)};
  const f4=await fetch(WP+'/wp-content/uploads/2026/07/upl_logo-mark-v2.png',{redirect:'manual'});
  out.DEV.statika_png={s:f4.status, tipas:f4.headers.get('content-type'), dydis:f4.headers.get('content-length')};
  const f5=await api('/wp-json/code-snippets/v1/snippets');
  let s5=[]; try{s5=JSON.parse(f5.t);}catch(e){}
  out.DEV.rest={s:f5.s, kiek:Array.isArray(s5)?s5.length:'?'};
  const f6=await fetch(WP+'/parduotuve/',{redirect:'manual'}); const h6=await f6.text();
  out.DEV.parduotuve={s:f6.status, dev_nuorodu:(h6.match(/dev\.avesa\.lt/g)||[]).length};

  /* petshop.lt per IP — regresijos nera */
  const t1=await ipReq('petshop.lt','/');
  out.PETSHOP_IP={s:t1.s, petshop_nuorodu:(String(t1.t).match(/https:\/\/petshop\.lt/g)||[]).length, dev_liko:(String(t1.t).match(/dev\.avesa\.lt/g)||[]).length};

  /* vizualas */
  const { chromium } = await import('playwright');
  const br = await chromium.launch();
  const ctx = await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1366,height:900}});
  const pg = await ctx.newPage();
  const nepavyke=[]; const i_petshop=[];
  pg.on('requestfailed',rq=>{ if(nepavyke.length<10) nepavyke.push(rq.url().slice(0,140)+' :: '+(rq.failure()?rq.failure().errorText:'')); });
  pg.on('request',rq=>{ if(rq.url().includes('//petshop.lt')&&i_petshop.length<10) i_petshop.push(rq.url().slice(0,140)); });
  await pg.goto('https://dev.avesa.lt/',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(7000);
  await put('screenshots/r194_dev_titulinis.png', await pg.screenshot({fullPage:false}), 'r194 dev titulinis');
  await pg.goto('https://dev.avesa.lt/wp-login.php',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(3000);
  await put('screenshots/r194_dev_login.png', await pg.screenshot({fullPage:false}), 'r194 dev login');
  out.VIZ={nepavykusios:nepavyke, uzklausos_i_petshop:i_petshop};
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r194.json', Buffer.from(JSON.stringify(out,null,1)), 'r194 dev veidrodis');
