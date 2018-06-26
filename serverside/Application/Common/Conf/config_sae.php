<?php
return array(
	'DB_TYPE'       => 'mysql', //分布式数据库类型必须相同
	/*'DB_HOST'       => 'bcgdvrqhbbfi.rds.sae.sina.com.cn,fzmlfhzmisci.rds.sae.sina.com.cn',*/
	'DB_HOST'       => SAE_MYSQL_HOST_M,
	'DB_NAME'       => SAE_MYSQL_DB, //如果相同可以不用定义多个
	'DB_USER'       => SAE_MYSQL_USER,
	'DB_PWD'        => SAE_MYSQL_PASS,
	'DB_PORT'       => SAE_MYSQL_PORT,
	'DB_PREFIX'     => '',
	//Sql语句（查询）解析缓存，用于提升能效
	//'DB_SQL_BUILD_CACHE' => true,
    //'DB_SQL_BUILD_QUEUE' => 'xcache',
    //'DB_SQL_BUILD_LENGTH' => 20,

	//PUBLIC
    '__PUBLIC__'    =>  __ROOT__.'/Public',
);