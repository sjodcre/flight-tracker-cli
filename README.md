# flight-tracker-cli

## Project Overview

**Flight Tracker CLI** is a simple command-line tool that lets you check the status of any flight in real time, right from your terminal. It’s written in Python and designed to be straightforward — no need to open a browser or app; just run a quick command to see if a flight is on time, delayed, or landed. Whether you’re an aviation enthusiast or just picking up a friend from the airport, this CLI gives you up-to-the-minute flight information at your fingertips.

## Features

- **Instant Flight Status** – Retrieve up-to-date status info (departure/arrival times, delays, cancellations, etc.) for a given flight by specifying its airline and flight number. The tool connects to a live flight data API to fetch accurate information (e.g. status, gate, and schedule) for flights worldwide.
- **Live Tracking Mode** – Keep an eye on a flight in progress. Using the `track-flight` command, you can continuously monitor a flight’s status over time. The CLI will periodically update the flight’s info in the terminal, so you can watch for changes (useful for tracking a flight’s progress or delays without refreshing anything).
- **Wide Airline Coverage** – Supports virtually all airlines and flights. If the flight exists and is publicly trackable, this tool can fetch it. (Under the hood it leverages public APIs, so as long as the flight data is available through the API, you’re good to go.)
- **User-Friendly Output** – Flight details are presented in a clean, readable format directly in your console. You’ll typically see the flight number, airline name, current status (e.g. *On Time*, *Delayed*), and possibly additional details like departure/arrival airports and times. No junk, just the info you need.
- **Lightweight & Fast** – It’s a small Python program with minimal dependencies, so it installs quickly and runs in a flash. Perfect for quick look-ups without heavy tools.

## Installation

You’ll need **Python 3.x** installed on your system. The project uses Poetry for dependency management, but you can use pip as well. Choose one of the following installation methods:

### Option 1: Install with Poetry (recommended)

Clone this repository:
```bash
git clone https://github.com/yourusername/flight-tracker-cli.git
cd flight-tracker-cli
```

Install dependencies with Poetry:
```bash
poetry install
```
This will create a virtual environment and install all required packages.

Run the CLI via Poetry:
```bash
poetry run flight-tracker --help
```

### Option 2: Install with pip

Clone the repository (as in step 1 above).

Install the package using pip:
```bash
pip install .
```
This will install `flight-tracker-cli` into your Python environment and make the `flight-tracker` command available globally.

Verify the installation by running:
```bash
flight-tracker --help
```
You should see usage instructions if the install succeeded.

> **Note:** The tool relies on a flight status API. You might need to obtain an API key from the data source (if required) and configure it. Typically, you’d set an environment variable or edit a config file with your API key. Check the project documentation or source code for any configuration details (for example, an `API_KEY` setting). If no API key is needed (some public endpoints work without auth), then you can use the tool out-of-the-box.

## Usage

Once installed, using Flight Tracker CLI is straightforward. It provides a couple of commands: one to get a one-time status update and one to continuously track a flight.

### 1. Get a one-time flight status

Run the command with the airline code (or name) and flight number:
```bash
$ flight-tracker get-flight-status <Airline> <FlightNumber>
```

For example:
```bash
$ flight-tracker get-flight-status UA 212
```

This will fetch the current status of United Airlines flight 212. The output might look something like:
```
Flight UA 212 (United Airlines)
Status: Delayed (Departed 10:15 AM, Estimated arrival 1:45 PM)
Departure: SFO (San Francisco Intl) at 10:00 AM PDT
Arrival: LAX (Los Angeles Intl) at 12:30 PM PDT (Estimated 1:45 PM)
```

### 2. Track a flight in real-time

If you want to continuously monitor a flight, use:
```bash
$ flight-tracker track-flight <Airline> <FlightNumber>
```

For example:
```bash
$ flight-tracker track-flight AA 100
```

This command will start tracking American Airlines flight 100. The tool will periodically refresh the information and print updates to the terminal. You might see status changes in real-time (e.g., from *Boarding* to *Departed* to *In Flight* to *Landed*). This is handy if you’re waiting and want live updates without re-running commands. **Press** `Ctrl+C` to stop tracking when you’re done.

### 3. Help and other commands

You can always run the help command to see all available options:
```bash
$ flight-tracker --help
```

This will list the commands (like `get-flight-status` and `track-flight`) and any additional flags or usage details. Use this if you forget the exact syntax or want to see if new features are available.

> **Note:** If an API key or config is required, make sure you’ve set that up (for example, through an environment variable like `FLIGHT_API_KEY`). The CLI will typically prompt or throw an error if it can’t access the API. Check the repository docs for specifics on configuring your API access.

## Contribution Guidelines

Contributions are welcome! This project is open-source, and if you have ideas to improve it or find a bug, feel free to get involved:

- **Feedback & Ideas:** If you have an idea for a new feature or notice something that could be better (or broken), open an issue in the repository. Describe the enhancement or bug – we’re friendly and happy to discuss any suggestions.
- **Submitting Changes:** To contribute code, fork this repository and create a new branch for your changes (`git checkout -b feature/my-improvement`). Make your code changes, write or update tests if applicable (there’s a test suite in the `tests/` directory – you can run it with `pytest` or `poetry run pytest` to ensure everything still passes), then push your branch and open a Pull Request.
- **Code Style:** Try to follow standard Python conventions (PEP8). This makes the code easier to review and maintain. We don’t have a very strict style guide beyond that – just keep the code clean and readable.
- **Discuss First:** For large changes or new features, it’s a good idea to open an issue first and discuss with the maintainers. This can save time and ensure your effort aligns with the project’s goals.
- **Be Patient and Communicative:** We’ll review contributions as soon as we can. Feel free to tag maintainers or ask for a review if a PR is sitting for a while. And if we request any changes or have questions, don’t be discouraged – it’s all part of making the project better together.

By contributing to Flight Tracker CLI, you’ll be helping others get convenient flight info quickly. Thank you in advance for your support!
