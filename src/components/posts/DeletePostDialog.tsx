import { PostData } from "@/lib/types";
import { useDeletePostMutation } from "./mutations";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeletePostDialogProps {
  post: PostData;
  open: boolean;
  onClose: () => void;
}
const DeletePostDialog = ({ open, post, onClose }: DeletePostDialogProps) => {
  const mutation = useDeletePostMutation();
  function handleOpenChange(open: boolean) {
    if (!open || !mutation.isPending) {
      onClose();
    }
  }
  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete post?</DialogTitle>
          <DialogDescription>
            About to break up with this post? No hard feelings, right?
          </DialogDescription>
          <DialogFooter>
            <LoadingButton
              loading={mutation.isPending}
              variant="destructive"
              onClick={() => {
                mutation.mutate(post.id, { onSuccess: onClose });
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

export default DeletePostDialog;
