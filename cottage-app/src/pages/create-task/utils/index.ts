import axios from "axios"
import { API_BASE_URL } from "../../../constants"
import {getJWTToken} from "@cottage-software-inc/client-library/lib/lib/helpers";
import { Task } from "../types/Task"

export const updateTaskInAirtable = async (
    task: any,
    projectContents: string,
    dependencies: string,
    isDraft: boolean
  ): Promise<any> => {
    const taskWithoutID = {
      Name: task.Name,
      "Acceptance Criteria": task["Acceptance Criteria"],
      Description: task.Description,
      "Figma Direct Link": task["Figma Direct Link"],
      "Figma Embed": task["Figma Embed"],
    }

    const response = await axios.patch(
      `${API_BASE_URL}/tasks?recordId=${
        task["Record ID"]
      }&jwtToken=${getJWTToken()}`,
      {
        fields: {
          ...taskWithoutID,
          Contents: projectContents,
          Dependencies: dependencies,
          IsDraft: `${isDraft}`,
        },
      }
    );
  
    return response.data;
  };

export const createTaskInAirtable = async(
  task : Task,
  projectContents : string,
  dependencies: string,
  ) => {
    const url = API_BASE_URL + "/tasks"
    console.log(task)
    console.log(projectContents)
    console.log(dependencies)

    const response = await axios.post(
        url,
        {
            fields : {
              ...task,
              Contents: projectContents,
              Dependencies: dependencies,
              IsDraft: "true"
            }
        }
    )

    return response.data
}

export const getEditorContents = async () => {
  const files = await (window as any).stackblitzVM.getFsSnapshot();
  const dependencies = await (window as any).stackblitzVM.getDependencies();

  return { files, dependencies };
};