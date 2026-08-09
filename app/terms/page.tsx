import type { Metadata } from "next";
import LegalPageLayout, {
  LegalPlaceholder,
  type LegalSection,
} from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions — People First",
  description:
    "Read the terms governing use of the People First website, including the provisions that remain subject to company and legal confirmation.",
};

const sections: LegalSection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          These Terms & Conditions are intended to govern access to and use of
          the People First website operated by
          {" "}
          <LegalPlaceholder>[Company legal name required]</LegalPlaceholder>.
          By using the website after final terms are published, visitors will be
          expected to comply with them.
        </p>
        <p>
          The legal identity of the website operator and the effective date
          must be completed before these terms are treated as final.
        </p>
      </>
    ),
  },
  {
    id: "use-of-the-website",
    title: "Use of the Website",
    content: (
      <p>
        You may use the website to learn about People First, its work, content,
        programmes, podcasts, insights, and ways to make contact. You are
        responsible for using the website lawfully and for ensuring that any
        information you submit is accurate to the best of your knowledge.
      </p>
    ),
  },
  {
    id: "permitted-and-prohibited-conduct",
    title: "Permitted and Prohibited Conduct",
    content: (
      <>
        <p>You must not use the website to:</p>
        <ul>
          <li>break applicable law or infringe another person&rsquo;s rights;</li>
          <li>
            submit malicious code, spam, deceptive content, or material intended
            to disrupt the website;
          </li>
          <li>
            attempt to gain unauthorised access to the website, its supporting
            systems, or information submitted by another person;
          </li>
          <li>
            misrepresent your identity or use the contact forms to impersonate
            another person; or
          </li>
          <li>
            interfere with the website&rsquo;s availability, security, or normal
            operation.
          </li>
        </ul>
        <p>
          Any additional restrictions, including rules for automated access or
          reuse of published materials, require company confirmation.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          The website contains branding, written content, artwork, photographs,
          audio-related material, design elements, and software that may be
          protected by intellectual-property laws. The project does not
          establish the legal owner or licence status of every item.
        </p>
        <p>
          Before this section is finalised, ownership, permitted reuse, brand
          permissions, and any third-party credits or licences must be
          confirmed:
          {" "}
          <LegalPlaceholder>
            [Intellectual-property owner and licence terms required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "user-submissions-and-contact-forms",
    title: "User Submissions and Contact Forms",
    content: (
      <>
        <p>
          The website&rsquo;s contact forms allow you to provide your name,
          email address, optional phone number, role, and a message. Submit only
          information that you are authorised to provide and that is relevant to
          your enquiry.
        </p>
        <p>
          A form submission does not by itself create a client, employment,
          partnership, investment, advisory, or other formal relationship, and
          it does not guarantee a response. Do not submit confidential,
          financial, identification, or other sensitive material through the
          general contact form.
        </p>
        <p>
          The project does not yet confirm a delivery provider or formal
          submission-handling workflow:
          {" "}
          <LegalPlaceholder>
            [Contact-form handling and authorised recipients required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: (
      <p>
        The website links to external social-media pages and websites associated
        with featured ventures. Those destinations are operated independently
        and may have their own terms, policies, content, and availability. A
        link does not establish responsibility for an external site or its
        practices.
      </p>
    ),
  },
  {
    id: "website-availability",
    title: "Website Availability",
    content: (
      <p>
        Website content and features may be corrected, updated, suspended, or
        withdrawn as the site develops. People First should confirm whether it
        intends to make any specific availability, support, maintenance, or
        notice commitments:
        {" "}
        <LegalPlaceholder>
          [Availability and support commitments required, if any]
        </LegalPlaceholder>
        .
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: (
      <>
        <p>
          Website content is provided for general information. Visitors should
          verify information relevant to their circumstances and obtain
          appropriate professional advice where needed before acting on it.
        </p>
        <p>
          The exact warranty exclusions and disclaimer language must be tailored
          to the organisation, its published content, and applicable law:
          {" "}
          <LegalPlaceholder>
            [Company-approved disclaimer wording required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <p>
        No liability cap, category of excluded loss, indemnity, or other
        limitation has been assumed in this draft. This provision must be
        prepared for the correct legal entity, services, audience, and governing
        law:
        {" "}
        <LegalPlaceholder>
          [Legally reviewed limitation-of-liability wording required]
        </LegalPlaceholder>
      </p>
    ),
  },
  {
    id: "changes-to-the-terms",
    title: "Changes to the Terms",
    content: (
      <>
        <p>
          These terms may be revised when the website, People First&rsquo;s
          activities, or applicable requirements change. The effective date at
          the top of the page should be updated when revised terms are
          published.
        </p>
        <p>
          Any process for notifying users or obtaining renewed acceptance must
          be confirmed:
          {" "}
          <LegalPlaceholder>
            [Terms change-notification process required, if applicable]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <p>
        The governing law, courts, venue, and any dispute-resolution process
        cannot be determined from the current project and have not been
        invented.
        {" "}
        <LegalPlaceholder>
          [Jurisdiction and dispute process require company and legal
          confirmation]
        </LegalPlaceholder>
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>Questions about these terms should be directed to:</p>
        <ul>
          <li>
            <LegalPlaceholder>[Company legal name required]</LegalPlaceholder>
          </li>
          <li>
            <LegalPlaceholder>[Contact email required]</LegalPlaceholder>
          </li>
          <li>
            <LegalPlaceholder>
              [Registered or business address required]
            </LegalPlaceholder>
          </li>
        </ul>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      summary="The rules intended to govern use of the People First website, with company-specific legal provisions clearly marked for confirmation."
      currentPath="/terms"
      sections={sections}
    />
  );
}
