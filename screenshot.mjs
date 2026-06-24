import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};if(sha)body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'}).trim();
}
function getCode(){for(let i=0;i<4;i++){try{execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?context=edit" -o /tmp/s.json`,{encoding:'utf8',env,maxBuffer:50000000});return JSON.parse(fs.readFileSync('/tmp/s.json','utf8'));}catch(e){execSync('sleep 3');}}return null;}
const out={};
const o=getCode();
if(!o){out.err="read fail";commit("snip512_patch.json",JSON.stringify(out,null,2));console.log("ERR");}
else{
  const code=o.code||"";
  const anchor="li{margin:2px 0}'. '</style>';";
  const media="@media (max-width:600px){.ps-desc-acc .ps-desc-body table{display:block;overflow-x:auto;-webkit-overflow-scrolling:touch;width:100%}.ps-desc-acc .ps-desc-body td,.ps-desc-acc .ps-desc-body th{white-space:nowrap}}";
  const repl="li{margin:2px 0}' . '"+media+"'. '</style>';";
  out.anchor_count=code.split(anchor).length-1;
  out.had_media=/@media/.test(code);
  if(out.anchor_count!==1){out.err="anchor!=1";commit("snip512_patch.json",JSON.stringify(out,null,2));console.log("ANCHOR ERR");}
  else{
    const newCode=code.replace(anchor,repl);
    out.old_len=code.length;out.new_len=newCode.length;out.delta=newCode.length-code.length;
    // PUT back, preserve active
    fs.writeFileSync('/tmp/upd.json',JSON.stringify({code:newCode,active:true}));
    const wc=execSync(`curl -sk --max-time 45 -o /tmp/wr.json -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/upd.json "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512"`,{encoding:'utf8',env,maxBuffer:50000000}).trim();
    out.write_http=wc;
    // read back
    const o2=getCode();
    out.after_has_media=o2?/@media \(max-width:600px\)/.test(o2.code||""):null;
    out.after_active=o2?o2.active:null;
    out.after_len=o2?(o2.code||"").length:null;
    // capture any write error body
    try{const wb=JSON.parse(fs.readFileSync('/tmp/wr.json','utf8'));if(wb.code&&wb.message&&wc!=="200")out.write_err=String(wb.message).slice(0,150);}catch(e){}
    commit("snip512_patch.json",JSON.stringify(out,null,2));
    console.log("DONE "+JSON.stringify(out));
  }
}
