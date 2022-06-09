import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import { styled } from "@mui/material/styles";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Step as StepProps } from "../../types/Step";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { AppDataContext } from "../../AppContext";
import setActiveStep from "../../actions/setActiveStep";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 8,
    left: "calc(-50% + 8px)",
    right: "calc(50% + 8px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1058BD",
      backgroundColor: "#1058BD",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#1058BD",
      backgroundColor: "#1058BD",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    backgroundColor: "#eaeaf0",
    border: "1px solid #666",
    height: 4,
    borderRadius: 0,
    margin: "0 -5px",
  },
}));

// @ts-ignore
const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#1058BD",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#1058BD",
    zIndex: 1,
    fontSize: 10,
  },
  "& .QontoStepIcon-circle": {
    width: 12,
    height: 12,
    zIndex: 1,
    borderRadius: "50%",
    backgroundColor: "currentColor",
    border: "1px #666 solid",
  },
  "& .QontoStepIcon-circle.complete": {
    width: 12,
    height: 12,
    borderRadius: "50%",
    backgroundColor: "#1058BD",
  },
}));

function QontoStepIcon(props: {
  active: any;
  completed: boolean;
  className: string;
}) {
  const { active, completed, className } = props;

  return (
    // @ts-ignore
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <div className="QontoStepIcon-circle complete" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

interface OwnProps {
  steps: StepProps[];
}

export default function HorizontalLinearStepper({ steps }: OwnProps) {
  const {
    state: { activeStep },
    dispatch,
  } = React.useContext(AppDataContext);
  const [skipped, setSkipped] = React.useState(new Set<number>());

  console.log("activeStep " + activeStep);

  const isStepOptional = (step: number) => {
    // TODO: should any of the steps be optional? Returning false for now.
    return false;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleReset = () => {
    dispatch(setActiveStep(1));
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        height: "100vh",
      }}
    >
      <Stepper
        sx={{ width: "400px", marginTop: "53px", marginLeft: "25px" }}
        activeStep={Number(activeStep)}
        alternativeLabel
        connector={<QontoConnector />}
      >
        <span style={{ position: "absolute", width: "125px" }}>
          <QontoConnector />
        </span>
        {steps.map((step, index) => {
          const { title: label } = step;
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          if (isStepOptional(index)) {
            labelProps.optional = (
              <Typography variant="caption">Optional</Typography>
            );
          }
          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          if (label === "") {
            return <span></span>;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel StepIconComponent={QontoStepIcon} {...labelProps}>
                <Box
                  sx={{
                    color: "#333",
                    fontWeight: 500,
                    fontSize: "10px",
                    fontFamily: "Source Sans Pro",
                  }}
                >
                  {label}
                </Box>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <React.Fragment>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 166px)",
          }}
        >
          {activeStep || activeStep === 0
            ? steps[Number(activeStep) - 1].component
            : null}
        </Box>
      </React.Fragment>
    </Box>
  );
}
