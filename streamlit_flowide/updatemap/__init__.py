import streamlit.components.v1 as components
from .._common import variables
from .._common.types import MapConfig,TypedDict,CRS
from typing import Optional,List,Union

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



def UpdateMap(config: MapConfig,data: List[InitData], ws_urls: Union[List[str],str],js_hook=None,key=None,auto_move=True,crs: CRS = CRS.Meter, **kwargs):
    component_value = _component_func(
        config=config,
        init_data=data,
        key=key, 
        default=0,
        ws_urls=(ws_urls if isinstance(ws_urls,list) else [ws_urls] ),
        js_hook=js_hook,
        component=COMPONENT_NAME,
        auto_move=auto_move,
        crs=crs,
        **kwargs
    )
    return component_value

