import streamlit as st
from streamlit_flowide import *
from time import sleep
from streamlit_flowide import javascript_hooks as js
st.set_page_config(layout="wide")


config = {
    'height':'900px',
    'tileLayer':{
        'urlTemplate':'https://swisskrono-gw.flowide.net/livemap-swisskrono-out/tile_out4/{z}/{x}/{y}.png'
    },
    'pixel':{
        'imgWidth':56844,
        'imgHeight':53795,
        'unitToPixel':{ # untransform optional
            'transform':[[2451357.591514033, 3371040.249180861, -193117578.0733881], [-5050614.925448298, 1635954.424450811, 206646664.5841257], [0.0, 0.0, 1.0]]
        }
    }
}


print(UpdateMap(
    config,
    [{
        'markerId':'marker1',
        'position':[48.13037983959886, 22.294233664870266],
        'tags':['tag.50332785'],
        'scale':0.8,
        'color':'royalblue'
    }],
    [
        'wss://pss-gw.flowide.net/v2/locations/websocket',
        'wss://pss-gw.flowide.net/v2/generalTags/websocket'
    ],
    js.typescript(js.relative_file('myhooks.ts')),
    my_random_argument="hello",
    crs=CRS.Pixel
))



CustomMap(
    js.typescript(js.relative_file('mymap.ts')),
    custom_argument="hello"
)

# stuff = GraphMap(config,{
#         'nodes':{},
#         'edges':[],
#         'metadata':{
#             'nodeInputFields':{
#                 'devId':{
#                     "type":"number"
#                 }
#             },
#             'defaultNodeDisplay':{
#                 'size':16,
#                 'shape':'square',
#                 'color':'red'
#             }
#         }
#     },markers=[{
#         'pos':[10,10],
#         'tooltip':'valami'
#     }],
#     rectangles=[{
#         'upperBounds':[10,10],
#         'lowerBounds':[0,0],
#         'color':'red',
#         'tooltip':'valami'
#     }]
# )

# ctx = LiveMap(config,cluster=True)

# with ctx.buffering():
#     ctx.create_marker("2",[0,0],delay=2000)
#     ctx.create_marker("3",[5,0],cluster=True,delay=2000)
#     ctx.create_marker("4",[0,0],cluster=True,delay=2000)
#     ctx.delete_marker('4',[0,0],delay=2000)
#     ctx.change_main_icon("2","icons/map-pin-icon-box.svg",delay=2000)
#     ctx.move_marker('2',[0,5],delay=1000)


# colors = ['red','blue','green','orange','tomato']

# import random
# for i in range(0,30):
#     ctx.move_marker("3",[5,i])
#     ctx.change_main_color("3",random.choice(colors))
#     sleep(0.5)



