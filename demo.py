import streamlit as st
from streamlit_flowide import *
from time import sleep

st.set_page_config(layout="wide")


config = {
    'map':{
        'lowerBounds':[0,0],
        'upperBounds':[24,16],
        'transform':[[0.00,-0.17,99.0],[0.17,0.00,-101.5],[0.0,0.0,1.0]],
        'untransform':[[0.00,5.882,597.05],[-5.882,0.00,582.35],[0.0,0.0,1.0]]
    },
    'height':'900px',
    'gps_transform':[
        [-1,0,0],
        [0,1,0],
        [0,0,1]
    ],
    'tileLayer': {
        'urlTemplate':'https://dev.flowide.net/coordinates_swisskrono-out/tiles/{z}/{x}/{y}.png',
        'imgSize':[15411,9144]
    }
}




stuff = GraphMap(config,{
        'nodes':{},
        'edges':[],
        'metadata':{
            'nodeInputFields':{
                'devId':{
                    "type":"number"
                }
            },
            'defaultNodeDisplay':{
                'size':16,
                'shape':'square',
                'color':'red'
            }
        }
    },markers=[{
        'pos':[10,10],
        'tooltip':'valami'
    }],
    rectangles=[{
        'upperBounds':[10,10],
        'lowerBounds':[0,0],
        'color':'red',
        'tooltip':'valami'
    }]
)

ctx = LiveMap(config,cluster=True)

with ctx.buffering():
    ctx.create_marker("2",[0,0],delay=2000)
    ctx.create_marker("3",[5,0],cluster=True,delay=2000)
    ctx.create_marker("4",[0,0],cluster=True,delay=2000)
    ctx.delete_marker('4',[0,0],delay=2000)
    ctx.change_main_icon("2","icons/map-pin-icon-box.svg",delay=2000)
    ctx.move_marker('2',[0,5],delay=1000)


colors = ['red','blue','green','orange','tomato']

import random
for i in range(0,30):
    ctx.move_marker("3",[5,i])
    ctx.change_main_color("3",random.choice(colors))
    sleep(0.5)




