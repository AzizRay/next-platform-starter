exports.handler = async function (event, context) {
    const ip = event.headers["x-forwarded-for"] || event.headers["client-ip"] || "Unknown IP";
    console.log(`Incoming request from IP: ${ip}`);
  
    return {
      statusCode: 404,
      headers: { "Content-Type": "text/plain" },
      body: "404 Not Found",
    };
  };
  