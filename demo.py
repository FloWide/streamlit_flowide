import streamlit as st
from streamlit_flowide import *
from time import sleep
from streamlit_flowide import javascript_hooks as js
from streamlit_flowide.flowidemap import FloWideMap,FloWidePlayBack, FloWideUpdateMap
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
        'meter': {
            'transform': [
                [1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ]
        }
    }
}


data = [
  {
    "time": 10000,
    "event": {
      "name": "CREATE_MARKER",
      "args": {
        "id": "12",
        "position": [
          20.000446566614254,
          0
        ],
        "scale": 0.8,
        "trackColor": "red"
      }
    }
  },
  {
    "time": 10000,
    "event": {
      "name": "FLO_ICON_CHANGE_MAIN_ICON",
      "args": {
        "id": "12",
        "from": "",
        "to": "icons/map-pin-icon-truck.svg"
      }
    }
  },
  {
    "time": 10000,
    "event": {
      "name": "FLO_ICON_CHANGE_MAIN_COLOR",
      "args": {
        "id": "12",
        "from": "",
        "to": "red"
      }
    }
  },
  {
    "time": 10000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.997270362775293,
          0.3639556867070359
        ],
        "prevPosition": [
          20.000446566614254,
          0
        ],
        "noTrack": False,
        "trackColor": None
      }
    }
  },
  {
    "time": 20000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.987743103086423,
          0.7277711559745829
        ],
        "prevPosition": [
          19.997270362775293,
          0.3639556867070359
        ],
        "noTrack": False,
        "trackColor": None
      }
    }
  },
  {
    "time": 30000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.97186884133438,
          1.0913063277105624
        ],
        "prevPosition": [
          19.987743103086423,
          0.7277711559745829
        ],
        "noTrack": False,
        "trackColor": None
      }
    }
  },
  {
    "time": 40000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.949654328178543,
          1.454421396091476
        ],
        "prevPosition": [
          19.97186884133438,
          1.0913063277105624
        ],
        "noTrack": False,
        "trackColor": None
      }
    }
  },
  {
    "time": 50000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.92110900269464,
          1.8169769656335186
        ],
        "prevPosition": [
          19.949654328178543,
          1.454421396091476
        ],
        "noTrack": True,
        "trackColor": None
      }
    }
  },
  {
    "time": 60000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.886244980578617,
          2.1788341859946607
        ],
        "prevPosition": [
          19.92110900269464,
          1.8169769656335186
        ],
        "noTrack": False,
        "trackColor": None
      }
    }
  },
  {
    "time": 70000,
    "event": {
      "name": "MOVE_MARKER",
      "args": {
        "id": "12",
        "position": [
          19.84507703905317,
          2.539854885095911
        ],
        "prevPosition": [
          19.886244980578617,
          2.1788341859946607
        ],
        "noTrack": False,
        "trackColor": None
      }
    }
  }
]


FloWideMap(config,js.typescript(js.relative_file("mymap.ts")))

FloWidePlayBack(config,meter=data)

FloWideUpdateMap(
    config,
    'wss://swisskrono-gw.flowide.net/v2/locations/websocket',
    [{
            "markerId": "mymarker",
            "tags": [],
            "position": [0, 0],
            "map": "meter",
            "color": "blue",
            "icon": "icons/map-pin-icon-truck.svg",
            "scale": 0.8
    }],
    gps_map_key='master',
    meter_map_key='meter'
)
