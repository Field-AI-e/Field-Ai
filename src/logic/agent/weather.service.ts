import { Conversation } from "src/entities/conversation.entity";
import { User } from "src/entities/user.entity";

export class WeatherService {
    async handleWeatherForecast(latitude: number, longitude: number): Promise<any> {


        let startDate: Date | undefined = new Date();
        let endDate: Date | undefined = new Date();
        let forecastDays = 7;
        endDate.setDate(endDate.getDate() + forecastDays - 1);
        // Handle specific date requests
     

        // Default behavior if no specific dates
        if (!startDate && !endDate) {
            if (forecastDays === 1) {
                endDate = startDate;
            } else if (forecastDays > 1) {
                endDate = startDate;
                endDate.setDate(endDate.getDate() + forecastDays - 1);
            }
        }

        const forecast = await this.getFieldForecastWeather({ latitude, longitude }, startDate?.toISOString()?.split('T')[0], endDate?.toISOString()?.split('T')[0]);

        if (forecast.length === 0) {
            return {
                answer: "Sorry, I couldn't retrieve the weather forecast at this time. Please try again later.",
                success: false,
            };
        }


        return {
            weatherData: forecast,
            success: true,
        };
    }

    async getFieldForecastWeather(coodinates: any, startDate?: string, endDate?: string) {
        const { latitude, longitude } = coodinates
        const params: any = {
            latitude,
            longitude,
            daily: ["wind_speed_10m_max", "wind_gusts_10m_max", "wind_direction_10m_dominant", "shortwave_radiation_sum", "sunshine_duration", "precipitation_sum", "precipitation_hours", "temperature_2m_max", "temperature_2m_min"],
            timezone: "auto"
        }

        // Add date parameters if provided
        if (startDate) {
            params.start_date = startDate;
        }
        if (endDate) {
            params.end_date = endDate;
        }

        // Convert params to URL search string
        const searchParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach((item: any) => searchParams.append(key, item.toString()));
            } else {
                searchParams.append(key, (value as any).toString());
            }
        });
        try {
            const response = await fetch(`https://api.open-meteo.com/v1/forecast?${searchParams.toString()}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const weatherResults = await response.json();

            const results = weatherResults.daily.time.map((item, index) => {
                return {
                    date: item,
                    maxTemp: weatherResults.daily.temperature_2m_max[index],
                    minTemp: weatherResults.daily.temperature_2m_min[index],
                    precipitation: weatherResults.daily.precipitation_sum[index],
                    windSpeed: weatherResults.daily.wind_speed_10m_max[index] / 3.6,
                    windGustSpeed: weatherResults.daily.wind_gusts_10m_max[index] / 3.6,
                    windDirection: weatherResults.daily.wind_direction_10m_dominant[index],
                    shortwaveRadiation: weatherResults.daily.shortwave_radiation_sum[index],
                    sunshineDuration: weatherResults.daily.sunshine_duration[index] / 3600,
                    precipitationHours: weatherResults.daily.precipitation_hours[index],
                }
            })
            return results;
        } catch (e) {
            //console.log(e)
            return []
        }

    }

}