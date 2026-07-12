import { execSync } from "child_process";
import fs from "fs";
function putText(n,s){
  const repo=process.env.GH_REPO,tok=process.env.GH_TOKEN;
  const url='https://api.github.com/repos/'+repo+'/contents/analize/'+n;
  let sha='';
  try{sha=JSON.parse(execSync('curl -s --max-time 30 -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||'';}catch(e){}
  const b={message:'pf '+n,branch:'main',content:Buffer.from(s,'utf8').toString('base64')};
  if(sha)b.sha=sha;
  fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
  execSync('curl -s --max-time 40 -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
}
let out='';const L=s=>{out+=s+'\n';console.log(s);};
const BASE='https://dev.avesa.lt';const U=process.env.WP_USER||'';const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const PHP="if ( ! defined('ABSPATH') ) { return; }\nadd_action('wp_loaded', function(){\n  if ( ! isset($_GET['ps_atrdry']) ) { return; }\n  $tok = isset($_GET['token']) ? sanitize_text_field(wp_unslash($_GET['token'])) : '';\n  if ( $tok !== 'cmplz_6680aa2a42151d54fa8d64ec' ) { return; }\n\n  $pool = array(\n    array(34471,'maistas'),array(34486,'maistas'),array(34156,'maistas'),\n    array(34168,'kramtalai'),array(34175,'kramtalai'),\n    array(27198,'zaislai'),array(26500,'zaislai'),\n    array(33994,'pavadeliai'),array(33956,'pavadeliai'),\n    array(26897,'higiena'),\n    array(23934,'sampunai'),\n    array(27852,'guoliai'),array(26640,'guoliai'),\n    array(27071,'dubeneliai'),array(23705,'dubeneliai'),\n    array(24802,'vitaminai'),array(26919,'vitaminai'),\n    array(26958,'sukos'),\n    array(14492,'apranga'),\n    array(33894,'transportavimas')\n  );\n\n  // validity map (live)\n  $valid=array(); $invalid=array();\n  foreach($pool as $it){\n    $p=wc_get_product($it[0]);\n    $ok = ($p && $p->get_status()==='publish' && $p->is_in_stock() && (float)$p->get_price()>0);\n    if($ok){$valid[$it[0]]=true;}else{\n      $reason=!$p?'nera':($p->get_status()!=='publish'?'draft':(!$p->is_in_stock()?'out':'price0'));\n      $invalid[]=array('id'=>$it[0],'cat'=>$it[1],'why'=>$reason);\n    }\n  }\n\n  $pick=function($seed) use($pool){\n    $arr=$pool; $n=count($arr);\n    mt_srand($seed);\n    for($i=$n-1;$i>0;$i--){ $j=mt_rand(0,$i); $t=$arr[$i];$arr[$i]=$arr[$j];$arr[$j]=$t; }\n    $picked=array(); $cc=array();\n    foreach($arr as $it){\n      if(count($picked)>=12) break;\n      $cat=$it[1];\n      if(isset($cc[$cat]) && $cc[$cat]>=2) continue;\n      $p=wc_get_product($it[0]);\n      if(!$p || $p->get_status()!=='publish' || !$p->is_in_stock() || (float)$p->get_price()<=0) continue;\n      $picked[]=array('id'=>$it[0],'cat'=>$cat,'t'=>mb_substr(html_entity_decode(get_the_title($it[0])),0,40));\n      $cc[$cat]=(isset($cc[$cat])?$cc[$cat]:0)+1;\n    }\n    return array('picked'=>$picked,'catcount'=>$cc);\n  };\n\n  $today = intval(date('Ymd'));\n  $days=array();\n  for($d=0;$d<4;$d++){\n    $ts=strtotime(\"+$d day\");\n    $seed=intval(date('Ymd',$ts));\n    $days[date('Y-m-d',$ts)] = $pick($seed);\n  }\n\n  header('Content-Type: application/json; charset=utf-8');\n  echo wp_json_encode(array(\n    'valid_count'=>count($valid),\n    'pool_total'=>count($pool),\n    'invalid'=>$invalid,\n    'days'=>$days\n  ), JSON_UNESCAPED_UNICODE|JSON_UNESCAPED_SLASHES);\n  exit;\n}, 6);";
function api(method,path,body){const auth='-u "'+U+':'+P+'"';let cmd;if(body){fs.writeFileSync('/tmp/b.json',JSON.stringify(body));cmd='curl -s -k --max-time 90 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' -H "Content-Type: application/json" --data-binary @/tmp/b.json "'+BASE+path+'"';}else{cmd='curl -s -k --max-time 60 -w "\nHTTP:%{http_code}" '+auth+' -X '+method+' "'+BASE+path+'"';}let r;try{r=execSync(cmd,{encoding:'utf8',maxBuffer:30000000});}catch(e){r=(e.stdout||'')+'\nHTTP:TIMEOUT';}return{code:(r.match(/HTTP:(\S+)$/)||[])[1]||'?',body:r.replace(/\nHTTP:\S+$/,'')};}
function sh(c){try{return execSync(c,{encoding:'utf8',maxBuffer:30000000});}catch(e){return (e.stdout||'')+'[ERR]';}}
(async()=>{try{
  const payload={name:'Petshop Atrinktos Dry v1',desc:'token rotation dryrun',code:PHP,scope:'global',active:true,priority:10};
  const c=api('POST','/wp-json/code-snippets/v1/snippets',payload);
  let id=0;try{id=JSON.parse(c.body).id;}catch(e){}
  L('id='+id); if(!id){L('fail '+c.body.slice(0,200));putText('_atrdry.txt',out);return;}
  execSync('sleep 2');
  const r=sh('curl -s -k --max-time 60 "'+BASE+'/?ps_atrdry=1&token=cmplz_6680aa2a42151d54fa8d64ec"');
  putText('atr_dry.json', r);
  L('len='+r.length);
  if(id){api('POST','/wp-json/code-snippets/v1/snippets/'+id+'/deactivate',{});L('deactivated '+id);}
  putText('_atrdry.txt',out+'\nATRDRY_ID='+id);
}catch(e){L('!!! '+e);putText('_atrdry.txt',out);}})();
