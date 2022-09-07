import functools
from shutil import which
import os
import shutil
from typing import Callable, Dict
import warnings
import subprocess
from pathlib import Path
import base64
import glob
import inspect
from filelock import FileLock

import hashlib
_TYPES = os.path.join(os.path.dirname(__file__),'types/*.d.ts')

CACHE_FOLDER = '/tmp/streamlit_flowide/cache'

class DiskCache:

    def __init__(self) -> None:

        if not os.path.exists(CACHE_FOLDER):
            os.makedirs(CACHE_FOLDER)

        self._files = set(
            map(
                lambda e: os.path.basename(e),
                glob.glob(os.path.join(CACHE_FOLDER,'*'))
            )
        )
        self._memory_cache: Dict[str,str] = {}

    def check_exists(self,hash: str):
        return hash in self._files

    def get_cached_value(self,hash: str):
        if not self.check_exists(hash):
            raise ValueError(f'no entry for {hash}')

        if hash in self._memory_cache:
            return self._memory_cache[hash]

        with open(os.path.join(CACHE_FOLDER,hash),'r') as f:
            code = f.read()
            self._memory_cache[hash] = code
            return code

    def set_cached_value(self,hash: str,value: str):
        with open(os.path.join(CACHE_FOLDER,hash),'w+') as f:
            f.write(value)
        self._files.add(hash)
        self._memory_cache[hash] = value

    @staticmethod
    def hash_file_content(input_file: str):
        hash = hashlib.md5(usedforsecurity=False)
        with open(input_file,'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash.update(chunk)
        return hash.hexdigest()

    @staticmethod
    def hash_dir_content(directory: str):
        return DiskCache._hash_dir(directory,hashlib.md5(usedforsecurity=False)).hexdigest()
        

    def _hash_dir(directory: str | Path,hash):
        assert Path(directory).is_dir()
        for path in Path(directory).iterdir():
            if path.is_file():
                with open(path, "rb") as f:
                    for chunk in iter(lambda: f.read(4096), b""):
                        hash.update(chunk)
            elif path.is_dir():
                hash = DiskCache._hash_dir(path, hash)
        return hash


_disk_cache = DiskCache()


def disk_cache(func: Callable[[str],str]):
    @functools.wraps(func)
    def with_cache(input: str):
        with FileLock(f"{input}.lock"):
            if os.path.isfile(input):
                hash = _disk_cache.hash_file_content(input)
            else:
                hash = _disk_cache.hash_dir_content(input)
            if not _disk_cache.check_exists(hash):
                value = func(input)
                _disk_cache.set_cached_value(hash,value)
                return value
            else:
                return _disk_cache.get_cached_value(hash)
    return with_cache
        


class IllegalArgumentError(ValueError):
    pass

class TypeScriptCompileError(RuntimeError):
    pass

def _is_program_exists(name: str) -> bool:
    return which(name) is not None

def _code_to_encoded_string(code: str) -> str:
    return f"data:text/javascript;base64,{base64.b64encode(code.encode()).decode()}"

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
    os.makedirs(ts_build_dir,exist_ok=True)
    result = subprocess.run(['tsc',file,'--target','es2016','--outDir',ts_build_dir,'--allowJs','--allowUmdGlobalAccess',*glob.glob(_TYPES)],capture_output=True)
    if result.returncode != 0:
        shutil.rmtree(ts_build_dir,ignore_errors=True)
        raise TypeScriptCompileError(result.stdout.decode('utf-8'))

    bundled = _run_rollup_bundling( os.path.join(ts_build_dir, f"{Path(file).stem}.js"  ))
    shutil.rmtree(ts_build_dir)
    return _code_to_encoded_string(bundled)


def _javascript(input: str):
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


def _typescript(input: str):
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


typescript_dev = _typescript
javascript_dev = _javascript

typescript = disk_cache(_typescript)
javascript = disk_cache(_javascript)


def relative_file(file_path: str):
    return os.path.join(os.path.dirname(inspect.stack()[1].filename),file_path)