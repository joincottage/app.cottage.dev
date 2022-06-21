export const SET_SELECTED_TASKS = "SET_SELECTED_TASKS";
export interface SetSelectedTasksAction {
  type: typeof SET_SELECTED_TASKS;
  payload: {
    selectedTasks: any[];
  };
}

const setSelectedTasks = (selectedTasks: any[]): SetSelectedTasksAction => ({
  type: SET_SELECTED_TASKS,
  payload: { selectedTasks },
});

export default setSelectedTasks;
