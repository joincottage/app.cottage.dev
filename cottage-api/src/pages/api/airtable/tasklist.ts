import { NextApiRequest, NextApiResponse } from "next";
import base from "src/apiService/airtable/base";
import validateUser from "src/apiService/softr/validateUser";
import cors from "cors";
import runMiddleware from "src/utils/runMiddleware";
import { withSentry } from "@sentry/nextjs";
import corsOptions from "../../../apiService/corsOptions";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await runMiddleware(req, res, cors(corsOptions));

  const isValidUser = await validateUser(req.query.jwtToken as string);
  if (!isValidUser) {
    res.status(401).send("Unauthorized");
    return;
  }

  switch (req.method) {
    case "POST": {
      const fields = req.body.fields;
      if (!fields) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Task List Instances").create(
        [
          {
            fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error creating records");
            return;
          }
          res.json(records[0].fields);
        }
      );

      break;
    }
    case "PATCH": {
      if (!req.query.taskListId || !req.body.fields) {
        res.status(400).send("Bad Request");
        return;
      }

      // @ts-ignore
      base("Task List Instances").update(
        [
          {
            id: req.query.taskListId,
            fields: req.body.fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating tasklist");
            return;
          }
          res.json(records[0].fields);
        }
      );

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
