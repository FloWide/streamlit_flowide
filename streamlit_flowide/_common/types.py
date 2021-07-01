
from typing import List

try:
    from typing import TypedDict
except ImportError:
    from typing_extensions import TypedDict



class TransformConfig(TypedDict):
    upperBounds: List[float]
    lowerBounds: List[float]
    transform: List[List[float]]
    untransform: List[List[float]]


class MapConfig(TypedDict):
    map:TransformConfig
    image:str
    height:str
    gps_transform:List[List[float]]

