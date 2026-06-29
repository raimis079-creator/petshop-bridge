import { execSync } from "child_process";
import fs from "fs";

const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};
  if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function jget(path){
  const cmd = 'curl -sk -D /tmp/hdr.txt -H "Authorization: '+AUTH+'" -H "Accept: application/json" "'+BASE+path+'"';
  let body=''; let status=0;
  try{ body = execSync(cmd, {encoding:'utf8', maxBuffer: 300000000});
    const hdr = fs.existsSync('/tmp/hdr.txt') ? fs.readFileSync('/tmp/hdr.txt','utf8') : '';
    const ms = hdr.match(/HTTP\/[\d.]+\s+(\d+)/); if(ms) status = parseInt(ms[1],10);
  }catch(e){ return {status:-1, data:{__exc:String(e).slice(0,200)}}; }
  let data; try{ data=JSON.parse(body); }catch(e){ data={__parse_error:true, raw:body.slice(0,300)}; }
  return {status, data};
}

(async()=>{
  const out={ts:new Date().toISOString()};

  // Probe code-snippets API — try a few route shapes
  const tries = [
    '/wp-json/code-snippets/v1/snippets?per_page=200',
    '/wp-json/code-snippets/v1/snippets'
  ];
  let snips=null, used=null, st=null;
  for(const t of tries){
    const r = jget(t);
    st = r.status;
    if(Array.isArray(r.data)){ snips=r.data; used=t; break; }
    if(r.data && r.data.__parse_error){ out['probe_'+t]=r.data.raw; }
    else out['probe_'+t]={status:r.status, data:(r.data && r.data.code)?r.data.code:r.data};
  }
  out.used_route = used; out.list_status = st;

  if(Array.isArray(snips)){
    out.snippet_count = snips.length;
    // list compact
    out.snippets = snips.map(s=>({id:s.id, name:s.name, scope:s.scope, active:s.active, tags:s.tags, codelen:(s.code||'').length}));
    // pull full code for promo/gift/badge/dovana/akcij/bundle/mix/qty/kiek related
    const rx=/promo|gift|dovan|badge|akcij|bundle|mix|kiek|qty|daugiau|pigiau|nuolaid|discount|rinkin/i;
    out.relevant_code = snips.filter(s=>rx.test((s.name||'')+' '+(s.desc||'')+' '+(s.tags||[]).join(' ')))
      .map(s=>({id:s.id, name:s.name, active:s.active, scope:s.scope, code:(s.code||'').slice(0,6000)}));
  }

  commit('recon_snippets.json', JSON.stringify(out,null,1));
  console.log("DONE");
})();
