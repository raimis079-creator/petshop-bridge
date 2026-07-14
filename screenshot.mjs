import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;let sha='';try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}const b={message:'x',branch:'main',content:Buffer.from(s,'utf8').toString('base64')};if(sha)b.sha=sha;fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});}
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const REPO=process.env.GH_REPO, TOK=process.env.GH_TOKEN;
const IMGS=['pet-dog.png','pet-cat.png','pet-bird.png','pet-rodent.png','pet-fish.png','pet-reptile.png','pet-other.png','pet-empty-state.png'];
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k -A "Mozilla/5.0" --max-time 90 '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k -A "Mozilla/5.0" --max-time 60 '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'');}return r;}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{
  let out='';const L=s=>{out+=s+'\n';};
  // 1. Parsisiunciu kiekviena PNG is repo raw i /tmp, base64, tada per snippet irasau i plugin
  let b64map={};
  for(const img of IMGS){
    // Gaunu is repo per Contents API (base64 jau)
    const meta=sh('curl -s --max-time 40 -H "Authorization: Bearer '+TOK+'" "https://api.github.com/repos/'+REPO+'/contents/analize/img/'+img+'?ref=main"');
    try{ const j=JSON.parse(meta); b64map[img]=(j.content||'').replace(/\n/g,''); L(img+': '+(b64map[img].length)+' b64 chars'); }
    catch(e){ L(img+': FAIL'); }
  }
  // 2. Rasau b64map i plugin kaip laikina JSON, tada snippet iskaido
  //    Bet JSON didelis — dalim. Vietoj to: po viena faila per snippet.
  for(const img of IMGS){
    if(!b64map[img])continue;
    const depPHP="if(!defined('ABSPATH'))return;\nadd_action('wp_loaded',function(){if(($_GET['ps_i1']??'')!=='1')return;if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;$d=WP_PLUGIN_DIR.'/petshop-core';@mkdir($d.'/assets/images',0755,true);$c=file_get_contents($d.'/assets/_i.b64');$o=@file_put_contents($d.'/assets/images/"+img+"',base64_decode($c));@unlink($d.'/assets/_i.b64');header('Content-Type:application/json');echo wp_json_encode(array('"+img+"'=>$o));exit;},6);";
    // Pirma irasau b64 i plugin _i.b64 per Contents-like: naudoju code-snippet kuris rasys is GET param? Ne, per didelis.
    // Vietoj to: rasau b64 i faila per bridge SSH-like... neturim. Naudoju WP REST media? Ne.
    // Sprendimas: irasau b64 i plugin faila per maza snippet kuris skaito is repo tiesiogiai.
    const fetchPHP="if(!defined('ABSPATH'))return;\nadd_action('wp_loaded',function(){if(($_GET['ps_fetch']??'')!=='"+img+"')return;if(($_GET['token']??'')!=='cmplz_6680aa2a42151d54fa8d64ec')return;$d=WP_PLUGIN_DIR.'/petshop-core';@mkdir($d.'/assets/images',0755,true);$url='https://raw.githubusercontent.com/"+REPO+"/main/analize/img/"+img+"';$data=@file_get_contents($url);if($data===false){$r=wp_remote_get($url,array('timeout'=>60));$data=is_wp_error($r)?false:wp_remote_retrieve_body($r);}$o=$data?@file_put_contents($d.'/assets/images/"+img+"',$data):false;header('Content-Type:application/json');echo wp_json_encode(array('img'=>'"+img+"','bytes'=>$o,'src_len'=>$data?strlen($data):0));exit;},6);";
    const c=api('POST','/wp-json/code-snippets/v1/snippets',{name:'ImgF '+img,desc:'x',code:fetchPHP,scope:'global',active:true,priority:5});
    let sid=0;try{sid=JSON.parse(c).id;}catch(e){}
    execSync('sleep 2');
    L('fetch '+img+': '+sh('curl -s -k -A "Mozilla/5.0" --max-time 70 "'+BASE+'/?ps_fetch='+img+'&token=cmplz_6680aa2a42151d54fa8d64ec"'));
    if(sid) api('POST','/wp-json/code-snippets/v1/snippets/'+sid+'/deactivate',{});
  }
  // Patikra: ar failai pasiekiami
  for(const img of IMGS){
    L(img+' HTTP: '+sh('curl -s -k -A "Mozilla/5.0" --max-time 20 -o /dev/null -w "%{http_code}" "'+BASE+'/wp-content/plugins/petshop-core/assets/images/'+img+'"'));
  }
  putText('img_deploy.txt',out);
})();
