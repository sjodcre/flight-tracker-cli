import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import * as dotenv from "dotenv";
import { savePrice } from "./storage.js";

dotenv.config();

const API_KEY = process.env.SERPAPI_KEY;
const API_URL = "https://serpapi.com/search?engine=google_flights";

export async function trackFlight() {
  if (!API_KEY) {
    console.log(chalk.red("❌ API key is missing. Please add it to .env"));
    return;
  }

  // Calculate dates
  const currentDate = new Date();
  const queryDate = currentDate.toISOString().split("T")[0]; // Current date in YYYY-MM-DD format
  const outboundDate = new Date(currentDate);
  outboundDate.setDate(outboundDate.getDate() + 30);
  const returnDate = new Date(outboundDate);
  returnDate.setDate(returnDate.getDate() + 10);

  const outboundDateString = outboundDate.toISOString().split("T")[0];
  const returnDateString = returnDate.toISOString().split("T")[0];
  const origin = "KUL";
  const destination = "CTS";
  console.log(chalk.blue(`Query Date: ${queryDate}`));
  console.log(chalk.blue(`Outbound Date: ${outboundDateString}`));
  console.log(chalk.blue(`Return Date: ${returnDateString}`));

  const spinner = ora("Fetching flight data...").start();

  try {
    const response = await axios.get(API_URL, {
      params: {
        api_key: API_KEY,
        departure_id: origin,
        arrival_id: destination,
        outbound_date: outboundDateString,
        return_date: returnDateString,
        currency: "MYR",
        stops: 1, // Nonstop flights only
        hl: "en",
        gl: "MY",
      },
    });

    spinner.stop();

    const { best_flights, other_flights, price_insights } = response.data;

    let allFlights: any[] = [];
    let priceLevel = price_insights ? price_insights.price_level : "unknown";
    let lowestPrice = price_insights?.lowest_price || "NULL";

    if (best_flights && best_flights.length > 0) {
      console.log(chalk.bold("\n✈️  Best Flight Deals:"));
      best_flights.forEach((flight: any, index: number) => {
        const firstLeg = flight.flights[0]; // First leg of journey
        console.log(
          chalk.green(`#${index + 1}: ${firstLeg.airline} - ${flight.price} MYR`)
        );
        console.log(
          chalk.cyan(
            `   ${firstLeg.departure_airport.name} (${firstLeg.departure_airport.id}) → ${firstLeg.arrival_airport.name} (${firstLeg.arrival_airport.id})`
          )
        );
        console.log(chalk.magenta(`   Duration: ${flight.total_duration} min`));
        console.log(
          chalk.gray(`   Layovers: ${flight.layovers?.length || 0}`)
        );
        console.log("\n");
      });

      allFlights = best_flights.map((f: any) => ({ ...f, best_flight: true }));

    } else if (other_flights && other_flights.length > 0) {
      console.log(
        chalk.yellow("\n⚠️ No best flights found. Displaying other available flights:")
      );
      other_flights.forEach((flight: any, index: number) => {
        const firstLeg = flight.flights[0]; // First leg of journey
        console.log(
          chalk.green(`#${index + 1}: ${firstLeg.airline} - ${flight.price} MYR`)
        );
        console.log(
          chalk.cyan(
            `   ${firstLeg.departure_airport.name} (${firstLeg.departure_airport.id}) → ${firstLeg.arrival_airport.name} (${firstLeg.arrival_airport.id})`
          )
        );
        console.log(chalk.magenta(`   Duration: ${flight.total_duration} min`));
        console.log(
          chalk.gray(`   Layovers: ${flight.layovers?.length || 0}`)
        );
        console.log("\n");
      });

      allFlights = other_flights.map((f: any) => ({ ...f, best_flight: false }));

    } else {
      console.log(chalk.red("❌ No flights found for this route."));
      savePrice(
        [], // Empty flight list
        queryDate,
        outboundDateString,
        returnDateString,
        origin,
        destination,
        priceLevel,
        lowestPrice
      );
      return;
    }

    // ✅ Check for Price Insights
    if (!price_insights) {
      console.log(chalk.yellow("⚠️ No price insights available."));
      return;
    }

    console.log(chalk.bold("\n💰 Price Insights:"));
    console.log(chalk.green(`   🔹 Lowest Price: ${price_insights.lowest_price} MYR`));
    console.log(chalk.blue(`   🔹 Price Level: ${price_insights.price_level}`));
    console.log(
      chalk.magenta(
        `   🔹 Typical Price Range: ${price_insights.typical_price_range[0]} - ${price_insights.typical_price_range[1]} MYR`
      )
    );

    // ✅ Save lowest price to storage
    // const lowestPrice = price_insights.lowest_price;
    // const priceLevel = price_insights ? price_insights.price_level : "unknown";
    // const allFlights = best_flights?.map((f: any) => ({ ...f, best_flight: true })) || [];
    // if (other_flights) {
    //   allFlights.push(...other_flights.map((f: any) => ({ ...f, best_flight: false })));
    // }
    savePrice(allFlights, queryDate, outboundDateString, returnDateString, origin, destination, priceLevel, price_insights.lowest_price);
  } catch (error) {
    spinner.stop();
    if (error instanceof Error) {
      console.error(chalk.red("❌ Error fetching flight data:"), error.message);
    } else {
      console.error(chalk.red("❌ An unknown error occurred"));
    }
  }
}
