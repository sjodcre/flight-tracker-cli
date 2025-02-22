import { Command } from "commander";
import { trackFlight } from "./tracker.js";
import cfonts from "cfonts";

const program = new Command();

cfonts.say("Flight Tracker", {
  font: "block",
  align: "center",
  colors: ["cyan"],
  background: "black",
  letterSpacing: 0,
  lineHeight: 1,
  space: true,
});

program
  .version("1.0.0")
  .description("Flight Price Tracker CLI")
  .command("track")
  .description("Track flight prices")
  .option("-d, --departure <code>", "Departure airport (IATA code)", "KUL")
  .option("-a, --arrival <code>", "Arrival airport (IATA code)", "CTS")
  .option("-o, --outbound <date>", "Outbound date (YYYY-MM-DD)")
  .option("-r, --return <date>", "Return date (YYYY-MM-DD)")
  .action((options) => {
    trackFlight(options.departure, options.arrival, options.outbound, options.return);
  });

program.parse(process.argv);


