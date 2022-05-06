<?php

require('vendor/autoload.php');
require("web/src/DbWorker.php");

$worker = new DbWorker();
$worker->work();
