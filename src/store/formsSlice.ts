import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { FormSchema, Field } from "../types";
import { loadForms, saveForms } from "../utils/storage";
import { v4 as uuid } from "uuid";

interface FormsState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
}

const initialSaved = loadForms();

const initialState: FormsState = {
  currentForm: {
    id: uuid(),
    name: "Untitled",
    createdAt: Date.now(),
    fields: [],
  },
  savedForms: initialSaved,
};

const slice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    setCurrentForm(state, action: PayloadAction<FormSchema>) {
      state.currentForm = action.payload;
    },
 addField(state, action: PayloadAction<Omit<Field, "id">>) {
  const f: Field = { ...action.payload, id: uuid() };
  state.currentForm?.fields.push(f);
}

,
    updateField(state, action: PayloadAction<{ id: string; patch: Partial<Field> }>) {
      const idx = state.currentForm?.fields.findIndex((f) => f.id === action.payload.id);
      if (idx !== undefined && idx >= 0) {
        state.currentForm!.fields[idx] = { ...state.currentForm!.fields[idx], ...action.payload.patch };
      }
    },
    deleteField(state, action: PayloadAction<{ id: string }>) {
      state.currentForm!.fields = state.currentForm!.fields.filter((f) => f.id !== action.payload.id);
    },
    reorderFields(state, action: PayloadAction<{ from: number; to: number }>) {
      const f = state.currentForm!.fields;
      const [moved] = f.splice(action.payload.from, 1);
      f.splice(action.payload.to, 0, moved);
    },
    saveForm(state, action: PayloadAction<{ name?: string } | undefined>) {
      if (!state.currentForm) return;
      if (action?.payload?.name) state.currentForm.name = action.payload.name;
      state.currentForm.createdAt = Date.now();
      state.savedForms.push(state.currentForm);
      saveForms(state.savedForms);
      state.currentForm = { id: uuid(), name: "Untitled", createdAt: Date.now(), fields: [] };
    },
    loadSavedForms(state) {
      state.savedForms = loadForms();
    },
    deleteSavedForm(state, action: PayloadAction<{ id: string }>) {
      state.savedForms = state.savedForms.filter((f) => f.id !== action.payload.id);
      saveForms(state.savedForms);
    },
  },
});

export const formsActions = slice.actions;
export default slice.reducer;
