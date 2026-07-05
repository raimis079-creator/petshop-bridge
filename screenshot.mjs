import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'t539',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbt539.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbt539.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message.slice(0,100); } }
(async()=>{
  // Reikia buti prisijungus admin - naudojam app password su cookie? Ne, admin puslapiui reikia sesijos.
  // Vietoj to tikrinam AJAX endpoint tiesiogiai (bet reikia nonce is admin). 
  // Alternatyva: tiesiogiai iskvieciam WP_Query per probe snippet, kad patikrintume browse logika.
  // Bet paprasciausia - patikrinti ar admin puslapio HTML turi naujus elementus.
  // Admin puslapis reikalauja login - naudojam basic auth su app password kuris veikia REST bet ne wp-admin.
  // Todel testuojam AJAX logika per probe: simuliuojam ta pati WP_Query.
  var probe = \`add_action('init', function(){
    if ((\\$_GET['psc_t539'] ?? '') !== '1') return;
    if ((\\$_GET['k'] ?? '') !== 'ps2026' && !current_user_can('manage_options')) return;
    // Simuliuojam browse WP_Query (kaip AJAX su browse=1, source_cat=konservai-katems)
    \\$out = array();
    foreach (array('' => 'be filtro', 'konservai-katems' => 'konservai katems') as \\$slug => \\$lbl) {
      \\$tax = array('relation'=>'AND', array('taxonomy'=>'product_type','field'=>'slug','terms'=>array('simple')));
      if (\\$slug) \\$tax[] = array('taxonomy'=>'product_cat','field'=>'slug','terms'=>\\$slug);
      \\$q = new WP_Query(array('post_type'=>'product','post_status'=>'publish','posts_per_page'=>150,'orderby'=>'title','order'=>'ASC','tax_query'=>\\$tax));
      \\$out['browse_'.(\\$slug?:'all')] = array('label'=>\\$lbl, 'count'=>\\$q->found_posts);
      wp_reset_postdata();
    }
    header('Content-Type: application/json'); echo wp_json_encode(\\$out); exit;
  });\`;
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC T539', code:probe, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r = exec('curl -sk -m 30 "'+BASE+'/?psc_t539=1&k=ps2026"');
  var m = r.match(/(\\{.*\\})/s);
  commit('test_539.json', m?m[0]:(r||'').slice(0,400));
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  console.log('done');
})();
