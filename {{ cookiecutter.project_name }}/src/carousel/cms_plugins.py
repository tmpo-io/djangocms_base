# coding: utf-8
import re
from cms.plugin_base import CMSPluginBase
from cms.plugin_pool import plugin_pool
from .models import *
from django.utils.translation import ugettext as _
from django.contrib import admin
from django.forms import ModelForm, ValidationError
from cmsplugin_filer_image.cms_plugins import FilerImagePlugin


class GaleriaPlugin(CMSPluginBase):
    model = Galeria
    name = _("Galeria")
    render_template = "galeria.html"
    allow_children = True
    child_classes = ['ImageGaleriaPlugin']

    def render(self, context, instance, placeholder):
        context.update({
            'instance': instance,
            'placeholder': placeholder,
        })
        return context


class ImageGaleriaPlugin(FilerImagePlugin):
    parent_classes = ['GaleriaPlugin']


plugin_pool.register_plugin(GaleriaPlugin)
plugin_pool.register_plugin(ImageGaleriaPlugin)
