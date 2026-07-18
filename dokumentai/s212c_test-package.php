<?php
require __DIR__ . '/class-package-size-resolver.php';
$T=0;$P=0;$F=0;
function check($name,$got,$exp=array()){
	global $T,$P,$F;$T++;
	$ok=true;
	foreach($exp as $k=>$v){ if(!array_key_exists($k,$got)||$got[$k]!==$v){$ok=false;} }
	if($ok){$P++;echo "  [PASS] $name\n";}
	else{$F++;echo "  [FAIL] $name\n     exp ".json_encode($exp)."\n     got ".json_encode(array('parse'=>$got['parse_status'],'trust'=>$got['assignment_trust'],'sellable'=>$got['sellable_unit_food_g'],'cand'=>$got['parsed_candidate_g'],'reason'=>$got['reason_code']))."\n";}
}
function R($term,$trust=null){ return Petshop_Package_Size_Resolver::resolve(array('term_value'=>$term,'assignment_trust'=>$trust)); }

echo "\n=== SPRENDIMŲ MATRICA (parse × trust) ===\n";
// parse unresolved → svoris null (bet koks trust)
check('unresolved + verified → svoris null', R('xyz','verified'),
	array('parse_status'=>'unresolved','sellable_unit_food_g'=>null));
check('unresolved + review → svoris null', R('','review_required'),
	array('parse_status'=>'unresolved','sellable_unit_food_g'=>null));
// parse resolved + verified → sellable leidžiamas
check('resolved + verified → sellable=7000', R('7 kg','verified'),
	array('parse_status'=>'resolved','assignment_trust'=>'verified','sellable_unit_food_g'=>7000,'parsed_candidate_g'=>7000));
// parse resolved + review_required → svoris null
check('resolved + review_required → svoris null, candidate lieka', R('7 kg','review_required'),
	array('parse_status'=>'resolved','assignment_trust'=>'review_required','sellable_unit_food_g'=>null,'parsed_candidate_g'=>7000,'reason_code'=>'assignment_review_required'));
// parse resolved + unverified → svoris null
check('resolved + unverified → svoris null (backfill laukia)', R('7 kg','unverified'),
	array('parse_status'=>'resolved','assignment_trust'=>'unverified','sellable_unit_food_g'=>null,'parsed_candidate_g'=>7000,'reason_code'=>'assignment_not_audited'));
// parse resolved + unknown → svoris null
check('resolved + unknown → svoris null (konservatyvu)', R('7 kg','some_future'),
	array('parse_status'=>'resolved','assignment_trust'=>'unknown','sellable_unit_food_g'=>null,'reason_code'=>'assignment_trust_unknown'));
// null trust (nesuteikta) → unknown normalizacija
check('trust=null → normalizuojama į unknown', R('7 kg',null),
	array('assignment_trust'=>'unknown','sellable_unit_food_g'=>null));

echo "\n=== FIXTURE 1: 80 TERMINŲ SINTAKSĖ (trust=verified) ===\n";
$terms=array('0,75 kg'=>750,'1 kg'=>1000,'1,5 kg'=>1500,'1,9 kg'=>1900,'10 g'=>10,'10 kg'=>10000,'100 g'=>100,
 '105 g'=>105,'110 g'=>110,'113 g'=>113,'115 g'=>115,'12 kg'=>12000,'12,5 kg'=>12500,'120 g'=>120,'1250 g'=>1250,
 '130 g'=>130,'135 g'=>135,'14 g'=>14,'140 g'=>140,'15 g'=>15,'15 kg'=>15000,'150 g'=>150,'16,5 kg'=>16500,'160 g'=>160,
 '18 kg'=>18000,'180 g'=>180,'185 g'=>185,'2 kg'=>2000,'2,25 kg'=>2250,'2,5 kg'=>2500,'2,56 kg'=>2560,'2,7 kg'=>2700,
 '20 g'=>20,'20 kg'=>20000,'200 g'=>200,'22 g'=>22,'240 g'=>240,'250 g'=>250,'285 g'=>285,'3 kg'=>3000,'3,5 kg'=>3500,
 '30 g'=>30,'300 g'=>300,'320 g'=>320,'333 g'=>333,'342 g'=>342,'35 g'=>35,'36 g'=>36,'4 kg'=>4000,'4,25 kg'=>4250,
 '40 g'=>40,'400 g'=>400,'415 g'=>415,'425 g'=>425,'45 g'=>45,'5 kg'=>5000,'50 g'=>50,'500 g'=>500,'55 g'=>55,'56 g'=>56,
 '57 g'=>57,'6,5 kg'=>6500,'60 g'=>60,'65 g'=>65,'650 g'=>650,'7 kg'=>7000,'7,5 kg'=>7500,'70 g'=>70,'720 g'=>720,
 '74 g'=>74,'75 g'=>75,'8 kg'=>8000,'80 g'=>80,'800 g'=>800,'82 g'=>82,'85 g'=>85,'90 g'=>90,'900 g'=>900,'95 g'=>95,'96 g'=>96);
$allok=true;$n=0;
foreach($terms as $t=>$g){ $r=R($t,'verified');
	if($r['parse_status']!=='resolved'||$r['sellable_unit_food_g']!==$g){$allok=false;echo "     [!] '$t' -> ".json_encode($r)."\n";} $n++; }
$T++; if($allok){$P++;echo "  [PASS] visi 80 terminų (verified) -> resolved, teisingi gramai ($n)\n";}else{$F++;echo "  [FAIL] 80 terminų\n";}

echo "\n=== FIXTURE 2: 13 UNIKALIŲ REVIEW PRODUKTŲ (SKU, ne JOIN eilutės) ===\n";
// 13 unikalių SKU, kiekvienas term='15 kg', WP status=needs_manual_review
$review=array(
 '01MVC002'=>'15 kg','01M181102'=>'15 kg','01M182102'=>'15 kg','01M171102'=>'15 kg','01M201602'=>'15 kg',
 '01M201502'=>'15 kg','01MVC402'=>'15 kg','01MVC602'=>'15 kg','01MVC702'=>'15 kg','01M191111'=>'15 kg',
 '01M201202'=>'15 kg','01M131102'=>'15 kg','01M110102'=>'15 kg');
$T++; if(count($review)===13){$P++;echo "  [PASS] fixture = 13 unikalių SKU (ne JOIN eilučių)\n";}else{$F++;echo "  [FAIL] ne 13 unikalių: ".count($review)."\n";}
$allok=true;
foreach($review as $sku=>$term){
	$trust='review_required'; // Provider jau normalizavo needs_manual_review -> review_required
	$r=R($term,$trust);
	// term='15 kg' parsinasi (15000) BET review_required -> sellable null, candidate=15000
	if($r['parse_status']!=='resolved'||$r['sellable_unit_food_g']!==null||$r['parsed_candidate_g']!==15000||$r['assignment_trust']!=='review_required'){
		$allok=false;echo "     [!] $sku -> ".json_encode($r)."\n";}
}
$T++; if($allok){$P++;echo "  [PASS] visi 13 review: parse=resolved, trust=review_required, sellable=null, candidate=15000\n";}else{$F++;echo "  [FAIL] review trust gate\n";}

// ta pati '1,5 kg': verified->sellable, review->null (problema priskyrime, ne tekste)
check('ta pati 1,5kg + verified → sellable=1500', R('1,5 kg','verified'),
	array('sellable_unit_food_g'=>1500,'assignment_trust'=>'verified'));
check('ta pati 1,5kg + review → sellable=null', R('1,5 kg','review_required'),
	array('sellable_unit_food_g'=>null,'parsed_candidate_g'=>1500,'assignment_trust'=>'review_required'));

echo "\n=== GRAMATIKOS ===\n";
check('bonus 15+3 kg → 18000', R('15+3 kg','verified'),array('sellable_unit_food_g'=>18000,'method'=>'bonus_pack'));
check('bonus 15 + 3 kg tarpai', R('15 + 3 kg','verified'),array('sellable_unit_food_g'=>18000,'method'=>'bonus_pack'));
check('multipack 2×7 kg → 14000', R('2×7 kg','verified'),array('sellable_unit_food_g'=>14000,'method'=>'multipack'));
check('multipack 2x7 kg → 14000', R('2x7 kg','verified'),array('sellable_unit_food_g'=>14000,'method'=>'multipack'));
check('multipack 2 x 7 kg tarpai', R('2 x 7 kg','verified'),array('sellable_unit_food_g'=>14000,'method'=>'multipack'));
check('single 7 kg method', R('7 kg','verified'),array('method'=>'single'));
check('1+2+3 kg → unresolved (jokio surask-visus)', R('1+2+3 kg','verified'),array('parse_status'=>'unresolved'));
check('2 7 kg (be x) → unresolved', R('2 7 kg','verified'),array('parse_status'=>'unresolved'));

echo "\n=== KRAŠTUTINIAI ===\n";
check('0 kg → unresolved', R('0 kg','verified'),array('parse_status'=>'unresolved'));
check('neigiama -5 kg → unresolved', R('-5 kg','verified'),array('parse_status'=>'unresolved'));
check('kg be skaičiaus → unresolved', R('kg','verified'),array('parse_status'=>'unresolved'));
check('500 be vieneto → unresolved', R('500','verified'),array('parse_status'=>'unresolved'));
check('500 ml → unresolved', R('500 ml','verified'),array('parse_status'=>'unresolved'));
check('7 KG didž. → resolved', R('7 KG','verified'),array('sellable_unit_food_g'=>7000));
check('12,5 kg kablelis', R('12,5 kg','verified'),array('sellable_unit_food_g'=>12500));
check('12.5 kg taškas', R('12.5 kg','verified'),array('sellable_unit_food_g'=>12500));
check('multipack viena prekė 2×7=14000 (ne 7000)', R('2×7 kg','verified'),array('sellable_unit_food_g'=>14000));

echo "\n".str_repeat('=',60)."\n";
printf("REZULTATAS: %d/%d PASS, %d FAIL\n",$P,$T,$F);
if($F>0) exit(1);
