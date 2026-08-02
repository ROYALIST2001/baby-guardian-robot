// FILE: src/services/httpService.js
// JOB: Send requests to the backend with the login token attached.

import { NODE_API_URL } from "../config/api";
import { getToken } from "./storageService";

// ---- GET: read data ----
export async function getWithAuth(path) {
   const token = await getToken();

   const response = await fetch(NODE_API_URL + path, {
      method: "GET",
      headers: {
         Authorization: "Bearer " + token,
      },
   });

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.error || "Request failed");
   }

   return data;
}

// ---- A shared helper for POST and PUT, because they are almost the same ----
// "method" is either "POST" or "PUT". "body" is the data we send.
async function sendWithAuth(method, path, body) {
   const token = await getToken();

   const response = await fetch(NODE_API_URL + path, {
      method: method,
      headers: {
         Authorization: "Bearer " + token,
         // This header tells the server the body is JSON.
         "Content-Type": "application/json",
      },
      // Turn our object into text, because the body must be text.
      body: JSON.stringify(body),
   });

   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.error || "Request failed");
   }

   return data;
}

// ---- POST: create or send something ----
export async function postWithAuth(path, body) {
   return await sendWithAuth("POST", path, body);
}

// ---- PUT: update something ----
export async function putWithAuth(path, body) {
   return await sendWithAuth("PUT", path, body);
}
