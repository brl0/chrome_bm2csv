/* chrome_bm2csv.js
Convert Chrome bookmarks (json) to csv
Inspired by https://github.com/rongjiecomputer/chrome
*/

const fs = require("fs");
const path = require("path");
const _ = require("lodash");
const json2csv = require("json2csv").parse;
const moment = require("moment");

const path_bm_file = path.resolve(process.argv[2]);
const path_bm_output = path.resolve(process.argv[3]);
const path_bm_quicktype = path.resolve("bm_quicktype.js");

const bm_file = require(path_bm_file);
const Convert = require(path_bm_quicktype);

//https://stackoverflow.com/questions/51343828/how-to-parse-chrome-bookmarks-date-added-value-to-a-date
function chromeTime2TimeT(time) {
  return Math.floor((time - 11644473600000000) / 1000);
}

const bm_obj = Convert.toBmQt(bm_file).roots.other;

function set_vals(item, item_path = "", parent_id = 0) {
  item.path = item_path != "" ? item_path : "/";
  if (parent_id) item.parent_id = parent_id;
  if (item.type == "url") {
    item.last_visited = item.meta_info.last_visited;
    item.last_visited_desktop = item.meta_info.last_visited_desktop;
    results = results.concat(_.omit(item, ["meta_info", "children"]));
  }
  if (item.type == "folder") {
    results = results.concat(_.omit(item, ["children", "url", "meta_info"]));
    for (child of item.children) {
      set_vals(child, item_path + "/" + item.name, item.id);
    }
  }
  return results;
}

var results = new Array();
results = set_vals(bm_obj);

const date_prop_list = [
  "date_added",
  "date_modified",
  "last_visited",
  "last_visited_desktop"
];

results.forEach(function(element) {
  for (dp of date_prop_list) {
    if (element[dp] && element[dp] != 0) {
      element[dp + "_f"] = moment(chromeTime2TimeT(element[dp])).format();
    }
  }
});

csv = json2csv(results);

fs.writeFile(path_bm_output, csv, { flag: "wx" }, function(err) {
  if (err) throw err;
});
