import { NextResponse } from "next/server";
import { performance } from "node:perf_hooks";
import * as XLSX from "xlsx";
import connectDB from "../../lib/db";
import {
  getSalesAnalytics,
  getProductPerformance,
  getCustomerBehavior,
  getCustomerSegments,
  getMarketingAnalytics,
  getPredictions,
  invalidateAnalyticsCache,
} from "../../lib/analytics";

export const runtime = "nodejs";

const REQUIRED_COLUMNS = ["date", "product", "category", "quantity", "price"];

function normaliseRow(row) {
  const output = {};
  REQUIRED_COLUMNS.forEach((column) => {
    if (!(column in row)) {
      throw new Error(`Missing required column "${column}" in uploaded file.`);
    }
  });

  const rawDate = row.date ?? row.Date ?? row.DATE;
  if (!rawDate) {
    throw new Error("Each row must include a date column.");
  }

  const parsedDate = new Date(rawDate);
  if (Number.isNaN(parsedDate.getTime())) {
    throw new Error(`Invalid date value "${rawDate}"`);
  }

  const normalised = {
    date: parsedDate.toISOString().slice(0, 10),
    product: String(row.product ?? row.Product ?? "").trim(),
    category: String(row.category ?? row.Category ?? "").trim(),
    quantity: Number(row.quantity ?? row.Quantity ?? 0),
    price: Number(row.price ?? row.Price ?? 0),
    festival: (row.festival ?? row.Festival ?? "").trim() || null,
  };

  if (!normalised.product) {
    throw new Error("Product value cannot be empty.");
  }
  if (!normalised.category) {
    throw new Error("Category value cannot be empty.");
  }
  if (Number.isNaN(normalised.quantity) || normalised.quantity < 0) {
    throw new Error(
      `Invalid quantity value "${row.quantity ?? row.Quantity}". Quantity must be a non-negative number.`
    );
  }
  if (Number.isNaN(normalised.price) || normalised.price < 0) {
    throw new Error(
      `Invalid price value "${row.price ?? row.Price}". Price must be a non-negative number.`
    );
  }

  return normalised;
}

function parseCsv(buffer) {
  const text = buffer.toString("utf8");
  const [headerLine, ...lineItems] = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (!headerLine) {
    return [];
  }
  const headers = headerLine.split(",").map((item) => item.trim());
  return lineItems.map((line) => {
    const values = line.split(",").map((value) => value.trim());
    return headers.reduce((record, header, index) => {
      record[header] = values[index] ?? "";
      return record;
    }, {});
    });
}

function parseExcel(buffer) {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  return XLSX.utils.sheet_to_json(worksheet, { defval: "" });
}

async function insertRows(rows) {
  if (!rows.length) {
    return 0;
  }

  const pool = connectDB();
  const chunkSize = 1000;
  const insertPromises = [];
  for (let i = 0; i < rows.length; i += chunkSize) {
    const chunk = rows.slice(i, i + chunkSize);
    const placeholders = chunk.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const flatValues = chunk.flatMap((row) => [
      row.date,
      row.product,
      row.category,
      row.quantity,
      row.price,
      row.festival,
    ]);

    insertPromises.push(
      pool.query(
        `INSERT INTO sales_data (date, product, category, quantity, price, festival)
         VALUES ${placeholders}`,
        flatValues
      )
    );
  }

  await Promise.all(insertPromises);
  return rows.length;
}

export async function POST(request) {
  const startTime = performance.now();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded. Please attach a CSV or Excel file." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let rawRows;

    if (file.name.toLowerCase().endsWith(".csv")) {
      rawRows = parseCsv(buffer);
    } else if (file.name.toLowerCase().endsWith(".xlsx")) {
      rawRows = parseExcel(buffer);
    } else {
      return NextResponse.json(
        { error: "Unsupported file type. Please upload a .csv or .xlsx file." },
        { status: 400 }
      );
    }

    const normalisedRows = rawRows.map(normaliseRow);
    const inserted = await insertRows(normalisedRows);

    const sampleRows = normalisedRows.slice(0, 5);
    invalidateAnalyticsCache();

    const [sales, products, customerBehavior, customerSegments, marketing, predictions] =
      await Promise.all([
        getSalesAnalytics(),
        getProductPerformance(),
        getCustomerBehavior(),
        getCustomerSegments(),
        getMarketingAnalytics(),
        getPredictions(),
      ]);

    return NextResponse.json({
      message: "Upload successful",
      total: inserted,
      durationMs: Math.round(performance.now() - startTime),
      sample: sampleRows,
      analytics: {
        sales,
        products,
        customerBehavior,
        customerSegments,
        marketing,
        predictions,
      },
    });
  } catch (error) {
    console.error("Data upload error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process the uploaded file." },
      { status: 500 }
    );
  }
}
