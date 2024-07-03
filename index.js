const express = require("express");
const axios = require("axios");
const requestIp = require("request-ip");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5500;
const IPAPI_KEY = process.env.IPAPI_KEY || "your_ipapi_key";
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

app.use(requestIp.mw());
app.set('trust proxy', true);
// Function to get the location based on IP address
async function getLocation(ip) {


  const url = `https://ipapi.co/${ip}/json/`;
  const response = await axios.get(url);
  const data = response.data;
  // console.log('LOCATION DATA: ', data);

  if (data.error) {
    throw new Error(data.error.info);
  }

  return {
    city: data.city,
    region: data.region_name,
    country: data.country_name,
    lat: data.latitude,
    lon: data.longitude,
  };
}

// Function to get temperature
async function getTemperature(lat, lon) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  const response = await axios.get(url);
  const data = response.data;
  return data.main.temp;
}

function getClientIp(req) {
  const xForwardedFor = req.headers['x-forwarded-for']?.split(',').shift()
    || req.socket?.remoteAddress
  if (xForwardedFor) {
    console.log('headers === ', xForwardedFor);
    // Extract the first IP in the list (if there are multiple IPs)
    return xForwardedFor.split(',')[0].trim();
  }
  // Fall back to the requestIp middleware
  return req.clientIp;
}

// Endpoint to handle requests
app.get("/api/hello", async (req, res) => {
  try {
    const visitorName = req.query.visitor_name || "Guest";
    let clientIp = getClientIp(req);

    // Handle reserved IP addresses
    if (clientIp === "::1" || clientIp === "127.0.0.1") {
      clientIp = "8.8.8.8"; // Example fallback to a known public IP for testing
    }

    // Get location based on IP address
    const location = await getLocation(clientIp);

    // Get temperature based on location
    const temperature = await getTemperature(location.lat, location.lon);

    // Form the response
    const response = {
      client_ip: clientIp,
      location: location.city,
      greeting: `Hello, ${visitorName}! The temperature is ${temperature} degrees Celsius in ${location.city}`,
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});