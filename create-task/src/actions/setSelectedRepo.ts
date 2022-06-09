export const SET_SELECTED_REPO = "SET_SELECTED_REPO";
export interface SetSelectedRepoAction {
  type: typeof SET_SELECTED_REPO;
  payload: {
    selectedRepo: any;
  };
}

const setSelectedRepo = (selectedRepo: any): SetSelectedRepoAction => ({
  type: SET_SELECTED_REPO,
  payload: { selectedRepo },
});

export default setSelectedRepo;
