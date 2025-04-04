// components/EventTypeDialog.tsx
import {
    Dialog,
    DialogTitle,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
} from "@mui/material";

type Props = {
    open: boolean;
    onClose: () => void;
    onSelect: (activity: string) => void;
    eventTypes: string[];
};

export const EventsDialog = ({ open, onClose, onSelect, eventTypes }: Props) => {
    return (
        <Dialog onClose={onClose} open={open}>
            <DialogTitle>Choisir un type de sortie</DialogTitle>
            <List>
                {eventTypes.map((type) => (
                    <ListItem key={type} disablePadding>
                        <ListItemButton onClick={() => onSelect(type)}>
                            <ListItemText primary={type} />
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => onSelect("Autre")}>
                        <ListItemText primary="Proposer un nouveau type..." />
                    </ListItemButton>
                </ListItem>
            </List>
        </Dialog>
    );
};
