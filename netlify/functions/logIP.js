exports.handler = async function (event, context) {
  let ip = "Unknown IP";

  // Capture relevant headers
  const headers = event.headers;
  const userAgent = headers["user-agent"] || "Unknown User-Agent";
  const referer = headers["referer"] || headers["referrer"] || "No Referrer";
  const geoCountry = headers["x-country"] || "Unknown Country"; // Used by some CDNs
  const geoCity = headers["x-city"] || "Unknown City";

  // Prioritize real client IP (Checking multiple headers)
  if (headers["x-client-ip"]) {
    ip = headers["x-client-ip"];
  } else if (headers["x-forwarded-for"]) {
    ip = headers["x-forwarded-for"].split(',')[0].trim(); // Take the first valid IP
  } else if (headers["cf-connecting-ip"]) {
    ip = headers["cf-connecting-ip"]; // Cloudflare IP
  } else if (headers["true-client-ip"]) {
    ip = headers["true-client-ip"]; // Some proxies use this
  } else if (headers["x-real-ip"]) {
    ip = headers["x-real-ip"]; // Nginx Proxy
  } else if (headers["fastly-client-ip"]) {
    ip = headers["fastly-client-ip"]; // Fastly CDN
  } else if (headers["x-cluster-client-ip"]) {
    ip = headers["x-cluster-client-ip"]; // Load balancers
  } else if (headers["forwarded"]) {
    ip = headers["forwarded"].split(';')[0].split('=')[1]; // RFC 7239 format
  } else {
    ip = headers["client-ip"] || "Unknown IP"; // Default Netlify IP header
  }

  // Extract IPv4 if it's embedded in an IPv6-mapped address (::ffff:192.168.1.1 → 192.168.1.1)
  if (ip.includes(':') && ip.includes('.')) {
    ip = ip.split(':').pop();
  }

  // Log the full details
  console.log(`
    📡 Incoming request details:
    - IP Address: ${ip}
    - User-Agent: ${userAgent}
    - Referrer: ${referer}
    - Geo-Country: ${geoCountry}
    - Geo-City: ${geoCity}
  `);

  return {
    statusCode: 404,
    headers: { "Content-Type": "text/plain" },
    body: "404 Not Found",
  };
};
