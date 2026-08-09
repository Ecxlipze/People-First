import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout, {
  LegalPlaceholder,
  type LegalSection,
} from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy — People First",
  description:
    "Read how information submitted through the People First website is handled, including the details that remain subject to company confirmation.",
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          This Privacy Policy explains how{" "}
          <LegalPlaceholder>[Company legal name required]</LegalPlaceholder>,
          operating the People First website (&ldquo;People First&rdquo;,
          &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;), handles
          personal information provided through this website.
        </p>
        <p>
          This draft reflects the website functionality that can currently be
          confirmed from the project. It should be reviewed and completed with
          the organisation&rsquo;s actual operational and legal practices before
          publication as a final policy.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>
          The website includes contact forms. If you choose to submit a form,
          the form asks for your name and email address. You may also provide a
          phone number, select a role, and write a message. We receive the
          information you choose to enter in those fields.
        </p>
        <p>
          The current project does not confirm the use of analytics tools,
          advertising trackers, payment processors, user accounts, or other
          services that collect additional categories of personal information.
          Routine hosting and server-log practices have not been documented in
          the project and require confirmation:
          {" "}
          <LegalPlaceholder>
            [Hosting provider and technical log details required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    content: (
      <>
        <p>
          Information submitted through a contact form may be used to review
          and respond to the enquiry, understand the type of support requested,
          and maintain the website&rsquo;s contact process.
        </p>
        <p>
          Any additional business purposes, legal bases, marketing uses, or
          automated decision-making practices must be confirmed before being
          described here:
          {" "}
          <LegalPlaceholder>
            [Additional purposes and applicable legal bases required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "how-information-may-be-shared",
    title: "How Information May Be Shared",
    content: (
      <>
        <p>
          The current website project does not identify an email delivery
          provider, CRM, analytics provider, advertising partner, or a confirmed
          list of recipients for contact-form information. We therefore do not
          name or imply any such recipient in this policy.
        </p>
        <p>
          Before this policy is finalised, People First must document any
          service providers, professional advisers, affiliated organisations,
          legal disclosures, business transfers, or other circumstances in
          which personal information may be shared:
          {" "}
          <LegalPlaceholder>
            [Information-sharing categories and recipients required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "cookies-and-similar-technologies",
    title: "Cookies and Similar Technologies",
    content: (
      <>
        <p>
          No intentional cookie-setting code, analytics tag, advertising pixel,
          or embedded third-party media service was identified in the current
          People First application. Hosting-platform behavior and production
          configuration still require confirmation.
        </p>
        <p>
          For a fuller explanation of the current position and what must be
          reviewed if the website changes, see the{" "}
          <Link href="/cookies">Cookie Policy</Link>.
        </p>
      </>
    ),
  },
  {
    id: "data-security",
    title: "Data Security",
    content: (
      <>
        <p>
          Appropriate security measures depend on how submissions are hosted,
          accessed, transmitted, and retained. Those operational details are not
          established by the current project and must be documented:
          {" "}
          <LegalPlaceholder>
            [Security and access-control practices required]
          </LegalPlaceholder>
          .
        </p>
        <p>
          No method of transmission or storage can be guaranteed to be entirely
          secure. Do not use the contact form to send passwords, financial
          details, identification documents, or other sensitive information
          unless People First has specifically provided an appropriate secure
          channel.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <p>
        The project does not define retention periods or deletion procedures
        for contact-form information or technical logs.
        {" "}
        <LegalPlaceholder>
          [Retention periods and deletion criteria required]
        </LegalPlaceholder>
      </p>
    ),
  },
  {
    id: "user-rights-and-choices",
    title: "User Rights and Choices",
    content: (
      <>
        <p>
          Depending on where you live and which laws apply, you may have rights
          relating to your personal information, such as asking for access,
          correction, deletion, restriction, or a copy of certain information,
          or objecting to certain uses. These rights are not the same in every
          location and may be subject to legal exceptions.
        </p>
        <p>
          The process, identity-verification requirements, response time, and
          responsible privacy contact must be confirmed:
          {" "}
          <LegalPlaceholder>
            [Privacy request process and contact email required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "third-party-links-and-services",
    title: "Third-Party Links and Services",
    content: (
      <p>
        The website contains links to external websites, including social-media
        pages and sites associated with featured ventures. Following a link
        takes you to a service that operates under its own terms and privacy
        practices. People First does not control those external sites, and you
        should review their notices before providing information to them.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    content: (
      <>
        <p>
          The current project does not specify the website&rsquo;s intended
          minimum audience age or procedures for handling information relating
          to children.
        </p>
        <p>
          Those details must be established before this section is final:
          {" "}
          <LegalPlaceholder>
            [Minimum age and children&rsquo;s data practices required]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "changes-to-this-privacy-policy",
    title: "Changes to This Privacy Policy",
    content: (
      <>
        <p>
          This policy may be updated when the website, operational practices,
          or applicable requirements change. The effective date at the top of
          the page should be updated whenever a revised policy is published.
        </p>
        <p>
          Any commitment to provide additional notice of material changes must
          be confirmed:
          {" "}
          <LegalPlaceholder>
            [Change-notification method required, if applicable]
          </LegalPlaceholder>
          .
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>Questions or privacy requests should be directed to:</p>
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

export default function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      summary="How information submitted through the People First website is handled, and which operational details still need company confirmation."
      currentPath="/privacy"
      sections={sections}
    />
  );
}
