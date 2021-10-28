import streamlit.components.v1 as components
from streamlit.report_thread import get_report_ctx
from time import time, sleep
import streamlit as st
from .._common import variables
from .._common.types import MapConfig
from .._common.gps_transform import create_transform_function
from typing import Callable, List

from contextlib import contextmanager
import itertools

COMPONENT_NAME = "streamlit_flowide_livemap"


class LiveMapContext:

    def __init__(self, send, value):
        self._send = lambda **kwargs: send(component=COMPONENT_NAME, **kwargs)
        self.value = value

    def __current_milli_time(self):
        return int(time() * 1000)

    def set_gps_transform(self, transform: Callable[[List[float]], List[float]]):
        self._transform = transform

    def create_marker(self, id, pos, scale=1, cluster=False, delay=None):
        if self._transform and pos[-1] == 'gcs':
            pos = self._transform(pos[0:-1])

        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'CREATE_MARKER',
                'args': {
                    'id': id,
                    'position': pos,
                    'scale': scale,
                    'cluster': cluster
                }
            }
        }])

    def delete_marker(self, id, pos=[0, 0], delay=None):
        if self._transform and pos[-1] == 'gcs':
            pos = self._transform(pos[0:-1])
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'DELETE_MARKER',
                'args': {
                    'id': id,
                    'position': pos
                }
            }
        }])

    def move_marker(self, id, pos, delay=None):
        if self._transform and pos[-1] == 'gcs':
            pos = self._transform(pos[0:-1])
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'MOVE_MARKER',
                'args': {
                    'id': id,
                    'position': pos,
                    'noTrack':True,
                    'prevPosition': [0, 0]  # not used in live context
                }
            }
        }])

    def open_popup(self, id, content, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'OPEN_POPUP',
                'args': {
                    'id': id,
                    'content': content
                }
            }
        }])

    def close_popup(self, id, content=None, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'CLOSE_POPUP',
                'args': {
                    'id': id,
                    'content': content
                }
            }
        }])

    def change_main_icon(self, id, icon, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'FLO_ICON_CHANGE_MAIN_ICON',
                'args': {
                    'id': id,
                    'from': None,
                    'to': icon
                }
            }
        }])

    def change_main_color(self, id, color, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'FLO_ICON_CHANGE_MAIN_COLOR',
                'args': {
                    'id': id,
                    'from': None,
                    'to': color
                }
            }
        }])

    def add_icon_plate(self, id, icon, side, color=None, slot=-1, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'FLO_ICON_ADDON_ADD',
                'args': {
                    'id': id,
                    'icon': icon,
                    'side': side,
                    'color': color,
                    'slot': slot
                }
            }
        }])

    def remove_icon_plate(self, id, icon, side, color=None, slot=-1, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'FLO_ICON_ADDON_REMOVE',
                'args': {
                    'id': id,
                    'icon': icon,
                    'side': side,
                    'color': color,
                    'slot': slot
                }
            }
        }])

    def add_icon_status(self, icon, slot, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'FLO_ICON_STATUS_ADD',
                'args': {
                    'id': id,
                    'icon': icon,
                    'slot': slot
                }
            }
        }])

    def remove_icon_status(self, icon, slot, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'FLO_ICON_STATUS_REMOVE',
                'args': {
                    'id': id,
                    'icon': icon,
                    'slot': slot
                }
            }
        }])

    def create_rectangle(self, id, bounds, color='blue', delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'RECTANGLE_CREATE',
                'args': {
                    'id': id,
                    'bounds': bounds,
                    'color': color
                }
            }
        }])

    def remove_rectangle(self, id, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'RECTANGLE_REMOVE',
                'args': {
                    'id': id,
                    'bounds': None,
                    'color': None
                }
            }
        }])

    def change_rectangle_color(self, id, color, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'RECTANGLE_CHANGE_COLOR',
                'args': {
                    'id': id,
                    'from': None,
                    'to': color
                }
            }
        }])

    def change_rectangle_bounds(self, id, bounds, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'RECTANGLE_CHANGE_BOUNDS',
                'args': {
                    'id': id,
                    'from': None,
                    'to': bounds
                }
            }
        }])

    def create_circle(self, id, radius, pos, color="red", delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'CIRCLE_CREATE',
                'args': {
                    'id': id,
                    'radius': radius,
                    'pos': pos,
                    'color': color
                }
            }
        }])

    def remove_circle(self, id, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'CIRCLE_REMOVE',
                'args': {
                    'id': id,
                    'radius': None,
                    'pos': None,
                    'color': None
                }
            }
        }])

    def move_circle(self, id, pos, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'CIRCLE_MOVE',
                'args': {
                    'id': id,
                    'from': None,
                    'to': pos
                }
            }
        }])

    def set_map_view(self, id, center, zoom, delay=None):
        self._send(live_data=[{
            'time': self.__current_milli_time(),
            'delay': delay,
            'event': {
                'name': 'SET_MAP_VIEW',
                'args': {
                    'id': id,
                    'toCenter': center,
                    'toZoom': zoom,
                    'fromCenter': None,
                    'fromZoom': None
                }
            }
        }])

    @contextmanager
    def buffering(self):
        og_send_func = self._send
        buffer = []
        self._send = lambda **kwargs: buffer.append(kwargs["live_data"])
        try:
            yield self
        finally:
            buffer = list(itertools.chain.from_iterable(buffer))
            self._send = og_send_func
            self._send(live_data=buffer)


_RELEASE = variables.RELEASE


if not _RELEASE:
    _component_func = components.declare_component(
        COMPONENT_NAME,
        url="http://localhost:3001",
        component_type=LiveMapContext
    )
else:
    _component_func = components.declare_component(
        COMPONENT_NAME, path=variables.FRONTEND_BUILD, component_type=LiveMapContext)


def LiveMap(config: MapConfig, cluster=False, key=None) -> LiveMapContext:

    value: LiveMapContext = _component_func(
        config=config, cluster=cluster, key=key, component=COMPONENT_NAME)
    value.set_gps_transform(
        create_transform_function(config.get('gps_transform')))
    return value
