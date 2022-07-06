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
      if (!req.query.recordId) {
        res.status(400).send("Bad Request");
        return;
      }

      const { data: submission } = await getDataFromAirtable({
        tableName: "Tasks",
        filterByFormula: `{Record ID} = '${req.query.recordId}'`,
      });

      res.json(submission);

      break;
    }
    case "POST": {
      const fields = req.body.fields;
      if (!fields) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Tasks").create(
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
      if (!req.query.recordId || !req.body.fields) {
        res.status(400).send("Bad Request");
        return;
      }

      // @ts-ignore
      base("Tasks").update(
        [
          {
            id: req.query.recordId,
            fields: req.body.fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating task");
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
