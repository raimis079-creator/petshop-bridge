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
const TS="1782149468";
const out={};
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// 1) APPLY Zuvies rusis (validuota)
const za=execSync(`curl -sk --max-time 90 "https://dev.avesa.lt/?petshop_attr_zuvrusis=apply&confirm=APPLY&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const zm=za.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.zuvrusis_apply=zm?{viso:+zm[1],parsed:+zm[2],review:+zm[3],mode:/APPLY<\/h2>/.test(za)}:'no';
// 2) Pasaro forma atributas
let attr=null; try{ const al=wc('GET','products/attributes?per_page=100&_fields=id,name,slug'); attr=al.find(a=>a.slug==='pa_pasaro_forma'||a.slug==='pasaro_forma'); }catch(e){}
if(!attr){ attr=wc('POST','products/attributes',{ name:"Pa\u0161aro forma", slug:"pasaro_forma", type:"select", order_by:"menu_order", has_archives:false }); }
out.attribute={id:attr.id,name:attr.name,slug:attr.slug};
// 3) snippet
let php=fs.readFileSync('modules/pasforma.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
let snip=null; try{ const list=cs('GET','snippets?per_page=100'); if(Array.isArray(list)) snip=list.find(s=>s.name==='Pasaro Forma Modulis v1.0'); }catch(e){}
let r; if(snip){ r=cs('PUT','snippets/'+snip.id,{name:'Pasaro Forma Modulis v1.0',scope:'global',priority:11,active:true,code:php}); } else { r=cs('POST','snippets',{name:'Pasaro Forma Modulis v1.0',scope:'global',priority:11,active:true,code:php}); }
out.snippet={id:r.id,active:r.active};
execSync('sleep 2');
// 4) DRY Pasaro forma
const html=execSync(`curl -sk --max-time 60 "https://dev.avesa.lt/?petshop_attr_pasforma=dry&k=ps2026"`,{encoding:'utf8',maxBuffer:10000000});
const m=html.match(/Viso:\s*<b>(\d+)<\/b>.*?PARSED:\s*<b>(\d+)<\/b>.*?REVIEW:\s*<b>(\d+)<\/b>/s);
out.forma_summary=m?{viso:+m[1],parsed:+m[2],review:+m[3]}:html.slice(0,200);
out.forma_dist={};
[...html.matchAll(/=&gt; ([^<]+)<\/td>/g)].forEach(x=>{ const t=x[1].trim(); out.forma_dist[t]=(out.forma_dist[t]||0)+1; });
// keli pavyzdziai
out.samples=[...html.matchAll(/<td>(\d+)<\/td><td>([^<]*)<\/td><td class="[pr]">PARSED<\/td><td>([^<]*)<\/td>/g)].filter(r=>/wafers|sticks|stics|vibra|pellet/i.test(r[2])||['18172','18166','18206','18227','18341'].includes(r[1])).slice(0,12).map(r=>r[1]+' '+r[2].slice(0,46)+' => '+r[3]);
out.fin=putResult('forma_dry_'+TS+'.txt', out);
