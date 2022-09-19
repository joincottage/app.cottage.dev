import cors from "cors";
import formidable, { File } from "formidable";
import { promises as fs } from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import addProject from "src/apiService/airtable/addProject";
import base from "src/apiService/airtable/base";
import updateProject from "src/apiService/airtable/updateProject";
import { uploadImage } from "src/apiService/google-cloud-storage/upload";
import runMiddleware from "src/utils/runMiddleware";
import corsOptions from "../../../apiService/corsOptions";

// HUNTER: DO NOT REMOVE! This is needed for form.parse to work properly
export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFiles = Array<[string, File]>;

async function uploadProjectToAirtable(req: NextApiRequest, path?: string) {
  console.log("Uploading to Airtable - projects");
  const project = await updateProject({
    title: req.query.title as string,
    description: req.query.description as string,
    link: req.query.link as string,
    loggedInUsersRecordID: req.query.loggedInUsersRecordID as string,
    path,
    projectRecordId: req.query.projectRecordId as string,
  });

  return project;
}

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
    case "POST": {
      if (
        (req.query.subfolder !== "projects" &&
          req.query.subfolder !== "avatars")
      ) {
        res.status(400).send("Bad request");
        return;
      }

      /* Get files using formidable */
      console.log("Getting files via Formidable");
      const imageFile = await new Promise<ProcessedFiles | undefined>(
        (resolve, reject) => {
          console.log("In formidable initialization");
          // parse a file upload
          const form = formidable({});

          console.log("Calling form.parse");
          form.parse(req, (err, fields, { file }) => {
            console.log("In form.parse");
            if (err) {
              res.writeHead(err.httpCode || 400, {
                "Content-Type": "text/plain",
              });
              res.end(String(err));
              return;
            }

            console.log("Parsing files...");

            resolve(file[0]);
          });
        }
      ).catch((e) => {
        console.log(e);
        res.status(500).send("Server Error");
      });

      console.log("File parsing completed.");

      if (!imageFile) {
        console.error(
          "Could not parse image file using Formidable. Check Formidable promise."
        );
        res.status(500).send("Server Error");
        return;
      }

      console.log("Uploading image file to Google Cloud Storage");
      const { fileName, path } = await uploadImage(
        imageFile.filepath,
        imageFile.originalFilename as string,
        req.query.subfolder
      );

      res.status(200).json({
        status: "ok",
        message: "Image was uploaded successfully",
        fileName,
        url: path,
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

export default handler;
