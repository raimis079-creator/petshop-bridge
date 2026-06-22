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
const TS="1782123592";
function api(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/m.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/m.json "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// stulpeliu antrastes (3114 vaikai)
const cols=api('GET','menu-items?menus=232&parent=3114&per_page=50&_fields=id,title,menu_order');
out.columns=cols.map(c=>({id:c.id,t:c.title.rendered,o:c.menu_order}));
const aks=cols.find(c=>/aksesuarai/i.test(c.title.rendered));
out.aks_id=aks?aks.id:null;
if(aks){
  const leaves=api('GET','menu-items?menus=232&parent='+aks.id+'&per_page=50&_fields=id,title,menu_order,object_id');
  out.aks_leaves=leaves.map(l=>({id:l.id,t:l.title.rendered,o:l.menu_order,oid:l.object_id})).sort((a,b)=>a.o-b.o);
  const guoliai=leaves.find(l=>/guoliai/i.test(l.title.rendered));
  const baseOrder=guoliai?guoliai.menu_order:(Math.max(...leaves.map(l=>l.menu_order))||0);
  // sukurti 2 menu-items kaip taxonomy product_cat
  const mk=(title,oid,order)=>api('POST','menu-items',{ title, type:'taxonomy', object:'product_cat', object_id:oid, parent:aks.id, menus:232, status:'publish', menu_order:order });
  const r1=mk("V\u0117sinantys kilim\u0117liai \u0161unims",654, baseOrder+1);
  const r2=mk("Baseinai \u0161unims",655, baseOrder+2);
  out.created=[ {id:r1.id,t:r1.title&&r1.title.rendered,oid:r1.object_id,parent:r1.parent}, {id:r2.id,t:r2.title&&r2.title.rendered,oid:r2.object_id,parent:r2.parent} ];
}
out.fin=putResult('menuadd_'+TS+'.txt', out);
