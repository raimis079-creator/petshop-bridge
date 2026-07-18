<?php
require __DIR__ . '/class-package-size-resolver.php';

$T=0;$P=0;$F=0;
function check($name,$got,$exp_status,$exp=array()){
	global $T,$P,$F;$T++;
	$ok = ($got['status']===$exp_status);
	foreach($exp as $k=>$v){ if(!array_key_exists($k,$got)||$got[$k]!==$v){$ok=false;} }
	if($ok){$P++;echo "  [PASS] $name\n";}
	else{$F++;echo "  [FAIL] $name\n     exp status=$exp_status ".json_encode($exp)."\n     got ".json_encode(array('status'=>$got['status'],'sellable'=>$got['sellable_unit_food_g'],'cand'=>$got['parsed_candidate_g'],'method'=>$got['method'],'reason'=>$got['reason_code']))."\n";}
}
function R($term,$status=null){ return Petshop_Package_Size_Resolver::resolve(array('term_value'=>$term,'assignment_status'=>$status)); }

echo "\n=== FIXTURE 1: TERMINŲ SINTAKSĖ (80 realių pa_pakuotes_dydis, status=fixed) ===\n";
// visos 80 realių reikšmių -> sellable gramai. status='fixed' (patikimas), tad resolved.
$terms=array(
 '0,75 kg'=>750,'1 kg'=>1000,'1,5 kg'=>1500,'1,9 kg'=>1900,'10 g'=>10,'10 kg'=>10000,'100 g'=>100,
 '105 g'=>105,'110 g'=>110,'113 g'=>113,'115 g'=>115,'12 kg'=>12000,'12,5 kg'=>12500,'120 g'=>120,
 '1250 g'=>1250,'130 g'=>130,'135 g'=>135,'14 g'=>14,'140 g'=>140,'15 g'=>15,'15 kg'=>15000,'150 g'=>150,
 '16,5 kg'=>16500,'160 g'=>160,'18 kg'=>18000,'180 g'=>180,'185 g'=>185,'2 kg'=>2000,'2,25 kg'=>2250,
 '2,5 kg'=>2500,'2,56 kg'=>2560,'2,7 kg'=>2700,'20 g'=>20,'20 kg'=>20000,'200 g'=>200,'22 g'=>22,
 '240 g'=>240,'250 g'=>250,'285 g'=>285,'3 kg'=>3000,'3,5 kg'=>3500,'30 g'=>30,'300 g'=>300,'320 g'=>320,
 '333 g'=>333,'342 g'=>342,'35 g'=>35,'36 g'=>36,'4 kg'=>4000,'4,25 kg'=>4250,'40 g'=>40,'400 g'=>400,
 '415 g'=>415,'425 g'=>425,'45 g'=>45,'5 kg'=>5000,'50 g'=>50,'500 g'=>500,'55 g'=>55,'56 g'=>56,
 '57 g'=>57,'6,5 kg'=>6500,'60 g'=>60,'65 g'=>65,'650 g'=>650,'7 kg'=>7000,'7,5 kg'=>7500,'70 g'=>70,
 '720 g'=>720,'74 g'=>74,'75 g'=>75,'8 kg'=>8000,'80 g'=>80,'800 g'=>800,'82 g'=>82,'85 g'=>85,
 '90 g'=>90,'900 g'=>900,'95 g'=>95,'96 g'=>96,
);
$n=0; $allok=true;
foreach($terms as $t=>$g){
	$r=R($t,'fixed');
	if($r['status']!=='resolved' || $r['sellable_unit_food_g']!==$g){ $allok=false;
		echo "     [!] '$t' -> ".$r['status']." sellable=".var_export($r['sellable_unit_food_g'],true)." (laukta $g)\n"; }
	$n++;
}
$T++; if($allok){$P++;echo "  [PASS] visi 80 terminų -> resolved su teisingais gramais ($n)\n";}else{$F++;echo "  [FAIL] kai kurie 80 terminų neteisingi\n";}

echo "\n=== FIXTURE 2: TRUST GATE (13 review produktų — term='15 kg' BET needs_manual_review) ===\n";
// realus atvejis: terminas 15kg sintaksiskai parsinasi, bet priskyrimas klaidingas (realiai 1,5kg)
$review_skus=array('01MVC002','01M181102','01M182102','01M171102','01M201602','01M201502',
	'01MVC402','01MVC602','01MVC702','01M191111','01M201202','01M131102','01M110102');
$allok=true;
foreach($review_skus as $sku){
	$r=R('15 kg','needs_manual_review');
	// PRIVALO: ambiguous, sellable=null, parsed_candidate=15000 (diagnostikai)
	if($r['status']!=='ambiguous' || $r['sellable_unit_food_g']!==null || $r['parsed_candidate_g']!==15000){
		$allok=false; echo "     [!] $sku -> ".json_encode($r)."\n"; }
}
$T++; if($allok){$P++;echo "  [PASS] visi 13 review (term='15 kg' + needs_manual_review) -> ambiguous, sellable=null, candidate=15000\n";}else{$F++;echo "  [FAIL] review trust gate\n";}

// ta pati '1,5 kg' reiksme: fixed->resolved, review->ambiguous (problema priskyrime, ne tekste)
check('ta pati 1,5kg + fixed -> resolved', R('1,5 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>1500));
check('ta pati 1,5kg + needs_manual_review -> ambiguous', R('1,5 kg','needs_manual_review'),'ambiguous',
	array('sellable_unit_food_g'=>null,'parsed_candidate_g'=>1500));

echo "\n=== STATUSŲ PRIORITETAS ===\n";
check('tuščias terminas -> unresolved', R('','fixed'),'unresolved',array('sellable_unit_food_g'=>null));
check('NULL terminas -> unresolved', R(null,'fixed'),'unresolved',array('sellable_unit_food_g'=>null));
check('nekanoninis tekstas -> unresolved', R('didelis maišas','fixed'),'unresolved');
check('neparsinamas NUGALI review (tuščias+review)', R('','needs_manual_review'),'unresolved'); // unresolved eina pirmas
check('nežinomas statusas -> ambiguous', R('7 kg','some_new_status'),'ambiguous',
	array('sellable_unit_food_g'=>null,'parsed_candidate_g'=>7000));
check('status=fixed -> resolved', R('7 kg','fixed'),'resolved',array('sellable_unit_food_g'=>7000));
check('status=stock_sync_checked -> resolved', R('7 kg','stock_sync_checked'),'resolved',array('sellable_unit_food_g'=>7000));
check('status=NULL (patikimas) -> resolved', R('7 kg',null),'resolved',array('sellable_unit_food_g'=>7000));
check('status="" (patikimas) -> resolved', R('7 kg',''),'resolved',array('sellable_unit_food_g'=>7000));

echo "\n=== GRAMATIKOS ===\n";
check('bonus pack 15+3 kg -> 18000', R('15+3 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>18000,'method'=>'bonus_pack'));
check('bonus pack 15 + 3 kg (tarpai)', R('15 + 3 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>18000,'method'=>'bonus_pack'));
check('multipack 2×7 kg -> 14000', R('2×7 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>14000,'method'=>'multipack'));
check('multipack 2x7 kg (x) -> 14000', R('2x7 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>14000,'method'=>'multipack'));
check('multipack 2 x 7 kg (tarpai)', R('2 x 7 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>14000,'method'=>'multipack'));
check('paprastas single 7 kg method', R('7 kg','fixed'),'resolved',array('method'=>'single'));
// universalus regex NELEIDZIAMAS
check('trys skaičiai -> unresolved (jokio surask-visus)', R('1+2+3 kg','fixed'),'unresolved');
check('multipack be × -> unresolved', R('2 7 kg','fixed'),'unresolved');

echo "\n=== KRAŠTUTINIAI ===\n";
check('0 kg -> unresolved (<=0)', R('0 kg','fixed'),'unresolved');
check('0 g -> unresolved', R('0 g','fixed'),'unresolved');
check('neigiama -5 kg -> unresolved', R('-5 kg','fixed'),'unresolved');
check('vienetas be skaičiaus -> unresolved', R('kg','fixed'),'unresolved');
check('skaičius be vieneto -> unresolved', R('500','fixed'),'unresolved');
check('nežinomas vienetas ml -> unresolved', R('500 ml','fixed'),'unresolved');
check('didžiosios raidės 7 KG -> resolved', R('7 KG','fixed'),'resolved',array('sellable_unit_food_g'=>7000));
check('kablelis 12,5 kg -> 12500', R('12,5 kg','fixed'),'resolved',array('sellable_unit_food_g'=>12500));
check('taškas 12.5 kg -> 12500', R('12.5 kg','fixed'),'resolved',array('sellable_unit_food_g'=>12500));
// quantity NEDALYVAUJA - Resolver visada grazina VIENO vieneto svori
check('multipack 2×7 = 14000 (viena preke, ne 7000)', R('2×7 kg','fixed'),'resolved',
	array('sellable_unit_food_g'=>14000));

echo "\n".str_repeat('=',60)."\n";
printf("REZULTATAS: %d/%d PASS, %d FAIL\n",$P,$T,$F);
if($F>0) exit(1);
