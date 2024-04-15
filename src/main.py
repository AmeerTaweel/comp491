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
        "#1b0c41",
        "#4a0c6b",
        "#781c6d",
        "#a52c60",
        "#cf4446",
        "#ed6925",
        "#fb9b06",
        "#f7d13d",
        "#fcffa4"
    ])
    l = 30
    data = (np.random.rand(l, l) * 10).astype(int)
    return template("code-view", data=data, colorscale=colorscale)


@route("/system-view")
def system_view():
    l = 10
    comms = (np.random.rand(l, l) * 11).astype(int)
    return template("system-view", comms = comms)


@route("/object-view")
def object_view():
    gpus = tuple(i for i in range(5))
    object_selection = ("flags","something else", "something else")
    dimension_selection = tuple(2 ** i for i in range(6))
    colorscale = spectra.scale([
        "#1b0c41",
        "#4a0c6b",
        "#781c6d",
        "#a52c60",
        "#cf4446",
        "#ed6925",
        "#fb9b06",
        "#f7d13d",
        "#fcffa4"
    ])
    l = 10
    data = (np.random.rand(l, l) * 10).astype(int)
    return template(
        "object-view",
        gpus = gpus,
        object_selection = object_selection,
        dimension_selection = dimension_selection, 
        data=data, 
        colorscale=colorscale
    )

run(host = SERVER_HOST, port = SERVER_PORT)
