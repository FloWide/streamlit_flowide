
from typing import List

try:
    from typing import TypedDict
except ImportError:
    from typing_extensions import TypedDict

from enum import Enum


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

class CRS(str,Enum):
    EPSG3395 = 'EPSG3395',
    EPSG3857 = 'EPSG3857',
    EPSG4326 = 'EPSG4326',
    Earth = 'Earth',
    Simple = 'Simple',
    Meter = 'Meter'
    Pixel = 'Pixel'