export async function getLocation(ip) {
	try {
		const response = await fetch(`https://ipapi.co/${ip}/json/`);
		const data = await response.json();
		return data || "Unknown";
	} catch (error) {
		console.error("Error fetching location:", error);
		return "Unknown";
	}
}

async function getLocation(ip) {
	const url = `https://ipapi.co/${ip}/json/`;
	const response = await axios.get(url);
	const data = response.data;
	console.log("LOCATION DATA: ", data);

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