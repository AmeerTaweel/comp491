#include "crow_all.h"

using namespace std;
int main() {
    crow::SimpleApp app; //define your crow application

    //define your endpoint at the root directory
    CROW_ROUTE(app, "/<string>")([](string name){
        crow::response res;
        res.set_static_file_info("./static/style.css");
        crow::response res2;
        res2.set_static_file_info("./static/style.css");
        auto page = crow::mustache::load("system_view.html");
        crow::mustache::context ctx;
        ctx["name"] = name;
        return page.render(ctx);
    });

    //set the port, set the app to run on multiple threads, and run the app
    app.port(8888).multithreaded().run();
}
