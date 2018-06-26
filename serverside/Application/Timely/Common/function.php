<?php
	function dealWebpage($webpage){
		$webpage = str_replace("\n", "", $webpage);
		$webpage = str_replace("\r", "", $webpage);
		$webpage = str_replace("\t", "", $webpage);
		$webpage = str_replace(" ", "", $webpage);
		return $webpage;
	}