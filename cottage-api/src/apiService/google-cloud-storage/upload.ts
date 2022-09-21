import util from "util";
import bucket from "./bucket";
import uuid from "uuid";

/**
 *
 * @param { File } object file object that will be uploaded
 * @description - This function does the following
 * - It uploads a file to the image bucket on Google Cloud
 * - It accepts an object as an argument with the
 *   "originalname" and "buffer" as keys
 */

export const uploadImage = async (
  filePath: string,
  destFileName: string,
  subfolder: "projects" | "avatars"
) => {
  const fileName = uuid() + "_" + destFileName;
  const path = "thirdwork/" + subfolder + "/" + fileName;
  console.log("path: " + path);

  try {
    await bucket.upload(filePath, {
      destination: path,
    });
  } catch (err) {
    console.error("Failed uploading file to bucket");
    console.error(`filePath: ${filePath}, path: ${path}`);
    console.error(err);
    throw err;
  }

  console.log(`${filePath} uploaded`);
  return { fileName, path };
};
