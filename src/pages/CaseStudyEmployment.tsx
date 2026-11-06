import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import html from "./case-studies/employment.html?raw";

const EmploymentTalentCaseStudies = () => (
  <CaseStudyLayout
    html={html}
    activeKey="employment-talent"
    title="Employment & Talent Case Studies — Taghavi Immigration Law"
    description="Real employment and talent visa case studies: O-1, EB-1A, EB-2 NIW, and L-1 approvals handled by Taghavi Immigration Law."
  />
);

export default EmploymentTalentCaseStudies;
