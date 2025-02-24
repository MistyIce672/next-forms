"use client";
import { useState } from "react";
import Papa from "papaparse";

export default function Upload() {
  const [columns, setColumns] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [mappings, setMappings] = useState({
    name: "",
    email: "",
    phone: "",
    username: "",
  });

  const handleMappingChange = (field: string, value: string) => {
    setMappings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
            setColumns(headers);
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
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <select
                  value={mappings.name}
                  onChange={(e) => handleMappingChange("name", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {columns.map((column, index) => (
                    <option key={index} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <select
                  value={mappings.email}
                  onChange={(e) => handleMappingChange("email", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {columns.map((column, index) => (
                    <option key={index} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <select
                  value={mappings.phone}
                  onChange={(e) => handleMappingChange("phone", e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {columns.map((column, index) => (
                    <option key={index} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <select
                  value={mappings.username}
                  onChange={(e) =>
                    handleMappingChange("username", e.target.value)
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select column</option>
                  {columns.map((column, index) => (
                    <option key={index} value={column}>
                      {column}
                    </option>
                  ))}
                </select>
              </div>

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
