function isJavaScript(data) {
  const js =
    /(?:function|const|let|var|if|else|for|while|switch|case|break|return|console\.[\w()]+|\w+\s*\([^)]*\))\s*[{;]/;
  return js.test(data);
}

function isSVG(string) {
  const svg = /^<svg\b[^>]*(?:\/>|>.*?<\/svg>)/is;
  return svg.test(string);
}

function isHTML(data) {
  const html = /^<(?:"[^"]*"['"]*|'[^']*'['"]*|[^'">])+>/;
  return html.test(data);
}

function isXML(data){
   const xml = /^<\?xml\s+version=["'][^"']*["']\s+encoding=["'][^"']*["']\?>\s*<([a-zA-Z_][\w\-\.:]*)[^>]*>(?:[^<]+|<(?!\/\1>))*<\/\1>$/;
   return xml.test(data);
}

function getMimeType(data) {
  if (typeof data === "object" || Array.isArray(data)) {
    // Convert the data to JSON
    data = JSON.stringify(data);
    return {
      contentType: "application/json",
      data: data,
    };
  } else if (Buffer.isBuffer(data)) {
    return {
      contentType: "application/octet-stream",
      data: data,
    };
  } else {
    if (isSVG(data)) {
      return {
        contentType: "image/svg+xml",
        data: data,
      };
    } else if (isJavaScript(data)) {
      return {
        contentType: "application/javascript",
        data: data,
      };
    } else if (typeof data === "string") {
      if (isHTML(data)) {
        return {
          contentType: "text/html",
          data: data,
        };
      } else if (isXML(data)){
        return {
          contentType: "application/xml",
          data: data,
        };
      }
    } else {
      console.log("hello bro");
      return {
        contentType: "text/plain",
        data: data,
      };
    }
  }
}

export default getMimeType;
