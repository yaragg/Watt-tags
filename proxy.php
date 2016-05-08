<?php
	if(array_key_exists('tag', $_REQUEST)){
		$url = 'https://api.wattpad.com:443/v4/stories?query=%23' . $_REQUEST['tag'];
	}
	else{
		echo "No URL requested!";
		exit();
	}

	//Adapted from http://stackoverflow.com/questions/7732634/making-a-http-get-request-with-http-basic-authentication
	$options = array('http' => array(
			'method' => 'GET',
			'header' => 'Authorization: Basic opvIOeOTTqgYiHKtP4XubwylYBnUCSfDBNl1M4vnZKes'
		));
	$context = stream_context_create($options);

	$data = file_get_contents($url, false, $context);

	if(array_key_exists('callback', $_REQUEST)){
		$callback = $_REQUEST['callback'];
		$data = "$callback($data)";
	}

	header("content-type: application/javascript");
	echo $data;
?>