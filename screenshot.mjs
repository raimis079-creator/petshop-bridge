import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/pp.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/pp.json "'+url+'"',{encoding:'utf8',maxBuffer:50000000}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782197583";
const chunks=["14772,14478,12463,12462,12461,12460,17947,19785,19770,19765,19730,19725,19760,19756,19751,19747,19720,19715,19780,19775,19740,19735,18623,21531,18572,18521,21123,18385,18382,18372,18369,18366,18354,18338,18332,18323,18320,18314,18302,18272", "18254,18212,18206,18203,18197,18188,18181,18178,18172,18169,27128,18159,18154,27130,27132,18149,18058,18054,18051,17965,17969,17959,26899,17751,17748,27126,16889,16886,16881,16876,16871,16868,16865,16862,16857,16854,16745,16824,16810,16794", "16791,16788,16785,16782,16779,16776,16772,16763,16751,16727,16724,16718,16712,16702,16609,16591,16645,16633,16627,16624,16588,16585,16582,16573,16431,16425,16422,16411,16402,14795,16326,16329,16534,16525,16481,16478,16475,16472,16469,16466", "16270,16265,16259,16254"];
const out={imports:null, sources:{zb:0,vf:0,'vf+legacy':0,legacy:0,unknown:0}, examples:{zb:[],legacy:[],vf:[],'vf+legacy':[],unknown:[]}};
// pilnas importu sarasas
try{ const r=execSync(`curl -sk --max-time 60 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?ps_imprisk=1&k=ps2026"`,{encoding:'utf8',env,maxBuffer:50000000});
  const j=JSON.parse(r); out.imports=(j.imports||[]).map(im=>({id:im.id,name:im.name,k:im.key||{},uk:im.unique_key||''}));
}catch(e){ out.imp_err=e.message.slice(0,100); }
// chunkais saltiniai
for(const ch of chunks){
  try{ const r=execSync(`curl -sk --max-time 90 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/?ps_imprisk=1&k=ps2026&ids=${ch}"`,{encoding:'utf8',env,maxBuffer:50000000});
    const j=JSON.parse(r); const s=j.datagap_sources||{};
    for(const k in out.sources) out.sources[k]+=(s[k]||0);
    const ex=j.datagap_examples||{};
    for(const k in out.examples){ (ex[k]||[]).forEach(e=>{ if(out.examples[k].length<8) out.examples[k].push(e); }); }
  }catch(e){ out.chunk_err=(out.chunk_err||'')+e.message.slice(0,40)+';'; }
  execSync('sleep 1');
}
putResult('imprisk4_'+TS+'.json', JSON.stringify(out));
