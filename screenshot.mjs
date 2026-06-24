import { execSync } from "child_process";
import fs from "fs";
const env = { ...process.env, WP_PASS_CLEAN: (process.env.WP_APP_PASS||"").replace(/\s+/g,"") };
function commit(name, str){
  const b64=Buffer.from(str,'utf8').toString('base64');const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';try{sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const body={message:'r',content:b64,branch:'main'};if(sha)body.sha=sha;fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  return execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -H "User-Agent: r" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8',maxBuffer:80000000}).trim();
}
const TS=String(Date.now());
const out={};
// 1. GET snippet
const s=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?k=ps2026"`,{encoding:'utf8',env,maxBuffer:30000000}));
const code=s.code||"";
out.before_len=code.length;
// 2. naujas kompaktiskumo CSS (PHP concat, iterpiamas pries </style>)
const addCss = " . '.ps-desc-acc .ps-desc-body p{margin:0 0 8px}'"
  + " . '.ps-desc-acc .ps-desc-body table{border-collapse:collapse;width:auto;margin:8px 0}'"
  + " . '.ps-desc-acc .ps-desc-body td{padding:1px 14px 1px 0;vertical-align:top;border:0}'"
  + " . '.ps-desc-acc .ps-desc-body td p{margin:0;line-height:1.4}'"
  + " . '.ps-desc-acc .ps-desc-body td strong{white-space:nowrap}'"
  + " . '.ps-desc-acc .ps-desc-body ul{margin:6px 0 8px;padding-left:20px}'"
  + " . '.ps-desc-acc .ps-desc-body li{margin:2px 0}'";
const anchor = ". '</style>';";
out.anchor_found = code.indexOf(anchor)>-1;
out.already_has_compact = code.indexOf('.ps-desc-body td{padding:1px')>-1;
if(!out.anchor_found){ out.ABORT="anchor nerastas"; commit("csscss_"+TS+".json",JSON.stringify(out,null,2)); console.log("ABORT"); process.exit(0); }
if(out.already_has_compact){ out.ABORT="jau pridetas"; commit("csscss_"+TS+".json",JSON.stringify(out,null,2)); console.log("JAU"); process.exit(0); }
const newCode = code.replace(anchor, addCss + anchor);
out.after_len=newCode.length;
out.inserted = newCode.length>code.length && newCode.indexOf('.ps-desc-body td{padding:1px')>-1;
if(!out.inserted){ out.ABORT="iterpimas nepavyko"; commit("csscss_"+TS+".json",JSON.stringify(out,null,2)); console.log("ABORT2"); process.exit(0); }
// 3. PUT snippet
fs.writeFileSync('/tmp/snip.json', JSON.stringify({id:512, code:newCode}));
const wc=execSync(`curl -sk --max-time 45 -o /tmp/wr.json -w "%{http_code}" -X PUT -u "$WP_USER:$WP_PASS_CLEAN" -H "Content-Type: application/json" -d @/tmp/snip.json "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?k=ps2026"`,{encoding:'utf8',env,maxBuffer:30000000}).trim();
out.write_http=wc;
// 4. verify
execSync('sleep 2');
const s2=JSON.parse(execSync(`curl -sk --max-time 40 -u "$WP_USER:$WP_PASS_CLEAN" "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/512?k=ps2026"`,{encoding:'utf8',env,maxBuffer:30000000}));
out.live_has_compact = (s2.code||"").indexOf('.ps-desc-body td{padding:1px')>-1;
out.live_active = s2.active;
out.live_len = (s2.code||"").length;
commit("csscss_"+TS+".json", JSON.stringify(out,null,2));
console.log("DONE "+TS);
