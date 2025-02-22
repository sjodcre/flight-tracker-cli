import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import * as dotenv from "dotenv";
import { savePrice } from "./storage.js";

dotenv.config();

const API_KEY = process.env.SERPAPI_KEY;
const API_URL = "https://serpapi.com/search?engine=google_flights";

export async function trackFlight(
  departure_id = "KUL",
  arrival_id = "CTS",
  outbound_date?: string,
  return_date?: string
) {
  if (!API_KEY) {
    console.log(chalk.red("❌ API key is missing. Please add it to .env"));
    return;
  }

  // Calculate dates
  const currentDate = new Date();
  const queryDate = currentDate.toISOString().split("T")[0]; // Current date in YYYY-MM-DD format

  // ❌ If return date is provided but outbound date is missing, throw an error
  if (!outbound_date && return_date) {
    console.log(
      chalk.red(
        "❌ Error: If you provide a return date, you must also specify an outbound date."
      )
    );
    return;
  }

  // const outboundDate = new Date(currentDate);
  // outboundDate.setDate(outboundDate.getDate() + 30);

  // const returnDate = new Date(outboundDate);
  // returnDate.setDate(returnDate.getDate() + 10);

  let outboundDate = outbound_date ? new Date(outbound_date) : new Date(currentDate);
  if (!outbound_date) outboundDate.setDate(outboundDate.getDate() + 1);

  let returnDate = return_date ? new Date(return_date) : new Date(outboundDate);
  console.log(returnDate);
  if (!return_date) returnDate.setDate(returnDate.getDate() + 10);

  const outboundDateString = outboundDate.toISOString().split("T")[0];
  const returnDateString = returnDate.toISOString().split("T")[0];

  // const origin = "KUL";
  // const destination = "CTS";
  console.log(chalk.blue(`Query Date: ${queryDate}`));
  console.log(chalk.blue(`Outbound Date: ${outboundDateString}`));
  console.log(chalk.blue(`Return Date: ${returnDateString}`));

  const spinner = ora("Fetching flight data...").start();

  try {
    const outboundResponse = await axios.get(API_URL, {
      params: {
        api_key: API_KEY,
        departure_id,
        arrival_id,
        outbound_date: outboundDateString,
        return_date: returnDateString,
        currency: "MYR",
        stops: 1, // Nonstop flights only
        hl: "en",
        gl: "MY",
      },
    });

    spinner.stop();

    const { best_flights: outboundBestFlights, other_flights: outboundOtherFlights, price_insights } = outboundResponse.data;

    let allOutboundFlights: any[] = [];
    let priceLevel = price_insights ? price_insights.price_level : "unknown";
    let lowestPrice = price_insights?.lowest_price || "NULL";

    if (outboundBestFlights && outboundBestFlights.length > 0) {
      console.log(chalk.bold("\n✈️  Best Outbound Flight Deals:"));
      outboundBestFlights.forEach((flight: any, index: number) => {
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

      allOutboundFlights = outboundBestFlights.map((f: any) => ({ ...f, best_flight: true }));

      // Select the first outbound flight's departure_token for return flight search
      console.log(chalk.magenta(`Using first best outbound flight for return search`));
      const selectedFlight = allOutboundFlights[0];
      const departure_token = selectedFlight.departure_token;

      if (!departure_token) {
        console.log(chalk.red('❌ No departure token found for the selected flight.'));
        return;
      }

      const returnResponse = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          departure_id,
          arrival_id,
          outbound_date: outboundDateString,
          return_date: returnDateString,
          departure_token,
          stops: 1, // Nonstop flights only
          currency: 'MYR',
          hl: 'en',
          gl: 'MY',
        },
      });
  
      const { best_flights: returnBestFlights, other_flights: returnOtherFlights } = returnResponse.data;
      
      if (!returnBestFlights && !returnOtherFlights) {
        console.log(chalk.red('❌ No return flights found for this route.'));
        // savePrice(
        //   [], // Empty flight list
        //   queryDate,
        //   outboundDateString,
        //   returnDateString,
        //   departure_id,
        //   arrival_id,
        //   'unknown',
        //   'NULL',
        //   'No return flights found'
        // );
        return;
      }

      console.log(chalk.bold('\n✈️  Return Flight Options:'));
      const allReturnFlights = [...(returnBestFlights || []), ...(returnOtherFlights || [])];
      allReturnFlights.forEach((flight, index) => {
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
        console.log(chalk.gray(`   Layovers: ${flight.layovers?.length || 0}`));
        console.log('\n');
      });


    } else if (outboundOtherFlights && outboundOtherFlights.length > 0) {
      console.log(
        chalk.yellow("\n⚠️ No best flights found. Displaying other available flights:")
      );
      outboundOtherFlights.forEach((flight: any, index: number) => {
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

      allOutboundFlights = outboundOtherFlights.map((f: any) => ({ ...f, best_flight: false }));

      console.log(chalk.magenta(`Using first other outbound flight for return search`));
      const selectedFlight = allOutboundFlights[0];
      const departure_token = selectedFlight.departure_token;

      if (!departure_token) {
        console.log(chalk.red('❌ No departure token found for the selected flight.'));
        return;
      }

      const returnResponse = await axios.get(API_URL, {
        params: {
          api_key: API_KEY,
          departure_id,
          arrival_id,
          outbound_date: outboundDateString,
          return_date: returnDateString,
          departure_token,
          stops: 1, // Nonstop flights only
          currency: 'MYR',
          hl: 'en',
          gl: 'MY',
        },
      });
  
      const { best_flights: returnBestFlights, other_flights: returnOtherFlights } = returnResponse.data;
      
      if (!returnBestFlights && !returnOtherFlights) {
        console.log(chalk.red('❌ No return flights found for this route.'));
        // savePrice(
        //   [], // Empty flight list
        //   queryDate,
        //   outboundDateString,
        //   returnDateString,
        //   departure_id,
        //   arrival_id,
        //   'unknown',
        //   'NULL',
        //   'No return flights found'
        // );
        return;
      }

      console.log(chalk.bold('\n✈️  Return Flight Options:'));
      const allReturnFlights = [...(returnBestFlights || []), ...(returnOtherFlights || [])];
      allReturnFlights.forEach((flight, index) => {
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
        console.log(chalk.gray(`   Layovers: ${flight.layovers?.length || 0}`));
        console.log('\n');
      });


    } else {
      console.log(chalk.red("❌ No flights found for this route."));
      savePrice(
        [], // Empty flight list
        queryDate,
        outboundDateString,
        returnDateString,
        departure_id,
        arrival_id,
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
    savePrice(allOutboundFlights, queryDate, outboundDateString, returnDateString, departure_id, arrival_id, priceLevel, price_insights.lowest_price);
  } catch (error) {
    spinner.stop();
    if (error instanceof Error) {
      console.error(chalk.red("❌ Error fetching flight data:"), error.message);
    } else {
      console.error(chalk.red("❌ An unknown error occurred"));
    }
  }
}
