import React from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store/store";
import { formsActions } from "../store/formsSlice";
import { Box, Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MyFormsPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const savedForms = useSelector((state: RootState) => state.forms.savedForms);

  if (savedForms.length === 0) {
    return <Typography sx={{ p: 2 }}>No saved forms.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 720, mx: "auto", p: 2 }}>
      <Typography variant="h5" gutterBottom>My Forms</Typography>
      <List>
        {savedForms.map((form) => (
          <ListItem
            key={form.id}
            secondaryAction={
              <Box>
                <Button variant="outlined" onClick={() => navigate(`/preview/${form.id}`)}>Preview</Button>
                <Button
                  sx={{ ml: 1 }}
                  color="error"
                  variant="outlined"
                  onClick={() => dispatch(formsActions.deleteSavedForm({ id: form.id }))}
                >
                  Delete
                </Button>
              </Box>
            }
          >
            <ListItemText primary={form.name} secondary={new Date(form.createdAt).toLocaleString()} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MyFormsPage;
