import streamlit as st
from streamlit_flowide import *
from time import sleep
from streamlit_flowide import javascript_hooks as js
from streamlit_flowide.flowidemap import FloWideMap
st.set_page_config(layout="wide")


config = {
    'tileLayers': [
        {
            'urlTemplate': 'https://swisskrono-gw.flowide.net/livemap-swisskrono-out/tile_out4/{z}/{x}/{y}.png'
        },
        {
            'urlTemplate': 'https://swisskrono-gw.flowide.net/livemap-swisskrono-out/tile_out7/{z}/{x}/{y}.png'
        }
    ],
    'masterMap': {
        'imgWidth': 56844,
        'imgHeight': 53795,
        'unitToPixel': {
            'transform': [
                [2451357.591514033, 3371040.249180861, -193117578.0733881],
                [-5050614.925448298, 1635954.424450811, 206646664.5841257],
                [0.0, 0.0, 1.0]
            ]
        }
    },
    'maps': {
        'other': {
            'transform': [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]
        }
    }
}


FloWideMap(config, js.typescript(js.relative_file('mymap.ts')))
