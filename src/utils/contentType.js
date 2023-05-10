const getTextContentType = (text) => {
	if (isSVGXML(text)) return "image/svg+xml";
	if (isSVG(text)) return "image/svg";
	if (isXML(text)) return "application/xml";
	if (isHTML(text)) return "text/html";
	else if (/^\s*\/\*.*?\*\/\s*/.test(text)) {
		return "text/css";
	} else if (
		/^\s*(var|let|const|function|console|class|if|else|while|for|switch)\b/.test(
			text
		)
	) {
		return "text/javascript";
	} else if (
		/^\s*\{.*\}\s*$/.test(text) ||
		(typeof text === "object" && !Array.isArray(text) && text !== null)
	) {
		return "application/json";
	} else {
		return "text/plain";
	}
};

const isSVGXML = (text) => {
	return /<svg[^>]+xmlns="http:\/\/www\.w3\.org\/2000\/svg"/i.test(text);
};

const isHTML = (text) => {
	if (
		(/^\s*<!doctype html>/i.test(text) &&
			hasMatchingOpeningAndClosingTags(
				text.replace(/<!doctype html>/i, "").trim()
			)) ||
		hasMatchingOpeningAndClosingTags(text)
	)
		return true;
};

const isSVG = (text) => {
	return hasMatchingOpeningAndClosingTags(text, "svg");
};

const isXML = (text) => {
	const isXMLVE = () => {
		return /^<\?xml\s+version=[^\s]+\s+encoding=[^\s]+\s*\?>/.test(text);
	};

	if (
		isXMLVE() &&
		hasMatchingOpeningAndClosingTags(text.replace(/<\?xml[^?]+\?>/i, "").trim())
	) {
		console.log("came here");
		console.log(text);
		return true;
	}
};

function hasMatchingOpeningAndClosingTags(str, tagName) {
	const regex = /<(\w+)[^>]*>|<\/(\w+)>/g;
	const tags = str.match(regex);
	if (!tags) {
		return false; // No tags found
	}

	const openingTag = tags[0].slice(1, -1).split(" ")[0];
	const closingTag = tags[tags.length - 1].slice(2, -1);
	console.log(openingTag);
	console.log(closingTag);
	if (tagName) {
		return (
			openingTag.toLowerCase() === tagName.toLowerCase() &&
			closingTag.toLowerCase() === tagName.toLowerCase()
		);
	} else {
		return openingTag === closingTag;
	}
}

const getFileContentType = (path) => {
	const fileExtension = path.split(".").pop();
	switch (fileExtension) {
		case "html":
			return "text/html";
		case "css":
			return "text/css";
		case "js":
			return "text/javascript";
		case "json":
			return "application/json";
		case "jpg":
			return "image/jpg";
		case "jpeg":
			return "image/jpeg";
		case "png":
			return "image/png";
		case "gif":
			return "image/gif";
		case "pdf":
			return "application/pdf";
		case "mp4":
			return "video/mp4";
		case "mp3":
			return "audio/mp3";
		default:
			return "application/octet-stream";
	}
};

export { getFileContentType, getTextContentType };
