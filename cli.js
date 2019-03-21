#!/usr/bin/env node
const { getCount, watchCount } = require("./api");

const logSignatures = count =>
  process.stdout.write(
    `\rSignatures at ${new Date().toLocaleTimeString()}: ${count}`
  );

const handleCount = async ({ id, rate }) => {
  try {
    const errorOrCount = await getCount(id);
    if (errorOrCount instanceof Error) {
      throw errorOrCount;
    } else {
      logSignatures(errorOrCount);
    }
  } catch (error) {
    console.error("Could not get signature count, because", error.message);
  }
};

const handleWatch = async ({ id, rate }) => {
  process.stdout.write("Fetching signature count...");
  watchCount(id, logSignatures, rate);
};

const withId = yargs =>
  yargs
    .positional("id", { describe: "The petition ID", type: "number" })
    .option("rate", {
      describe: "The number of seconds to wait between requests",
      type: "number",
    });

const { argv } = require("yargs")
  .command("count <id>", "count a petition's signatures", withId, handleCount)
  .command(
    "watch <id>",
    "watch a petition's signature count",
    withId,
    handleWatch
  )
  .demandCommand(1)
  .help();
