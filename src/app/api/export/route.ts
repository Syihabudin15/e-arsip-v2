import { NextRequest, NextResponse } from "next/server";
import ExcelJS from "exceljs";

export const POST = async (req: NextRequest) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");
  const data = await req.json();
  // Tambahkan header
  worksheet.columns = data.columns;

  // Tambahkan data
  for (const d of data.rows) {
    worksheet.addRow(d);
  }

  // Buffer hasil Excel
  const buffer = await workbook.xlsx.writeBuffer();

  return new NextResponse(buffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename=${data.filename}.xlsx`,
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
};
