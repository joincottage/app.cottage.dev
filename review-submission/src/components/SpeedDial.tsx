import React, { useState } from "react";
import MuiSpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";

interface Action {
  icon: JSX.Element;
  name: string;
  onClick: () => void;
}
interface OwnProps {
  actions: Action[];
  sx?: any;
}

export default function SpeedDial({ actions, sx }: OwnProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <MuiSpeedDial
      ariaLabel="Cottage options speed dial"
      icon={<SpeedDialIcon />}
      onClose={handleClose}
      onOpen={handleOpen}
      open={open}
      sx={sx}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => {
            action.onClick();
            handleClose();
          }}
        />
      ))}
    </MuiSpeedDial>
  );
}
