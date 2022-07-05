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
      if (!req.query.loggedInUserRecordID) {
        res.status(400).send("Bad Request");
        return;
      }

      const { data: tasks } = await getDataFromAirtable({
        tableName: "Task Instances",
        filterByFormula: `{Record ID (from Travel Agent)}="${req.query.loggedInUserRecordID}"`,
      });

      res.json(tasks);

      break;
    }
    case "POST": {
      const tasks = req.body.tasks;
      if (!tasks) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Task Instances").create(tasks, function (err: any, records: any) {
        if (err) {
          console.error(err);
          res.status(500).send("Error creating records");
          return;
        }
        res.status(200).send("Records added");
      });

      break;
    }
    case "PATCH": {
      if (!req.query.recordId || !req.body.fields) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Task Instances").update(
        [
          {
            id: req.query.recordId as string,
            fields: req.body.fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating record");
            return;
          }
          res.json(records[0].fields);
        }
      );

      break;
    }
    case "DELETE": {
      if (!req.query.taskIds) {
        res.status(400).send("Bad Request");
        return;
      }

      const taskIds = (req.query.taskIds as string)?.split(",");

      base("Task Instances").destroy(taskIds, function (err, deletedRecords) {
        if (err) {
          console.error(err);
          res.status(500).send("Error deleting records");
          return;
        }
        console.log("Deleted", deletedRecords?.length, "records");
        res.status(200).send("Records deleted");
      });

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
