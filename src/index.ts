import { Command } from "commander";
import { trackFlight } from "./tracker.js";
// import * as figlet from "figlet";
// import {figlet} from "figlet";
import cfonts from "cfonts";


const program = new Command();

// console.log(figlet.textSync("Flight Tracker"));
cfonts.say("Flight Tracker", {
  font: "block",   // Style of the text
  align: "center", // Align text to center
  colors: ["cyan"], // Text color
  background: "black", // Background color
  letterSpacing: 0, // Space between letters
  lineHeight: 1, // Space between lines
  space: true, // Add space around text
});

program
  .version("1.0.0")
  .description("Flight Price Tracker CLI")
  .command("track")
  .description("Track flight price from source to destination")
  .option("-f, --from <from>", "Origin airport (IATA code)")
  .option("-t, --to <to>", "Destination airport (IATA code)")
  .option("-d, --date <date>", "Departure date (YYYY-MM-DD)")
  .action((options) => {
    trackFlight(options.from, options.to, options.date);
  });
  // .parse(process.argv);


program.parse(process.argv);
