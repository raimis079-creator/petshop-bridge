import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(n,s){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'rw',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(p){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 25 "'+DEV+p+'"',{encoding:'utf8',maxBuffer:20000000,timeout:27000,env:{...process.env,WPU,WPP}}); }catch(e){ return ''; } }
let out='';
const ids = ['custom_html-2','custom_html-3','custom_html-4','custom_html-5'];
const backup = {};
for(const id of ids){
  const r = api('/wp-json/wp/v2/widgets/'+id+'?context=edit');
  try{
    const j = JSON.parse(r);
    out += '=== '+id+' ('+j.sidebar+') ===\n';
    // instance.raw jei yra, arba encoded (base64)
    let content = '';
    let title = '';
    if(j.instance && j.instance.raw){
      content = j.instance.raw.content || '';
      title = j.instance.raw.title || '';
      out += 'raw.title: '+JSON.stringify(title)+'\n';
      out += 'raw.content:\n'+content+'\n\n';
      backup[id] = { instance: { raw: { title, content } } };
    } else if(j.instance && j.instance.encoded){
      out += 'encoded (base64): '+j.instance.encoded.slice(0,80)+'...\n';
      // Decode base64 -> serialized PHP -> parse
      const buf = Buffer.from(j.instance.encoded, 'base64');
      out += 'decoded (utf8): '+buf.toString('utf8').slice(0,500)+'\n';
      backup[id] = { instance: { encoded: j.instance.encoded, hash: j.instance.hash } };
    } else {
      out += 'RAW/ENCODED nera - full JSON:\n'+r.slice(0,600)+'\n';
    }
    out += '\n';
  }catch(e){ out += id+' READ ERR: '+r.slice(0,200)+'\n\n'; }
}
// Backup i faila
putFile('widgets_backup.json', JSON.stringify(backup, null, 2));
putFile('readwidgets.txt', out);
