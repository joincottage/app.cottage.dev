import { NextApiRequest, NextApiResponse } from "next";
import getDataFromAirtable from "src/apiService/airtable/getDataFromAirtable";
import validateUser from "src/apiService/softr/validateUser";
import cors from "cors";
import runMiddleware from "src/utils/runMiddleware";
import { withSentry } from "@sentry/nextjs";
import corsOptions from "../../../apiService/corsOptions";
import base from "src/apiService/airtable/base";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  await runMiddleware(req, res, cors(corsOptions));

  if (!req.query.jwtToken) {
    res.status(400).send("Bad Request");
    return;
  }
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

      if (!req.query.recordId || req.query.recordId === "null") {
        const { data: clients } = await getDataFromAirtable({
          tableName: "Clients",
          filterByFormula: `{Record ID (from Travel Agent)} = '${req.query.loggedInUserRecordID}'`,
        });

        const { data: taskTemplates } = await getDataFromAirtable({
          tableName: "Task List Templates",
        });

        const tripName = "";
        const workflowTaskLists = [];

        const clientInWorkflow = null;
        const selectedClient = undefined;

        const location = {
          description: "",
          structured_formatting: {
            main_text: "",
            secondary_text: "",
            main_text_matched_substrings: [],
          },
        };

        const locationCoordinates = null;

        const totalTravellerCount = -1;

        const notes = "";

        const data = {
          tripName,
          selectedClient,
          location,
          locationCoordinates,
          taskListInstances: [],
          totalTravellerCount,
          notes,
          airtableRecordData: {},
          clients,
          taskTemplates,
        };

        res.json(data);
      } else {
        const { data: workflowMetadata } = await getDataFromAirtable({
          tableName: "Trips",
          filterByFormula: `AND({Record ID (from Travel Agent)} = '${req.query.loggedInUserRecordID}',{Record ID}='${req.query.recordId}')`,
        });

        const { data: clients } = await getDataFromAirtable({
          tableName: "Clients",
          filterByFormula: `{Record ID (from Travel Agent)} = '${req.query.loggedInUserRecordID}'`,
        });

        const { data: taskListInstances } = await getDataFromAirtable({
          tableName: "Task List Instances",
          filterByFormula: `{Workflow ID} = '${req.query.recordId}'`,
        });

        const { data: taskTemplates } = await getDataFromAirtable({
          tableName: "Task List Templates",
        });

        const tripName = workflowMetadata[0]["Trip Name"] || "";

        const clientInWorkflow = workflowMetadata[0]["Client"]
          ? workflowMetadata[0]["Client"][0]
          : null;
        const selectedClient = clients.find(
          (c: any) => c["Record ID"] === clientInWorkflow
        );

        const location = {
          description: workflowMetadata[0]["Arrival City"] || "",
          structured_formatting: {
            main_text: workflowMetadata[0]["Arrival City"] || "",
            secondary_text: "",
            main_text_matched_substrings: [],
          },
        };

        const locationCoordinates = {
          lat: workflowMetadata[0]["Latitude"],
          lng: workflowMetadata[0]["Longitude"],
        };

        let departureDate = null;
        if (workflowMetadata[0]["Trip Start Date"]) {
          departureDate = workflowMetadata[0]["Trip Start Date"];
        }

        let returnDate = null;
        if (workflowMetadata[0]["Trip End Date"]) {
          returnDate = workflowMetadata[0]["Trip End Date"];
        }

        const totalTravellerCount =
          workflowMetadata[0]["Total Traveller Count"];

        const notes = workflowMetadata[0]["Notes"];

        const data = {
          tripName,
          selectedClient,
          location,
          locationCoordinates,
          taskListInstances,
          totalTravellerCount,
          notes,
          airtableRecordData: workflowMetadata[0],
          clients,
          taskTemplates,
        };

        res.json(data);
      }

      break;
    }
    case "DELETE": {
      if (!req.query.workflowRecordId) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Trips").destroy(
        [req.query.workflowRecordId as string],
        function (err, deletedRecords) {
          if (err) {
            console.error(err);
            res.status(500).send("Error deleting workflow");
            return;
          }
          console.log("Deleted", deletedRecords?.length, "records");
          res.status(200).send("Workflow deleted successfully");
        }
      );

      break;
    }
    case "PATCH": {
      if (!req.query.workflowRecordId || !req.body.fields) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Trips").update(
        [
          {
            id: req.query.workflowRecordId as string,
            fields: req.body.fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error updating workflow");
            return;
          }
          res.json(records[0].fields);
        }
      );

      break;
    }
    case "POST": {
      const fields = req.body.fields;
      if (!fields) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Trips").create(
        [
          {
            fields: req.body.fields,
          },
        ],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error creating workflow");
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
