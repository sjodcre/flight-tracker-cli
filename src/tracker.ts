import axios from "axios";
import chalk from "chalk";
import ora from "ora";
import * as dotenv from "dotenv";
import { savePrice } from "./storage.js";

dotenv.config();

const API_KEY = process.env.API_KEY;
const API_URL = "https://api.skyscanner.net/apiservices/browsequotes/v1.0/US/USD/en-US";

export async function trackFlight(from: string, to: string, date: string) {
  if (!API_KEY) {
    console.log(chalk.red("❌ API key is missing. Please add it to .env"));
    return;
  }

  const spinner = ora("Fetching flight data...").start();

  try {
    const response = await axios.get(
      `${API_URL}/${from}/${to}/${date}?apiKey=${API_KEY}`
    );

    spinner.stop();

    const flight = response.data.Quotes[0]; // Get the cheapest option
    if (flight) {
      console.log(
        chalk.green(
          `🎟️ Lowest price: $${flight.MinPrice} - Carrier ID: ${flight.OutboundLeg.CarrierIds[0]}`
        )
      );
      savePrice(from, to, date, flight.MinPrice);

    } else {
      console.log(chalk.yellow("⚠️ No flights found for this route."));
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(chalk.red("❌ Error fetching flight data:"), error.message);
    } else {
      console.error(chalk.red("❌ An unknown error occurred"));
    }
  }
}
