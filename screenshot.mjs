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
const TS="1782124645";
function wc(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/b.json',JSON.stringify(body)); cmd=`curl -sk --max-time 50 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/b.json "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } else { cmd=`curl -sk --max-time 35 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wc/v3/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
function wp(method,p,body){ let cmd; if(body){ fs.writeFileSync('/tmp/w.json',JSON.stringify(body)); cmd=`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -X ${method} -d @/tmp/w.json "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } else { cmd=`curl -sk --max-time 30 -u "$WP_USER:$WP_PASS_CLEAN" -X ${method} "https://dev.avesa.lt/wp-json/wp/v2/${p}"`; } return JSON.parse(execSync(cmd,{encoding:'utf8',env,maxBuffer:20000000})); }
const out={};
// 1) kategorija (idempotent)
let pp=null; try{ const r=wc('GET','products/categories?slug=pirmoji-pagalba-sunims&_fields=id,name,slug,parent'); if(Array.isArray(r)&&r[0]) pp=r[0]; }catch(e){}
if(!pp){ pp=wc('POST','products/categories',{ name:"Pirmoji pagalba \u0161unims", slug:"pirmoji-pagalba-sunims", parent:70 }); }
out.cat={id:pp.id,name:pp.name,slug:pp.slug,parent:pp.parent};
// 2) perkelti 23609, 22275
const ids=[23609,22275];
const upd=[];
for(const id of ids){ const prod=wc('GET','products/'+id+'?_fields=id,name,categories'); let cats=prod.categories.map(c=>c.id).filter(x=>x!==82); if(!cats.includes(pp.id)) cats.push(pp.id); upd.push({id,categories:cats.map(x=>({id:x}))}); }
const mr=wc('POST','products/batch',{update:upd});
out.moved=(mr&&Array.isArray(mr.update))?mr.update.length:mr;
out.pp_count=wc('GET','products/categories/'+pp.id+'?_fields=count').count;
out.higiena_count=wc('GET','products/categories/82?_fields=count').count;
// 3) meniu - i PRIEZIURA IR SVEIKATA stulpeli (3158), po Sukos (order 12)
let mi=null; try{ const ex=wp('GET','menu-items?menus=232&search=Pirmoji&per_page=10&_fields=id,title,object_id'); if(Array.isArray(ex)) mi=ex.find(x=>x.object_id===pp.id); }catch(e){}
if(!mi){ mi=wp('POST','menu-items',{ title:"Pirmoji pagalba \u0161unims", type:'taxonomy', object:'product_cat', object_id:pp.id, parent:3158, menus:232, status:'publish', menu_order:13 }); }
out.menu_item={id:mi.id,t:mi.title&&mi.title.rendered,parent:mi.parent,oid:mi.object_id};
out.fin=putResult('firstaid_'+TS+'.txt', out);
