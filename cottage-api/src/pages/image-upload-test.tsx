import { useState } from "react";
import getLoggedInUserRecordID from "src/utils/getLoggedInUserRecordID";

export default function PrivatePage() {
  const [image, setImage] = useState(null);
  const [createObjectURL, setCreateObjectURL] = useState<string | null>(null);

  const uploadToClient = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const i = event.target.files[0];

      setImage(i);
      setCreateObjectURL(URL.createObjectURL(i));
    }
  };

  const uploadToServer = async (event: any) => {
    const body = new FormData();
    //@ts-ignore
    body.append("file", image);
    const response = await fetch(
      `/api/google-cloud-storage/upload?subfolder=projects&title=asdf&description=fffffff&link=httpsdsafdsafs&loggedInUsersRecordID=${getLoggedInUserRecordID()}`,
      {
        method: "POST",
        body,
      }
    );
  };

  return (
    <div>
      <div>
        <img src={createObjectURL as string} />
        <h4>Select Image</h4>
        <input type="file" name="myImage" onChange={uploadToClient} />
        <button
          className="btn btn-primary"
          type="submit"
          onClick={uploadToServer}
        >
          Send to server
        </button>
      </div>
    </div>
  );
}
