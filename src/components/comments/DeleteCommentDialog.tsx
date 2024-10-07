import { CommentData } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useDeleteCommentMutation } from "./mutation";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

const DeleteCommentDialog = ({
  comment,
  onClose,
  open,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete commnent?</DialogTitle>
          <DialogDescription>
            Are you sure? That comment was a masterpiece... or maybe not 🤔
          </DialogDescription>
          <DialogFooter>
            <LoadingButton
              loading={mutation.isPending}
              variant="destructive"
              onClick={() => {
                mutation.mutate(comment.id, { onSuccess: onClose });
              }}
            >
              Delete
            </LoadingButton>
            <Button
              variant="outline"
              disabled={mutation.isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentDialog;
