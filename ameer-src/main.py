from bottle import route, run, template, static_file
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
    return template("index", name="Ameer")


run(host = SERVER_HOST, port = SERVER_PORT)
