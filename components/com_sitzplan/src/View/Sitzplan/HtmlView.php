<?php

declare(strict_types=1);

namespace Joomla\Component\Sitzplan\Site\View\Sitzplan;

use Joomla\CMS\Factory;
use Joomla\CMS\Language\Text;
use Joomla\CMS\MVC\View\HtmlView as BaseHtmlView;

class HtmlView extends BaseHtmlView
{
    public function display($tpl = null): void
    {
        $document = Factory::getApplication()->getDocument();
        $wa       = $document->getWebAssetManager();

        $wa->registerAndUseStyle('com_sitzplan.site', 'media/com_sitzplan/css/site.css');
        $wa->registerAndUseScript('com_sitzplan.site', 'media/com_sitzplan/js/site.js', [], ['defer' => true]);

        $this->title    = Text::_('COM_SITZPLAN_TITLE');
        $this->subtitle = Text::_('COM_SITZPLAN_SUBTITLE');

        parent::display($tpl);
    }
}
