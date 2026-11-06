import jsPDF from "jspdf";
import logoUrl from "@/assets/logo.svg";
import {
  CHECKLIST_VARIANTS,
  DEFAULT_VARIANT_KEY,
  type ChecklistVariant,
} from "./checklistVariants";

// Convert SVG asset to PNG data URL at given pixel dimensions
const svgToPngDataUrl = async (
  url: string,
  width: number,
  height: number,
  color?: string,
): Promise<string> => {
  const res = await fetch(url);
  let svgText = await res.text();
  if (color) {
    // Inject fill on root <svg> so all paths inherit
    svgText = svgText.replace(
      /<svg([^>]*)>/,
      `<svg$1 fill="${color}">`,
    );
  }
  const blob = new Blob([svgText], { type: "image/svg+xml" });
  const blobUrl = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const i = new Image();
      i.onload = () => resolve(i);
      i.onerror = reject;
      i.src = blobUrl;
    });
    const scale = 2; // crisp
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(blobUrl);
  }
};

export const generateChecklistPdf = async (
  firstName: string,
  variantKey: string = DEFAULT_VARIANT_KEY,
) => {
  const variant: ChecklistVariant =
    CHECKLIST_VARIANTS[variantKey] ?? CHECKLIST_VARIANTS[DEFAULT_VARIANT_KEY];

  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;

  // Brand colors (from index.css)
  // Primary: #eb6f63   Secondary: #1b2129
  const PRIMARY: [number, number, number] = [235, 111, 99];
  const SECONDARY: [number, number, number] = [27, 33, 41];
  const MUTED: [number, number, number] = [71, 85, 105];
  

  let y = margin;

  const addPageHeader = () => {
    doc.setFillColor(...SECONDARY);
    doc.rect(0, 0, pageWidth, 40, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text("Taghavi Immigration Law", margin, 25);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("Family Immigration Checklist", pageWidth - margin, 25, { align: "right" });
    y = 90; // breathing room below header bar
  };

  const addPageFooter = (pageNum: number) => {
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(0.5);
    doc.line(margin, pageHeight - 40, pageWidth - margin, pageHeight - 40);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    doc.text("© 2026 Taghavi Immigration Law", margin, pageHeight - 24);
    doc.text(`Page ${pageNum}`, pageWidth - margin, pageHeight - 24, { align: "right" });
  };

  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - 60) {
      addPageFooter(doc.getNumberOfPages());
      doc.addPage();
      addPageHeader();
    }
  };

  const heading = (text: string, size = 18) => {
    ensureSpace(size + 14);
    y += 12; // breathing room above heading
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(...SECONDARY);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * (size * 1.15) + 8;
  };

  const subheading = (text: string, keepWith = 60) => {
    // keep the subheading together with at least `keepWith` pts of following content
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 16 + 4 + keepWith);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...PRIMARY);
    doc.text(lines, margin, y);
    y += lines.length * 16 + 4;
  };

  const paragraph = (text: string, opts: { bold?: boolean; color?: [number, number, number] } = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(11);
    doc.setTextColor(...(opts.color ?? MUTED));
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 15 + 6);
    doc.text(lines, margin, y);
    y += lines.length * 15 + 8;
  };

  const bullet = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(text, contentWidth - 18);
    ensureSpace(lines.length * 15 + 4);
    doc.setTextColor(...PRIMARY);
    doc.text("•", margin + 4, y);
    doc.setTextColor(...MUTED);
    doc.text(lines, margin + 18, y);
    y += lines.length * 15 + 4;
  };

  // ---------- COVER PAGE ----------
  doc.setFillColor(...SECONDARY);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(...PRIMARY);
  doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

  // Logo (white) at top
  try {
    const logoPng = await svgToPngDataUrl(logoUrl, 466, 60, "#ffffff");
    const logoW = 200;
    const logoH = (60 / 466) * logoW;
    doc.addImage(logoPng, "PNG", margin, margin, logoW, logoH);
  } catch {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text("TAGHAVI IMMIGRATION LAW", margin, margin + 14);
  }

  // Accent line
  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(3);
  doc.line(margin, 210, margin + 60, 210);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(34);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize("Your Family Immigration Checklist", contentWidth);
  doc.text(titleLines, margin, 250);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(...PRIMARY);
  doc.text(`Personalized for ${firstName}`, margin, 315);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(203, 213, 225);
  doc.text("Prepared by Taghavi Immigration Law", margin, 340);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Trusted by Families Across America", margin, 420);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  const trust = [
    "1,000+ visas approved",
    "4.8 stars from 156 Google reviews",
    "250+ families reunited in the past year",
  ];
  let ty = 445;
  trust.forEach((t) => {
    doc.setTextColor(...PRIMARY);
    doc.text("•", margin, ty);
    doc.setTextColor(203, 213, 225);
    doc.text(t, margin + 14, ty);
    ty += 20;
  });

  // ---------- PAGE 2: SITUATION SUMMARY ----------
  doc.addPage();
  addPageHeader();
  heading("Your Situation Summary", 22);
  paragraph("Based on your quiz answers, here is where you stand.", { bold: true, color: SECONDARY });
  subheading(variant.scenarioLabel);
  paragraph(variant.summary.situation);
  paragraph(variant.summary.timeline);
  paragraph(variant.summary.complexity);

  // ---------- PAGE 3: ACTION ITEMS ----------
  doc.addPage();
  addPageHeader();
  heading("Your Step-by-Step Action Items", 22);
  paragraph("Based on your situation, here is what to do next.", { bold: true, color: SECONDARY });

  variant.steps.forEach((s) => {
    subheading(s.title);
    s.body?.forEach((p) => paragraph(p));
    s.bullets?.forEach(bullet);
    y += 4;
  });

  // ---------- PAGE 4: COMMON MISTAKES (optional) ----------
  if (variant.mistakes && variant.mistakes.length > 0) {
    doc.addPage();
    addPageHeader();
    heading("Common Mistakes to Avoid", 22);
    variant.mistakes.forEach((m) => paragraph(m));
  }

  // ---------- FINAL PAGE: NEXT STEP + ABOUT ----------
  doc.addPage();
  addPageHeader();
  heading("Your Recommended Next Step", 22);
  paragraph(
    "Based on your quiz answers, we recommend booking a free case evaluation with our team. This is a 30-minute conversation where we review your specific situation, confirm your path, give you an estimated timeline, and provide a flat-fee quote if you decide to move forward."
  );
  paragraph(
    "No documents required for the call. No obligation. No sales pitch. Just honest answers from a team that has done this over a thousand times."
  );
  paragraph("Book here: https://tilimmigration.com/schedule-a-case-evaluation", { bold: true, color: PRIMARY });
  paragraph("Or call directly: 804-408-3522", { bold: true, color: SECONDARY });
  paragraph("Quiz takers receive priority scheduling.", { color: SECONDARY });

  y += 8;
  heading("About Taghavi Immigration Law", 18);
  paragraph(
    "Soulmaz Taghavi is a first generation American and the founder of Taghavi Immigration Law. Her parents came from Iran on student visas during a revolution and built their life in the US from scratch. She became an immigration attorney because she grew up watching her family navigate a system nobody explained to them."
  );
  paragraph(
    "Today her firm has helped over a thousand families. 4.8 stars from 156 Google reviews. 250 families reunited in the past year. Flat-fee pricing with no surprises. A multilingual team that speaks Spanish, French, Farsi, Portuguese, and more. And an attorney who personally reviews every case before it is submitted."
  );
  paragraph(
    "The immigrant experience is the American experience. And we are here to make sure your family gets through it with clarity, confidence, and someone in your corner who actually understands."
  );

  // Footers on pages 2-N
  const total = doc.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    addPageFooter(i);
  }

  doc.save(`Family-Immigration-Checklist-${firstName || "Personalized"}.pdf`);
};
