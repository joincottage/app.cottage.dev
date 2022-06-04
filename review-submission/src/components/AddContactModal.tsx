import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { LoadingButton } from "@mui/lab";
import { Stack, TextField } from "@mui/material";
import Airtable from "airtable";
import React, { useState } from "react";

// FIXME: Move behind API to hide Airtable API key
const base = new Airtable({ apiKey: "keyk0tDEC8slUu1HI" }).base(
  "appG97m5OTveLvpTc"
);

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

interface OwnProps {
  onAddContact(record: any): void;
}

export default function AddContactModal({ onAddContact }: OwnProps) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [formIsSubmitting, setFormIsSubmitting] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [notes, setNotes] = useState("");

  const onSubmit = () => {
    setFormIsSubmitting(true);
    base("Clients").create(
      [
        {
          fields: {
            "First Name": firstName,
            "Last Name": lastName,
            Notes: notes,
            "Travel Agent": [
              window.logged_in_user?.airtable_record_id || "recl4QqKSpFuPg2Iu",
            ],
          },
        },
      ],
      function (err: any, records: any[]) {
        if (err) {
          console.error(err);
          return;
        }
        setFormIsSubmitting(false);
        setOpen(false);
        onAddContact(records[0].fields);
      }
    );
  };

  return (
    <>
      <Button onClick={handleOpen} variant="outlined">
        Add Contact
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Stack direction="row-reverse" spacing={2}>
            <LoadingButton
              loading={formIsSubmitting}
              variant="contained"
              onClick={onSubmit}
            >
              Save
            </LoadingButton>
            <Button variant="outlined" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </Stack>
          <Stack spacing={2} mt={2}>
            <TextField
              id="outlined-basic"
              label="First Name"
              placeholder=""
              onChange={(e) => setFirstName(e.target.value)}
              sx={{ width: "100%" }}
            />
            <TextField
              id="outlined-basic"
              label="Last Name"
              placeholder=""
              onChange={(e) => setLastName(e.target.value)}
              sx={{ width: "100%" }}
            />
            <TextField
              id="outlined-basic"
              label="Notes"
              placeholder="Add your notes"
              onChange={(e) => setNotes(e.target.value)}
              sx={{ width: "100%" }}
              multiline
              rows={4}
            />
          </Stack>
        </Box>
      </Modal>
    </>
  );
}
