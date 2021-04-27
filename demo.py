import streamlit as st
from streamlit_flowide import *
import json
from time import sleep
from random import randint

st.set_page_config(layout="wide")

mapConfig = json.loads("""{"lowerBounds":[-20,-20],"transform":[[0.00146131,-6.20697248,15.87566848],[6.20697248,0.00146131,-19.47182787],[0,0,1]],"untransform":[[0.00003793,0.16110913,3.13648711],[-0.16110913,0.00003793,2.55845372],[0,0,1]],"upperBounds":[20,20]}""")

config = {
    'map':mapConfig
}

config['image'] = 'http://localhost:800/maps/keve-iroda/svg'


GraphMap(config,data={
    'nodes':{
        '[0,0]':{
            'label':'#1'
        },
        '[10,10]':{
            'label':'#2'
        }
    },
    'edges':[
        {
            'source':'[0,0]',
            'target':'[10,10]',
            'metadata':{
                'color':'red'
            }
        }
    ],
    'metadata':{
        'edgeInputFields':{
            'color':{
                'type':'text'
            }
        },
        'nodeInputFields':{}
    }
    
})


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


PlayBack(config,[
        {
            'time':1602247219471,
            'event':{
                'name':'CREATE_MARKER',
                'args':{
                    'id':'12',
                    'position':[randint(0,10),0]
                }
            }
        },
        {
            'time':1602247219471 + 2000,
            'event':{
                'name':'MOVE_MARKER',
                'args':{
                    'id':'12',
                    'position':[3.772618633552917,0.001],
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
                    'position':[-2,2],
                    'prevPosition':[3.772618633552917,0.001],
                }
            }
        },
    ])

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


ctx = LiveMap(config)

ctx.create_marker("2",[0,0])
ctx.change_main_icon("2","icons/map-pin-icon-box.svg")

for i in range(0,30):
    ctx.move_marker("2",[0,i])
    sleep(0.5)