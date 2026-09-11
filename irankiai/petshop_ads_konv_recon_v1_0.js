/**
 * PETSHOP ADS KONVERSIJŲ RECON v1.0 (S1673, C etapas) — TIK SKAITO, nieko nekeičia.
 * Surenka: conversion actions (būsena, kilmė, EC), konversijos pagal dieną nuo 2026-09-08 (T-0),
 * pagal kampaniją, pagal conversion action; ar Ads mato purchase su transaction_id (order_id).
 * Rezultatą POST į ps-web/v1/ads-recon (WP opcija ps_ads_recon). Preview → Run (vienodai, read-only).
 */
var URL = 'https://petshop.lt/?rest_route=/ps-web/v1/ads-recon';
var KEY = 'FDPFp74rq8G8ceoglCn5sA7YrR1IA8lo';
var NUO = '2026-09-01';

function main() {
  var out = { v: 'ADS KONV RECON v1.0', kada: new Date().toISOString(), klaidos: [] };
  out.actions = gaql('SELECT conversion_action.id, conversion_action.name, conversion_action.status, conversion_action.type, conversion_action.origin, conversion_action.category, conversion_action.primary_for_goal, conversion_action.include_in_conversions_metric, conversion_action.counting_type, conversion_action.tag_snippets, conversion_action.value_settings.default_value FROM conversion_action WHERE conversion_action.status != "REMOVED"',
    function (r) { var a = r.conversionAction; return { id: a.id, name: a.name, st: a.status, type: a.type, origin: a.origin, cat: a.category, primary: a.primaryForGoal, inMetric: a.includeInConversionsMetric, count: a.countingType, label: (a.tagSnippets || []).length ? String((a.tagSnippets[0].eventSnippet || '')).match(/AW-\d+\/[\w-]+/) : null }; });
  out.pagal_diena = gaql('SELECT segments.date, segments.conversion_action_name, metrics.conversions, metrics.conversions_value, metrics.all_conversions FROM customer WHERE segments.date >= "' + NUO + '" ORDER BY segments.date',
    function (r) { return { d: r.segments.date, act: r.segments.conversionActionName, konv: r.metrics.conversions, verte: r.metrics.conversionsValue, visos: r.metrics.allConversions }; });
  out.pagal_kampanija = gaql('SELECT campaign.id, campaign.name, campaign.status, segments.date, metrics.cost_micros, metrics.clicks, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date >= "' + NUO + '" AND campaign.status != "REMOVED" ORDER BY segments.date',
    function (r) { return { d: r.segments.date, k: r.campaign.name, st: r.campaign.status, cost: Math.round(r.metrics.costMicros / 10000) / 100, cl: r.metrics.clicks, konv: r.metrics.conversions, verte: r.metrics.conversionsValue }; });
  out.paskutiniai_30 = gaql('SELECT segments.conversion_action_name, metrics.conversions, metrics.conversions_value FROM customer WHERE segments.date DURING LAST_30_DAYS',
    function (r) { return { act: r.segments.conversionActionName, konv: r.metrics.conversions, verte: r.metrics.conversionsValue }; });
  try { out.ec = gaql('SELECT customer.conversion_tracking_setting.conversion_tracking_id, customer.conversion_tracking_setting.enhanced_conversions_for_leads_enabled, customer.conversion_tracking_setting.accepted_customer_data_terms, customer.conversion_tracking_setting.google_ads_conversion_customer FROM customer', function (r) { return r.customer.conversionTrackingSetting; }); } catch (e) { out.klaidos.push('ec: ' + e); }
  var body = JSON.stringify(out); Logger.log(body.slice(0, 3000));
  var resp = UrlFetchApp.fetch(URL, { method: 'post', contentType: 'application/json', payload: body, headers: { 'x-ps-key': KEY }, muteHttpExceptions: true });
  Logger.log('POST: ' + resp.getResponseCode() + ' ' + resp.getContentText());
}
function gaql(q, f) { var o = []; try { var it = AdsApp.search(q); while (it.hasNext()) o.push(f(it.next())); } catch (e) { o.push({ klaida: String(e), q: q.slice(0, 80) }); } return o; }
