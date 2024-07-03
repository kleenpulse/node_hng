import fetch from "node-fetch";

const OPENWEATHERMAP_API_KEY = Bun.env.OPENWEATHERMAP_API_KEY;
export async function getTemperature(lat: string, lon: string) {
	const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
	const response = await fetch(url);
	const data = (await response.json()) as unknown as any;
	console.log("TEMPERATURE", data);
	return data.main.temp;
}
