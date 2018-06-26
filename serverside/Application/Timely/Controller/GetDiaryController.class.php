<?php
	namespace Timely\Controller;
	use Xt\XtController;
	class GetDiaryController extends XtController{
		public function __construct(){
			parent::__construct(0);
		}
	
		//定时任务，去携程网抓消息
		//就这个接口，每天0点和12点执行
		//https://xtzero.me/index.php/Timely/GetDiary/get
		public function get($page = 1){
			$url = 'http://you.ctrip.com/yousite/Home/GetTravel';
			$bag = [
				'traveltype' => 'head',
				'pageindex' => $page
			];

			$response = curl($url,$bag);
			$json = substr($response['data'],strpos($response['data'], '{'));
			$array = json_decode($json,true);
			$array_ = $array['Travel'];

			$array__ = [];
			foreach ($array_ as $k => $v) {
				if(M('article') -> where(['title' => $v['Name']]) -> find()){
					continue;
				}else{
					$temp = $this->urlToContent($v['Url']);
					array_push($array__, [
						'title'		=> $v['Name'],
						'descr'		=> $v['Content'].'...',
						'author'	=> $v['Author'],
						'time'		=> strtotime($v['Time']),
						'cover'		=> $v['Img'],
						'banner'	=> $temp['banner'],
						'url'		=> $v['Url'],
						'content'	=> $this->articleArrayToString($temp['content'])
					]);
				}
			}

			M('article') -> addAll($array__);
		}

		public function urlToContent($url){
			$webpage = file_get_contents($url);
			$webpage_ = dealWebpage($webpage);
			$a_str = '<i></i>浏览<span></span></a></span></div>';
			$b_str = '<!--游记正文end-->';
			$a = strpos($webpage_, $a_str) + strlen($a_str);
			$b = strpos($webpage_, $b_str);
			$contents = substr($webpage_, $a ,$b - $a);
			$_contents = str_replace('</', '【换行】</', $contents);
			$__contents = explode('【换行】', $_contents);
			// stop($webpage_);
			foreach ($__contents as $k => $v) {
				$v = htmlspecialchars_decode($v);
				//如果这一块是图片的
				if(strpos($v, 'src="')){
					$c_str = 'data-original=';
					$c = strpos($v, $c_str) + strlen($c_str) + 1;
					$d_str = '\'src=';
					$d = strpos($v, $d_str);
					$imageurl = substr($v, $c,$d - $c);
					$__contents[$k] = [
						'type' 		=> 'image',
						'content'	=> $imageurl
					];
				}else if(strpos($v, '<h5class="title5"id="80234073">')){
					$__contents[$k] = [
						'type'		=> 'level2Title',
						'content'	=> strip_tags($v)
					];
				}else if(strpos($v, '<emclass="name">')){
					$__contents[$k] = [
						'type'		=> 'imageTitle',
						'content'	=> strip_tags($v)
					];
				}else if(strpos($v, '<strong>')){
					$__contents[$k] = [
						'type'		=> 'strongText',
						'content'	=> strip_tags($v)
					];
				}else if(strip_tags($v) =='&nbsp;' || strip_tags($v) == ''){
					$__contents[$k] = [
						'type'		=> 'br',
						'content'	=> ''
					];
				}else if(strpos($v, 'aclass="gs_a_poi"')){
					$__contents[$k] = [
						'type'		=> 'colorSpan',
						'content'	=> strip_tags($v)
					];
				}else{
					$__contents[$k] = [
						'type'		=> 'text',
						'content'	=> strip_tags($v)
					];
				}

			}

			$res = [
				//这个就是处理好的数组形式的文章
				'content' 	=> $__contents,

				//封面
				'banner'	=> $this->getCover($webpage_)
			];

			return $res;
		}

		private function articleArrayToString($articleArr){
			foreach ($articleArr as $k => $v) {
				$articleArr_[$k] = implode('_==_', $v);
			}

			$str = implode('<<>>', $articleArr_);
			return $str;
		}

		private function getCover($webpage){
			$a_str = '<imgdata-coverlocationy="0"';
			$a = strpos($webpage, $a_str) + strlen($a_str);
			$b_str = '<divclass="ctd_head">';
			$b = strpos($webpage, $b_str);

			$imgHtml = substr($webpage, $a,$b - $a);
			
			$c_str = 'src="';
			$c = strpos($imgHtml, $c_str) + strlen($c_str);
			$d_str = '"/>';
			$d = strpos($imgHtml, $d_str);

			$imageUrl = substr($imgHtml, $c,$d - $c);
			return $imageUrl;
		}
	}