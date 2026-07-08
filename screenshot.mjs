import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'hr',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 45 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:30000000,timeout:50000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }

const out={};
// 1. WP Reading settings - front page display (probe per snippet, file rezultatas)
const php = `add_action('init', function(){
  if (!isset($_GET['pkey']) || $_GET['pkey'] !== 'home_r7') { return; }
  $r = array();
  $r['show_on_front'] = get_option('show_on_front'); // 'posts' arba 'page'
  $r['page_on_front'] = get_option('page_on_front'); // page ID jei 'page'
  $r['page_for_posts'] = get_option('page_for_posts');
  $r['blogname'] = get_option('blogname');
  // WooCommerce shop page
  if (function_exists('wc_get_page_id')) {
    $r['woo_shop_page_id'] = wc_get_page_id('shop');
  }
  // front page turinys jei page
  if ($r['show_on_front']==='page' && $r['page_on_front']) {
    $fp = get_post($r['page_on_front']);
    $r['front_title'] = $fp ? $fp->post_title : '?';
    $r['front_content_len'] = $fp ? strlen($fp->post_content) : 0;
    $r['front_template'] = $fp ? get_post_meta($fp->ID, '_wp_page_template', true) : '';
  }
  // meniu struktura
  $menus = wp_get_nav_menus();
  $r['menus'] = array();
  foreach($menus as $m){
    $items = wp_get_nav_menu_items($m->term_id);
    $r['menus'][$m->name] = array('count'=>count($items), 'top'=>array());
    foreach($items as $it){
      if(empty($it->menu_item_parent) || $it->menu_item_parent=='0'){
        $r['menus'][$m->name]['top'][] = $it->title;
      }
    }
  }
  $up = wp_upload_dir();
  file_put_contents($up['basedir'].'/home_recon_r7.json', wp_json_encode($r));
  wp_die('HOME_DONE');
});`;
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP home recon',code:php,scope:'global',active:false});
let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
out.sid=sid;
if(sid){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  get('/?pkey=home_r7');
  out.result=get('/wp-content/uploads/home_recon_r7.json').slice(0,4000);
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
putFile('homerecon.json',JSON.stringify(out));
