import base from "./base";

interface Options {
  title: string;
  description: string;
  link: string;
  loggedInUsersRecordID: string;
  path?: string;
  projectRecordId: string;
}

export default async function updateProject({
  title,
  description,
  link,
  loggedInUsersRecordID,
  path,
  projectRecordId,
}: Options): Promise<any> {
  console.log(`Updating project: ${JSON.stringify(arguments[0], null, 2)}`);

  const fields = {
    "Project Title": title,
    "Project Description": description,
    Link: link,
    Developer: [loggedInUsersRecordID],
  };
  if (path) {
    fields["Cover Image"] = [
      {
        url: "https://storage.googleapis.com/cottage-images/" + path,
      },
    ];
  }

  return new Promise((resolve, reject) => {
    base("Projects").update(
      [
        {
          id: projectRecordId,
          fields,
        },
      ],
      function (err: any, records: any) {
        if (err) {
          console.error(err);
          res.status(500).send("Error creating records");
          reject(err);
          return;
        }
        console.log("Airtable upload completed successfully.");
        resolve(records[0].fields);
      }
    );
  });
}
