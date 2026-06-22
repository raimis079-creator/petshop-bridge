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
const TS="1782136599";
function wp(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/w.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/w.json "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// visi GRAUZIKAMS saka: rasti top (oid 87) ir descendants
const all=wp('GET','menu-items?menus=232&per_page=100&_fields=id,title,parent,menu_order,object_id,object');
// GRAUZIKAMS top
const top=all.find(m=>m.object_id===87 && m.object==='product_cat');
out.grauzikams_top=top?{id:top.id,t:top.title.rendered}:null;
if(top){
  // tiesioginiai vaikai + ju vaikai
  const kids=all.filter(m=>m.parent===top.id).map(m=>({id:m.id,t:m.title.rendered,o:m.menu_order,oid:m.object_id}));
  out.grauz_children=kids.sort((a,b)=>a.o-b.o);
  // Narvai ir aksesuarai (oid 304)
  const narvai=all.find(m=>m.object_id===304);
  out.narvai=narvai?{id:narvai.id,parent:narvai.parent,o:narvai.menu_order}:null;
  // jei narvai egzistuoja, deti Kraika kaip seseri
  if(narvai){
    let mi=all.find(m=>m.object_id===657);
    if(!mi){ mi=wp('POST','menu-items',{ title:"Kraikas ir \u0161ienas grau\u017eikams", type:'taxonomy', object:'product_cat', object_id:657, parent:narvai.parent, menus:232, status:'publish', menu_order:narvai.menu_order+1 }); }
    out.created={id:mi.id,t:mi.title&&mi.title.rendered,parent:mi.parent,oid:mi.object_id,o:mi.menu_order};
  }
}
out.fin=putResult('grauz_menu_'+TS+'.txt', out);
