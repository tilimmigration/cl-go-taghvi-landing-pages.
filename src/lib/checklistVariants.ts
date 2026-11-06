// Content variants for the personalized Family Immigration Checklist PDF.
// Each variant maps to a quiz-answer scenario.

export type ChecklistStep = {
  title: string;
  body?: string[]; // paragraphs
  bullets?: string[];
};

export type ChecklistVariant = {
  key: string;
  scenarioLabel: string; // shown as subheading on Situation Summary page
  summary: {
    situation: string;
    timeline: string;
    complexity: string;
  };
  steps: ChecklistStep[];
  mistakes?: string[]; // optional "Common Mistakes" page
};

export const CHECKLIST_VARIANTS: Record<string, ChecklistVariant> = {
  // Variant 1 — original default
  "visa-spouse-clean": {
    key: "visa-spouse-clean",
    scenarioLabel:
      "US Citizen + Married + Spouse Entered With a Visa + Spouse in the US + No Prior Filings + No Complications",
    summary: {
      situation:
        "Your Situation: You are in a strong position. As a US citizen married to someone who entered the US legally, you likely qualify to file for a marriage green card through what is called adjustment of status. This means your spouse can apply for their green card without leaving the country.",
      timeline:
        "Estimated Timeline: 12 to 18 months from filing to approval, depending on USCIS processing times in your area.",
      complexity:
        "Complexity Level: Standard. This is the most common type of case we handle and we have done it hundreds of times.",
    },
    steps: [
      {
        title: "Step 1: Gather your core documents.",
        bullets: [
          "Your US birth certificate or naturalization certificate",
          "Your marriage certificate",
          "Your spouse's passport",
          "Your spouse's I-94 record (arrival/departure record)",
          "Evidence of your bona fide marriage (joint bank accounts, lease, photos, etc.)",
        ],
      },
      {
        title: "Step 2: Do NOT file anything without professional guidance.",
        bullets: [
          "The wrong form, the wrong timing, or missing evidence can trigger delays or denials",
          "Even standard cases benefit from attorney review",
        ],
      },
      {
        title: "Step 3: Book a free case evaluation.",
        bullets: [
          "30 minutes with our team",
          "We will review your situation, confirm your path, and give you a clear timeline and flat-fee quote",
          "No cost. No obligation.",
        ],
      },
      {
        title: "Step 4: Understand the timeline.",
        bullets: [
          "Once you engage an attorney and submit your documents, the firm handles everything from forms to filing to interview preparation",
          "Your job is to provide the documents and show up for the interview",
          "Our job is everything else",
        ],
      },
      {
        title: "Step 5: Do not wait.",
        bullets: [
          "Processing times under this administration are getting longer",
          "Every month you delay is a month added to the other end",
          "The sooner you start, the sooner your family is protected",
        ],
      },
    ],
    mistakes: [
      "Mistake 1: Assuming marriage automatically gives your spouse legal status. It does not. There is a multi-step legal process required.",
      "Mistake 2: Hiring a notario to handle your paperwork. A notario is not a lawyer. One wrong form can trigger a denial or a 10-year bar.",
      "Mistake 3: Filing the wrong form. Different situations require different forms. Filing I-130 when you need I-485 or vice versa can set your case back years.",
      "Mistake 4: Waiting because you are scared of the cost. The cost of waiting is almost always higher than the cost of starting. And the first step, the case evaluation, is free.",
      "Mistake 5: Trying to do it yourself based on what you read online. Immigration law changes constantly. What worked for someone else may not work for you. What you read on Reddit may be wrong. Get a professional assessment.",
    ],
  },

  // Variant 2 — undocumented entry spouse, in the US, no prior filings
  "undocumented-spouse": {
    key: "undocumented-spouse",
    scenarioLabel:
      "US Citizen + Married + Spouse Entered Undocumented + Spouse in the US + No Prior Filings",
    summary: {
      situation:
        "Your Situation: Your case is viable but more complex than a standard adjustment of status. Because your spouse entered without inspection, they may not be eligible to adjust status inside the US. Depending on the circumstances, there may be a waiver available or your spouse may need to go through consular processing at a US embassy abroad. There are also potential bars to re-entry (3-year or 10-year bars) that need to be evaluated carefully.",
      timeline:
        "Estimated Timeline: This varies significantly. It could be 1 to 3 years for a straightforward waiver case, or 3 to 7 years for more complex situations. An attorney assessment is strongly recommended.",
      complexity:
        "Complexity Level: Moderate to High. This type of case requires careful legal strategy to avoid triggering bars or complications.",
    },
    steps: [
      {
        title: "Step 1: Do not file anything on your own.",
        body: [
          "This is the single most important step. When a spouse entered without inspection, filing the wrong form or at the wrong time can trigger serious consequences including a 3-year or 10-year bar from re-entry to the United States.",
          "Do not let a notario, a family member, or an online guide tell you what to file. This type of case requires an attorney who handles undocumented-entry cases regularly.",
        ],
      },
      {
        title: "Step 2: Do not leave the country.",
        body: [
          "If your spouse is currently in the US and entered without documentation, leaving the country, even temporarily, can trigger an automatic bar on returning. Depending on how long they have been here without status, the bar can be 3 years or 10 years.",
          "Do not travel internationally until you have spoken with an attorney and understand the specific risks.",
        ],
      },
      {
        title: "Step 3: Gather what you can, but do not stress about perfection.",
        bullets: [
          "Your US birth certificate or naturalization certificate",
          "Your marriage certificate",
          "Your spouse's passport or any identity document from their home country",
          "Any records of your spouse's entry or presence in the US (even informal ones)",
          "Evidence of your bona fide marriage (joint bank accounts, lease, utility bills, photos, insurance documents, tax returns filed jointly)",
          "If your spouse has any prior immigration filings, court notices, or correspondence from USCIS or immigration court, gather those as well",
        ],
      },
      {
        title: "Step 4: Understand that there ARE options.",
        body: [
          "Many couples in this situation assume there is no path forward. That is not true. Depending on the specific circumstances, there may be a provisional unlawful presence waiver (I-601A) available, or there may be other forms of relief.",
          "Some couples qualify for adjustment of status inside the US if the spouse entered legally at some point, even briefly.",
          "The path is more complex but it is not impossible. We handle cases like yours regularly.",
        ],
      },
      {
        title: "Step 5: Book a free case evaluation immediately.",
        body: [
          "This type of case should not wait. The longer you delay, the more complicated the legal landscape becomes, especially under the current administration.",
          "On the call, we will review your specific situation, determine whether a waiver is available, and explain the full path including timeline and cost.",
          "30 minutes. No cost. No obligation. No judgment about how your spouse entered the country. We are here to find the path, not to judge the journey.",
          "Book here: https://tilimmigration.com/schedule-a-case-evaluation",
        ],
      },
    ],
  },

  // Variant 3 — US Citizen + Fiance + Fiance Outside the US (K-1)
  "fiance-abroad": {
    key: "fiance-abroad",
    scenarioLabel: "US Citizen + Fiance + Fiance Outside the US",
    summary: {
      situation:
        "Your Situation: You are likely looking at a K-1 fiance visa. This allows your fiance to enter the US for the purpose of getting married within 90 days of arrival. After marriage, you file for a marriage green card.",
      timeline:
        "Estimated Timeline: 6 to 12 months for the fiance visa, then 12 to 18 months for the green card after marriage.",
      complexity:
        "Complexity Level: Standard. This is a well-established process and we handle fiance visas regularly.",
    },
    steps: [
      {
        title: "Step 1: Confirm your eligibility to file a K-1 fiance visa.",
        bullets: [
          "You must be a US citizen. Permanent residents cannot file a K-1 fiance visa petition.",
          "You must have met your fiance in person at least once within the last two years. There are very limited exceptions to this requirement for certain cultural or religious situations.",
          "You must both be legally free to marry. If either of you has been previously married, those marriages must be legally terminated through divorce or annulment before you can file.",
        ],
      },
      {
        title: "Step 2: Gather your core documents.",
        bullets: [
          "Your US birth certificate or naturalization certificate (proof of citizenship)",
          "Your passport",
          "Your fiance's passport",
          "Proof that you have met in person within the last two years (photos together with dates and locations, boarding passes, travel itineraries, hotel receipts, passport stamps)",
          "If either of you was previously married, proof of divorce or annulment (final decree)",
          "Evidence of your genuine relationship (photos, messages, call logs, travel history, letters, evidence of communication over time)",
        ],
      },
      {
        title: "Step 3: Understand the timeline.",
        bullets: [
          "The K-1 fiance visa process typically takes 6 to 12 months from the date of filing.",
          "Once your fiance receives the visa, they have 6 months to enter the US.",
          "Once they enter the US, you must get married within 90 days.",
          "After marriage, you file for a marriage green card, which takes an additional 12 to 18 months.",
          "Total timeline from start to green card: approximately 18 to 30 months.",
        ],
      },
      {
        title: "Step 4: Do not attempt to use a tourist visa as a workaround.",
        body: [
          "Some couples try to bring their fiance to the US on a tourist visa with the intention of getting married. This is considered visa fraud and can result in a permanent bar from immigration benefits. Use the K-1 process. It exists for exactly this situation.",
        ],
      },
      {
        title: "Step 5: Book a free case evaluation.",
        body: [
          "We will review your situation, confirm your eligibility, walk you through the K-1 process step by step, and give you a flat-fee quote.",
          "If there are any complications, such as a prior visa denial, a criminal record, or a previous immigration issue for either party, we will identify those early and build a strategy around them.",
          "30 minutes. No cost. No obligation.",
          "Book here: https://tilimmigration.com/schedule-a-case-evaluation",
        ],
      },
    ],
    mistakes: [
      "Mistake 1: Assuming marriage automatically gives your spouse legal status. It does not. There is a multi-step legal process required.",
      "Mistake 2: Hiring a notario to handle your paperwork. A notario is not a lawyer. One wrong form can trigger a denial or a 10-year bar.",
      "Mistake 3: Filing the wrong form. Different situations require different forms. Filing I-130 when you need I-485 or vice versa can set your case back years.",
      "Mistake 4: Waiting because you are scared of the cost. The cost of waiting is almost always higher than the cost of starting. And the first step, the case evaluation, is free.",
      "Mistake 5: Trying to do it yourself based on what you read online. Immigration law changes constantly. What worked for someone else may not work for you. What you read on Reddit may be wrong. Get a professional assessment.",
    ],
  },

  // Variant 4 — US Citizen petitioning Parent / Sibling / Adult Child Abroad
  "family-abroad": {
    key: "family-abroad",
    scenarioLabel: "US Citizen + Parent or Sibling or Child Outside the US",
    summary: {
      situation:
        "Your Situation: As a US citizen, you have the ability to petition for certain family members to receive green cards. Parents of US citizens are considered immediate relatives, which means there is no wait for a visa number. Siblings and adult children may face longer wait times depending on the category and the country of origin.",
      timeline:
        "Estimated Timeline: Parents: 1 to 2 years. Siblings: varies widely, potentially 10 to 20 years depending on country. Adult children: varies by category.",
      complexity:
        "Complexity Level: Standard for parents. Variable for siblings and adult children.",
    },
    steps: [
      {
        title: "Step 1: Understand which category your family member falls into.",
        body: [
          "Immigration law treats different family relationships differently. The category determines the wait time and the process.",
        ],
        bullets: [
          "Parents of US citizens: classified as immediate relatives. No wait for a visa number. This is the fastest family-based category.",
          "Unmarried children (under 21) of US citizens: also classified as immediate relatives. No wait for a visa number.",
          "Married children of US citizens: not immediate relatives. There may be a multi-year wait depending on country of origin.",
          "Siblings of US citizens: longest wait times. Depending on the country of origin, the backlog can be 10 to 20 years or more.",
        ],
      },
      {
        title: "Step 2: Gather your core documents.",
        bullets: [
          "Your US birth certificate or naturalization certificate (proof you are a US citizen)",
          "Your passport",
          "Your family member's passport and birth certificate",
          "Proof of the family relationship: for parents, your birth certificate showing their names; for children, their birth certificate showing your name; for siblings, both of your birth certificates showing the same parent",
          "If any names have changed due to marriage or legal name change, include documentation of the name change",
        ],
      },
      {
        title: "Step 3: Be realistic about timelines.",
        bullets: [
          "For parents: the process typically takes 1 to 2 years from filing to their arrival in the US.",
          "For unmarried children under 21: similar timeline to parents, approximately 1 to 2 years.",
          "For married children: the wait time varies by country but can be 5 to 12 years.",
          "For siblings: the wait time varies by country but can be 10 to 20 years or more. Some countries have backlogs exceeding 20 years.",
        ],
        body: [
          "These timelines are set by visa bulletin dates and are largely outside anyone's control. An attorney cannot speed up the visa bulletin, but they can make sure everything is filed correctly so you do not lose your place in line.",
        ],
      },
      {
        title: "Step 4: File sooner rather than later.",
        body: [
          "For categories with long wait times, your place in line is determined by your priority date, which is the date USCIS receives your petition. Every month you delay filing is a month added to an already long wait.",
          "If you are considering petitioning for a sibling or adult child, filing now secures your priority date even if the wait is many years away.",
        ],
      },
      {
        title: "Step 5: Book a free case evaluation.",
        body: [
          "We will confirm which category your family member falls into, explain the realistic timeline, and walk you through the process and cost.",
          "If there are complications, such as prior immigration issues, criminal history, or prior denials for your family member, we will identify those early.",
          "30 minutes. No cost. No obligation.",
          "Book here: https://tilimmigration.com/schedule-a-case-evaluation",
        ],
      },
    ],
    mistakes: [
      "Mistake 1: Assuming marriage automatically gives your spouse legal status. It does not. There is a multi-step legal process required.",
      "Mistake 2: Hiring a notario to handle your paperwork. A notario is not a lawyer. One wrong form can trigger a denial or a 10-year bar.",
      "Mistake 3: Filing the wrong form. Different situations require different forms. Filing I-130 when you need I-485 or vice versa can set your case back years.",
      "Mistake 4: Waiting because you are scared of the cost. The cost of waiting is almost always higher than the cost of starting. And the first step, the case evaluation, is free.",
      "Mistake 5: Trying to do it yourself based on what you read online. Immigration law changes constantly. What worked for someone else may not work for you. What you read on Reddit may be wrong. Get a professional assessment.",
    ],
  },

  // Variant 5 — Previously Filed With Notario or On Own + Complications or Unsure
  "notario-complications": {
    key: "notario-complications",
    scenarioLabel: "Previously Filed With Notario or On Own + Complications or Unsure",
    summary: {
      situation:
        "Your Situation: You have already started the process but you are not sure if it was done correctly. This is more common than you might think. We see clients every week who come to us after a notario or a previous attorney filed paperwork that contained errors, missed deadlines, or used the wrong forms.",
      timeline:
        "Estimated Timeline: Varies significantly based on what was filed and what corrections are needed. Some cases can be resolved in a few months. Others may take several years if there are serious errors or bars to overcome.",
      complexity:
        "Complexity Level: Depends on what was filed and whether there are errors on the record.",
    },
    steps: [
      {
        title: "Step 1: Stop filing anything new until you know what was filed before.",
        body: [
          "If a notario, a community helper, or you yourself filed paperwork with USCIS, it is critical to find out exactly what was submitted. Filing additional applications on top of an error can compound the problem and create new complications.",
          "Do not submit any new forms, applications, or payments to USCIS until an attorney has reviewed what is already on file.",
        ],
      },
      {
        title: "Step 2: Gather everything you have from the prior filing.",
        bullets: [
          "Any receipts from USCIS (receipt notices start with IOE, SRC, EAC, WAC, LIN, or NBC followed by numbers)",
          "Copies of any forms that were filed (I-130, I-485, I-751, N-400, or any other form)",
          "Any correspondence from USCIS, including approval notices, denial notices, requests for evidence, or notices to appear",
          "Any documents you gave to the notario or previous attorney",
          "Receipts for any payments made, either to USCIS or to the person who helped you",
        ],
        body: [
          "If you do not have copies of what was filed, that is okay. We can request your immigration file from USCIS through a Freedom of Information Act request.",
        ],
      },
      {
        title: "Step 3: Understand what can go wrong with a notario filing.",
        bullets: [
          "Wrong form filed: this can result in a denial that goes on your record and makes future applications harder.",
          "Missing evidence: if the application was submitted without proper supporting documents, USCIS may have issued a request for evidence or denied the case outright.",
          "Wrong category: if the notario filed under the wrong immigration category, the entire application may be invalid.",
          "Missed deadlines: if a response to a request for evidence was not filed on time, the case may have been automatically denied.",
          "Fraudulent information: in some cases, notarios include false information without the client's knowledge. This can create serious legal problems including potential bars to future immigration benefits.",
        ],
      },
      {
        title: "Step 4: Do not panic.",
        body: [
          "Most notario mistakes can be fixed. Some require filing a motion to reopen. Some require starting over with a new application. Some require a legal brief explaining the error and why it should not be held against you.",
          "The key is to identify the error, understand its impact, and build a strategy to address it.",
          "We see these cases every week. You are not the first person this has happened to and you will not be the last.",
        ],
      },
      {
        title: "Step 5: Book a free case evaluation immediately.",
        body: [
          "Bring whatever documents you have. If you have nothing, that is fine too.",
          "We will review what was filed, identify any errors or complications, and explain your options for moving forward.",
          "If you need us to request your immigration file from USCIS, we can start that process.",
          "The sooner we review what happened, the sooner we can build a plan to fix it.",
          "30 minutes. No cost. No obligation.",
          "Book here: https://tilimmigration.com/schedule-a-case-evaluation",
        ],
      },
    ],
    mistakes: [
      "Mistake 1: Assuming marriage automatically gives your spouse legal status. It does not. There is a multi-step legal process required.",
      "Mistake 2: Hiring a notario to handle your paperwork. A notario is not a lawyer. One wrong form can trigger a denial or a 10-year bar.",
      "Mistake 3: Filing the wrong form. Different situations require different forms. Filing I-130 when you need I-485 or vice versa can set your case back years.",
      "Mistake 4: Waiting because you are scared of the cost. The cost of waiting is almost always higher than the cost of starting. And the first step, the case evaluation, is free.",
      "Mistake 5: Trying to do it yourself based on what you read online. Immigration law changes constantly. What worked for someone else may not work for you. What you read on Reddit may be wrong. Get a professional assessment.",
    ],
  },

  // Variant 6 — Prior Denial, Deportation Proceedings, or Complications
  "prior-denial-deportation": {
    key: "prior-denial-deportation",
    scenarioLabel: "Prior Denial, Deportation Proceedings, or Complications",
    summary: {
      situation:
        "Your Situation: Your case has additional complexity that requires careful legal analysis. A prior denial, deportation proceedings, or other immigration complications do not necessarily mean there are no options. But they do mean that generic advice is not sufficient. You need an attorney who can review the specific details of your history and build a strategy around them.",
      timeline:
        "Recommended Action: Book a free case evaluation immediately. The sooner we can review your situation, the more options you are likely to have.",
      complexity:
        "Complexity Level: High. This type of case should not be handled without an experienced attorney.",
    },
    steps: [
      {
        title: "Step 1: Do not ignore any notices from USCIS or immigration court.",
        body: [
          "If you have received a denial notice, a notice to appear in immigration court, or any other official correspondence, do not set it aside. These documents have deadlines. Missing a deadline can result in a removal order, which means a judge has ordered your deportation, potentially without you even being present.",
          "If you have received a notice and you do not understand what it means, bring it to an attorney immediately.",
        ],
      },
      {
        title: "Step 2: Gather every piece of immigration correspondence you have.",
        bullets: [
          "Denial notices from USCIS",
          "Notices to appear (NTA) from immigration court",
          "Any correspondence from an immigration judge",
          "Any prior applications, receipts, or filings",
          "Any correspondence from a previous attorney",
        ],
        body: [
          "If you have been in deportation proceedings before and the case was closed or terminated, gather those documents as well. A prior proceeding that was closed can sometimes be reopened.",
        ],
      },
      {
        title: "Step 3: Understand that a denial or a complication does not mean there are no options.",
        bullets: [
          "A denial can often be appealed through a motion to reopen or a motion to reconsider.",
          "Deportation proceedings do not automatically mean deportation. There are defenses available depending on your situation, including marriage to a US citizen, qualifying for cancellation of removal, asylum claims, VAWA protections, and other forms of relief.",
          "A criminal record complicates things but does not always make you ineligible. The impact depends on the type of offense, the severity, and how immigration law classifies it.",
          "Every case is different. Generic advice from the internet or from community members cannot account for the specific details of your history.",
        ],
      },
      {
        title: "Step 4: Do not talk to immigration officers or sign anything without an attorney.",
        body: [
          "If you are approached by ICE or any immigration enforcement officer, you have the right to remain silent and the right to speak with an attorney.",
          "Do not sign any documents without understanding what they are. Some documents, if signed, can waive your right to a hearing or agree to voluntary departure.",
          "If you are detained, ask to speak with an attorney immediately.",
        ],
      },
      {
        title: "Step 5: Book a free case evaluation as soon as possible.",
        body: [
          "This is the most urgent of all result paths. The longer you wait, the fewer options you may have.",
          "Bring every document you have. If you have nothing, come anyway. We can request your records.",
          "We will review your history, identify what happened, and explain every option available to you.",
          "If your case involves deportation proceedings, our associate attorney Jordan handles immigration court litigation and is experienced in removal defense.",
          "30 minutes. No cost. No obligation. Confidential. We do not judge how you got here. We focus on where you are going.",
          "Book here: https://tilimmigration.com/schedule-a-case-evaluation",
          "Or call directly: 804-408-3522",
          "If you are scared, that is normal. If you feel overwhelmed, that is normal. If you do not know where to start, this call is where you start. We are here.",
        ],
      },
    ],
  },
};

export const DEFAULT_VARIANT_KEY = "visa-spouse-clean";
