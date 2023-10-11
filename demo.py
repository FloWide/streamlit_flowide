import streamlit as st
from streamlit_flowide import *
from time import sleep
from streamlit_flowide import javascript_hooks as js
from streamlit_flowide.flowidemap import FloWideMap,FloWidePlayBack, FloWideUpdateMap
st.set_page_config(layout="wide")


config = {
    'tileLayers': [
        {
            'urlTemplate': 'https://commenthol.github.io/leaflet-rastercoords/example/tiles/{z}/{x}/{y}.png'
        },
    ],
    'initialView':[ 3831,3101,4],
    'masterMap': {
        'imgWidth': 3831,
        'imgHeight': 3101,
        'unitToPixel': {
            'transform': [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]
        }
    },
    'maps': {
        'meter': {
            'transform': [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]
        }
    }
}

FloWideMap(config,js.typescript(js.relative_file("mymap.ts")))
FloWideUpdateMap(config,None,[])
FloWidePlayBack(config,master=[
    {
        "time":10000,
        "event":{
            "name":'CREATE_MARKER',
            "args":{
                "id":"1",
                "position":[0,0],
                "scale":0.8,
                "trackColor":"blue",
                "simple":True
            }
        }
    },
    {
        "time":15000,
        "event":{
            "name":'FLO_ICON_STATUS_TEXT_ADD',
            "args":{
                "id":"1",
                "text":"Hi",
                "textColor":"black",
                "backgroundColor":"yellow"
            }
        }
    }
])