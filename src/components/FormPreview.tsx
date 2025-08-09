import React, { useEffect, useMemo, useState } from "react";
import type { FormSchema, Field } from "../types";
import { evalDerived } from "../utils/derivedEvaluator";
import { validateField } from "../utils/validators";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  RadioGroup,
  Radio,
} from "@mui/material";

type Props = {
  schema: FormSchema;
  onSubmit?: (values: Record<string, any>) => void;
};

export const FormPreview: React.FC<Props> = ({ schema, onSubmit }) => {
  const fields = schema.fields || [];

  const initialValues = useMemo(() => {
    const obj: Record<string, any> = {};
    fields.forEach((f) => {
      obj[f.id] = f.defaultValue ?? (f.type === "checkbox" ? [] : "");
    });
    return obj;
  }, [fields]);

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  const setValue = (id: string, val: any) => {
    setValues((prev) => ({ ...prev, [id]: val }));
  };

  useEffect(() => {
    const ctx = { ...values };

    const derivedFields = fields.filter((f) => f.derived?.isDerived);
    let changed = true;
    let iter = 0;
    const maxIter = 5;
    while (changed && iter < maxIter) {
      changed = false;
      iter++;
      for (const df of derivedFields) {
        const expr = df.derived!.expression;
        const newVal = evalDerived(expr, ctx);
        if (String(ctx[df.id] ?? "") !== String(newVal ?? "")) {
          ctx[df.id] = newVal;
          changed = true;
        }
      }
    }
    setValues((prev) => ({ ...prev, ...ctx }));
  }, [ JSON.stringify(values), fields]);

  useEffect(() => {
    const newErrors: Record<string, string[]> = {};
    fields.forEach((f) => {
      const errs = validateField(values[f.id], f.validations);
      if (errs.length) newErrors[f.id] = errs;
    });
    setErrors(newErrors);
  }, [values, fields]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string[]> = {};
    let hasError = false;
    fields.forEach((f) => {
      const errs = validateField(values[f.id], f.validations);
      if (errs.length) {
        newErrors[f.id] = errs;
        hasError = true;
      }
    });
    setErrors(newErrors);
    if (!hasError) {
      onSubmit?.(values);
    }
  };

  const renderField = (f: Field) => {
    const value = values[f.id];
    const fieldErrors = errors[f.id] ?? [];
    const helper = fieldErrors.join(", ");

    switch (f.type) {
      case "text":
      case "number":
      case "date":
      case "textarea":
        return (
          <FormControl fullWidth margin="normal" key={f.id}>
            <TextField
              label={f.label}
              type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
              value={value ?? ""}
              multiline={f.type === "textarea"}
              onChange={(e) => setValue(f.id, e.target.value)}
              InputLabelProps={f.type === "date" ? { shrink: true } : undefined}
              error={fieldErrors.length > 0}
              helperText={helper}
            />
          </FormControl>
        );

      case "select":
        return (
          <FormControl fullWidth margin="normal" key={f.id} error={fieldErrors.length > 0}>
            <InputLabel>{f.label}</InputLabel>
            <Select
              label={f.label}
              value={value ?? ""}
              onChange={(e) => setValue(f.id, e.target.value)}
            >
              {(f.options || []).map((opt) => (
                <MenuItem key={opt} value={opt}>
                  {opt}
                </MenuItem>
              ))}
            </Select>
            {helper && <FormHelperText>{helper}</FormHelperText>}
          </FormControl>
        );

      case "radio":
        return (
          <FormControl component="fieldset" margin="normal" key={f.id} error={fieldErrors.length > 0}>
            <Typography variant="subtitle1">{f.label}</Typography>
            <RadioGroup
              value={value ?? ""}
              onChange={(e) => setValue(f.id, e.target.value)}
            >
              {(f.options || []).map((opt) => (
                <FormControlLabel key={opt} value={opt} control={<Radio />} label={opt} />
              ))}
            </RadioGroup>
            {helper && <FormHelperText>{helper}</FormHelperText>}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl component="fieldset" margin="normal" key={f.id} error={fieldErrors.length > 0}>
            <Typography variant="subtitle1">{f.label}</Typography>
            {(f.options || []).map((opt) => {
              const checked = Array.isArray(value) ? value.includes(opt) : false;
              return (
                <FormControlLabel
                  key={opt}
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={(e) => {
                        const next = Array.isArray(value) ? [...value] : [];
                        if (e.target.checked) {
                          next.push(opt);
                        } else {
                          const idx = next.indexOf(opt);
                          if (idx >= 0) next.splice(idx, 1);
                        }
                        setValue(f.id, next);
                      }}
                    />
                  }
                  label={opt}
                />
              );
            })}
            {helper && <FormHelperText>{helper}</FormHelperText>}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 720, mx: "auto", p: 2 }}>
      <Typography variant="h6" gutterBottom>{schema.name}</Typography>
      {fields.length === 0 && <Typography>No fields added yet.</Typography>}
      {fields.map((f) => (
        <Box key={f.id}>
          {renderField(f)}
          {f.derived?.isDerived && (
            <Typography variant="caption" sx={{ ml: 1 }}>
              Derived: {String(values[f.id] ?? "")}
            </Typography>
          )}
        </Box>
      ))}

      <Box sx={{ mt: 2 }}>
        <Button variant="contained" type="submit">Submit</Button>
      </Box>
    </Box>
  );
};

export default FormPreview;
