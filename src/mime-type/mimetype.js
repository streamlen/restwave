const mimeTypes = {
   ".html": "text/html",
   ".css": "text/css",
   ".js": "text/javascript",
   ".json": "application/json",
   ".pdf": "application/pdf",
   ".png": "image/png",
   ".jpg": "image/jpeg",
   ".gif": "image/gif"
 };

 function getMimeType(file) {
   const ext = file.substr(file.lastIndexOf("."));
   return mimeTypes[ext] || "application/octet-stream";
 }

 export default getMimeType;