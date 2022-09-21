import { Storage } from "@google-cloud/storage";

const credentials = JSON.parse(Buffer.from(process.env.GOOGLE_SERVICE_KEY_BASE_64, 'base64').toString('ascii'));

const storage = new Storage({
  credentials,
  //keyFilename: serviceKey,
  projectId: "cottage-328223",
});

const bucket = storage.bucket('cottage-images');

export default bucket;
