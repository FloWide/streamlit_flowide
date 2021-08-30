import streamlit as st
from streamlit_flowide import *
import json
from time import sleep
from random import randint

st.set_page_config(layout="wide")

mapConfig = json.loads("""{"lowerBounds":[-20,-20],"transform":[[0.00146131,-6.20697248,15.87566848],[6.20697248,0.00146131,-19.47182787],[0,0,1]],"untransform":[[0.00003793,0.16110913,3.13648711],[-0.16110913,0.00003793,2.55845372],[0,0,1]],"upperBounds":[20,20]}""")

config = {
    'map':mapConfig,
    'height':'900px',
    'gps_transform':[
        [-1,0,0],
        [0,1,0],
        [0,0,1]
    ]
}

config['image'] = 'http://localhost:800/maps/keve-iroda/svg'


st.write(GraphMap(config,data={
    'directed':True,
    'nodes':{
    },
    'edges':[
    ],
    'metadata':{
        'edgeInputFields':{
            'color':{
                'type':'text'
            }
        },
        'nodeInputFields':{}
    }
    
}))

"""
st.write(ZoneEditor(config,data=
    {
        'asd':{
            'name':'asd',
            'height':[0,4],
            'vertices':[
                [0,0],
                [0,10],
                [1,15]
            ]
        }
    }
))
"""


PlayBack(config,[
        {
            'time':1602247219471,
            'event':{
                'name':'CREATE_MARKER',
                'args':{
                    'id':'12',
                    'position':[randint(0,10),0,'gcs']
                }
            }
        },
        {
            'time':1602247219471,
            'event':{
                'name':'CREATE_MARKER',
                'args':{
                    'id':'13',
                    'position':[randint(0,10),0,'gcs']
                }
            }
        },
        {
            'time':1602247219471 + 2000,
            'event':{
                'name':'MOVE_MARKER',
                'args':{
                    'id':'12',
                    'position':[3.772618633552917,0.001,'gcs'],
                    'prevPosition':[0,0]
                }
            }
        },
        {
            'time':1602247219471 + 5000,
            'event':{
                'name':'MOVE_MARKER',
                'args':{
                    'id':'12',
                    'position':[-2,2,'gcs'],
                    'prevPosition':[3.772618633552917,0.001],
                }
            }
        },
    ],cluster=True)
"""
HeatMap(
    config,
    [
        [randint(0,10),0.0,1],
        [1.0,1.0,0.5],
        [4.0,4,0.7],
        [4.307988081148033,3.64313005324229,0.5]
    ],
    None
)

Spaghetti(config,[
        [randint(0,10),0.0,1000],
        [1.0,1.0,5000],
        [4.0,4,8000],
        [4.307988081148033,3.64313005324229,10000]
],)
"""
sleep(3)
ctx = LiveMap(config,cluster=True)

ctx.create_marker("2",[0,0])
ctx.create_marker("3",[0,0],cluster=True)
ctx.create_marker("4",[0,0],cluster=True)
ctx.delete_marker('4',[0,0])
ctx.change_main_icon("2","icons/map-pin-icon-box.svg")

for i in range(0,30):
    ctx.move_marker("2",[0,i])
    sleep(0.5)