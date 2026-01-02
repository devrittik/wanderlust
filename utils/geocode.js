const axios = require("axios");

module.exports = async (query) => {
  const res = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
        limit: 1,
      },
      headers: {
        "User-Agent": "wanderlust-app",
      },
    }
  );

  if (!res.data.length) return null;

  return {
    type: "Point",
    coordinates: [
      parseFloat(res.data[0].lon), // lng
      parseFloat(res.data[0].lat), // lat
    ],
  };
};
