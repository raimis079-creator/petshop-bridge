<?php
require __DIR__.'/class-feeding-canonical-hash.php';
$data=json_decode(file_get_contents('/home/claude/rd.json'),true);
$T=0;$P=0;$F=0;
function ok($n,$c){global $T,$P,$F;$T++;if($c){$P++;echo "  [PASS] $n\n";}else{$F++;echo "  [FAIL] $n\n";}}

// TESTAS 1: žinomos lentelės hash sutampa
foreach(array('t199','t165','t83') as $tid){
	$t=$data[$tid]['table']; $rows=$data[$tid]['rows'];
	$h=Petshop_Feeding_Canonical_Hash::compute($t,$rows);
	ok("1. $tid žinomas hash sutampa", $h===$data[$tid]['hash']);
}

// TESTAS 2: eilučių tvarka NEkeičia hash
foreach(array('t199','t83') as $tid){
	$t=$data[$tid]['table']; $rows=$data[$tid]['rows'];
	$h1=Petshop_Feeding_Canonical_Hash::compute($t,$rows);
	$rev=array_reverse($rows);
	$h2=Petshop_Feeding_Canonical_Hash::compute($t,$rev);
	ok("2. $tid tvarka nekeičia hash", $h1===$h2);
}

// TESTAS 3: vienas normos pakeitimas KEIČIA hash
$t=$data['t199']['table']; $rows=$data['t199']['rows'];
$h1=Petshop_Feeding_Canonical_Hash::compute($t,$rows);
$mod=$rows; $mod[0]['amount_from_g']='999.00';
$h2=Petshop_Feeding_Canonical_Hash::compute($t,$mod);
ok("3. normos pakeitimas keičia hash", $h1!==$h2);

// TESTAS 4: redirect_reason pakeitimas KEIČIA hash
$mod2=$rows; $mod2[0]['redirect_reason']='TEST_REDIRECT';
$h3=Petshop_Feeding_Canonical_Hash::compute($t,$mod2);
ok("4. redirect pakeitimas keičia hash", $h1!==$h3);

// TESTAS 4b: condition_dimensions pakeitimas keičia hash (t83 turi conditions)
$t83=$data['t83']['table']; $r83=$data['t83']['rows'];
$h83a=Petshop_Feeding_Canonical_Hash::compute($t83,$r83);
$m83=$r83; $m83[0]['condition_dimensions']='{"feeding_type":"mixed"}';
$h83b=Petshop_Feeding_Canonical_Hash::compute($t83,$m83);
ok("4b. condition pakeitimas keičia hash", $h83a!==$h83b);

// TESTAS 5: meta ($id) pakeitimas keičia hash
$mt=$t; $mt['brand']='KITAS';
$h4=Petshop_Feeding_Canonical_Hash::compute($mt,$rows);
ok("5. brand (meta) pakeitimas keičia hash", $h1!==$h4);

echo "\n".str_repeat('=',50)."\n";
printf("REZULTATAS: %d/%d PASS, %d FAIL\n",$P,$T,$F);
if($F>0)exit(1);
