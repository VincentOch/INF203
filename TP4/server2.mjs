"use strict";

import { createServer } from "http";
import { readFile, stat } from "fs";
import { parse } from "querystring";
import { URL } from "url";

// Global variable to store user data
let visitedUsers = [];

// Function to get MIME type based on file extension
function getMimeType(filePath) {
  const mimeTypes = {
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
    '.eot': 'application/vnd.ms-fontobject',
    '.ttf': 'application/font-sfnt',
    '.woff': 'application/font-woff',
    '.woff2': 'application/font-woff2',
    '.mjs': 'application/javascript'
  };

  const fileExtension = filePath.split(".").pop().toLowerCase();
  return mimeTypes[fileExtension] || "application/octet-stream";
}

// Function to sanitize user input to prevent XSS
function sanitizeInput(input) {
  return input.replace(/</g, "_").replace(/>/g, "_");
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

// Function to clear user memory
function clearUserMemory(response) {
  visitedUsers = [];
  response.setHeader("Content-Type", "text/html; charset=utf-8");
  response.end("<html><body><p>User memory cleared.</p></body></html>");
}

// Handle requests
function webserver(request, response) {
  try {
    const url = new URL(request.url, `http://${request.headers.host}`);

    if (url.pathname === "/") {
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>Server works.</body></html>");    } else if (url.pathname === "/stop") {
      // ... (existing code)
    } else if (url.pathname.startsWith("/files/")) {
        serveFile(url.pathname.substring(7), response);    } else if (url.pathname === "/bonjour") {
      // ... (existing code)
    } else if (url.pathname === "/bonjour") {
        // Question 4
        const queryParams = parse(url.search.substring(1));
        const name = queryParams.name || "Unknown";
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>bonjour ${name}</p></body></html>`);
    } else if (url.pathname === "/salut") {
        const queryParams = parse(url.search.substring(1));
        const user = queryParams.user || "Unknown";

        // Sanitize user input to prevent XSS
        const sanitizedUser = sanitizeInput(user);

        // Save the user in memory
        visitedUsers.push(sanitizedUser);

        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>salut ${sanitizedUser}, the following users have visited: ${visitedUsers.join(", ")}</p></body></html>`);    } else if (url.pathname === "/clear") {
        // Question 6
        clearUserMemory(response);
    } else {
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end("<!doctype html><html><body>404 - Not Found</body></html>");    }
  } catch (error) {
        response.statusCode = 500;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(`<html><body><p>Error: ${error.message}</p></body></html>`);  }
}

// Server object creation
const server = createServer(webserver);

// Get port number from command line arguments or use default (8000)
const port = process.argv[2] || 8000;

// Server starting
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
