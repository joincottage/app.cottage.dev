import * as React from 'react';
import {Modal, Box} from '@mui/material/';
import EditProfile from './components/EditProfile';
import ProfileData from '../../types/ProfileData';

interface OwnProps {
  modal: boolean;
  closeModal: () => void;
  children: JSX.Element | JSX.Element[];
}

export default function BasicModal({modal, closeModal, children} : OwnProps) {

  return (
      <Modal
        open={modal}
        onClose={closeModal}
        aria-labelledby="profile-modal-title"
      >
        <Box>{children}</Box>
      </Modal>
  );
}
