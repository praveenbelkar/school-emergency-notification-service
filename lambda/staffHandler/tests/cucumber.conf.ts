import { setDefaultTimeout } from "@cucumber/cucumber";

const timeoutMillis = parseInt(process.env.HTTP_TIMEOUT ?? "10000");

setDefaultTimeout(timeoutMillis);
