import streamlit.components.v1 as components

from .._common import variables

from .. import javascript_hooks as js
import os
try:
    from streamlit import cache_resource
    cache = cache_resource
except ImportError:
    from streamlit import cache

_RELEASE = variables.RELEASE

COMPONENT_NAME = "streamlit_flowide_map"

if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url="http://localhost:3001",
    )
else:
    _component_func = components.declare_component(COMPONENT_NAME, path=variables.FRONTEND_BUILD)



def FloWideMap(config,module: str,**kwargs):
    return _component_func(
        module=module,
        config=config,
        component=COMPONENT_NAME,
        **kwargs
    )

def FloWidePlayBack(config,auto_refresh=False,**kwargs):
    return FloWideMap(
        config,
        __get_module_code('playback.ts.build'),
        auto_refresh=auto_refresh,
        **kwargs
    )

def FloWideUpdateMap(config,ws_url,init_data,gps_map_key=None,meter_map_key=None,**kwargs):
    return FloWideMap(
        config,
        __get_module_code('updatemap.ts.build'),
        ws_url=ws_url,
        init_data=init_data,
        gps_map_key=gps_map_key,
        meter_map_key=meter_map_key,
        **kwargs
    )


@cache(show_spinner=False)
def __get_module_code(module_file: str):
    with open(__get_module_file(module_file),'r') as f:
        return f.read()


def __get_module_file(module_file: str):
    return os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            'modules',
            module_file
        )
    )
