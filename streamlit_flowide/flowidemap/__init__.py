import streamlit.components.v1 as components

from .._common import variables

from .. import javascript_hooks as js
import os
from streamlit import cache,spinner

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
        __get_module_code('playback.ts'),
        auto_refresh=auto_refresh,
        **kwargs
    )

def FloWideUpdateMap(config,ws_url,init_data,gps_map_key=None,meter_map_key=None,**kwargs):
    return FloWideMap(
        config,
        __get_module_code('updatemap.ts'),
        ws_url=ws_url,
        init_data=init_data,
        gps_map_key=gps_map_key,
        meter_map_key=meter_map_key,
        **kwargs
    )


@cache(show_spinner=False)
def __get_module_code(module_file: str):
    with spinner(f'Compiling map module: {module_file}'):
        return js.typescript(__get_module_file(module_file))


def __get_module_file(module_file: str):
    return os.path.abspath(
        os.path.join(
            os.path.dirname(__file__),
            'modules',
            module_file
        )
    )