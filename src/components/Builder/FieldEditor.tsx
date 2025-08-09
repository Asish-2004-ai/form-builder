import React, { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from "@mui/material";
import type { FieldType, Field } from "../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (field: Omit<Field, "id">) => void;
  existingFields?: Field[]; 
  editField?: Field; 
}

const fieldTypes: FieldType[] = [
  "text", "number", "textarea", "select", "radio", "checkbox", "date"
];

const FieldEditor: React.FC<Props> = ({
  open,
  onClose,
  onSave,
  existingFields = [],
  editField
}) => {
  const [type, setType] = useState<FieldType>("text");
  const [label, setLabel] = useState("");
  const [required, setRequired] = useState(false);
  const [defaultValue, setDefaultValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [validations, setValidations] = useState({});
  const [isDerived, setIsDerived] = useState(false);
  const [expression, setExpression] = useState("");
  const [parents, setParents] = useState<string[]>([]);

  useEffect(() => {
    if (editField) {
      setType(editField.type);
      setLabel(editField.label);
      setRequired(!!editField.required);
      setDefaultValue(editField.defaultValue ?? "");
      setOptions(editField.options || []);
      setValidations(editField.validations || {});
      if (editField.derived?.isDerived) {
        setIsDerived(true);
        setExpression(editField.derived.expression);
        setParents(editField.derived.parents);
      }
    }
  }, [editField]);

  const handleSave = () => {
    if (!label.trim()) {
      alert("Label is required");
      return;
    }
    if (["select", "radio", "checkbox"].includes(type) && options.length === 0) {
      alert("Options required for this field type");
      return;
    }
    if (isDerived) {
      if (parents.length === 0) {
        alert("Please select at least one parent field");
        return;
      }
      if (!expression.trim()) {
        alert("Expression is required for derived field");
        return;
      }
    }

    const field: Omit<Field, "id"> = {
      type,
      label,
      required,
      defaultValue,
      options:
        ["select", "radio", "checkbox"].includes(type) ? options : undefined,
      validations,
      derived: isDerived
        ? { isDerived: true, parents, expression }
        : undefined
    };
    onSave(field);
    onClose();
    reset();
  };

  const reset = () => {
    setType("text");
    setLabel("");
    setRequired(false);
    setDefaultValue("");
    setOptions([]);
    setValidations({});
    setIsDerived(false);
    setExpression("");
    setParents([]);
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>{editField ? "Edit Field" : "Add Field"}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value as FieldType)}
          >
            {fieldTypes.map((ft) => (
              <MenuItem key={ft} value={ft}>
                {ft}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Label"
          fullWidth
          margin="normal"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={required}
              onChange={(e) => setRequired(e.target.checked)}
            />
          }
          label="Required"
        />

        {["select", "radio", "checkbox"].includes(type) && (
          <TextField
            label="Options (comma separated)"
            fullWidth
            margin="normal"
            value={options.join(",")}
            onChange={(e) =>
              setOptions(
                e.target.value.split(",").map((o) => o.trim()).filter(Boolean)
              )
            }
          />
        )}

        <TextField
          label="Default Value"
          fullWidth
          margin="normal"
          value={defaultValue}
          onChange={(e) => setDefaultValue(e.target.value)}
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Validations
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={(validations as any).notEmpty || false}
              onChange={(e) =>
                setValidations({ ...validations, notEmpty: e.target.checked })
              }
            />
          }
          label="Not Empty"
        />

        <TextField
          label="Min Length"
          type="number"
          margin="normal"
          value={(validations as any).minLength || ""}
          onChange={(e) =>
            setValidations({
              ...validations,
              minLength: Number(e.target.value) || undefined
            })
          }
        />
        <TextField
          label="Max Length"
          type="number"
          margin="normal"
          value={(validations as any).maxLength || ""}
          onChange={(e) =>
            setValidations({
              ...validations,
              maxLength: Number(e.target.value) || undefined
            })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={(validations as any).email || false}
              onChange={(e) =>
                setValidations({ ...validations, email: e.target.checked })
              }
            />
          }
          label="Email"
        />

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Derived Field
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isDerived}
              onChange={(e) => setIsDerived(e.target.checked)}
            />
          }
          label="Is Derived"
        />
        {isDerived && (
          <>
            <FormControl fullWidth margin="normal">
              <InputLabel>Parent Fields</InputLabel>
              <Select
                multiple
                value={parents}
                onChange={(e) => setParents(e.target.value as string[])}
              >
                {existingFields.length === 0 ? (
                  <MenuItem disabled>No available fields</MenuItem>
                ) : (
                  existingFields
                    .filter((f) => f.id !== editField?.id) // avoid self-dependency
                    .map((f) => (
                      <MenuItem key={f.id} value={f.id}>
                        {f.label}
                      </MenuItem>
                    ))
                )}
              </Select>
            </FormControl>
            <TextField
              label="Expression"
              fullWidth
              margin="normal"
              value={expression}
              onChange={(e) => setExpression(e.target.value)}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            reset();
          }}
        >
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          {editField ? "Update" : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FieldEditor;
