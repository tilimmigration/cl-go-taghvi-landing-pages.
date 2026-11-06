import jsPDF from "jspdf";
import logoUrl from "@/assets/logo.svg";

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
    svgText = svgText.replace(/<svg([^>]*)>/, `<svg$1 fill="${color}">`);
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
    const scale = 2;
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

type VisaSection = {
  title: string;
  who: string;
  checklistIntro?: string;
  checklist: string[];
  extraSubsections?: { heading: string; items: string[] }[];
  documents: string[];
  timeline: string;
  mistakes: string[];
  notes?: string[];
};

const VISA_SECTIONS: VisaSection[] = [
  {
    title: "O-1 Visa (Extraordinary Ability or Achievement)",
    who: "Individuals who have demonstrated extraordinary ability in the sciences, arts, education, business, or athletics through sustained national or international acclaim.",
    checklistIntro: "Eligibility Checklist (check all that apply to you):",
    checklist: [
      "You have received a major nationally or internationally recognized award in your field",
      "You have been a member of associations that require outstanding achievement for membership",
      "You have published material about you in major trade publications or media",
      "You have judged the work of others in your field (peer review, panel judge, etc.)",
      "You have made original scientific, scholarly, or business contributions of major significance",
      "You have authored scholarly articles in professional journals or major media",
      "You have been employed in a critical or essential capacity at organizations with a distinguished reputation",
      "You have commanded a high salary or compensation relative to others in your field",
    ],
    notes: [
      "How many did you check? If you checked 3 or more, you may have a strong O-1 case. If you checked 1 to 2, it is worth discussing with an attorney whether additional evidence could strengthen your profile.",
    ],
    documents: [
      "Detailed resume or CV",
      "Evidence of awards, publications, and media coverage",
      "Letters of recommendation from recognized experts in your field",
      "Employment offer or agent agreement from a U.S. entity",
      "Peer advisory letter from a relevant peer group or organization",
    ],
    timeline: "2 to 6 months for standard processing. Premium processing available (15 business days).",
    mistakes: [
      "Submitting generic recommendation letters that do not speak to specific achievements",
      "Failing to document the significance of your contributions with third-party evidence",
      "Not providing enough context about why your work matters in your specific field",
    ],
  },
  {
    title: "EB-1A (Extraordinary Ability Green Card)",
    who: "Individuals who can demonstrate extraordinary ability in their field and wish to obtain a green card without employer sponsorship.",
    checklistIntro: "Eligibility Checklist (check all that apply to you):",
    checklist: [
      "You have received a major, internationally recognized award (such as a Nobel Prize, Pulitzer, or Olympic medal)",
    ],
    extraSubsections: [
      {
        heading: "OR you meet at least 3 of the following 10 criteria:",
        items: [
          "Nationally or internationally recognized awards or prizes for excellence",
          "Membership in associations requiring outstanding achievement",
          "Published material in professional or major trade publications about you and your work",
          "Participation as a judge of the work of others in your field",
          "Original scientific, scholarly, artistic, athletic, or business contributions of major significance",
          "Authorship of scholarly articles in the field",
          "Display of your work at artistic exhibitions or showcases",
          "Performance of a leading or critical role in distinguished organizations",
          "High salary or remuneration relative to others in the field",
          "Commercial success in the performing arts",
        ],
      },
    ],
    documents: [
      "Comprehensive petition letter explaining how you meet the criteria",
      "Supporting evidence for each criterion claimed",
      "Expert opinion letters from recognized authorities",
      "Evidence of your plan to continue working in your field in the U.S.",
    ],
    timeline: "8 to 12 months for standard processing. Premium processing available.",
    mistakes: [
      "Treating EB-1A like a resume submission instead of building a legal argument",
      "Not providing enough third-party evidence to corroborate your claims",
      "Underestimating the level of detail USCIS expects for each criterion",
    ],
  },
  {
    title: "EB-2 NIW (National Interest Waiver)",
    who: "Professionals with an advanced degree (or equivalent) or exceptional ability who can demonstrate that their work benefits the United States to such a degree that a job offer and labor certification should be waived.",
    checklistIntro: "Eligibility Checklist (check all that apply to you):",
    checklist: [
      "You hold a master's degree or higher (or a bachelor's degree plus 5 years of progressive experience)",
      "Your proposed work has substantial merit and national importance",
      "You are well positioned to advance your proposed endeavor",
      "On balance, it would benefit the United States to waive the job offer requirement",
    ],
    extraSubsections: [
      {
        heading: "Key factors that strengthen an NIW case:",
        items: [
          "Published research or patents",
          "Evidence that your work addresses a national priority (public health, technology, infrastructure, energy, education, national security)",
          "A track record of success in your field",
          "Letters from experts explaining why your work matters at a national level",
          "Evidence that requiring a job offer or labor certification would be impractical given the nature of your work",
        ],
      },
    ],
    documents: [
      "Advanced degree transcripts and credentials evaluation",
      "Detailed petition letter outlining the three-prong Dhanasar framework",
      "Expert recommendation letters",
      "Evidence of publications, citations, grants, patents, or media coverage",
      "Business plan (if applicable for entrepreneurs)",
    ],
    timeline: "6 to 18 months depending on processing center and whether premium processing is used.",
    mistakes: [
      "Failing to clearly articulate the national importance of your work",
      "Relying solely on your own statements instead of third-party evidence",
      "Not connecting your past achievements to your proposed future endeavor",
    ],
  },
  {
    title: "L-1 Visa (Intracompany Transferee)",
    who: "Employees being transferred from a foreign office to a U.S. office of the same company (or parent, subsidiary, or affiliate).",
    checklistIntro: "Eligibility Checklist:",
    checklist: [],
    extraSubsections: [
      {
        heading: "For L-1A (Managers and Executives):",
        items: [
          "You have worked for the company abroad for at least 1 continuous year within the last 3 years",
          "You are being transferred to a managerial or executive position in the U.S.",
          "The U.S. and foreign entities have a qualifying relationship",
        ],
      },
      {
        heading: "For L-1B (Specialized Knowledge):",
        items: [
          "You have worked for the company abroad for at least 1 continuous year within the last 3 years",
          "You possess specialized knowledge of the company's products, services, or processes",
          "You are being transferred to a role that requires that specialized knowledge",
        ],
      },
    ],
    documents: [
      "Evidence of the qualifying corporate relationship",
      "Evidence of your employment abroad",
      "Detailed job description for the U.S. position",
      "Organizational charts for both the foreign and U.S. offices",
      "Company financial documents",
    ],
    timeline: "3 to 6 months. Premium processing available.",
    mistakes: [
      "Not adequately documenting the qualifying relationship between entities",
      "Failing to clearly define the managerial or executive nature of the U.S. role",
      "For L-1B, not demonstrating why your knowledge is truly specialized",
    ],
  },
  {
    title: "E-2 Treaty Investor Visa",
    who: "Citizens of treaty countries who are investing a substantial amount of capital in a U.S. business.",
    checklistIntro: "Eligibility Checklist:",
    checklist: [
      "You are a citizen of a country that has a treaty of commerce and navigation with the United States",
      "You are investing or have invested a substantial amount of capital in a bona fide U.S. enterprise",
      "You are coming to the U.S. to develop and direct the investment enterprise",
      "The investment is not marginal (it must generate income beyond just supporting you and your family)",
    ],
    documents: [
      "Proof of nationality from a treaty country",
      "Evidence of the investment (bank statements, wire transfers, purchase agreements, lease agreements)",
      "Comprehensive business plan",
      "Evidence the enterprise is real and active",
      "Evidence that the investment is substantial relative to the total cost of the business",
    ],
    timeline: "2 to 5 months when filed at a U.S. consulate. Processing times vary by country.",
    mistakes: [
      "Not investing enough relative to the total enterprise value",
      "Submitting a business plan that does not demonstrate the business will generate significant economic activity",
      "Failing to prove that funds are from a lawful source",
    ],
  },
  {
    title: "TN Visa (USMCA Professionals)",
    who: "Canadian and Mexican citizens in specific professional occupations listed under the United States-Mexico-Canada Agreement.",
    checklistIntro: "Eligibility Checklist:",
    checklist: [
      "You are a citizen of Canada or Mexico",
      "You have a job offer from a U.S. employer in a qualifying TN profession (engineers, accountants, scientists, architects, and others listed in the USMCA appendix)",
      "You meet the educational or credential requirements for the specific profession",
      "The position is temporary (though TN status can be renewed indefinitely)",
    ],
    documents: [
      "Proof of Canadian or Mexican citizenship",
      "Degree transcripts and/or professional credentials",
      "Employer support letter describing the role, duties, qualifications, compensation, and duration",
      "For Mexican citizens: approved I-129 petition",
    ],
    timeline: "Canadians can apply directly at the port of entry. Mexican citizens apply through consular processing after I-129 approval (2 to 4 months).",
    mistakes: [
      "The job title or duties not aligning with a qualifying TN profession",
      "Not having proper documentation of degree equivalency",
      "Employer letter lacking sufficient detail about the temporary nature of the position",
    ],
  },
];

export const generateTalentVisaChecklistPdf = async (firstName?: string) => {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 54;
  const contentWidth = pageWidth - margin * 2;

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
    doc.text("The Talent Visa Checklist", pageWidth - margin, 25, { align: "right" });
    y = 90;
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
    y += 12;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(size);
    doc.setTextColor(...SECONDARY);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * (size * 1.15) + 8;
  };

  const subheading = (text: string, keepWith = 60) => {
    const lines = doc.splitTextToSize(text, contentWidth);
    ensureSpace(lines.length * 16 + 4 + keepWith);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(...PRIMARY);
    doc.text(lines, margin, y);
    y += lines.length * 16 + 4;
  };

  const minorHeading = (text: string) => {
    ensureSpace(20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...SECONDARY);
    const lines = doc.splitTextToSize(text, contentWidth);
    doc.text(lines, margin, y);
    y += lines.length * 14 + 4;
  };

  const paragraph = (
    text: string,
    opts: { bold?: boolean; color?: [number, number, number] } = {},
  ) => {
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

  const checkboxItem = (text: string) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(...MUTED);
    const lines = doc.splitTextToSize(text, contentWidth - 22);
    ensureSpace(lines.length * 15 + 4);
    doc.setDrawColor(...PRIMARY);
    doc.setLineWidth(1);
    doc.rect(margin + 2, y - 9, 10, 10);
    doc.text(lines, margin + 20, y);
    y += lines.length * 15 + 4;
  };

  // ---------- COVER PAGE ----------
  doc.setFillColor(...SECONDARY);
  doc.rect(0, 0, pageWidth, pageHeight, "F");
  doc.setFillColor(...PRIMARY);
  doc.rect(0, pageHeight - 8, pageWidth, 8, "F");

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

  doc.setDrawColor(...PRIMARY);
  doc.setLineWidth(3);
  doc.line(margin, 210, margin + 60, 210);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(36);
  doc.setTextColor(255, 255, 255);
  doc.text("The Talent Visa Checklist", margin, 260);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(16);
  doc.setTextColor(...PRIMARY);
  const subLines = doc.splitTextToSize(
    "Your Step-by-Step Guide to Finding the Right U.S. Work Visa",
    contentWidth,
  );
  doc.text(subLines, margin, 295);

  if (firstName) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(13);
    doc.setTextColor(203, 213, 225);
    doc.text(`Prepared for ${firstName}`, margin, 345);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Presented by Taghavi Immigration Law", margin, 420);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(203, 213, 225);
  const contactLines = [
    "Offices: Richmond, VA  |  Washington, DC  |  San Francisco, CA",
    "Website: tilimmigration.com",
    "Phone: 804-408-3522",
  ];
  let cy = 445;
  contactLines.forEach((t) => {
    doc.text(t, margin, cy);
    cy += 20;
  });

  // ---------- INTRODUCTION ----------
  doc.addPage();
  addPageHeader();
  heading("Introduction", 22);
  paragraph(
    "You are reading this because you are serious about building your career or business in the United States. Whether you are a researcher, engineer, entrepreneur, executive, or specialized professional, the U.S. immigration system offers multiple pathways to work authorization and permanent residency.",
  );
  paragraph(
    "The problem is that most people do not know which pathway is the right one for them. They spend months researching online, getting conflicting advice, and worrying about making the wrong choice. One wrong filing can cost you thousands of dollars and months of delays.",
  );
  paragraph(
    "This checklist was designed to change that. It covers the seven most common employment-based visa categories. For each one, you will find the eligibility requirements, the documents typically needed, the general timeline, and the most common mistakes we see in our practice.",
  );
  paragraph(
    "Use this checklist to assess where you stand right now. Then, if you want a professional evaluation of your specific case, we invite you to submit your case information for a complimentary consultation with our team.",
  );
  paragraph(
    "Important: Immigration law is complex and changes frequently. This checklist is for educational purposes and does not constitute legal advice. Every case is unique. For guidance specific to your situation, speak with a qualified immigration attorney.",
    { bold: true, color: SECONDARY },
  );

  // ---------- VISA SECTIONS ----------
  VISA_SECTIONS.forEach((section) => {
    doc.addPage();
    addPageHeader();
    heading(section.title, 20);

    minorHeading("Who it is for");
    paragraph(section.who);

    if (section.checklistIntro) subheading(section.checklistIntro);
    section.checklist.forEach(checkboxItem);

    section.extraSubsections?.forEach((sub) => {
      y += 4;
      minorHeading(sub.heading);
      sub.items.forEach(checkboxItem);
    });

    section.notes?.forEach((n) => paragraph(n, { color: SECONDARY }));

    subheading("Documents typically needed:");
    section.documents.forEach(bullet);

    subheading("Typical timeline:");
    paragraph(section.timeline);

    subheading("Common mistakes:");
    section.mistakes.forEach(bullet);
  });

  // ---------- FINAL PAGE: NEXT STEP ----------
  doc.addPage();
  addPageHeader();
  heading("Your Next Step", 22);
  paragraph(
    "You have now reviewed the seven most common employment-based visa pathways. If you checked multiple boxes in any category, there is a strong chance you have a viable case.",
  );
  paragraph(
    "But a checklist can only take you so far. Immigration cases are won on the details, the evidence, and the legal strategy behind the petition.",
  );
  paragraph("Here is what we recommend:", { bold: true, color: SECONDARY });

  subheading("Step 1: Submit your case information");
  paragraph(
    "Submit your details through our secure online form. It takes about 10 minutes and gives our team the details they need to evaluate your situation.",
  );

  subheading("Step 2: Book your complimentary consultation");
  paragraph(
    "During this 30-minute call, our team will review your background, assess your eligibility, give you a clear recommendation on the best visa path for your situation, and explain the timeline and fees involved.",
  );

  subheading("Step 3: Get your eligibility score");
  paragraph(
    "On the call, you will receive a 1-to-10 eligibility number so you know exactly where you stand.",
  );

  paragraph("There is no obligation and no cost for this initial evaluation.", {
    bold: true,
    color: SECONDARY,
  });

  paragraph("Submit your case information now: tilimmigration.com/case-info", {
    bold: true,
    color: PRIMARY,
  });
  paragraph("Or call us directly: 804-408-3522", { bold: true, color: SECONDARY });

  y += 8;
  paragraph("Taghavi Immigration Law", { bold: true, color: SECONDARY });
  paragraph("Richmond, VA  |  Washington, DC  |  San Francisco, CA");
  paragraph("tilimmigration.com");

  const total = doc.getNumberOfPages();
  for (let i = 2; i <= total; i++) {
    doc.setPage(i);
    addPageFooter(i);
  }

  doc.save(`Talent-Visa-Checklist${firstName ? `-${firstName}` : ""}.pdf`);
};
