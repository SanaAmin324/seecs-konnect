/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState } from "react";

const DocumentUploadContext = createContext();

export const useDocumentUpload = () => useContext(DocumentUploadContext);

export const DocumentUploadProvider = ({ children }) => {
  const [data, setData] = useState({
    file: null,
    course: "",
    className: "",
    academicYear: "",
    category: "",
    description: "",
  });

  return (
    <DocumentUploadContext.Provider value={{ data, setData }}>
      {children}
    </DocumentUploadContext.Provider>
  );
};
