import os
import streamlit.components.v1 as components
from streamlit.report_thread import get_report_ctx
from time import time,sleep
import streamlit as st
from .._common import variables

COMPONENT_NAME = "streamlit_flowide_livemap"

class LiveMapContext:

    def __init__(self,send,value):
        self._send = lambda **kwargs:send(component=COMPONENT_NAME,**kwargs)
        self.value = value

    def __current_milli_time(self):
        return int(time() * 1000)

    def create_marker(self,id,pos,scale = 1):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'CREATE_MARKER',
                'args':{
                    'id':id,
                    'position':pos,
                    'scale':scale
                }
            }
        }])


    def delete_marker(self,id,pos = None):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'CREATE_MARKER',
                'args':{
                    'id':id,
                    'position':pos
                }
            }
        }])

    def move_marker(self,id,pos):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'MOVE_MARKER',
                'args':{
                    'id':id,
                    'position':pos,
                    'prevPosition':[0,0]  # not used in live context
                }
            }
        }])
    
    def open_popup(self,id,content):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'OPEN_POPUP',
                'args':{
                    'id':id,
                    'content':content
                }
            }
        }])

    def close_popup(self,id,content = None):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'CLOSE_POPUP',
                'args':{
                    'id':id,
                    'content':content
                }
            }
        }])

    def change_main_icon(self,id,icon):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'FLO_ICON_CHANGE_MAIN_ICON',
                'args':{
                    'id':id,
                    'from':None,
                    'to':icon
                }
            }
        }])
    
    def change_main_color(self,id,color):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'FLO_ICON_CHANGE_MAIN_COLOR',
                'args':{
                    'id':id,
                    'from':None,
                    'to':color
                }
            }
        }])

    def add_icon_plate(self,id,icon,side,color = None,slot = -1):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'FLO_ICON_ADDON_ADD',
                'args':{
                    'id':id,
                    'icon':icon,
                    'side':side,
                    'color':color,
                    'slot':slot
                }
            }
        }])

    def remove_icon_plate(self,id,icon,side,color = None,slot = -1):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'FLO_ICON_ADDON_REMOVE',
                'args':{
                    'id':id,
                    'icon':icon,
                    'side':side,
                    'color':color,
                    'slot':slot
                }
            }
        }])

    def add_icon_status(self,icon,slot):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'FLO_ICON_STATUS_ADD',
                'args':{
                    'id':id,
                    'icon':icon,
                    'slot':slot
                }
            }
        }])

    def remove_icon_status(self,icon,slot):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'FLO_ICON_STATUS_REMOVE',
                'args':{
                    'id':id,
                    'icon':icon,
                    'slot':slot
                }
            }
        }])

    def create_rectangle(self,id,bounds,color = 'blue'):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'RECTANGLE_CREATE',
                'args':{
                    'id':id,
                    'bounds':bounds,
                    'color':color
                }
            }
        }])

    def remove_rectangle(self,id):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'RECTANGLE_REMOVE',
                'args':{
                    'id':id,
                    'bounds':None,
                    'color':None
                }
            }
        }])

    def change_rectangle_color(self,id,color):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'RECTANGLE_CHANGE_COLOR',
                'args':{
                    'id':id,
                    'from':None,
                    'to':color
                }
            }
        }])

    def change_rectangle_bounds(self,id,bounds):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'RECTANGLE_CHANGE_BOUNDS',
                'args':{
                    'id':id,
                    'from':None,
                    'to':bounds
                }
            }
        }])

    def create_circle(self,id,radius,pos,color = "red"):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'CIRCLE_CREATE',
                'args':{
                    'id':id,
                    'radius':radius,
                    'pos':pos,
                    'color':color
                }
            }
        }])

    def remove_circle(self,id):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'CIRCLE_REMOVE',
                'args':{
                    'id':id,
                    'radius':None,
                    'pos':None,
                    'color':None
                }
            }
        }])

    def move_circle(self,id,pos):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'CIRCLE_MOVE',
                'args':{
                    'id':id,
                    'from':None,
                    'to':pos
                }
            }
        }])

    def set_map_view(self,id,center,zoom):
        self._send(live_data=[{
            'time':self.__current_milli_time(),
            'event':{
                'name':'SET_MAP_VIEW',
                'args':{
                    'id':id,
                    'toCenter':center,
                    'toZoom':zoom,
                    'fromCenter':None,
                    'fromZoom':None
                }
            }
        }])



# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = variables.RELEASE


if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        COMPONENT_NAME,
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
        component_type=LiveMapContext
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    _component_func = components.declare_component(COMPONENT_NAME, path=variables.FRONTEND_BUILD,component_type=LiveMapContext)




# Create a wrapper function for the component. This is an optional
# best practice - we could simply expose the component function returned by
# `declare_component` and call it done. The wrapper allows us to customize
# our component's API: we can pre-process its input args, post-process its
# output value, and add a docstring for users.
def LiveMap(config,key=None) -> LiveMapContext:

    value = _component_func(config=config,key=key,component=COMPONENT_NAME)
    sleep(0.5)  
    return value

    