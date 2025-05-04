# flight-tracker-cli

## Project Overview

**Flight Tracker CLI** is a TypeScript-based command-line tool that helps you monitor flight prices and routes directly from your terminal. Whether you’re planning a trip or just exploring airfare trends, this CLI gives you quick access to outbound and return flight data based on your selected airports and dates.

## Features

* **Flight Tracking by Route & Dates** – Track flights between two airports with specified outbound and return dates.
* **Custom IATA Codes** – Easily specify departure and arrival airports using IATA codes (e.g., `KUL`, `CTS`).
* **Modern CLI Interface** – Built with [`commander`](https://github.com/tj/commander.js) and styled with [`cfonts`](https://github.com/dominikwilkowski/cfonts) for a fun and readable experience.
* **Lightweight & Developer-Friendly** – Written in TypeScript with simple local setup and no Python dependencies.

## Installation

### Prerequisites

* Node.js (v18 or newer recommended)
* npm or yarn

### Steps

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/flight-tracker-cli.git
   cd flight-tracker-cli
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Build the TypeScript code:**

   ```bash
   npm run build
   # or
   yarn build
   ```

4. **Run the CLI:**

   ```bash
   node dist/index.js track -d KUL -a CTS -o 2025-07-15 -r 2025-07-25
   ```

   You’ll see a styled CLI banner and the flight tracking output (based on how `trackFlight` is implemented).

## Example Usage

```bash
node dist/index.js track -d KUL -a CTS -o 2025-07-15 -r 2025-07-25
```

Options:

* `-d, --departure <code>` – Departure airport IATA code (default: `KUL`)
* `-a, --arrival <code>` – Arrival airport IATA code (default: `CTS`)
* `-o, --outbound <date>` – Outbound date in `YYYY-MM-DD` format
* `-r, --return <date>` – Return date in `YYYY-MM-DD` format

## Development

To run the CLI in dev mode (without building each time), use `ts-node`:

```bash
npx ts-node src/index.ts track -d KUL -a CTS -o 2025-07-15 -r 2025-07-25
```

> Make sure `ts-node` and `typescript` are installed as dev dependencies.

## Contribution Guidelines

Feel free to fork the project, open issues, and submit PRs! This is a learning-friendly project — all contributions are welcome.
