import numpy as np
from typing import List,Callable



def create_transform_function(matrix:List[List]) -> Callable[[List[float]],List[float]]:

    if not matrix:
        None

    matrix = np.array(matrix)
    def transform(point:List[float]) -> List[float]:
        point.reverse()
        vector = np.array(point)
        vector = vector.reshape(2,1)
        vector = np.append(vector,[[1]],axis=0)
        transformed = np.dot(matrix,vector)
        return [float(transformed[0,0]),float(transformed[1,0])]

    return transform