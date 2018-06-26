<?php
	/**
	*	@see 巨厉害的XtController，为需求简化的RestController
	* 	@see By：XtZero
	*/	
	namespace Xt;
	class XtController{
		protected $appid 		=	'wxf1ecc41105a7b3ea';
		protected $secret 		=	'b8338ffd2f5933a0d5cca570863a6235';
		protected $openid		=	false;
		protected $session_key	= 	false;

		/**
		*	构造函数
		* 	@param bool $kuayu
		* 	@param string $type  	按位决定功能，eg:type=11   
		* 	@param $type1 	:是否检查token并获取用户基础信息（手机、userid、学校、头像）
		* 	@return $this->token 中保存了用token换来的用户信息，见44行
		*/
		public function __construct($getUserInfo = 0){
			//跨域处理
			if($crossDomain){
				header("Access-Control-Allow-Origin: *");
		        header('Access-Control-Allow-Headers:x-requested-with,content-type');
		        header("Content-type: text/html; charset=utf-8"); 
			}

			if($getUserInfo){
				$token = I('post.token');
				if(empty($token)){
					$this->xtReturn();
				}else{
					$userinfo = M('token')
									-> alias('t')
									-> join('left join user u on t.openid=u.openid')
									-> where([
										't.overdate_time'	=> ['gt',getTime()],
										't.token'			=> $token,
									])
									-> field('u.openid,u.nickname,u.usericon,u.sina')
									-> find();
					if($userinfo){
						$this->userinfo = $userinfo;
					}else{
						$this->xtReturn('40001','');
					}
				}
			}
		}

		/**
		*返回数据包
		*@param 	string 	$code
		*@param 	string 	$message
		*@param 	array 	$data
		*@return 	json 	$res
		*/
		protected function xtReturn($code='40004',$message='缺少参数：token',$data=array()){
			switch($code){
				case '40000' : 	$message = '系统错误，请重试';break;
				case '40001' :	$message='登录状态已过期，请重新登录';break;
				case '40002' :	$message='未注册';break;
				case '40003' :	$message='调用了不存在的程序接口。';break;
				case '40005' :	$message='请从小程序中访问';break;
				case '40006' : 	$message = '没有更多数据了';break;
				case '200'	 :	$message='成功';break;				
			}

			$res = array( 
					'meta' => array(
							'code' 		=> $code,
							'message' 	=> $message
						),
					'data' => $data
				);
			
			header('HTTP/1.1 200 OK');
            header('Status:200 OK');
            header('Content-Type: application/json; charset=utf8');

        	exit(json_encode($res,JSON_UNESCAPED_SLASHES));
		}

		/**
		*参数验证
		*@param 	array 	$paramArray
		*@return	bool 	1 	成功
					bool 	0 	错误，传入非数组/字符串
		*/
		protected function xtParam($paramArray){
			$data = I('post.');
			if(is_string($paramArray)){
				if(strpos($paramArray, 'password') !== 0){
					$paramArray = htmlspecialchars_decode($paramArray);
				}
				$paramArray = explode(',', $paramArray);
				$error = 1;						//不缺参数
				$errorParamStr = '';
				foreach ($paramArray as $k => $v) {
					// var_dump($v);
					if($v == 'password'){
						$data[$v] = htmlspecialchars_decode($data[$v]);
					}
					if(empty($this->{$v} = $data[$v])){
						if($errorParamStr == ''){
							$errorParamStr .= ''.$v.'';
						}else{
							$errorParamStr .= ','.$v.'';
						}
						$error = 0;
					}
				}
			}else if(is_array($paramArray)){
				$error = 1;						//不缺参数
				$errorParamStr = '';
				foreach ($paramArray as $k) {
					// var_dump($k);
					if($k == 'password'){
						$data[$k] = htmlspecialchars_decode($data[$k]);
					}

					if(empty($this->{$k} = $data[$k])){
						if($errorParamStr == ''){
							$errorParamStr .= ''.$k.'';
						}else{
							$errorParamStr .= ','.$k.'';
						}
						$error = 0;
					}
				}
			}else{
				$this->xtReturn('40004','xtParam方法传入了非string或非Array参数');
			}

			if(!$error){
				$this->xtReturn('40004','缺少参数：'.$errorParamStr.'.');
			}else{
				return 1;
			}
		}

		/**
		*不是必要的参数验证
		*@param 	string 	使用逗号分隔的参数列表
		*@return	bool 	1 	成功
					bool 	0 	错误，传入非数组/字符串
		*/
		protected function xtParam2($paramArray){
			$data = I('post.');
			if(is_string($paramArray)){
				$paramArray = explode(',', $paramArray);
				$error = 1;						//不缺参数
				$errorParamStr = '';
				foreach ($paramArray as $k => $v) {
					$_temp = explode('=', $v);
					if(empty($this->{$_temp[0]} = trim($data[$_temp[0]]))){
						$this->{$_temp[0]} = ((bool)$_temp[1])?trim($_temp[1]):false;
					}
				}
			}else{
				$this->xtReturn('40004','xtParam方法传入了非string或非Array参数');
			}
		}
	}