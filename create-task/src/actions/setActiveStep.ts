export const SET_ACTIVE_STEP = "SET_ACTIVE_STEP";
export interface SetActiveStepAction {
  type: typeof SET_ACTIVE_STEP;
  payload: {
    activeStep: number;
  };
}

const setActiveStep = (activeStep: number): SetActiveStepAction => ({
  type: SET_ACTIVE_STEP,
  payload: { activeStep },
});

export default setActiveStep;
