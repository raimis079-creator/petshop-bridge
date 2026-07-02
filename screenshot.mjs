import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'pub',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbpub.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbpub.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  var out={ts:new Date().toISOString()};
  // 1. Snippet inventory
  var s = exec('curl -sk -m 30 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets"');
  try{ var arr=JSON.parse(s); out.snippets_total=arr.length; out.snippets_active=arr.filter(x=>x.active).map(x=>({id:x.id,name:x.name,scope:x.scope})); out.snippets_inactive_count=arr.filter(x=>!x.active).length; }catch(e){ out.snippets_err=s.slice(0,200); }
  // 2. Plugins + versions
  var p = exec('curl -sk -m 30 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/plugins?_fields=plugin,status,version,name"');
  try{ var pa=JSON.parse(p); out.plugins=pa.map(x=>({p:x.plugin,st:x.status,v:x.version})); }catch(e){ out.plugins_err=p.slice(0,300); }
  // 3. Homepage noindex
  var h = exec('curl -sk -m 20 "'+BASE+'/" | grep -io "noindex[^\\"]*" | head -3');
  out.noindex = h.trim() || 'NOT_FOUND';
  // 4. Sprendimai pages statuses
  out.pages={};
  for (var id of [34253,34254,34258,34259,34260,34261,34262]){
    var r = exec('curl -sk -m 15 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/pages/'+id+'?context=edit&_fields=id,status,title"');
    try{ var j=JSON.parse(r); out.pages[id]=j.status+' | '+(j.title&&j.title.raw||''); }catch(e){ out.pages[id]='?'; }
  }
  // 5. Product counts by status (X-WP-Total header)
  out.prod_counts={};
  for (var st of ['publish','draft','pending','private']){
    var hd = exec('curl -sk -m 20 -I -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wp/v2/product?status='+st+'&per_page=1&context=edit"');
    var m = hd.match(/x-wp-total:\s*(\d+)/i); out.prod_counts[st]= m?m[1]:'?';
  }
  // 6. WooCommerce version + env via wc/v3 system_status (light fields)
  var ss = exec('curl -sk -m 30 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/wc/v3/system_status?_fields=environment"');
  try{ var e=JSON.parse(ss).environment; out.env={wp:e.wp_version,wc:e.version,php:e.php_version,mem:e.wp_memory_limit}; }catch(e2){ out.env_err=ss.slice(0,200); }
  commit('audit_a.json', JSON.stringify(out));
  console.log('done');
})();
