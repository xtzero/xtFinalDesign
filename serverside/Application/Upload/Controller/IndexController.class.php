<?php
	namespace Upload\Controller;
	use Xt\XtController;
	use Think\SCS\SCS;
	class IndexController extends XtController{
		public function __construct(){
			parent::__construct();
		}
	
		public function index(){
			$s = new SCS();
			$filename = getTime().$_FILES['file']['name'];
			$upload = $s -> putObjectFile($_FILES['file']['tmp_name'],'xtfinaldesign',$filename);
			// stop($filename,$upload,$_FILES);
			if($upload){
				$imageUrl = 'http://sinacloud.net/xtfinaldesign/'.$filename;
				$this->xtReturn('200','',$imageUrl);
			}else{
				$this->xtReturn('40000','');
			}
		}
	}