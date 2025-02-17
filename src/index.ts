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
  .description("Track flight prices for Kuala Lumpur (KUL) → Sapporo (CTS)")
  .action(() => {
    trackFlight();
  });

program.parse(process.argv);
