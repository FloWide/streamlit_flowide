import os
import streamlit.components.v1 as components
from .._common import variables
from .._common.types import MapConfig,TypedDict
from .._common.gps_transform import create_transform_function
from typing import Iterable,Callable,List


class PlaybackEvent(TypedDict):
    name:str
    args:dict

class PlaybackElement(TypedDict):
    time:int
    event:PlaybackEvent


_RELEASE = variables.RELEASE


COMPONENT_NAME = "streamlit_flowide_playback"

if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url="http://localhost:3001",
    )
else:
    _component_func = components.declare_component(COMPONENT_NAME, path=variables.FRONTEND_BUILD)

def _prepare_data(data:Iterable[PlaybackElement],transform: Callable[[List[float]],List[float]] ) -> List[PlaybackElement]:

    if not transform:
        return list(data)

    pdata = []
    for el in data:
        pos = el["event"]["args"].get('position')
        prev_pos = el["event"]["args"].get('prevPosition')

        if pos and pos[-1] == 'gcs':
            el["event"]["args"]["position"] = transform(pos[0:-1])
        
        if prev_pos and prev_pos[-1] == 'gcs':
            el["event"]["args"]["prevPosition"] = transform(prev_pos[0:-1])


        pdata.append(el)
    return pdata


def PlayBack(config: MapConfig,data: Iterable[PlaybackElement], key=None):
    component_value = _component_func(
        config=config,
        data=_prepare_data(data,create_transform_function(config.get("gps_transform"))),
        key=key, 
        default=0,
        component=COMPONENT_NAME
    )
    return component_value

