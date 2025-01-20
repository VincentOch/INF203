"use strict";

import { createServer } from "http";
import *  as url from "url";
import * as fs from "fs";
import * as querystring from "querystring";


const port = process.argv[2] || 8000;
console.log('PORT = ', port);

const mimeType = {
    '.ico': 'image/x-icon',
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.css': 'text/css',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.svg': 'image/svg+xml',
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.eot': 'appliaction/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.mjs': 'application/javascript'

};

function getCoordinatesForPercent(percent) {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
}

function serveFile(filePath, response) {
    try {
      // Check if the file exists
      stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
          // File not found or is not a regular file
          response.statusCode = 404;
          response.setHeader("Content-Type", "text/html; charset=utf-8");
          response.end("<!doctype html><html><body>404 - File Not Found</body></html>");
        } else {
          // Read and serve the file
          readFile(filePath, (err, data) => {
            if (err) {
              throw err;
            }
  
            // Determine the MIME type based on file extension
            const mimeType = getMimeType(filePath);
  
            // Set the Content-Type header
            response.setHeader("Content-Type", mimeType);
  
            // Send the file content
            response.end(data);
          });
        }
      });
    } catch (error) {
      throw error;
    }
  }

// request processing

function webserver(request, response) {
    try {
      const url = new URL(request.url, `http://${request.headers.host}`);
  
      if (url.pathname === "/") {
        // Question 1a
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server works.</body></html>");
      } else if (url.pathname === "/stop") {
        // Question 2
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>The server will stop now.</body></html>");
        process.exit(0);
        return
      } else if (url.pathname.startsWith("/files/")) {
        // Question 3
        serveFile(url.pathname.substring(7), response);
        return

      }else if (url.pathname.startsWith("/Slices")) {
            if (!fs.existsSync("storage.json")) {
                throw new Error('404');
            } else {
                var data = fs.readFileSync("storage.json")
                response.writeHeader(200, { 'Content-Type': 'application/json' })
                response.write(data);
                response.end();
                return;
            }
        }

        else if (url.pathname.startsWith("/add")) {
            let query = querystring.parse(url.searchParams.toString());
            console.log(query);
            var value = query.value;
            var title = query.title;
            var color = query.color;

            if (value == undefined || title == undefined || color == undefined) {
                throw new Error('400');
            }

            var data = fs.readFileSync("storage.json");
            var json = JSON.parse(data);
            var new_data = { "title": title, "value": value, "color": color };
            json.push(new_data);
            fs.writeFileSync("storage.json", JSON.stringify(json));
            response.writeHeader(200, { 'Content-Type': 'text/html' });
            response.write('Data added', 'utf8');
            response.end();
            return;
        }

        else if (url.pathname.startsWith("/remove")) {
            let query = querystring.parse(url.searchParams.toString());
            console.log(query);
            var data = JSON.parse(fs.readFileSync("storage.json"));
            data.splice(query.index, 1);
            fs.writeFileSync("storage.json", JSON.stringify(data));
            response.writeHeader(200);
            response.end();
            return;
        }

        else if (url.pathname.startsWith("/clear")) {
            fs.writeFileSync("storage.json", JSON.stringify([{"title": "empty", "color": "red", "value": 1}]));
            response.writeHeader(200);

            response.end();
            return;
        }

        else if (url.pathname.startsWith("/restore")) {
            fs.writeFileSync("storage.json", JSON.stringify([
                {
                    "title": "foo",
                    "color": "red",
                    "value": 20
                },
                {
                    "title": "bar",
                    "color": "ivory",
                    "value": 50
                },
                {
                    "title": "baz",
                    "color": "blue",
                    "value": 30
                }
            ]));
            response.writeHeader(200);
            response.end();
            return;
        }

        else if (pathname.startsWith("/PieCh")) {
            var slices = JSON.parse(fs.readFileSync("storage.json"));
            var rep = '<svg id="pieChart" viewBox="-1 -1 2 2" height=500 width=500>';
            var value_tot = 0;
            for (var slice of slices) {
                value_tot += new Number(slice.value);
            }
            var cum = 0;
            for (var slice of slices) {
                var percent = slice.value / value_tot;
                var [x_start, y_start] = getCoordinatesForPercent(cum);
                cum += percent;
                var [x_end, y_end] = getCoordinatesForPercent(cum);
                var largeArcFlag = percent > .5 ? 1 : 0;
                var pathData = [
                    `M ${x_start} ${y_start}`,
                    `A 1 1 0 ${largeArcFlag} 1 ${x_end} ${y_end}`,
                    `L 0 0`,
                ].join(' ');

                rep += '<path d="' + pathData + '" fill="' + slice.color + '"></path>';
            }
            rep += '</svg>'
            response.writeHeader(200, { "Content-Type": "image/svg+xml" });
            response.write(rep);
            response.end();
        }

      
    else {
    // Handle other routes or return 404
    response.statusCode = 404;
    response.setHeader("Content-Type", "text/html; charset=utf-8");
    response.end("<!doctype html><html><body>404 - Not Found</body></html>");
    }
    } catch (error) {
      // Catch any exceptions and show error messages
      response.statusCode = 500;
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<html><body><p>Error: ${error.message}</p></body></html>`);
    }
  }



// server instanciation
const server = createServer(webserver);

// modify the server to listen to a port number given on the command line instead of 8000.
server.listen(port, (err) => { });