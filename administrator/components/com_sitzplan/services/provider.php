<?php

declare(strict_types=1);

namespace Joomla\Component\Sitzplan\Administrator\Service;

use Joomla\CMS\Dispatcher\ComponentDispatcherFactoryInterface;
use Joomla\CMS\Extension\ComponentInterface;
use Joomla\CMS\Extension\Service\Provider\ComponentDispatcherFactory;
use Joomla\CMS\Extension\Service\Provider\MVCFactory;
use Joomla\CMS\MVC\Factory\MVCFactoryInterface;
use Joomla\Component\Sitzplan\Administrator\Extension\SitzplanComponent;
use Joomla\DI\Container;
use Joomla\DI\ServiceProviderInterface;

return new class () implements ServiceProviderInterface {
    public function register(Container $container): void
    {
        $container->registerServiceProvider(new MVCFactory('Joomla\\Component\\Sitzplan'));
        $container->registerServiceProvider(new ComponentDispatcherFactory('Joomla\\Component\\Sitzplan'));

        $container->set(
            ComponentInterface::class,
            static function (Container $container): SitzplanComponent {
                $component = new SitzplanComponent($container->get(ComponentDispatcherFactoryInterface::class));
                $component->setMVCFactory($container->get(MVCFactoryInterface::class));

                return $component;
            }
        );
    }
};
