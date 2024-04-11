from bottle import route, run, template, static_file
import spectra
import numpy as np

# from team_battle_info import team_battle_info


SERVER_HOST = "localhost"
SERVER_PORT = 8080


# Serve Static Directory
@route("/static/<filepath:path>")
def serve_static(filepath):
    return static_file(filepath, root = "./static")


# Serve Favicon
@route("/favicon.ico")
def serve_favicon():
    return static_file("favicon.ico", root = "./static")


# Main (Index) Page
@route("/")
def index_route():
    # TODO: Add dedicated index template
    return code_view()


@route("/code-view")
def code_view():
    colorscale = spectra.scale([
        "#1B0C41",
        "#4A0C6B",
        "#781C6D",
        "#A52C60",
        "#CF4446",
        "#ED6925",
        "#FB9B06",
        "#F7D13D",
        "#FCFFA4"
    ])
    l = 10
    data = (np.random.rand(l, l) * 10).astype(int)
    return template("code-view", data=data, colorscale=colorscale)


@route("/system-view")
def system_view():
    l = 4
    comms = (np.random.rand(l, l) * 11).astype(int)
    return template("system-view", comms = comms)


@route("/object-view")
def object_view():
    gpus = tuple(i for i in range(5))
    object_selection = ("flags","something else", "something else")
    dimension_selection = tuple(2 ** i for i in range(6))
    return template(
        "object-view",
        gpus = gpus,
        object_selection = object_selection,
        dimension_selection = dimension_selection
    )


run(host = SERVER_HOST, port = SERVER_PORT)
