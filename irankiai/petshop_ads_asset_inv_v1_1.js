/**
 * PETSHOP ADS PMAX ASSET INVENTORIZACIJA v1.1 (S1671) — TIK SKAITO, NIEKO NEKEIČIA.
 * Surenka visų ENABLED PMax kampanijų asset grupių turtą (nuotraukos, logotipai, antraštės, aprašymai, video)
 * su būsena, performance label ir nuotraukų URL; atsiunčia į petshop.lt (ps_ads_recon).
 * Naudojimas: Google Ads → Tools → Scripts → „Petshop recon" → pakeisti kodą šiuo → Authorize → RUN.
 */
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';

function main() {
  var out = { v: 'ADS ASSET INV v1.1', kada: new Date().toISOString(), klaidos: [] };

  out.grupes = gaql(out, 'grupes',
    'SELECT campaign.id, campaign.name, campaign.status, asset_group.id, asset_group.name, asset_group.status, ' +
    'asset_group.final_urls, asset_group.ad_strength ' +
    'FROM asset_group WHERE campaign.status = "ENABLED"');

  out.turtas = gaql(out, 'turtas',
    'SELECT campaign.name, asset_group.id, asset_group.name, asset_group_asset.field_type, ' +
    'asset_group_asset.status, ' +
    'asset.id, asset.name, asset.type, asset.text_asset.text, ' +
    'asset.image_asset.full_size.url, asset.image_asset.full_size.width_pixels, asset.image_asset.full_size.height_pixels, ' +
    'asset.youtube_video_asset.youtube_video_id, asset.youtube_video_asset.youtube_video_title ' +
    'FROM asset_group_asset WHERE campaign.status = "ENABLED" AND asset_group_asset.status != "REMOVED"', 1500);

  out.stat_30d = gaql(out, 'stat_30d',
    'SELECT campaign.name, asset_group.name, metrics.impressions, metrics.clicks, metrics.cost_micros, ' +
    'metrics.conversions, metrics.conversions_value ' +
    'FROM asset_group WHERE campaign.status = "ENABLED" AND segments.date DURING LAST_30_DAYS');

  out.signalai = gaql(out, 'signalai',
    'SELECT campaign.name, asset_group.name, asset_group_signal.audience.audience, asset_group_signal.search_theme.text ' +
    'FROM asset_group_signal WHERE campaign.status = "ENABLED"');

  var body = JSON.stringify(out);
  Logger.log('Turtas: ' + out.turtas.length + ' eil., dydis: ' + body.length + ' B, klaidos: ' + out.klaidos.length);
  var resp = UrlFetchApp.fetch(URL, {
    method: 'post', contentType: 'application/json', payload: body,
    headers: { 'x-ps-key': KEY }, muteHttpExceptions: true });
  Logger.log('POST: ' + resp.getResponseCode() + ' ' + resp.getContentText());
}

function gaql(out, vardas, q, max) {
  var rows = []; max = max || 400;
  try {
    var it = AdsApp.search(q);
    while (it.hasNext() && rows.length < max) { rows.push(flat(it.next())); }
  } catch (e) { out.klaidos.push(vardas + ': ' + e); }
  return rows;
}

function flat(o) {
  var r = {};
  (function eiti(x, pre) {
    for (var k in x) {
      var v = x[k];
      if (v !== null && typeof v === 'object' && !Array.isArray(v)) { eiti(v, pre + k + '.'); }
      else { r[pre + k] = v; }
    }
  })(o, '');
  return r;
}
