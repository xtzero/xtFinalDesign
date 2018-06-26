<?php
	namespace Article\Controller;
	use Xt\XtController;
	class IndexController extends XtController{
		public function __construct(){
			parent::__construct(1);
		}
	
		//列出文章
		//https://xtzero.me/index.php/Article/Index/listArticle
		public function listArticle(){
			$this->xtParam('page');
			$articles = M('article') -> field('id as aid,title,author,cover') -> order('time desc') -> page($this->page,10) -> select();
			if($articles){
				$this->xtReturn('200','',$articles);
			}else{
				$this->xtReturn('40006','');
			}
		}

		//文章详情
		//https://xtzero.me/index.php/Article/Index/articleDetail
		public function articleDetail(){
			$this->xtParam('aid');
			$articleDetail = M('article') -> where(['id' => $this->aid]) -> find();
			if($articleDetail){
				$articleDetail['content'] = $this->articleStringToArr($articleDetail['content']);

				$this->xtReturn('200','',$articleDetail);
			}else{
				$this->xtReturn('401','这个文章不存在');
			}
		}

		private function articleStringToArr($str){
			$lines = explode('<<>>', $str);
			foreach ($lines as $k => $v) {
				$lines_[$k] = explode('_==_', $v);
			}

			return $lines_;
		}
	}