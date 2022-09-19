import base from "./base";

interface Options {
  title: string;
  description: string;
  link: string;
  loggedInUsersRecordID: string;
  path: string;
}

export default async function addProject({
  title,
  description,
  link,
  loggedInUsersRecordID,
  path,
}: Options): Promise<any> {
  return new Promise((resolve, reject) => {
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

    base("Projects").create(
      [
        {
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
