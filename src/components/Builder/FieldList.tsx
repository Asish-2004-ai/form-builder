import React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { formsActions } from "../../store/formsSlice";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

interface Props {
  onEditField?: (id: string) => void;
}

const FieldList: React.FC<Props> = ({ onEditField }) => {
  const dispatch = useDispatch();
  const fields = useSelector((state: RootState) => state.forms.currentForm?.fields || []);

  if (fields.length === 0) {
    return <Typography>No fields added yet.</Typography>;
  }

  return (
    <List>
      {fields.map((f, index) => (
        <ListItem
          key={f.id}
          secondaryAction={
            <Box>
              <IconButton
                onClick={() => index > 0 && dispatch(formsActions.reorderFields({ from: index, to: index - 1 }))}
              >
                <ArrowUpwardIcon />
              </IconButton>
              <IconButton
                onClick={() => index < fields.length - 1 && dispatch(formsActions.reorderFields({ from: index, to: index + 1 }))}
              >
                <ArrowDownwardIcon />
              </IconButton>
              <IconButton onClick={() => dispatch(formsActions.deleteField({ id: f.id }))}>
                <DeleteIcon />
              </IconButton>
            </Box>
          }
        >
          // inside ListItemText:
<ListItemText
  primary={`${f.label} (${f.type}) ${f.required ? "*" : ""}`}
  onClick={() => onEditField?.(f.id)}
  sx={{ cursor: "pointer" }}
/>

        </ListItem>
      ))}
    </List>
  );
};

export default FieldList;
