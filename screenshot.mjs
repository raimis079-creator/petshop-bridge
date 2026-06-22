import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function putResult(name, obj){
  const b64=Buffer.from((typeof obj==='string')?obj:JSON.stringify(obj,null,1),'utf8').toString('base64');
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  function getSha(){try{return JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){return '';}}
  function doPut(sha){const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/p.json',JSON.stringify(body));return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/p.json "'+url+'"',{encoding:'utf8'}).trim();}
  let code='';for(let i=0;i<5;i++){const sha=getSha();code=doPut(sha);if(code==='200'||code==='201')return code;execSync('sleep 2');}return 'FAIL:'+code;
}
const TS="1782150090";
const out={};
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
let php=fs.readFileSync('modules/pasforma.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const r=cs('PUT','snippets/510',{name:'Pasaro Forma Modulis v1.1',scope:'global',priority:11,active:true,code:php});
out.snippet={id:r.id,active:r.active};
execSync('sleep 2');
const html=execSync(`curl -sk --max-time 60 "https://dev.avesa.lt/?petshop_attr_pasforma=dry&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const m=html.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.summary=m?{viso:+m[1],parsed:+m[2],review:+m[3]}:'no';
out.dist={};
[...html.matchAll(/=&gt; ([^<]+)<\/td>/g)].forEach(x=>{ const t=x[1].trim(); out.dist[t]=(out.dist[t]||0)+1; });
out.has_vafliai=/Vafliai/.test(html);
// micro wafers patikra + algae wafers patikra
out.check=[...html.matchAll(/<td>(\d+)<\/td><td>([^<]*)<\/td><td class="[pr]">PARSED<\/td><td>([^<]*)<\/td>/g)].filter(r=>/wafers/i.test(r[2])).map(r=>r[1]+' '+r[2].slice(0,42)+' => '+r[3].replace('pa_pasaro_forma =&gt; ',''));
out.fin=putResult('forma_dry2_'+TS+'.txt', out);
