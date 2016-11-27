<?php


$content = json_decode(file_get_contents('./news.json'));

echo $content;




foreach($content as $news) {

	file_put_contents('decoded.json', json_encode($news));	


	exec('firebase database:push /news/new < ./decoded.json');
}


?>
