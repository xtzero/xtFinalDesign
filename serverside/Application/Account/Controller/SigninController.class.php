<?php
	namespace Account\Controller;
	use Xt\XtController;
	class SigninController extends XtController{
		public function __construct(){
			parent::__construct();
		}

		public function signin(){
			$this->xtParam('nickname,usericon');
			$jsCode = I('post.code');
			if(empty($jsCode)){
				$this->xtReturn('40004','');
			}else if(S($jsCode)){
				$this->openid = S('openid_'.$jsCode);
				$this->session_key = S('session_key_'.$jsCode);
			}else{
				$url = 'https://api.weixin.qq.com/sns/jscode2session?appid='.$this->appid.'&secret='.$this->secret.'&js_code='.$jsCode.'&grant_type=authorization_code';
				$_res = file_get_contents($url);
				$res = json_decode($_res,true);
				if($res['errcode']){
					$this->xtReturn($res['errcode'],$res['errmsg']);
				}else{
					S($jsCode,getTime(),280);
					S('openid_'.$jsCode,$res['openid'],280);
					S('session_key_'.$jsCode,$res['session_key'],280);
					$this->openid = S('openid_'.$jsCode);
					$this->session_key = S('session_key_'.$jsCode);
				}
			}
			
			if(M('user') -> where(['openid' => $this->openid]) -> find()){
				$this->xtReturn('401','已经注册过了。');
			}

			$signin = M('user') -> add([
				'openid'		=> $this->openid,
				'create_time'	=> getTime(),
				'change_time'	=> getTime(),
				'nickname'		=> $this->nickname,
				'usericon'		=> $this->usericon,
				'sina'			=> '刚刚注册的萌新。'
			]);

			if($signin){
				$this->xtReturn('200','');
			}else{
				$this->xtReturn('40000','');
			}
		}
	}

	