import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import { store } from "./store/store";
import type { RootState } from "./store/store";
import Create from "./pages/Create";
import MyFormsPage from "./pages/MyFormsPage";
import FormPreview from "./components/FormPreview";
import Layout from "./components/Layout";

const PreviewWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const form = useSelector((state: RootState) => state.forms.savedForms.find(f => f.id === id));
  if (!form) return <p>Form not found</p>;
  return <FormPreview schema={form} />;
};

const AppRoutes = () => (
 <Layout>
   <Routes>
    <Route path="/" element={<Create />} />
    <Route path="/create" element={<Create />} />
    <Route path="/myforms" element={<MyFormsPage />} />
    <Route path="/preview/:id" element={<PreviewWrapper />} />
  </Routes>
 </Layout>
);

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <nav style={{ padding: "8px" }}>
          <Link to="/create" style={{ marginRight: "8px" }}>Create</Link>
          <Link to="/myforms">My Forms</Link>
        </nav>
        <AppRoutes />
      </Router>
    </Provider>
  );
};

export default App;
