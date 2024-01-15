import { BeforeAll } from "@cucumber/cucumber";
import pactum from "pactum";
const { request } = pactum;

BeforeAll(async () => {
  const timeoutMillis = parseInt(process.env.HTTP_TIMEOUT ?? "10000");
  request.setDefaultTimeout(timeoutMillis);
});
