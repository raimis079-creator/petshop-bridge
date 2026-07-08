import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'mf',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }

// WPForms Lite formos strukturas laikomos wp_posts kaip post_type=wpforms su post_content=json
// Kuriam programiskai per get/set post + serialized meta
const php = `add_action('wp_loaded', function(){
  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'mk_9x3') { return; }
  $r=array();
  // 1. Ar jau yra sukurta susisiekite forma?
  $existing=get_posts(array('post_type'=>'wpforms','numberposts'=>20,'post_status'=>'any'));
  $r['existing']=array_map(function($f){return array('id'=>$f->ID,'title'=>$f->post_title,'status'=>$f->post_status);},$existing);
  if (!empty($existing)) {
    // gal jau turim - grazinam pirma
    $r['found_id']=$existing[0]->ID;
    header('Content-Type: application/json'); echo json_encode($r); exit;
  }
  // 2. Kuriam nauja WPForms struktura
  $form_data=array(
    'id'=>0,
    'field_id'=>4,
    'fields'=>array(
      '0'=>array('id'=>'0','type'=>'name','label'=>'Vardas','format'=>'simple','required'=>'1','size'=>'medium'),
      '1'=>array('id'=>'1','type'=>'email','label'=>'El. paštas','required'=>'1','size'=>'medium'),
      '2'=>array('id'=>'2','type'=>'textarea','label'=>'Žinutė','required'=>'1','size'=>'medium'),
      '3'=>array('id'=>'3','type'=>'gdpr-checkbox','label'=>'Sutikimas','required'=>'1','choices'=>array('1'=>array('label'=>'Sutinku, kad mano pateikti duomenys būtų naudojami atsakymui į užklausą pateikti.','value'=>'1')))
    ),
    'settings'=>array(
      'form_title'=>'Susisiekite',
      'form_desc'=>'',
      'submit_text'=>'Siųsti užklausą',
      'submit_text_processing'=>'Siunčiama...',
      'antispam_v3'=>'1',
      'honeypot'=>'1',
      'notification_enable'=>'1',
      'notifications'=>array(
        '1'=>array(
          'notification_name'=>'Susisiekite',
          'email'=>'terra@petshop.lt',
          'subject'=>'Nauja užklausa iš petshop.lt',
          'sender_name'=>'{field_id="0"}',
          'sender_address'=>'{admin_email}',
          'replyto'=>'{field_id="1"}',
          'message'=>'{all_fields}',
        )
      ),
      'confirmations'=>array(
        '1'=>array(
          'type'=>'message',
          'message'=>'<p>Ačiū! Jūsų užklausa gauta — atsakysime kiek įmanoma greičiau.</p>',
        )
      )
    ),
    'meta'=>array('template'=>'blank'),
  );
  $post_id=wp_insert_post(array(
    'post_type'=>'wpforms',
    'post_status'=>'publish',
    'post_title'=>'Susisiekite',
    'post_excerpt'=>'',
  ), true);
  if (is_wp_error($post_id)) { $r['err']=$post_id->get_error_message(); header('Content-Type: application/json'); echo json_encode($r); exit; }
  $form_data['id']=$post_id;
  $encoded=wp_slash(json_encode($form_data));
  wp_update_post(array('ID'=>$post_id,'post_content'=>$encoded));
  $r['created_id']=$post_id;
  $r['shortcode']='[wpforms id="'.$post_id.'"]';
  header('Content-Type: application/json'); echo json_encode($r); exit;
});`;

const out={};
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP mk form',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid; out.create_raw=c.slice(0,150);
if(sid){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  out.result=get(DEV+'/?pkey=mk_9x3');
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('mkform.json',JSON.stringify(out));
console.log('done',sid);
