<?php
	namespace Moment\Controller;
	use Xt\XtController;
	class IndexController extends XtController{
		public function __construct(){
			parent::__construct(1);
		}
	
		//发帖
		//https://xtzero.me/index.php/Moment/Index/sendMoment
		public function sendMoment(){
			$this->xtParam('content,images');
			$send = M("moment") -> add([
				'openid'	=> $this->userinfo['openid'],
				'content'	=> $this->content,
				'images'	=> $this->images,
				'time'		=> getTime(),
				'valid'		=> 1
			]);

			if($send){
				$this->xtReturn('200','');
			}else{
				$this->xtReturn('40000','');
			}
		}

		//查看帖子
		//https://xtzero.me/index.php/Moment/Index/listMoment
		public function listMoment(){
			$this->xtParam('page');
			$this->xtParam2('my=all');
			$map = [
						'm.valid'	=> 1
					];

			if($this->my == "my"){
				$map['m.openid'] = $this->userinfo['openid'];
			}

			$moments = M('moment')
							-> alias('m')
							-> join('left join user u on m.openid=u.openid')
							-> where($map)
							-> field('u.openid,u.nickname,u.usericon,m.id as mid,m.content,m.images,m.time,m.comment_count')
							-> order('m.time desc')
							-> page($this->page,10)
							-> select();
			if($moments){
				foreach ($moments as $k => $v) {
					$_image = explode(',', $v['images']);

					$momentsArr[$k] = [
						'id'	=> $v['mid'],
						'name'	=> $v['nickname'],
						'time'	=> date('Y-m-d H:i:s',$v['time']),
						'image' => $_image[0],
						'usericon' => $v ['usericon']
					];
				}
				$this->xtReturn('200','',$momentsArr);
			}else{
				$this->xtReturn('40006','');
			}
		}

		//帖子详情
		//https://xtzero.me/index.php/Moment/Index/momentDetail
		public function momentDetail(){
			$this->xtParam('mid');
			$momentDetail = M('moment')
								-> alias('m')
								-> join('left join user u on m.openid=u.openid')
								-> where([
									'm.id'		=> $this->mid,
									'm.valid'	=> 1
								])
								-> field('u.openid,u.nickname,u.usericon,m.id as mid,m.content,m.images,m.time,m.comment_count,m.see_count')
								-> find();
			if($momentDetail){
				//处理图片
				$_images = explode(',', $momentDetail['images']);
				$momentDetail['images'] = $_images;
				
				//评论
				$comments = M('comment')
								-> alias('c')
								-> join('left join user u on c.openid=u.openid')
								-> where([
									'c.valid' => 1,
									'c.mid' => $momentDetail['mid']
								])
								-> field('u.openid,u.nickname,u.usericon,c.content,c.id as cid,c.content,c.time,c.image')
								-> order('c.time desc')
								-> select();
				
				$momentDetail['comments'] = $comments;

				//涨一个阅读数
				M('moment') -> where(['id' => $this->mid]) -> setInc('see_count',1);
				$this->xtReturn('200','',$momentDetail);
			}else{
				$this->xtReturn('401','该帖子不存在');
			}
		}

		//发表评论
		//https://xtzero.me/index.php/Moment/Index/comment
		public function comment(){
			$this->xtParam('mid,content,image');
			$momentExist = M('moment') -> where(['id' => $this->mid,'valid' => 1]) -> find();
			if($momentExist){
				$comment = M('comment') -> add($bag = [
					'openid'	=> $this->userinfo['openid'],
					'content'	=> $this->content,
					'time'		=> getTime(),
					'valid'		=> 1,
					'image'		=> $this->image,
					'mid'		=> $this->mid,
				]);
				
				if($comment){
					//增加一个评论数

					M('moment') -> where(['id' => $this->mid]) -> setInc('comment_count',1);
					$this->xtReturn('200','');
				}else{
					$this->xtReturn('40000','');
				}
			}else{
				$this->xtReturn('401','这个帖子不存在');
			}
		}

		//删帖
		//https://xtzero.me/index.php/Moment/Index/delMoment
		public function delMoment(){
			$this->xtParam('mid');
			$isHisMoment = M('moment') -> where(['id' => $this->mid,'openid' => $this->userinfo['openid'],'valid' => 1]) -> find();
			if($isHisMoment){
				$del = M('moment') -> where(['id' => $this->mid]) -> setField('valid',0);
				if($del){
					$this->xtReturn('200','');
				}else{
					$this->xtReturn('40000','');
				}
			}else{
				$this->xtReturn('40000','');
			}
		}

		//我参与评论的帖子
		//https://xtzero.me/index.php/Moment/Index/myCommentedMoments
		public function myCommentedMoments(){
			$this->xtParam('page');
			$myCommentedMoments = M('comment')
									-> alias('c')
									-> join('left join moment m on c.mid=m.id')
									-> join('left join user u on m.openid=u.openid')
									-> where([
										'c.openid' => $this->userinfo['openid'],
										'c.valid' => 1,
										'm.valid' => 1
									])
									-> field('u.nickname,u.usericon,c.content as comment_content,c.time as comment_time,m.id as mid,m.content as moment_content,m.time as moment_time,m.images as moment_images')
									-> order('c.time desc')
									-> page($this->page,10)
									-> select();

			if($myCommentedMoments){
				$_images = explode(',',$myCommentedMoments['moment_images']);
				$myCommentedMoments['moment_images'][0];

				$this->xtReturn('200','',$myCommentedMoments);
			}else{
				$this->xtReturn('40006','');
			}
		}

		//用户反馈
		public function feedback(){
			$this->xtParam('content,contact');
			$res = M('feedback') -> add([
				'openid' => $this->userinfo['openid'],
				'content' => $this->content,
				'time' => getTime(),
				'contact' => $this->contact
 			]);

 			if($res){
 				$this->xtReturn('200','');
 			}else{
 				$this->xtReturn('40000','');
 			}
		}
	}