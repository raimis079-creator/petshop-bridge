<?php
/** TEMP PS S1681 ad — read-only: laiškų šaltinis — ps_email_jobs 24 val., MailPoet eilė/naujienlaiškiai/prenumeratoriai (orange.fr), wpmailsmtp debug, komentarai 48 val., ps_naujienlaiskiai. */
add_action('init', function(){
  if (!isset($_GET['ps_s1681ad'])) return; global $wpdb; $p=$wpdb->prefix; $o=array('v'=>'S1681 ad');
  $o['jobs_cols']=$wpdb->get_col("SHOW COLUMNS FROM {$p}ps_email_jobs");
  $o['jobs24']=$wpdb->get_results("SELECT * FROM {$p}ps_email_jobs ORDER BY id DESC LIMIT 12",ARRAY_A);
  $o['mp_sub_orange']=$wpdb->get_results("SELECT id,email,status,created_at FROM {$p}mailpoet_subscribers WHERE email LIKE '%orange.fr%' OR email LIKE '%saintgeniest%' LIMIT 5",ARRAY_A);
  $o['mp_sub_n']=$wpdb->get_results("SELECT status,COUNT(*) n FROM {$p}mailpoet_subscribers GROUP BY status",ARRAY_A);
  $o['mp_queue']=$wpdb->get_results("SELECT q.id,q.newsletter_id,q.count_total,q.count_processed,q.count_to_process,t.status,t.updated_at FROM {$p}mailpoet_sending_queues q JOIN {$p}mailpoet_scheduled_tasks t ON t.id=q.task_id ORDER BY q.id DESC LIMIT 5",ARRAY_A);
  $o['mp_tasks24']=$wpdb->get_results("SELECT type,status,COUNT(*) n,MAX(updated_at) iki FROM {$p}mailpoet_scheduled_tasks WHERE updated_at>=DATE_SUB(NOW(),INTERVAL 24 HOUR) GROUP BY type,status",ARRAY_A);
  $o['mp_active']=in_array('mailpoet/mailpoet.php',get_option('active_plugins'));
  $o['smtp_debug']=$wpdb->get_results("SELECT id,LEFT(content,300) c,initiator,event_type,created_at FROM {$p}wpmailsmtp_debug_events ORDER BY id DESC LIMIT 5",ARRAY_A);
  $o['comments']=$wpdb->get_results("SELECT comment_type,comment_approved,COUNT(*) n,MAX(comment_date) iki FROM {$p}comments WHERE comment_date>=DATE_SUB(NOW(),INTERVAL 48 HOUR) GROUP BY comment_type,comment_approved",ARRAY_A);
  $o['comment_sample']=$wpdb->get_results("SELECT comment_type,comment_author_email,LEFT(comment_content,100) c,comment_date FROM {$p}comments WHERE comment_date>=DATE_SUB(NOW(),INTERVAL 48 HOUR) AND comment_type NOT IN('order_note','review') ORDER BY comment_ID DESC LIMIT 5",ARRAY_A);
  $o['nl']=$wpdb->get_results("SELECT * FROM {$p}ps_naujienlaiskiai ORDER BY 1 DESC LIMIT 3",ARRAY_A);
  $o['e']=$wpdb->last_error;
  header('Content-Type: application/json; charset=utf-8'); echo json_encode($o,JSON_UNESCAPED_UNICODE|JSON_PARTIAL_OUTPUT_ON_ERROR); exit;
});
