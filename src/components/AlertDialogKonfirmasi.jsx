import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { useRef } from "react";

const AlertDialogKonfirmasi = ({
  isOpen,
  onClose,
  onConfirm,
  judul = "Konfirmasi",
  isi = "Apakah kamu yakin ingin melanjutkan tindakan ini?",
  teksTombol = "Hapus",
  warnaTombol = "red",
}) => {
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            {judul}
          </AlertDialogHeader>

          <AlertDialogBody>{isi}</AlertDialogBody>

          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Batal
            </Button>
            <Button colorScheme={warnaTombol} onClick={onConfirm} ml={3}>
              {teksTombol}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
};

export default AlertDialogKonfirmasi;
