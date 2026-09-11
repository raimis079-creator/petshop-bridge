/**
 * PETSHOP ADS PMAX NUOTRAUKŲ MAINAI v1.2 (S1672)
 * Ką daro: į 2 ENABLED PMax asset grupes ("Šunų maistas" / "Kačių maistas") įkelia naujas prekių nuotraukas
 * iš https://petshop.lt/wp-content/uploads/pmax-s1672/ (manifest.json: 84 vnt., 3 formatai) ir nuima SENUS
 * MARKETING_IMAGE / SQUARE_MARKETING_IMAGE / PORTRAIT_MARKETING_IMAGE asset'us iš tų grupių.
 * NELIEČIA: AD_IMAGE, LOGO, tekstų, video, biudžetų, tROAS. Nekuria/netrina kampanijų.
 * Eiga per lauko tipą: palieka 1 seną (minimumas), įkelia naujus, tada nuima likusį seną → niekada < 1 ir niekada > 20.
 * Naudojimas: Google Ads → Scripts → "Petshop recon" → įklijuoti → PREVIEW (DRY=true nieko nekeičia, tik ataskaita)
 *   → Claude patikra → pakeisti DRY=false → RUN.
 */
var DRY = true;
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
var BASE = 'https://petshop.lt/wp-content/uploads/pmax-s1672/';
var TYPES = ['MARKETING_IMAGE', 'SQUARE_MARKETING_IMAGE', 'PORTRAIT_MARKETING_IMAGE'];
var GRUPES = { dogs: 'Šunų maistas', cats: 'Kačių maistas' };

function main() {
  var out = { v: 'ADS ASSET SWAP v1.2', dry: DRY, kada: new Date().toISOString(), klaidos: [], grupes: {} };
  var man = JSON.parse(UrlFetchApp.fetch(BASE + 'manifest.json').getContentText());
  out.manifest = man.length;
  // ARCHYVAS prieš mainus: asset lygio rodikliai 90 d. (performance label, parodymai, konversijos)
  out.archyvas_90d = [];
  try { var qa = AdsApp.search('SELECT campaign.name, asset_group.name, asset_group_asset.field_type, asset_group_asset.status, asset_group_asset.performance_label, ' +
      'asset.id, asset.name, asset.type, asset.text_asset.text, asset.image_asset.full_size.url, metrics.impressions, metrics.clicks, metrics.conversions, metrics.conversions_value, metrics.cost_micros ' +
      'FROM asset_group_asset WHERE campaign.status = "ENABLED" AND segments.date BETWEEN "2026-06-13" AND "2026-09-11"');
    while (qa.hasNext()) { var ra = qa.next(); out.archyvas_90d.push({ c: ra.campaign.name, g: ra.assetGroup.name, ft: ra.assetGroupAsset.fieldType, st: ra.assetGroupAsset.status, pl: ra.assetGroupAsset.performanceLabel,
      id: String(ra.asset.id), n: ra.asset.name, t: ra.asset.type, txt: ra.asset.textAsset ? ra.asset.textAsset.text : '', url: ra.asset.imageAsset ? ra.asset.imageAsset.fullSize.url : '',
      imp: ra.metrics.impressions, cl: ra.metrics.clicks, conv: ra.metrics.conversions, val: ra.metrics.conversionsValue, cost: ra.metrics.costMicros }); if (out.archyvas_90d.length >= 600) break; }
  } catch (e) { out.klaidos.push('archyvas: ' + e); }

  var groups = {};
  var it = AdsApp.performanceMaxCampaigns().withCondition('campaign.status = ENABLED').get();
  while (it.hasNext()) {
    var c = it.next(); var ag = c.assetGroups().get();
    while (ag.hasNext()) { var g = ag.next(); groups[g.getName()] = { g: g, camp: c.getName() }; }
  }
  out.rastos_grupes = Object.keys(groups);

  for (var key in GRUPES) {
    var name = null; for (var gn in groups) { if (gn.indexOf(GRUPES[key]) >= 0) name = gn; }
    var rep = { grupe: name, pridėta: {}, nuimta: {}, klaidos: [] }; out.grupes[key] = rep;
    if (!name) { rep.klaidos.push('grupė nerasta: ' + GRUPES[key]); continue; }
    var g = groups[name].g;
    var old = seniAssetai(g.getId());
    rep.seni = {}; for (var t in old) rep.seni[t] = old[t].length;
    var nauji = man.filter(function (m) { return m.grupe === key; });

    for (var ti = 0; ti < TYPES.length; ti++) {
      var type = TYPES[ti];
      var oldIds = old[type] || [];
      var files = nauji.filter(function (m) { return m.field === type; });
      rep.pridėta[type] = 0; rep.nuimta[type] = 0;
      if (files.length > 20) { rep.klaidos.push(type + ': per daug naujų ' + files.length); continue; }
      if (DRY) { rep.pridėta[type] = files.length + ' (planas)'; rep.nuimta[type] = oldIds.length + ' (planas)'; continue; }
      // 1) nuimti senus, palikti 1
      for (var i = 1; i < oldIds.length; i++) { if (nuimti(g, oldIds[i], type, rep)) rep.nuimta[type]++; }
      // 2) įkelti naujus
      for (var f = 0; f < files.length; f++) {
        try {
          var blob = UrlFetchApp.fetch(BASE + files[f].name).getBlob();
          var op = AdsApp.adAssets().newImageAssetBuilder().withName('ps_' + files[f].name.replace('.jpg', '')).withData(blob).build();
          if (!op.isSuccessful()) { rep.klaidos.push(files[f].name + ': ' + op.getErrors().join('; ')); continue; }
          g.addAsset(op.getResult(), type); rep.pridėta[type]++;
        } catch (e) { rep.klaidos.push(files[f].name + ': ' + e); }
      }
      // 3) nuimti paskutinį seną (tik jei bent 1 naujas įkeltas)
      if (oldIds.length && rep.pridėta[type] > 0) { if (nuimti(g, oldIds[0], type, rep)) rep.nuimta[type]++; }
    }
    rep.po = DRY ? 'n/a' : (function () { var a = seniAssetai(g.getId()), r = {}; for (var t in a) r[t] = a[t].length; return r; })();
  }

  var body = JSON.stringify(out);
  Logger.log(body);
  var resp = UrlFetchApp.fetch(URL, { method: 'post', contentType: 'application/json', payload: body, headers: { 'x-ps-key': KEY }, muteHttpExceptions: true });
  Logger.log('POST: ' + resp.getResponseCode() + ' ' + resp.getContentText());
}

function seniAssetai(agId) {
  var r = {}; var q = AdsApp.search('SELECT asset.id, asset_group_asset.field_type FROM asset_group_asset WHERE asset_group.id = ' + agId +
    ' AND asset_group_asset.status != "REMOVED" AND asset_group_asset.field_type IN ("MARKETING_IMAGE","SQUARE_MARKETING_IMAGE","PORTRAIT_MARKETING_IMAGE")');
  while (q.hasNext()) { var row = q.next(); var t = row.assetGroupAsset.fieldType; (r[t] = r[t] || []).push(String(row.asset.id)); }
  return r;
}

function nuimti(g, assetId, type, rep) {
  try { var a = AdsApp.adAssets().assets().withIds([assetId]).get(); if (!a.hasNext()) { rep.klaidos.push('asset ' + assetId + ' nerastas'); return false; }
    g.removeAsset(a.next(), type); return true; } catch (e) { rep.klaidos.push('remove ' + assetId + ' ' + type + ': ' + e); return false; }
}
