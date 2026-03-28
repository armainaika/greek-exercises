import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { ResultItem } from "@/types/index";

/**
 * POST /api/pdf
 *
 * generates a PDF greek language exercise where verbs are replaced with blanks
 * and their base form is shown in parentheses
 *
 * request body:
 * {
 *   result: ResultItem[]
 * }
 *
 * response:
 * - application/pdf (binary)
 *
 * notes:
 * - uses PDFKit to stream PDF content
 * - fonts must exist in /public/fonts
 */

export async function POST(req: Request) {
  const doc = new PDFDocument();

  // Collect streamed PDF chunks before combining into a single buffer
  const chunks: Uint8Array[] = [];

  const { result }: { result: ResultItem[] } = await req.json();

  /**
   * transform input into exercise text:
   * - verbs → "___________ (base_form)"
   * - text → unchanged
   */
  const exerciseString = result
    .map((item) => {
      if (item.type === "verb") {
        return `___________ (${item.base_form})`;
      }

      return item.text;
    })
    .join("");

  // accumulate PDF stream data
  doc.on("data", (chunk) => chunks.push(chunk));

  // register fonts
  doc.registerFont("inter", "public/fonts/Inter_18pt-Bold.ttf");
  doc.registerFont("mono", "public/fonts/Cousine-Regular.ttf");

  // title
  doc.font("inter").text("fill in the verbs in the right form");
  doc.moveDown();

  // exercise text
  doc.font("mono");
  doc.font("mono").text(exerciseString, {
    width: 450,
    align: "left",
  });

  // finalize pdf stream
  doc.end();

  // wait until PDF stream is fully generated
  await new Promise((resolve) => doc.on("end", resolve));

  const pdfBuffer = Buffer.concat(chunks);

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "inline; filename=file.pdf",
    },
  });
}
