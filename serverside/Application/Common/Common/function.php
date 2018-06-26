<?php
    function getTime(){
        date_default_timezone_set("PRC");
        return time();
    }

    /*
    *跨域
    *ver6.温宇彤
    */
    function crossDomain(){
        header("Access-Control-Allow-Origin: *");
        header('Access-Control-Allow-Headers:x-requested-with,content-type');
        header("Content-type: text/html; charset=utf-8"); 
    }

    function curl($url,$post_data =false,$cookies=false){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_TIMEOUT, 120);
        curl_setopt($ch,CURLOPT_URL,$url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_HEADER, 1);

        if($post_data){
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
        }

        if($cookies){
            curl_setopt($ch, CURLOPT_COOKIE, $cookies);
        }

        $output = curl_exec($ch);
        curl_close($ch);

        if($cookies == false){
            preg_match_all('/Set-Cookie:(.*);/iU', $output, $cookie_temp);
            $cookies = $cookie_temp[1][0];
        }
        return array('data'=>$output,'cookies'=>$cookies);
    }

    //n天前（-）/后（+）的00：00：00的时间戳
    function xtTime($n = 0){
    	return strtotime(date('Y-m-d',getTime() + ($n * 86400)).' 00:00:00');
    }

    function thisMonth1st(){
    	return strtotime(date('Y-m',getTime()).'-01 00:00:00');
    }

    function thisMonthLast(){
    	return strtotime(date('Y-m-d',strtotime(date('Y-m',(strtotime(date('Y-m',getTime()).'-28 00:00:00') + 432000)).'-01') - 43200).' 00:00:00');
    }
    //返回本周day的0点时间戳
    function thisWeekTime($day){
        switch($day){
            case 'monday':      $num=1;break;
            case 'tuesday':     $num=2;break;
            case 'wednesday':   $num=3;break;
            case 'thursday':    $num=4;break;
            case 'friday':      $num=5;break;
            case 'saturday':    $num=6;break;
            case 'sunday':      $num=7;break;
            default:return false;
        }

        $todayNum = ($tmp=date('w',getTime())==0)?7:$tmp;
        $timestamp = strtotime(date('Ymd',xtTime(-($todayNum-$num+1))).' 00:00:00');
        return $timestamp;
    }

    function thisMonday(){
        return strtotime(date('Y-m-d',(getTime()-((date('w')==0?7:date('w'))-1)*24*3600)).' 00:00:00'); 
    }

    //断点调试输出
    function stop(){
        $params = func_get_args();
        foreach ($params as $k => $v) {
            var_dump($v);
        }
        die('<br /><br />Stop function run finished.<br />Enjoy coding.<hr />');
    }

    function today($format='Ymd'){
        return date($format,getTime());
    }

    //16位随机id
    function xt16Id($pre){
        if (strlen($pre) != 1) {
            die('xt16Id 只能接受一位前缀。');
            return 0;
        }

        $time = getTime();
        $timepart = date('ymd',$time);
        $tail = substr($time, 0,5).rand(1000,9999);

        $id = $pre.$timepart.$tail;
        return $id;
    }