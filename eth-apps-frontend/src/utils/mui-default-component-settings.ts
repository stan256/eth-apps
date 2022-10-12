import {SxProps} from "@mui/system";
import {Theme} from "@mui/material";

export const defaultModalStyle: SxProps<Theme> = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: 500,
    width: '100%',
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 3,
    p: 3,
}

export const defaultFabStyle: SxProps<Theme> = {
    position: 'absolute',
    bottom: 16,
    right: 16,
}