import streamlit.components.v1 as components

from .._common import variables

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



