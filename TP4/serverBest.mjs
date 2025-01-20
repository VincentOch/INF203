"use strict";

import { createServer } from "http";
import { readFile, stat } from "fs";
import { parse } from "querystring";
import { URL } from "url";

// Global variable to store user data
let visitedUsers = [];

// Handle requests
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
    } else if (url.pathname.startsWith("/files/")) {
      // Question 3
      serveFile(url.pathname.substring(7), response);
    } else if (url.pathname === "/bonjour") {
      // Question 4
      const queryParams = parse(url.search.substring(1));
      const name = queryParams.name || "Unknown";
      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<html><body><p>bonjour ${name}</p></body></html>`);
    } else if (url.pathname === "/salut") {


      
      // Question 5
      const queryParams = parse(url.search.substring(1));
      const user = queryParams.user || "Unknown";

      // Sanitize user input to prevent XSS
      const sanitizedUser = sanitizeInput(user);

      // Save the user in memory
      visitedUsers.push(sanitizedUser);

      response.setHeader("Content-Type", "text/html; charset=utf-8");
      response.end(`<html><body><p>salut ${sanitizedUser}, the following users have already visited this page: ${visitedUsers.join(", ")}</p></body></html>`);
   
   
   
   
    } else if (url.pathname === "/clear") {
      // Question 6
      clearUserMemory(response);

    } else {
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

// Function to serve files
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

// Function to get MIME type based on file extension
function getMimeType(filePath) {
  const fileExtension = filePath.split(".").pop().toLowerCase();

  switch (fileExtension) {
    case 'ico': return 'image/x-icon';
    case 'html': return 'text/html';
    case 'js': return 'text/javascript';
    case 'json': return 'application/json';
    case 'css': return 'text/css';
    case 'png': return 'image/png';
    case 'jpg': return 'image/jpeg';
    case 'wav': return 'audio/wav';
    case 'mp3': return 'audio/mpeg';
    case 'svg': return 'image/svg+xml';
    case 'pdf': return 'application/pdf';
    case 'doc': return 'application/msword';
    case 'eot': return 'appliaction/vnd.ms-fontobject';
    case 'ttf': return 'application/font-sfnt';
    case 'woff': return 'application/font-woff';
    case 'woff2': return 'application/font-woff2';
    case 'mjs': return 'application/javascript';
  }
}

function clearUserMemory(response) {
  const clearedUser = visitedUsers.pop(); // Pop the last user to show in the response
  visitedUsers = [];
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end(`<html><body><p>salut ${clearedUser || "Unknown"}, the following users have already visited this page:'</p></body></html>`);
}

// Function to sanitize user input to prevent XSS
function sanitizeInput(input) {
  return input.replace(/</g, "_").replace(/>/g, "_");
}

// Server object creation
const server = createServer(webserver);

// Get port number from command line arguments or use default (8000)
const port = process.argv[2] || 8000;

// Server starting
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
