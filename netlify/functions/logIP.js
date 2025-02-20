exports.handler = async function (event, context) {
  const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "Unknown IP";

  // Log the IP address to Netlify's function logs
  console.log(`Incoming request from IP: ${ip}`);

  return {
    statusCode: 404,
    headers: { "Content-Type": "text/plain" },
    body: "404 Not Found",
  };
};
