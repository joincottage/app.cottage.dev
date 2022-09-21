import { NextApiRequest, NextApiResponse } from "next";
import base from "src/apiService/airtable/base";
import validateUser from "src/apiService/softr/validateUser";
import cors from "cors";
import runMiddleware from "src/utils/runMiddleware";
import { withSentry } from "@sentry/nextjs";
import corsOptions from "../../../apiService/corsOptions";
import getDataFromAirtable from "src/apiService/airtable/getDataFromAirtable";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await runMiddleware(req, res, cors(corsOptions));

  // const isValidUser = await validateUser(req.query.jwtToken as string);
  // if (!isValidUser) {
  //   res.status(401).send("Unauthorized");
  //   return;
  // }

  switch (req.method) {
    case "GET": {
      const { data: freelancers } = await getDataFromAirtable({
        tableName: "Developer Profiles",
        filterByFormula: `{Featured On Directory Page?}=TRUE()`,
        view: "Grid view",
      });

      res.json(freelancers);

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
