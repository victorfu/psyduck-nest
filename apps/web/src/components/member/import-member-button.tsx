import { Button, Upload } from "antd";
import { useState } from "react";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import { MemberFields } from "@/lib/member";

export const ImportMemberButton = ({
  onImportSuccess,
  onImportFailed,
}: {
  onImportSuccess?: (members: MemberFields[]) => void;
  onImportFailed?: (error: string) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const processFile = (file: File) => {
    setLoading(true);
    const fileExtension = file.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "xlsx" || fileExtension === "xls") {
      processExcel(file);
    } else if (fileExtension === "csv") {
      processCsv(file);
    } else {
      onImportFailed?.("Please upload an Excel (.xlsx, .xls) or CSV file");
      setLoading(false);
    }

    return false;
  };

  const processExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);

        handleImportedData(jsonData as MemberFields[]);
      } catch (error) {
        onImportFailed?.("Failed to parse Excel file");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processCsv = (file: File) => {
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        handleImportedData(results.data as MemberFields[]);
        setLoading(false);
      },
      error: (error) => {
        onImportFailed?.("Failed to parse CSV file");
        console.error(error);
        setLoading(false);
      },
    });
  };

  const handleImportedData = (data: MemberFields[]) => {
    // Validate and transform the data
    const members: MemberFields[] = data.map((row) => ({
      name: row.name || "",
      email: row.email || "",
      phone: row.phone || "",
    }));

    onImportSuccess?.(members);
  };

  return (
    <Upload
      beforeUpload={processFile}
      showUploadList={false}
      accept=".xlsx,.xls,.csv"
    >
      <Button
        color="primary"
        variant="outlined"
        loading={loading}
        type="primary"
      >
        匯入
      </Button>
    </Upload>
  );
};
