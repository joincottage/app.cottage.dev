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

  const isValidUser = await validateUser(req.query.jwtToken as string);
  if (!isValidUser) {
    res.status(401).send("Unauthorized");
    return;
  }

  switch (req.method) {
    case "GET": {
      if (req.query.submissionId) {
        const { data: submission } = await getDataFromAirtable({
          tableName: "Submissions",
          filterByFormula: `{Record ID} = '${req.query.submissionId}'`,
        });

        res.json(submission);

        return;
      }

      if (!req.query.recordId || !req.query.loggedInUserRecordID) {
        res.status(400).send("Bad Request");
        return;
      }

      const { data: submission } = await getDataFromAirtable({
        tableName: "Submissions",
        filterByFormula: `AND({Record ID (from Users)} = '${req.query.loggedInUserRecordID}', {Record ID (from Tasks)} = '${req.query.recordId}')`,
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

      base("Submissions").create(
        [
          {
            fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error creating records");
            throw err;
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
      base("Submissions").update(
        [
          {
            id: req.query.recordId,
            fields: req.body.fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating submission");
            throw err;
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
