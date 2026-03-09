import { FamilyMember } from "@/types/family";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useState } from "react";


interface DeleteMemberDialogProps {
    open: boolean;
    member: FamilyMember | null;
    hasChildren: boolean;
    onClose: () => void;
    onConfirm: (deleteChildren: boolean) => void;
}

export const DeleteMemberDialog: React.FC<DeleteMemberDialogProps> = ({
    open,
    member,
    hasChildren,
    onClose,
    onConfirm,
}) => {
    const [deleteChildren, setDeleteChildren] = useState(true);

    if (!member) return null;

    return (
        <AlertDialog open={open} onOpenChange={(v) => !v && onClose()}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-display">Delete {member.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will remove {member.name} from the family tree.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                {hasChildren && (
                    <div className="flex items-center gap-2 py-2">
                        <Checkbox
                            id="delete-children"
                            checked={deleteChildren}
                            onCheckedChange={(v) => setDeleteChildren(!!v)}
                        />
                        <Label htmlFor="delete-children" className="text-sm">
                            Also delete all descendants (uncheck to reassign children to parent)
                        </Label>
                    </div>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => onConfirm(deleteChildren)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

