import SiteHeader from "./SiteHeader";
import SiteFooter from "./SiteFooter";
import AnimatedSection from "./AnimatedSection";
import ProjectLayout from "./ProjectLayout";
import ContentContainer from "./ContentContainer";
import ProseContainer from "./ProseContainer";
import FooterSection from "./FooterSection";
import ProjectHeader from "./ProjectHeader";

interface ArticleTemplateProps {
  children: React.ReactNode;
  // All ProjectHeader props are optional now since it auto-detects from JSON
  year?: string;
  category?: string;
  subcategory?: string;
  title?: string;
  description?: string;
}

export default function ArticleTemplate({
  children,
  year,
  category,
  subcategory,
  title,
  description,
}: ArticleTemplateProps) {
  return (
    <ProjectLayout>
      <SiteHeader />

      <ContentContainer size="narrow">
        <AnimatedSection delay={0.2}>
          <ProjectHeader
            year={year}
            category={category}
            subcategory={subcategory}
            title={title}
            description={description}
          />
        </AnimatedSection>

        <AnimatedSection delay={0.3}>
          <ProseContainer>{children}</ProseContainer>
        </AnimatedSection>
      </ContentContainer>

      <AnimatedSection delay={0.4}>
        <FooterSection>
          <SiteFooter />
        </FooterSection>
      </AnimatedSection>
    </ProjectLayout>
  );
}
