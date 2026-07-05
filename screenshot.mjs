import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'gvg',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbgvg.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbgvg.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
(async()=>{
  // 1. Perjungiam 539 i global scope laikinai
  var cur = exec('curl -sk -m 20 -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/539"');
  var code539=''; try{ code539=JSON.parse(cur).code; }catch(e){}
  if (!code539) { commit('gen_via_global.json', JSON.stringify({err:'no 539 code'})); return; }
  fs.writeFileSync('/tmp/g539.json', JSON.stringify({scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/g539.json "'+BASE+'/wp-json/code-snippets/v1/snippets/539"');
  
  // 2. Probe (global) kuris iskvieicia callback frontend'e
  var probe = \`add_action('init', function(){
    if ((\\$_GET['psc_gvg'] ?? '') !== '1') return;
    if ((\\$_GET['k'] ?? '') !== 'ps2026' && !current_user_can('manage_options')) return;
    \\$fn='petshop_rinkinio_forma_page'; \\$out=array('exists'=>function_exists(\\$fn));
    if(function_exists(\\$fn)){
      \\$errs=array(); set_error_handler(function(\\$n,\\$s)use(&\\$errs){\\$errs[]="[\\$n] \\$s";return true;});
      ob_start(); try{ call_user_func(\\$fn); }catch(Throwable \\$e){\\$errs[]='EXC:'.\\$e->getMessage();}
      \\$h=ob_get_clean(); restore_error_handler();
      \\$out['errors']=\\$errs; \\$out['len']=strlen(\\$h);
      \\$out['browse']=strpos(\\$h,'bf-browse')!==false;
      \\$out['catfilter']=strpos(\\$h,'bf-cat-filter')!==false;
      \\$out['addchecked']=strpos(\\$h,'bf-add-checked')!==false;
      \\$out['chkall']=strpos(\\$h,'bf-chk-all')!==false;
      \\$out['runsearch']=strpos(\\$h,'function runSearch')!==false;
      \\$out['browsehandler']=strpos(\\$h,"runSearch('', true)")!==false;
      if(preg_match('/petCats\\\\s*=\\\\s*(\\\\[.*?\\\\]);/s',\\$h,\\$mm)){ \\$dd=json_decode(\\$mm[1],true); \\$out['petcats']=is_array(\\$dd)?count(\\$dd):0; \\$out['sample']=is_array(\\$dd)?array_slice(array_column(\\$dd,'name'),0,5):null; } else { \\$out['petcats']='MISS'; }
    }
    header('Content-Type: application/json'); echo wp_json_encode(\\$out); exit;
  });\`;
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC GVG', code:probe, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_gvg=1&k=ps2026"');
  var m=r.match(/(\\{.*\\})/s); commit('gen_via_global.json', m?m[0]:(r||'').slice(0,600));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  
  // 3. GRAZINAM 539 atgal i admin scope
  fs.writeFileSync('/tmp/a539.json', JSON.stringify({scope:'admin', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/a539.json "'+BASE+'/wp-json/code-snippets/v1/snippets/539"');
  console.log('done');
})();
