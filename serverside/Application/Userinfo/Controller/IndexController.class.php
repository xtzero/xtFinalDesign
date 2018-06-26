<?php
	namespace Userinfo\Controller;
	use Xt\XtController;
	class IndexController extends XtController{
		public function __construct(){
			parent::__construct(1);
		}
	
		//修改头像
		//https://xtzero.me/index.php/Userinfo/Index/editUsericon
		public function editUsericon(){
			$this->xtParam('usericon');
			$res = M('user') -> where(['openid' => $this->userinfo['openid']]) -> setField('usericon',$this->usericon);
			if($res){
				$this->xtReturn('200','');
			}else{
				$this->xtReturn('40000','');
			}
		}

		//修改昵称
		//https://xtzero.me/index.php/Userinfo/Index/editNickname
		public function editNickname(){
			$this->xtParam('nickname');
			$res = M('user') -> where(['openid' => $this->userinfo['openid']]) -> setField('nickname',$this->nickname);
			if($res){
				$this->xtReturn('200','');
			}else{
				$this->xtReturn('40000','');
			}
		}
	}