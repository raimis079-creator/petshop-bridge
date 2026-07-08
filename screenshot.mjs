import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sa',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,dataStr){
  fs.writeFileSync('/tmp/body.json', dataStr||'{}');
  let cmd='curl -sk -u "$WPU:$WPP" ';
  if(method==='POST') cmd+='-X POST -H "Content-Type: application/json" -d @/tmp/body.json ';
  else if(method==='DELETE') cmd+='-X DELETE ';
  cmd+='"'+DEV+path+'"';
  try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC:'+String(e).slice(0,80); }
}
function get(url){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+url+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
const out={};
const php = `add_action('wp_loaded', function(){
  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'appl_3v9') { return; }
  $res=array('venipak'=>array(),'lp_fields'=>array());
  // 1. VENIPAK pastomatai -> 24.90 (instance 3,9,5)
  $vp=array(3,9,5);
  foreach($vp as $iid){
    $opt='woocommerce_shopup_venipak_shipping_pickup_method_'.$iid.'_settings';
    $s=get_option($opt);
    if(is_array($s)){
      $old=isset($s['maximum_weight'])?$s['maximum_weight']:'(nera)';
      $s['maximum_weight']='24.90';
      update_option($opt,$s);
      $s2=get_option($opt);
      $res['venipak'][$iid]=array('old'=>$old,'new'=>$s2['maximum_weight']);
    } else { $res['venipak'][$iid]='NOT_FOUND'; }
  }
  // 2. LP Express - istiriam form_fields kad rastume teisinga svorio lauka
  if(class_exists('WC_Shipping_Zones')){
    $zones=WC_Shipping_Zones::get_zones();
    foreach($zones as $z){
      foreach($z['shipping_methods'] as $m){
        if(strpos($m->id,'lpexpress_terminal')!==false){
          $ff=method_exists($m,'get_instance_form_fields')?$m->get_instance_form_fields():array();
          $wfields=array();
          foreach($ff as $k=>$f){ if(stripos($k,'weight')!==false||stripos($k,'max')!==false||stripos(isset($f['title'])?$f['title']:'','svor')!==false||stripos(isset($f['title'])?$f['title']:'','weight')!==false) $wfields[$k]=isset($f['title'])?$f['title']:''; }
          $res['lp_fields'][$m->instance_id]=array('title'=>$m->instance_settings['title'],'weight_fields'=>$wfields,'all_keys'=>array_keys($m->instance_settings));
        }
      }
    }
  }
  header('Content-Type: application/json');
  echo json_encode($res);
  exit;
});`;
const create=api('/wp-json/code-snippets/v1/snippets','POST', JSON.stringify({name:'TEMP ship apply',code:php,scope:'global',active:true}));
let sid=''; try{ sid=JSON.parse(create).id; }catch(e){}
out.create_id=sid; out.create_raw=create.slice(0,150);
if(sid){
  out.result=get(DEV+'/?pkey=appl_3v9');
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  out.deleted=true;
}
putFile('shipapply.json',JSON.stringify(out));
console.log('done',sid);
