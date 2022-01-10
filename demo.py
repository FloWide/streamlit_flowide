import streamlit as st
from streamlit_flowide import *
import json
from time import sleep
from random import randint

st.set_page_config(layout="wide")


config = {
    'map':{
        'lowerBounds':[0,0],
        'upperBounds':[24,16],
        'transform':[
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ],
        'untransform':[
            [1,0,0],
            [0,1,0],
            [0,0,1]
        ]
    },
    'height':'900px',
    'gps_transform':[
        [-1,0,0],
        [0,1,0],
        [0,0,1]
    ]
}

config['image'] = 'https://img.rawpixel.com/s3fs-private/rawpixel_images/website_content/rm301-eye-11-c_1_1.jpg?w=800&dpr=1&fit=default&crop=default&q=65&vib=3&con=3&usm=15&bg=F4F4F3&ixlib=js-2.2.1&s=48c6e1f47b6e6364e88d1736d4b9356b'




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




