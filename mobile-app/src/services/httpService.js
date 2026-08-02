// FILE: src/services/httpService.js
// JOB: Send requests to the backend with the login token attached.

import { NODE_API_URL } from "../config/api";
import { getToken } from "./storageService";

// Send a GET request with the token.
// "path" is the part after /api, for example "/v1/babies".
export async function getWithAuth(path) {
   // Step 1: read the saved token from the phone.
   const token = await getToken();

   // Step 2: send the request with the token in the header.
   const response = await fetch(NODE_API_URL + path, {
      method: "GET",
      headers: {
         Authorization: "Bearer " + token,
      },
   });

   // Step 3: turn the answer into an object.
   const data = await response.json();

   // Step 4: if the backend returned an error, throw a clear message.
   if (!response.ok) {
      throw new Error(data.error || "Request failed");
   }

   return data;
}
