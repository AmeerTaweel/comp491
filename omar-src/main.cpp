#include "crow_all.h"

int main()
{
    crow::SimpleApp app;

    //define your endpoint at the root directory
    CROW_ROUTE(app, "/")([](){

        crow::response response;
        response.set_static_file_info("./static/style.css");
        response.set_static_file_info("./static/script.js");

        auto page = crow::mustache::load("index.html");
        crow::mustache::context ctx;

		std::vector<int> ints = {1, 2, 3, 4};
		ctx["gpus"] = ints;

		std::vector<std::string> objects = {"flags","something else", "something else"};
		ctx["object-selection"] = objects;

		std::vector<int> dimensions = {1, 2, 4, 8, 16, 32};
		ctx["dimension-selection"] = dimensions;

		return page.render(ctx);
    });


    // crow::response response;
    // response.set_static_file_info("./templates/style.css");

    app.port(8888).multithreaded().run();
}
