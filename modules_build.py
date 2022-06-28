import glob
import os
import subprocess
import shutil
from pathlib import Path
import base64

MODULES_GLOB = './streamlit_flowide/flowidemap/modules/*.ts'

_TYPES = './streamlit_flowide/javascript_hooks/types/*.d.ts'

def _run_rollup_bundling(entry_file: str):
    result = subprocess.run(['rollup',entry_file],capture_output=True)
    return result.stdout.decode('utf-8')
def _code_to_encoded_string(code: str) -> str:
    return f"data:text/javascript;base64,{base64.b64encode(code.encode()).decode()}"

def _handle_typescript_file(file: str):
    file_dir = os.path.dirname(file)
    ts_build_dir = os.path.join(file_dir,'ts-build')
    os.makedirs(ts_build_dir,exist_ok=True)
    result = subprocess.run(['tsc',file,'--target','es2016','--outDir',ts_build_dir,'--allowJs','--allowUmdGlobalAccess',*glob.glob(_TYPES)],capture_output=True)
    if result.returncode != 0:
        shutil.rmtree(ts_build_dir,ignore_errors=True)
        raise RuntimeError(result.stdout.decode('utf-8'))

    bundled = _run_rollup_bundling( os.path.join(ts_build_dir, f"{Path(file).stem}.js"  ))
    shutil.rmtree(ts_build_dir)
    return _code_to_encoded_string(bundled)

def typescript(input: str):
    if os.path.isfile(input):
        if not input.endswith(".ts"):
            raise ValueError(f"Expected a .ts file got: {input}")
        return _handle_typescript_file(input)
    elif os.path.isdir(input):
        index_file = os.path.join(input,'index.ts')
        if not os.path.isfile(index_file):
            raise ValueError("The given directory needs to have an index.ts file")
        return _handle_typescript_file(index_file)
    else:
        raise ValueError("You need to pass a valid typescript file")


if __name__ == '__main__':
    for file in glob.glob(MODULES_GLOB):
        result_file = os.path.join(os.path.dirname(file),f"{os.path.basename(file)}.build")
        with open(result_file,'w') as f:
            f.write(typescript(file))