/**
 * PETSHOP ADS PMAX NUOTRAUKŲ PRIKABINIMAS v2.0 (S1672) — antras žingsnis po swap v1.3.
 * Swap v1.3 sukūrė 84 asset'us (ps_*) bibliotekoje ir nuėmė 40 senų, bet addAsset 84× grąžino „bandykite vėliau".
 * Šis skriptas: NIEKO nekuria ir NIEKO nenuima. Suranda bibliotekoje ps_* nuotraukas pagal manifest.json ir
 * prikabina prie grupės/lauko tipo tas, kurių ten dar nėra. Pabaigoje suskaičiuoja per GAQL.
 * Preview (DRY=true) → Claude patikra → DRY=false → Run.
 */
var DRY = true;
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
var BASE = 'https://petshop.lt/wp-content/uploads/pmax-s1672/';
var GRUPES = { dogs: 'Šunų maistas', cats: 'Kačių maistas' };

function main() {
  var out = { v: 'ADS ASSET ATTACH v2.0', dry: DRY, kada: new Date().toISOString(), klaidos: [], grupes: {} };
  var man = JSON.parse(UrlFetchApp.fetch(BASE + 'manifest.json').getContentText());

  // biblioteka: ps_* nuotraukos
  var lib = {}; var q = AdsApp.search('SELECT asset.id, asset.name FROM asset WHERE asset.type = "IMAGE" AND asset.name LIKE "ps_%"');
  while (q.hasNext()) { var r = q.next(); lib[r.asset.name] = String(r.asset.id); }
  out.bibliotekoje = Object.keys(lib).length;

  var groups = {};
  var it = AdsApp.performanceMaxCampaigns().withCondition('campaign.status = ENABLED').get();
  while (it.hasNext()) { var c = it.next(); var ag = c.assetGroups().get(); while (ag.hasNext()) { var g = ag.next(); groups[g.getName()] = g; } }

  for (var key in GRUPES) {
    var name = null; for (var gn in groups) { if (gn.indexOf(GRUPES[key]) >= 0) name = gn; }
    var rep = { grupe: name, pries: {}, prikabinti: {}, truksta_bibliotekoje: [], klaidos: [] }; out.grupes[key] = rep;
    if (!name) { rep.klaidos.push('grupė nerasta'); continue; }
    var g = groups[name];
    var linked = prikabinti(g.getId()); rep.pries = suma(linked);
    var files = man.filter(function (m) { return m.grupe === key; });
    for (var i = 0; i < files.length; i++) {
      var an = 'ps_' + files[i].name.replace('.jpg', ''); var t = files[i].field;
      rep.prikabinti[t] = rep.prikabinti[t] || 0;
      if (!lib[an]) { rep.truksta_bibliotekoje.push(an); continue; }
      if (linked[t] && linked[t].indexOf(an) >= 0) continue;
      if (DRY) { rep.prikabinti[t]++; continue; }
      try { var a = AdsApp.adAssets().assets().withIds([lib[an]]).get(); if (!a.hasNext()) { rep.klaidos.push(an + ' nerastas'); continue; }
        g.addAsset(a.next(), t); rep.prikabinti[t]++; } catch (e) { rep.klaidos.push(an + ': ' + e); }
    }
    rep.po = DRY ? 'n/a' : suma(prikabinti(g.getId()));
  }
  var body = JSON.stringify(out); Logger.log(body);
  var resp = UrlFetchApp.fetch(URL, { method: 'post', contentType: 'application/json', payload: body, headers: { 'x-ps-key': KEY }, muteHttpExceptions: true });
  Logger.log('POST: ' + resp.getResponseCode() + ' ' + resp.getContentText());
}

function prikabinti(agId) {
  var r = {}; var q = AdsApp.search('SELECT asset.name, asset_group_asset.field_type FROM asset_group_asset WHERE asset_group.id = ' + agId +
    ' AND asset_group_asset.status != "REMOVED" AND asset_group_asset.field_type IN ("MARKETING_IMAGE","SQUARE_MARKETING_IMAGE","PORTRAIT_MARKETING_IMAGE")');
  while (q.hasNext()) { var row = q.next(); var t = row.assetGroupAsset.fieldType; (r[t] = r[t] || []).push(row.asset.name || ''); }
  return r;
}
function suma(l) { var s = {}; for (var t in l) { s[t] = { viso: l[t].length, ps: l[t].filter(function (n) { return n.indexOf('ps_') === 0; }).length }; } return s; }
