import { NextApiRequest, NextApiResponse } from "next";
import getDataFromAirtable from "src/apiService/airtable/getDataFromAirtable";
import validateUser from "src/apiService/softr/validateUser";
import cors from "cors";
import runMiddleware from "src/utils/runMiddleware";
import { withSentry } from "@sentry/nextjs";
import corsOptions from "../../apiService/corsOptions";
import base from "src/apiService/airtable/base";
import axios from "axios";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await runMiddleware(req, res, cors(corsOptions));

  // if (!req.query.jwtToken) {
  //   res.status(400).send("Bad Request");
  //   return;
  // }
  // const isValidUser = await validateUser(req.query.jwtToken as string);
  // if (!isValidUser) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }

  switch (req.method) {
    case "GET": {
      if (!req.query.fileName) {
        res.status(400).send("Bad Request");
        return;
      }
      const assetManifest = await axios.get(
        process.env.ENV === "dev"? 
        "https://cottage-app-dev.vercel.app/asset-manifest.json" : 
        "https://cottage-app.vercel.app/asset-manifest.json"
      );
      const componentInitScriptPath =
        assetManifest.data.files[req.query.fileName as string];

      const componentInitScript = await axios.get(
        process.env.ENV === "dev"? 
        `https://cottage-app-dev.vercel.app${componentInitScriptPath}` : 
        `https://cottage-app.vercel.app${componentInitScriptPath}`
      );

      res.status(200).send(componentInitScript.data);
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
