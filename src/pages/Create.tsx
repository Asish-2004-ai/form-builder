import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { formsActions } from "../store/formsSlice";
import FieldEditor from "../components/Builder/FieldEditor";
import FieldList from "../components/Builder/FieldList";
import type { Field } from "../types";

const Create: React.FC = () => {
  const dispatch = useDispatch();
  const currentForm = useSelector((state: RootState) => state.forms.currentForm);

  const [editorOpen, setEditorOpen] = useState(false);
  const [editField, setEditField] = useState<Field | undefined>(undefined);

  const [saveDialog, setSaveDialog] = useState(false);
  const [formName, setFormName] = useState(currentForm?.name || "");

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Create Form
      </Typography>

      <FieldList
        onEditField={(id) => {
          const fieldToEdit = currentForm?.fields.find((f) => f.id === id);
          if (fieldToEdit) {
            setEditField(fieldToEdit);
            setEditorOpen(true);
          }
        }}
      />

      <Box sx={{ mt: 2 }}>
        <Button
          variant="contained"
          onClick={() => {
            setEditField(undefined); 
            setEditorOpen(true);
          }}
        >
          Add Field
        </Button>
        <Button
          sx={{ ml: 2 }}
          variant="outlined"
          onClick={() => setSaveDialog(true)}
          disabled={!currentForm || currentForm.fields.length === 0}
        >
          Save Form
        </Button>
      </Box>

      
      <FieldEditor
        open={editorOpen}
        onClose={() => {
          setEditorOpen(false);
          setEditField(undefined);
        }}
        existingFields={currentForm?.fields || []}
        editField={editField}
        onSave={(field) => {
          if (editField) {
            dispatch(formsActions.updateField({ id: editField.id, patch: field }));
          } else {
dispatch(formsActions.addField(field));
          }
        }}
      />

      
      <Dialog open={saveDialog} onClose={() => setSaveDialog(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField
            label="Form Name"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveDialog(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={() => {
              dispatch(formsActions.saveForm({ name: formName }));
              setSaveDialog(false);
            }}
            disabled={!formName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Create;
