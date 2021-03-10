import os
import streamlit.components.v1 as components
from .._common import variables

# Create a _RELEASE constant. We'll set this to False while we're developing
# the component, and True when we're ready to package and distribute it.
# (This is, of course, optional - there are innumerable ways to manage your
# release process.)
_RELEASE = variables.RELEASE

COMPONENT_NAME = "streamlit_flowide_heatmap"

if not _RELEASE:
    _component_func = components.declare_component(
        # We give the component a simple, descriptive name ("my_component"
        # does not fit this bill, so please choose something better for your
        # own component :)
        COMPONENT_NAME,
        # Pass `url` here to tell Streamlit that the component will be served
        # by the local dev server that you run via `npm run start`.
        # (This is useful while your component is in development.)
        url="http://localhost:3001",
    )
else:
    # When we're distributing a production version of the component, we'll
    # replace the `url` param with `path`, and point it to to the component's
    # build directory:
    _component_func = components.declare_component(COMPONENT_NAME, path=variables.FRONTEND_BUILD)



def HeatMap(config,data,options = None, key=None):

    component_value = _component_func(config=config,data=data,options=options, key=key, default=0,component=COMPONENT_NAME)

    # We could modify the value returned from the component if we wanted.
    # There's no need to do this in our simple example - but it's an option.
    return component_value



