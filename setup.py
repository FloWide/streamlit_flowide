import sys

version="DEV"

if '--version' in sys.argv:
    index = sys.argv.index('--version')
    sys.argv.pop(index)
    version = sys.argv.pop(index)


import setuptools


setuptools.setup(
    name="streamlit_flowide",
    version=version,
    author="FloWide Ltd.",
    description="A collection of custom components for streamlit",
    packages=setuptools.find_packages(),
    include_package_data=True,
    setup_requires=['wheel'],
    classifiers=[],
    python_requires=">=3.8",
    install_requires=[
        "streamlit >= 0.63",
    ],
)
