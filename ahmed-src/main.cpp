#include "crow_all.h"
#include <vector>
#include <string>
#include <map>
#include <iostream>
#include <fstream>
//
using namespace std;
vector<string> parse_communication(){
    map<string, int> temp;
    vector<string> res;
    string temp2;
    string source;
    string target;
    string delim = ",";
    ifstream infile("../temp/stencil-p2p_base/snoopie_log_543392.txt");
    for(int i = 0; i < 11; i++){
        infile >> temp2;
    }
    while(infile >> temp2) {
        size_t pos;
        int i = 0;
        while (( pos = temp2.find(delim)) != string::npos){
            if(i == 3){
                source = temp2.substr(0,pos);
            } 
            else if(i == 4){
                target = temp2.substr(0,pos);
            }
            temp2.erase(0, pos + delim.length());
            i++;
        } 
        temp2 = source + ":" + target; 
        temp[temp2]++; 
    }
    for (auto i = temp.begin(); i != temp.end(); i++) 
    {
        res.push_back(i->first + ":" + to_string(i->second));
    }
    return res; 
}
int main() {
    crow::SimpleApp app; //define your crow application


    //define your endpoint at the root directory
    CROW_ROUTE(app, "/")([](){
        crow::response res;
        res.set_static_file_info("./static/style.css");
        auto page = crow::mustache::load("system_view.html");
        auto coms = parse_communication();
        
        crow::mustache::context ctx;
        ctx["coms"] = coms;
        return page.render(ctx);
    });

    //set the port, set the app to run on multiple threads, and run the app
    app.port(8888).multithreaded().run();
}
