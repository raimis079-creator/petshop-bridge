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
const TS="1782141277";
const out={};
function cs(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/c.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/c.json "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/code-snippets/v1/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
// redeploy 503 v1.2
let php=fs.readFileSync('modules/grauzrusis.php','utf8').replace(/^\uFEFF?<\?php\s*/,'');
const r=cs('PUT','snippets/503',{ name:'Grauziko Rusis Modulis v1.2', scope:'global', priority:11, active:true, code:php });
out.snippet503={id:r.id,active:r.active};
// temp yith dump snippet
const dump=`add_action('init', function(){ if (empty($_GET['ps_yith_dump']) || ($_GET['k']??'')!=='ps2026') return; $posts=get_posts(array('post_type'=>'yith_wcan_preset','numberposts'=>-1,'post_status'=>'any')); $list=array(); foreach($posts as $p){ $list[]=array('id'=>$p->ID,'slug'=>$p->post_name,'title'=>$p->post_title); } $one=get_page_by_path('suku-filtras', OBJECT, 'yith_wcan_preset'); $detail=null; if($one){ $mk=get_post_meta($one->ID); $d=array(); foreach($mk as $k=>$v){ $d[$k]= maybe_unserialize($v[0]); } $detail=$d; } header('Content-Type: application/json; charset=utf-8'); echo json_encode(array('list'=>$list,'suku_meta'=>$detail), JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE); exit; }, 5);`;
let did=null; try{ const lst=cs('GET','snippets?per_page=100'); if(Array.isArray(lst)){ const e=lst.find(s=>s.name==='TEMP Yith Dump'); if(e) did=e.id; } }catch(e){}
let dr; if(did){ dr=cs('PUT','snippets/'+did,{name:'TEMP Yith Dump',scope:'global',active:true,code:dump}); } else { dr=cs('POST','snippets',{name:'TEMP Yith Dump',scope:'global',active:true,code:dump}); }
out.dump_snippet={id:dr.id,active:dr.active};
out.fin=putResult('yithrecon_'+TS+'.txt', out);
