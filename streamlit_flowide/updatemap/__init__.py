import streamlit.components.v1 as components
from .._common import variables
from .._common.types import MapConfig,TypedDict
from typing import Optional,List

class InitData(TypedDict):
    markerId: str
    tags: List[str]
    position: List[float]
    color: Optional[str]
    icon: Optional[str]
    scale: Optional[float]

_RELEASE = variables.RELEASE


COMPONENT_NAME = "streamlit_flowide_updatemap"

if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url="http://localhost:3001",
    )
else:
    _component_func = components.declare_component(COMPONENT_NAME, path=variables.FRONTEND_BUILD)



def UpdateMap(config: MapConfig,data: List[InitData], ws_url: str,key=None):
    component_value = _component_func(
        config=config,
        init_data=data,
        key=key, 
        default=0,
        ws_url=ws_url,
        component=COMPONENT_NAME
    )
    return component_value

