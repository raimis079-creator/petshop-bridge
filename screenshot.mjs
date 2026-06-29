import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");

function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha='';
  try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')};
  if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function curlJSON(method, path, bodyObj){
  let cmd = 'curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" -H "Accept: application/json"';
  if(bodyObj!==undefined){ fs.writeFileSync('/tmp/body.json', JSON.stringify(bodyObj)); cmd += ' -d @/tmp/body.json'; }
  cmd += ' "'+BASE+path+'"';
  let raw=''; try{ raw = execSync(cmd, {encoding:'utf8', maxBuffer: 300000000}); }catch(e){ return {__exc:String(e).slice(0,200)}; }
  try{ return JSON.parse(raw); }catch(e){ return {__parse_error:true, raw:raw.slice(0,400)}; }
}

const PHP = [
"add_action('rest_api_init', function () {",
"  register_rest_route('petshop/v1', '/plugsrc', array(",
"    'methods' => 'GET',",
"    'permission_callback' => function () { return current_user_can('manage_options'); },",
"    'callback' => function () {",
"      $targets = array('petshop-promotions','petshop-fbt');",
"      $base = defined('WP_PLUGIN_DIR') ? WP_PLUGIN_DIR : (WP_CONTENT_DIR . '/plugins');",
"      $out = array('base' => $base, 'plugins' => array());",
"      foreach ($targets as $t) {",
"        $dir = $base . '/' . $t;",
"        $entry = array('dir' => $dir, 'exists' => is_dir($dir), 'files' => array());",
"        if (is_dir($dir)) {",
"          $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));",
"          foreach ($rii as $f) {",
"            if ($f->isFile() && substr($f->getFilename(), -4) === '.php') {",
"              $rel = ltrim(str_replace($dir, '', $f->getPathname()), '/');",
"              $sz = $f->getSize();",
"              $entry['files'][$rel] = ($sz < 200000) ? file_get_contents($f->getPathname()) : ('__TOO_BIG__ ' . $sz);",
"            }",
"          }",
"        }",
"        $out['plugins'][$t] = $entry;",
"      }",
"      return $out;",
"    }",
"  ));",
"});"
].join("\n");

(async()=>{
  const log={ts:new Date().toISOString(), steps:{}};

  // 1. CREATE
  const cr = curlJSON('POST', '/wp-json/code-snippets/v1/snippets', {
    name: 'TEMP Plugin Source Dump v1 (read-only)',
    desc: 'temporary read-only recon; delete after use',
    code: PHP, scope: 'global', active: false, priority: 10
  });
  const sid = cr && cr.id ? cr.id : null;
  log.steps.create = {id:sid, name:cr&&cr.name, err:(cr&&(cr.__exc||cr.code))||null, raw:(cr&&cr.__parse_error)?cr.raw:undefined};

  if(!sid){ commit('plugsrc.json', JSON.stringify({log, fatal:'no snippet id'},null,1)); console.log('NO ID'); return; }

  // 2. ACTIVATE
  const ac = curlJSON('POST', '/wp-json/code-snippets/v1/snippets/'+sid+'/activate', {});
  log.steps.activate = {active:(ac&&ac.active), err:(ac&&(ac.__exc||ac.code))||null};

  // 3. FETCH source via the gated REST route
  const src = curlJSON('GET', '/wp-json/petshop/v1/plugsrc');
  let dump = {fetch_failed:true, got: src};
  if(src && src.plugins){ dump = src; }
  log.steps.fetch_ok = !!(src && src.plugins);

  // 4. DELETE snippet (cleanup) — always attempt
  const del = curlJSON('DELETE', '/wp-json/code-snippets/v1/snippets/'+sid);
  log.steps.delete = {deleted: !!(del && (del.id||del===true||del===null||(del&&del.id))), raw: (del&&del.__parse_error)?del.raw:(del&&del.id?('id '+del.id):JSON.stringify(del).slice(0,120))};

  commit('plugsrc.json', JSON.stringify({log, dump},null,1));
  console.log("DONE sid="+sid);
})();
