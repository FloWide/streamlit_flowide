import setuptools


setuptools.setup(
    name="streamlit_flowide",
    version="0.0.1",
    author="FloWide Ltd.",
    description="A collection of custom components for streamlit",
    packages=setuptools.find_packages(),
    include_package_data=True,
    setup_requires=['wheel'],
    classifiers=[],
    python_requires=">=3.6",
    install_requires=[
        "streamlit >= 0.63",
    ],
)
