import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import html from "./case-studies/family.html?raw";

const FamilyImmigrationCaseStudies = () => (
  <CaseStudyLayout
    html={html}
    activeKey="family-immigration"
    title="Family Immigration Case Studies — Taghavi Immigration Law"
    description="Real family-based immigration case studies: military parole-in-place, K-1 fiancé visas, and marriage green cards handled by Taghavi Immigration Law."
  />
);

export default FamilyImmigrationCaseStudies;
