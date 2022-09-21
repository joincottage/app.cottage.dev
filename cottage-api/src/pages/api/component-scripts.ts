import { NextApiRequest, NextApiResponse } from "next";
import { withSentry } from "@sentry/nextjs";
// @ts-ignore
import * as Cottage from "@cottage-software-inc/api-library";
import appConfig from "src/config";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await Cottage.runCottageMiddleware({
    appName: appConfig.appName,
    prodUrl: "",
    requireSoftrAuth: true,
    req,
    res,
  });

  switch (req.method) {
    case "GET": {
      if (!req.query.fileName) {
        res.status(400).send("Bad Request");
        return;
      }

      const data = await Cottage.getAppResource({
        appName: appConfig.appName,
        fileName: req.query.fileName as string,
      });

      res.status(200).send(data);
      break;
    }
    default: {
      console.error(
        `Unsupported method type ${req.method} made to endpoint ${req.url}`
      );
      res.status(404).end();
      break;
    }
  }
}

export default withSentry(handler);
