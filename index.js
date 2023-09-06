import fs from "fs";
import path from "path";
import uglifyJS from "uglify-js";
import { parse } from "node-html-parser";
import CleanCSS from "clean-css";

function compile(mypath) {
  let data = [];
  data.script = "";
  data.style = "";
  data.template = {};

  const folder = mypath;
  let files = fs.readdirSync(folder);
  let i = 0;
  files.forEach(function (file) {
    extractTags(folder + file, data);
    i++;
  });

  let output = new CleanCSS().minify(data.style);
  // fs.writeFileSync("./public/assets/app.min.css", output.styles, "utf8");
  data.style = output.styles;
  data.script = minifyJs(data.script);

  return data;
}

// helpers

function extractTags(filepath, data) {
  let file = fs.readFileSync(filepath, "utf8");
  let filename = path.basename(filepath, ".html");

  const root = parse(file);
  if (root.querySelector("template")) {
    data.template[filename] =
      root.querySelector("template").innerHTML.replace(/\s\s+/g, " ") + "\n";
  }
  if (root.querySelector("script")) {
    data.script += root.querySelector("script").text + "\n";
  }
  if (root.querySelector("style")) {
    data.style += root.querySelector("style").text;
  }
}

function minifyJs(code) {
  let result = uglifyJS.minify(code);
  // if (result.error) throw result.error;
  return result.code;
}

export { compile };
