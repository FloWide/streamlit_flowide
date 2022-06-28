from streamlit_flowide import javascript_hooks as js
import glob
import os

MODULES_GLOB = './streamlit_flowide/flowidemap/modules/*.ts'

if __name__ == '__main__':
    for file in glob.glob(MODULES_GLOB):
        result_file = os.path.join(os.path.dirname(file),f"{os.path.basename(file)}.build")
        with open(result_file,'w') as f:
            f.write(js.typescript(file))