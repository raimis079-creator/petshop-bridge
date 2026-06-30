import { execSync } from "child_process";
import fs from "fs";
const repo = process.env.GH_REPO, tok = process.env.GH_TOKEN;
const WP_USER = process.env.WP_USER, WP_PASS = process.env.WP_APP_PASS;
const BASE = "https://dev.avesa.lt";
const AUTH = "Basic " + Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
function commit(name, str){
  const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name;
  let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
  const body={message:'r',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha;
  fs.writeFileSync('/tmp/cb.json',JSON.stringify(body));
  execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cb.json "'+url+'"',{encoding:'utf8'});
}
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000}); }catch(e){ return 'EXC:'+String(e).slice(0,200); } }
function api(method, path, body){
  let cmd='curl -sk -X '+method+' -H "Authorization: '+AUTH+'" -H "Content-Type: application/json"';
  if(body!==undefined){ fs.writeFileSync('/tmp/b.json', JSON.stringify(body)); cmd+=' -d @/tmp/b.json'; }
  cmd+=' "'+BASE+path+'"';
  let raw=exec(cmd);
  try{ return JSON.parse(raw); }catch(e){ return {__raw:raw.slice(0,400)}; }
}

// Pirma — gaunu dabartinį snippet 524 kodą, kad tik pakeisčiau JS dalį
const cur = api('GET','/wp-json/code-snippets/v1/snippets/524');
let code = cur.code || '';

// Pakeičiu component_quantities šaltinį: vietoj get_quantity_min() naudoju _petshop_component_quantities meta
const OLD_PHP = `        // STOCK CHECK + kompoziciniai kiekiai
        $all_in_stock = true;
        $component_quantities = array(); // [product_id => required_qty]
        if (method_exists($product, 'get_child_items')) {
            $child_items = $product->get_child_items();
            if (!empty($child_items)) {
                foreach ($child_items as $child) {
                    $child_product = $child->get_product();
                    if (!$child_product) continue;
                    $child_id = $child_product->get_id();
                    $req_qty = method_exists($child, 'get_quantity_min') ? $child->get_quantity_min() : 1;
                    if (!$req_qty) $req_qty = 1;
                    $component_quantities[$child_id] = $req_qty;
                    if (!$child_product->is_in_stock()) {
                        $all_in_stock = false;
                    }
                    $stock_qty = $child_product->get_stock_quantity();
                    if ($stock_qty !== null && $stock_qty < $req_qty) {
                        $all_in_stock = false;
                    }
                }
            }
        }`;

const NEW_PHP = `        // STOCK CHECK + kompoziciniai kiekiai
        // Kiekiai imami iš _petshop_component_quantities meta (tą patį skaito snippet'as #532)
        $all_in_stock = true;
        $component_quantities = array(); // [product_id => required_qty]
        $fixed_raw = get_post_meta($pid, '_petshop_component_quantities', true);
        $fixed_map = array();
        if (!empty($fixed_raw)) {
            $decoded = json_decode($fixed_raw, true);
            if (is_array($decoded)) $fixed_map = $decoded;
        }
        if (method_exists($product, 'get_child_items')) {
            $child_items = $product->get_child_items();
            if (!empty($child_items)) {
                foreach ($child_items as $child) {
                    $child_product = $child->get_product();
                    if (!$child_product) continue;
                    $child_id = $child_product->get_id();
                    // Kiekis iš meta (jei yra), kitaip 1
                    $req_qty = isset($fixed_map[$child_id]) ? (int)$fixed_map[$child_id] : 1;
                    if ($req_qty < 1) $req_qty = 1;
                    $component_quantities[$child_id] = $req_qty;
                    if (!$child_product->is_in_stock()) {
                        $all_in_stock = false;
                    }
                    $stock_qty = $child_product->get_stock_quantity();
                    if ($stock_qty !== null && $stock_qty < $req_qty) {
                        $all_in_stock = false;
                    }
                }
            }
        }`;

if (code.includes(OLD_PHP)) {
  code = code.replace(OLD_PHP, NEW_PHP);
} else {
  // fallback - rasti pagal get_quantity_min
  code = code.replace(/\$req_qty = method_exists\(\$child, 'get_quantity_min'\)[^;]*;/, 
    "\$req_qty = isset(\$fixed_map[\$child_id]) ? (int)\$fixed_map[\$child_id] : 1;");
  // ir įdėti fixed_map skaitymą prieš child loop - bet tai sudėtinga regex'u, todėl tikrinam:
}

const out={ts:new Date().toISOString(), replaced: code !== (cur.code||''), new_len: code.length};

if (out.replaced) {
  const u = api('PUT','/wp-json/code-snippets/v1/snippets/524', {
    name:'Petshop MnM Rinkinio Vitrina v8 (kiekiai iš meta)',
    code: code,
    desc:'Vitrina v8. Kiekiai imami iš _petshop_component_quantities meta. Dinaminis ×N, stock-aware, 3 kat gating.',
    scope: 'global', active: true
  });
  out.update = u && u.id ? ('updated len='+(u.code||'').length) : (u.__raw||'?');
}
commit('v8_update.json', JSON.stringify(out,null,1));
console.log("DONE replaced="+out.replaced);
