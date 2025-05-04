# Flight Tracker CLI

## Project Overview

Flight Tracker CLI is a command-line tool that lets you check real-time flight statuses directly from your terminal. Whether you're picking someone up from the airport or you're an aviation nerd, this tool gives you up-to-the-minute flight info.

## Features

- 🔍 Check flight status by airline and flight number
- 📡 Live tracking mode with periodic updates
- 🌍 Supports most major airlines and flight routes
- 📦 Lightweight and simple to install

## Installation

Make sure you have Python 3 installed. Then:

```bash
git clone https://github.com/sjodcre/flight-tracker-cli.git
cd flight-tracker-cli
pip install .
```

## Usage

Check a flight's status:

```bash
flight-tracker get-flight-status UA 212
```

Track a flight live:

```bash
flight-tracker track-flight UA 212
```

Use `--help` to see all available commands.

## Contributing

Feel free to fork and contribute! Open a pull request or file an issue if you see something worth improving.
