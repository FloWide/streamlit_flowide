import streamlit.components.v1 as components

from .._common import variables

_RELEASE = variables.RELEASE

COMPONENT_NAME = "streamlit_custom_map"

if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url="http://localhost:3001",
    )
else:
    _component_func = components.declare_component(COMPONENT_NAME, path=variables.FRONTEND_BUILD)



def CustomMap(js_code: str,**kwargs):
    return _component_func(
        js_code=js_code,
        config={},
        component=COMPONENT_NAME,
        **kwargs
    )



