import { CaseStudyLayout } from "@/components/CaseStudyLayout";
import html from "./case-studies/removal.html?raw";

const RemovalAsylumCaseStudies = () => (
  <CaseStudyLayout
    html={html}
    activeKey="removal-defense-asylum"
    title="Removal Defense & Asylum Case Studies — Taghavi Immigration Law"
    description="Real removal defense and asylum case studies: deportation defense, asylum grants, and humanitarian relief handled by Taghavi Immigration Law."
  />
);

export default RemovalAsylumCaseStudies;
