#include "crow_all.h"
#include <vector>

int main() {
	crow::SimpleApp app; //define your crow application

	// define your endpoint at the root directory
	CROW_ROUTE(app, "/")([](){
		auto page = crow::mustache::load("index.html");
		crow::mustache::context ctx;
		ctx["name"] = "Ameer Chwan";
		ctx["age"] = 5;
		std::vector<int> ints = {10, 20, 30};
		ctx["children"] = ints;
		return page.render(ctx);
	});

	//set the port, set the app to run on multiple threads, and run the app
	app.port(8888).multithreaded().run();
}
