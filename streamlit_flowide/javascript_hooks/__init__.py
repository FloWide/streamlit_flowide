from shutil import which
import os
import shutil
import warnings
import subprocess
from pathlib import Path
import base64
import glob

_TYPES = os.path.join(os.path.dirname(__file__),'types/*.d.ts')

class IllegalArgumentError(ValueError):
    pass

class TypeScriptCompileError(RuntimeError):
    pass

def _is_program_exists(name: str) -> bool:
    return which(name) is not None

def _code_to_encoded_string(code: str) -> str:
    return f"data:text/javascript;base64,{base64.urlsafe_b64encode(code.encode()).decode()}"

def _run_rollup_bundling(entry_file: str):
    result = subprocess.run(['rollup',entry_file],capture_output=True)
    return result.stdout.decode('utf-8')

def _handle_javascript_file(file: str):
    if not _is_program_exists('rollup'):
        warnings.warn("Couldn't find rollup executable. Importing other js files will fail.")
        with open(file,mode='r') as f:
            return _code_to_encoded_string(f.read())
    else:
        return _code_to_encoded_string(_run_rollup_bundling(file))


# tsc test.ts --target es2016 types.d.ts --outDir ./here 
def _handle_typescript_file(file: str):
    if not _is_program_exists('tsc'):
        raise RuntimeError("Couldn't find typescript compiler")

    file_dir = os.path.dirname(file)
    ts_build_dir = os.path.join(file_dir,'ts-build')
    os.mkdir(ts_build_dir)
    result = subprocess.run(['tsc',file,'--target','es2016','--outDir',ts_build_dir,'--allowJs','--allowUmdGlobalAccess',*glob.glob(_TYPES)],capture_output=True)
    if result.returncode != 0:
        shutil.rmtree(ts_build_dir)
        raise TypeScriptCompileError(result.stdout.decode('utf-8'))

    bundled = _run_rollup_bundling( os.path.join(ts_build_dir, f"{Path(file).stem}.js"  ))
    shutil.rmtree(ts_build_dir)
    return _code_to_encoded_string(bundled)


def javascript(input: str):
    if os.path.isfile(input):
        if not input.endswith(".js"):
            raise IllegalArgumentError(f"Expected a .js file got:{input}")
        return _handle_javascript_file(input)
    elif os.path.isdir(input):
        index_file = os.path.join(input,'index.js')
        if not os.path.isfile(index_file):
            raise IllegalArgumentError("The given directory needs to have an index.js file")
        return _handle_javascript_file(index_file)
    else: # assumed the input to be javascript code
        return _code_to_encoded_string(input)


def typescript(input: str):
    if os.path.isfile(input):
        if not input.endswith(".ts"):
            raise IllegalArgumentError(f"Expected a .ts file got: {input}")
        return _handle_typescript_file(input)
    elif os.path.isdir(input):
        index_file = os.path.join(input,'index.ts')
        if not os.path.isfile(index_file):
            raise IllegalArgumentError("The given directory needs to have an index.ts file")
        return _handle_typescript_file(index_file)
    else:
        raise IllegalArgumentError("You need to pass a valid typescript file")


if __name__ == '__main__':
    result = typescript('../../myhooks.ts')
    print(result[result.find(',')+1:])