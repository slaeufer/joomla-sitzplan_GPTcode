<?php

declare(strict_types=1);

use Joomla\CMS\Factory;

defined('_JEXEC') or die;

$application = Factory::getApplication();
$input       = $application->getInput();
$controller  = $input->getCmd('controller', 'display');
$task        = $input->getCmd('task', 'display');

$application->bootComponent('com_sitzplan')
    ->getMVCFactory()
    ->createController($controller, 'Site', [], $application, $input)
    ->execute($task);
