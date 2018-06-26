<?php
	namespace Account\Controller;
	use Xt\XtController;
	class LoginController extends XtController{
		public function __construct(){
			parent::__construct();
		}
	
		public function login(){
			$jsCode = I('post.code');
			if(empty($jsCode)){
				$this->xtReturn('40005','');
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

			$userinfo = M('user') -> where(['openid' => $this->openid]) -> find();
			if($userinfo){
				$token = md5($this->openid.getTime().rand(100000,999999));
				$insertToken = M('token') -> add([
					'openid'		=> $this->openid,
					'token'			=> $token,
					'create_time'	=> getTime(),
					'overdate_time'	=> getTime()+8640000 //token一天到期
				]);

				if($insertToken){
					$userinfo['token'] = $token;
					$this->xtReturn('200','',$userinfo);
				}else{
					$this->xtReturn('40000','');
				}
			}else{
				$this->xtReturn('40002','未注册');
			}
		}
	}

	