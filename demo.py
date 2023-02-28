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
