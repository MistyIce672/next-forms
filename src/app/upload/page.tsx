"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function Upload() {
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [sampleData, setSampleData] = useState<string[]>([]);
  const [mappings, setMappings] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
  });
  const [validationErrors, setValidationErrors] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
  });

  const validateField = (field: string, value: string) => {
    const columnIndex = columns.indexOf(value);
    const sampleValue = sampleData[columnIndex];

    switch (field) {
      case "name":
        if (!/^[a-zA-Z\s]*$/.test(sampleValue)) {
          return "Invalid name format";
        }
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sampleValue)) {
          return "Invalid email format";
        }
        break;
      case "phone":
        if (!/^\+?[\d\s-()]*$/.test(sampleValue)) {
          return "Invalid phone number format";
        }
        break;
      case "username":
        if (!/^[a-zA-Z0-9_]*$/.test(sampleValue)) {
          return "Invalid username format";
        }
        break;
    }
    return "";
  };

  const handleMappingChange = (field: string, value: string) => {
    const validationError = validateField(field, value);

    setValidationErrors((prev) => ({
      ...prev,
      [field]: validationError,
    }));
    setMappings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const hasErrors = Object.values(validationErrors).some(
      (error) => error !== "",
    );
    if (hasErrors) {
      alert("Please fix validation errors before submitting");
      return;
    }

    console.log("Mappings:", mappings);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError("");

    if (file) {
      if (file.type !== "text/csv") {
        setError("Please upload a CSV file");
        return;
      }

      Papa.parse(file, {
        complete: (results) => {
          if (results.data && results.data.length > 0) {
            const headers = results.data[0] as string[];
            const secondRow = results.data[1] as string[];
            setColumns(headers);
            setSampleData(secondRow);
          }
        },
        header: false,
        error: (error) => {
          setError("Error parsing CSV file: " + error.message);
        },
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-center">CSV File Upload</h1>

        <div className="flex flex-col items-center">
          <label
            htmlFor="fileInput"
            className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
          >
            Choose CSV File
          </label>
          <input
            id="fileInput"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

        {columns.length > 0 && (
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-4">
              {Object.entries(mappings).map(([field, value]) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <select
                    value={value}
                    onChange={(e) => handleMappingChange(field, e.target.value)}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${
                      validationErrors[field as keyof typeof validationErrors]
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <option value="">Select column</option>
                    {columns.map((column, index) => (
                      <option key={index} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                  {validationErrors[field as keyof typeof validationErrors] && (
                    <p className="text-red-500 text-sm mt-1">
                      {validationErrors[field as keyof typeof validationErrors]}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Submit
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
