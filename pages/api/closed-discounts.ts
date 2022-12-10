import type { NextApiRequest, NextApiResponse } from "next";

import fs from "fs";
import { IncomingHttpHeaders } from "http";

const EMAIL_REGEX = /\w+@\w+\.\w{2,3}/;

const MAX_SUBSCRIPTIONS_FROM_THE_SAME_USER_AGENT = 3;
const SUBSCRIPTIONS_INTERVAL_MILLISECONDS = 1000 * 10;

const MAX_MALICIOUS_USER_AGENTS = 3;
const MALICIOUS_USER_AGENTS_INTERVAL_MILLISECONS = 1000 * 60 * 10;

const NO_JSON_REPLACER = null;
const JSON_SPACES = 2;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  const subscription = {
    headers: req.headers,
    email: req.body.email,
  };

  if (!EMAIL_REGEX.test(subscription.email)) {
    return res
      .status(400)
      .end(fs.readFileSync("public/failed-subscription.html", "utf-8"));
  }

  if (!req.headers["user-agent"]) {
    return endSuccessfully(res);
  }

  const isMaliciousSubscription = isUserAgentMalicious(req.headers);

  if (areTooManyMessagesFromTheSameUserAgent(req) || isMaliciousSubscription) {
    if (!isMaliciousSubscription) {
      logUserAgentToFileSystem(req.headers);
    }

    return endSuccessfully(res);
  }
  fs.writeFileSync(
    `generated/closed-discounts/${+new Date()}`,
    JSON.stringify(subscription, NO_JSON_REPLACER, JSON_SPACES),
    "utf-8"
  );

  res.setHeader("Content-Type", "text/html");

  res
    .status(201)
    .end(fs.readFileSync("public/successful-subscription.html", "utf-8"));
}
function endSuccessfully(res: NextApiResponse<string>): void {
  res
    .status(201)
    .end(fs.readFileSync("public/successful-subscription.html", "utf-8"));
}

function areTooManyMessagesFromTheSameUserAgent(req: NextApiRequest): boolean {
  const timestamps = fs
    .readdirSync("generated/closed-discounts", "utf-8")
    .filter((entry) => entry !== ".gitkeep");

  return (
    timestamps.filter((timestamp) => {
      const today = +new Date();
      const then = timestamp;

      const content = fs.readFileSync(
        `generated/closed-discounts/${timestamp}`,
        "utf-8"
      );
      const subscription = JSON.parse(content);
      const userAgent = subscription.headers["user-agent"];
      return (
        req.headers["user-agent"] === userAgent &&
        today - +then < SUBSCRIPTIONS_INTERVAL_MILLISECONDS
      );
    }).length > MAX_SUBSCRIPTIONS_FROM_THE_SAME_USER_AGENT
  );
}
function isUserAgentMalicious(thisHeaders: IncomingHttpHeaders): boolean {
  const timestamps = fs
    .readdirSync("spamfilter/user-agents-log", "utf-8")
    .filter((entry) => entry !== ".gitkeep");

  return (
    timestamps.filter((timestamp) => {
      const today = +new Date();
      const then = timestamp;

      const thatHeaders = JSON.parse(
        fs.readFileSync(`spamfilter/user-agents-log/${timestamp}`, "utf-8")
      );

      const areUserAgentsSame =
        thisHeaders["user-agent"] === thatHeaders["user-agent"];

      const thisHeaderOrder = JSON.stringify(
        Object.getOwnPropertyNames(thisHeaders)
      );
      const thatHeaderOrder = JSON.stringify(
        Object.getOwnPropertyNames(thatHeaders)
      );

      const areHeaderOrdersSame = thisHeaderOrder === thatHeaderOrder;

      return (
        (areUserAgentsSame || areHeaderOrdersSame) &&
        today - +then < MALICIOUS_USER_AGENTS_INTERVAL_MILLISECONS
      );
    }).length > MAX_MALICIOUS_USER_AGENTS
  );
}

function logUserAgentToFileSystem(headers: IncomingHttpHeaders) {
  fs.writeFileSync(
    `spamfilter/user-agents-log/${+new Date()}`,
    JSON.stringify(headers),
    "utf-8"
  );
}
