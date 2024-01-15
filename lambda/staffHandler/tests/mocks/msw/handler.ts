import * as fs from "fs";
import { RequestHandler, rest } from "msw";

const staffDomainHandler: RequestHandler = rest.post(`${process.env.STAFF_DOMAIN_API_URL}`, async (req, res, ctx) => {
  const body = await req.json();
  const schoolCode = body.query.schoolCodes[0];
  console.log(`SchoolCode: ${schoolCode}`);

  const responseBody = fs.readFileSync(`./test/mocks/staffDomainResponse_${schoolCode}.json`, { encoding: "utf-8" });

  let statusCode = 200;
  if (req.headers.get("X-Correlation-ID") === "domain-500") {
    statusCode = 500;
  }

  return res(ctx.status(statusCode), ctx.json(JSON.parse(responseBody)));
});

const staffCoreHandler: RequestHandler = rest.get(
  `${process.env.STAFF_CORE_API_URL}/staffPersonals`,
  (req: any, res: any, ctx: any) => {
    const schoolCode = req.headers.get("locationCode");
    console.log(`SchoolCode: ${schoolCode}`);
    const responseBody = fs.readFileSync(`./test/mocks/staffCoreResponse_${schoolCode}.json`, { encoding: "utf-8" });

    return res(ctx.status(200), ctx.json(JSON.parse(responseBody)));
  }
);

const tokenHandler: RequestHandler = rest.post(
  `${process.env.STAFF_DOMAIN_TOKEN_URL}`,
  (req: any, res: any, ctx: any) => {
    return res(
      ctx.status(200),
      ctx.json({
        access_token: "accessToken",
      })
    );
  }
);

export const handlers: RequestHandler[] = [
  staffDomainHandler,
  //staffCoreHandler,
  tokenHandler,
];
