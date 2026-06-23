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
const TS=String(Date.now());
// imu kelias ivairias Eukanuba: 7 buvusios tuscios + kelios "senos"
const ids=[14772, 12463, 12460, 33452]; // 3 buvusios tuscios + Eukanuba EVD (ZB, sena su turtingu tekstu)
const out={ts:TS, items:[]};
for(const id of ids){
  try{
    const p=JSON.parse(execSync(`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/wc/v3/products/${id}?_fields=id,name,permalink"`,{encoding:'utf8',env,maxBuffer:20000000}));
    const url=p.permalink+(p.permalink.includes('?')?'&':'?')+'ps_desc=1';
    const html=execSync(`curl -sk --max-time 45 "${url}"`,{encoding:'utf8',maxBuffer:50000000});
    // istraukiu accordion sekciju pavadinimus
    const secs=[];
    const re=/<summary[^>]*>([^<]+)</gi; let m;
    while((m=re.exec(html))){ secs.push(m[1].trim()); }
    out.items.push({
      id, name:p.name.slice(0,45),
      has_accordion: html.includes('ps-desc-acc')||html.includes('psdp'),
      sections: secs
    });
  }catch(e){ out.items.push({id, err:e.message.slice(0,60)}); }
}
putResult('eukrender_'+TS+'.json', JSON.stringify(out,null,2));
console.log('done');
