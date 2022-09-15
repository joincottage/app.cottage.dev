import { NextApiRequest, NextApiResponse } from "next";
import base from "src/apiService/airtable/base";
import validateUser from "src/apiService/softr/validateUser";
import cors from "cors";
import runMiddleware from "src/utils/runMiddleware";
import { withSentry } from "@sentry/nextjs";
import corsOptions from "../../../apiService/corsOptions";
import getDataFromAirtable from "src/apiService/airtable/getDataFromAirtable";
import addProject from "src/apiService/airtable/addProject";
import updateProject from "src/apiService/airtable/updateProject";

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
    case "POST": {
      if (
        !req.query.title ||
        !req.query.description ||
        !req.query.link ||
        !req.query.loggedInUsersRecordID ||
        !req.query.imagePath
      ) {
        res.status(400).send("Bad Request");
        return;
      }

      const projectFields = {
        title: req.query.title as string,
        description: req.query.description as string,
        link: req.query.link as string,
        loggedInUsersRecordID: req.query.loggedInUsersRecordID as string,
      };

      if (req.query.imagePath !== "null") {
        projectFields.path = req.query.imagePath as string;
      }

      console.log(JSON.stringify(projectFields, null, 2));
      const project = await addProject(projectFields);
      console.log(JSON.stringify(project, null, 2));

      res.json(project);

      break;
    }
    case "PATCH": {
      if (
        !req.query.title ||
        !req.query.description ||
        !req.query.link ||
        !req.query.loggedInUsersRecordID ||
        !req.query.imagePath ||
        !req.query.projectRecordId
      ) {
        res.status(400).send("Bad Request");
        return;
      }

      const projectFields = {
        title: req.query.title as string,
        description: req.query.description as string,
        link: req.query.link as string,
        loggedInUsersRecordID: req.query.loggedInUsersRecordID as string,
        projectRecordId: req.query.projectRecordId as string,
      };

      if (req.query.imagePath !== "null") {
        projectFields.path = req.query.imagePath as string;
      }

      const project = await updateProject(projectFields);

      res.status(200).json(project);

      break;
    }
    case "DELETE": {
      if (!req.query.recordId) {
        res.status(400).send("Bad Request");
        return;
      }

      base("Projects").destroy(
        [req.query.recordId],
        function (err: any, records: any) {
          if (err) {
            console.error(err);
            res.status(500).send("Error deleting project");
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
