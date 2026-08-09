#!/usr/bin/env node
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { canonical, machineFingerprint, machineId } from "./lib/license.js";

const VENDOR_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MC4CAQAwBQYDK2VwBCIEIOZPvbb3BL/FNFt31RJj54HxNlw9AJD8EvBAlm2R2aue
-----END PRIVATE KEY-----`;
const VENDOR_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MCowBQYDK2VwAyEAVOm2Li+GsDXcSZgBQYtsZjtgl7KoNvZZCBrqAQM0j5s=
-----END PUBLIC KEY-----`;

function usage() {
  console.log(`Usage:
  node license-vendor.mjs issue --customer "Customer Name" --model perpetual [--days 365] [--machine-id ID] [--fingerprint FP] [--out license.key]
  node license-vendor.mjs show-public

Options:
  --customer    Customer name to embed in the license
  --model       License model: perpetual, subscription, trial
  --days        Days until expiration (default: perpetual/no expiry)
  --expires     Exact ISO expiry date (overrides --days)
  --machine-id  Target machine ID shown by the app activation page
  --fingerprint Full machine fingerprint (optional, optional only if machine ID is provided)
  --out         Output file path (default: license.key)

Examples:
  node license-vendor.mjs issue --customer "Jeff Network" --model perpetual --machine-id A1B2C-D3E4F-... --out license.key
  node license-vendor.mjs issue --customer "Jeff Network" --model subscription --days 365 --machine-id A1B2C-D3E4F-...
  node license-vendor.mjs show-public
`);
}

function normalizeMachineId(id) {
  return String(id || "").replace(/[^A-Fa-f0-9]/g, "").toUpperCase();
}

function parseArgs(argv) {
  const opts = { args: [] };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      if (["customer", "model", "machine-id", "fingerprint", "out", "expires"].includes(key)) {
        opts[key] = argv[++i];
      } else if (key === "days") {
        opts.days = Number(argv[++i]);
      } else {
        throw new Error(`Unknown option: ${arg}`);
      }
    } else {
      opts.args.push(arg);
    }
  }
  return opts;
}

function licenseFp({ fingerprint, machineId }) {
  if (fingerprint) return String(fingerprint).trim();
  if (machineId) return String(machineId).trim();
  return null;
}

function issueLicense({ fp, customer, model, expires }) {
  if (!fp) throw new Error("Need --machine-id or --fingerprint to issue a license.");
  if (!customer) throw new Error("Need --customer to issue a license.");
  if (!model) throw new Error("Need --model to issue a license.");
  const data = {
    fp,
    customer,
    model,
    issued: new Date().toISOString(),
    expires: expires || null,
    features: [],
  };
  const dataStr = canonical(data);
  const sig = crypto.sign(null, Buffer.from(dataStr), VENDOR_PRIVATE_KEY).toString("base64");
  return { data, sig };
}

async function main() {
  try {
    const opts = parseArgs(process.argv.slice(2));
    const cmd = opts.args[0];
    if (!cmd) {
      usage();
      process.exit(1);
    }
    if (cmd === "show-public") {
      console.log(VENDOR_PUBLIC_KEY);
      return;
    }
    if (cmd === "issue") {
      const fp = licenseFp({ fingerprint: opts["fingerprint"], machineId: opts["machine-id"] }) || machineId();
      const expires = opts.expires ? new Date(opts.expires).toISOString() : (opts.days ? new Date(Date.now() + opts.days * 86400000).toISOString() : null);
      const license = issueLicense({ fp, customer: opts.customer, model: opts.model, expires });
      const text = Buffer.from(JSON.stringify(license)).toString("base64");
      const outPath = opts.out || "license.key";
      fs.writeFileSync(outPath, text, "utf8");
      console.log(`License file written to ${outPath}`);
      console.log(`Machine ID used: ${normalizeMachineId(fp)}`);
      return;
    }
    usage();
    process.exit(1);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}

main();
