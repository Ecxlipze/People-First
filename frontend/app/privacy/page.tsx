import type { Metadata } from "next";
import Link from "next/link";
import LegalPageLayout, {
  LEGAL_CONTACT_EMAIL,
  LEGAL_OPERATOR_NAME,
  type LegalSection,
} from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Information about how we collect, use, and share your data.",
  alternates: {
    canonical: "/privacy",
  },
};

const sections: LegalSection[] = [
  {
    id: "introduction",
    title: "Introduction",
    content: (
      <>
        <p>
          This Privacy Policy explains how {LEGAL_OPERATOR_NAME} (&ldquo;People
          First&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;),
          a registered venture builder under the Securities and Exchange Commission
          of Pakistan (SECP), collects, uses, protects, and discloses personal
          information obtained through the People First website and related digital
          services.
        </p>
        <p>
          We are committed to maintaining the confidentiality, integrity, and
          security of personal information in compliance with the Prevention of
          Electronic Crimes Act, 2016 (PECA), relevant SECP compliance
          frameworks, and recognized international data protection best
          practices.
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
          We collect personal information that you choose to provide to us
          directly, as well as certain technical data generated automatically
          when you interact with our website:
        </p>
        <ul>
          <li>
            <strong>Contact &amp; Inquiry Information:</strong> When you submit
            a contact form, partner application, consultation request, or
            training registration, we collect your full name, email address,
            phone or WhatsApp number, selected role (e.g., Entrepreneur,
            Student, Training Partner, Investor, Media Guest), and your message
            or proposal content.
          </li>
          <li>
            <strong>Program &amp; Venture Inquiries:</strong> If you apply for
            venture incubation, partnership, or specific training cohorts, we
            may collect additional background details relevant to evaluating
            your venture or application.
          </li>
          <li>
            <strong>Technical &amp; Log Information:</strong> When you browse
            our website, our hosting infrastructure and edge delivery network
            automatically log standard diagnostic parameters, including your
            IP address, browser type and version, device operating system,
            referring URL, pages viewed, time stamps, and response latencies.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Information",
    content: (
      <>
        <p>
          We use the information collected for legitimate business and
          operational purposes, including:
        </p>
        <ul>
          <li>
            <strong>Responding to Inquiries:</strong> Processing and responding
            to your questions, feedback, media requests, and business inquiries.
          </li>
          <li>
            <strong>Evaluating Partnerships &amp; Applications:</strong>{" "}
            Reviewing venture proposals, partnership opportunities, and student
            or professional applications for our training cohorts.
          </li>
          <li>
            <strong>Operating &amp; Improving the Website:</strong> Ensuring
            security, preventing fraudulent activity, optimizing layout
            performance, and diagnosing technical server issues.
          </li>
          <li>
            <strong>Transactional Communications:</strong> Sending automated
            submission acknowledgments, consultation confirmations, and critical
            service updates.
          </li>
          <li>
            <strong>Compliance &amp; Legal Obligations:</strong> Satisfying
            statutory, regulatory, tax, or legal reporting requirements under
            applicable Pakistani law and SECP regulations.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-information-may-be-shared",
    title: "How Information May Be Shared",
    content: (
      <>
        <p>
          We respect your privacy and do not sell, rent, or trade your personal
          information to third-party marketers or data brokers. Information may
          only be shared under the following limited circumstances:
        </p>
        <ul>
          <li>
            <strong>Authorized Service Providers:</strong> Trusted third-party
            technology vendors who provide infrastructure, secure database
            hosting, edge network distribution (e.g., Vercel), and transactional
            email delivery services (SMTP). These providers process data solely
            on our behalf under strict confidentiality obligations.
          </li>
          <li>
            <strong>People First Ecosystem &amp; Venture Partners:</strong> Where
            an inquiry specifically pertains to a joint initiative, venture
            program, or specialized training track (e.g., Merchanity, Abaad.pk,
            or affiliated incubation programs), relevant submission details may
            be shared internally with designated program leaders.
          </li>
          <li>
            <strong>Legal &amp; Regulatory Disclosures:</strong> When required by
            subpoena, court order, regulatory mandate, or applicable law
            enforcement directive issued under the laws of the Islamic Republic
            of Pakistan.
          </li>
          <li>
            <strong>Corporate Reorganization:</strong> In connection with any
            merger, acquisition, corporate restructuring, or transfer of venture
            assets, subject to standard confidentiality agreements.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookies-and-similar-technologies",
    title: "Cookies and Similar Technologies",
    content: (
      <>
        <p>
          The People First website operates on a privacy-respecting architecture.
          We do not deploy intrusive third-party cross-site advertising cookies,
          behavioral tracking pixels, or data-broker trackers.
        </p>
        <p>
          We only use strictly necessary technical cookies and local storage
          mechanisms required for site navigation, security verification, and
          session integrity. For a detailed breakdown of how we handle cookies
          and how you can control them, please review our{" "}
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
          We implement robust technical, administrative, and physical security
          measures to safeguard your personal data against unauthorized access,
          accidental loss, alteration, or disclosure:
        </p>
        <ul>
          <li>
            <strong>Encryption in Transit:</strong> All web traffic is encrypted
            using modern Transport Layer Security (TLS 1.3 / HTTPS).
          </li>
          <li>
            <strong>Access Control:</strong> Access to inquiry submissions and
            internal databases is restricted to authorized personnel on a
            need-to-know basis using role-based authentication and secure
            credentials.
          </li>
          <li>
            <strong>Infrastructure Hardening:</strong> Regular dependency updates,
            security scanning, and firewalled database configurations.
          </li>
        </ul>
        <p>
          Please note that no method of transmission over the Internet or
          electronic storage is completely impenetrable. We urge you not to
          transmit confidential banking details, national identity numbers
          (CNIC), or passwords through standard contact forms.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We retain personal information only for as long as necessary to
          fulfill the purposes for which it was collected, resolve disputes, and
          satisfy legal or regulatory obligations:
        </p>
        <ul>
          <li>
            <strong>General Inquiries:</strong> Kept for up to 24 months
            following the resolution of your inquiry, after which records are
            securely archived or purged.
          </li>
          <li>
            <strong>Partnership &amp; Training Records:</strong> Kept for the
            duration of the active contractual or training relationship plus 5
            years to satisfy SECP corporate compliance and accounting standards.
          </li>
          <li>
            <strong>Technical Logs:</strong> Server and edge security logs are
            retained for 90 days for operational diagnosis and security audits
            before being automatically purged.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "user-rights-and-choices",
    title: "User Rights and Choices",
    content: (
      <>
        <p>
          Subject to applicable laws, you possess fundamental rights regarding
          your personal data:
        </p>
        <ul>
          <li>
            <strong>Access &amp; Review:</strong> The right to request a copy of
            the personal information we hold about you.
          </li>
          <li>
            <strong>Rectification:</strong> The right to request correction of
            inaccurate, outdated, or incomplete data.
          </li>
          <li>
            <strong>Erasure:</strong> The right to request deletion of your
            personal information when it is no longer needed for the purposes for
            which it was collected.
          </li>
          <li>
            <strong>Restriction &amp; Objection:</strong> The right to restrict
            or object to the processing of your data under certain circumstances.
          </li>
        </ul>
        <p>
          To exercise any of these rights, please email us at{" "}
          <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>. We
          verify identity via your registered email and respond within 30 days
          without charge.
        </p>
      </>
    ),
  },
  {
    id: "third-party-links-and-services",
    title: "Third-Party Links and Services",
    content: (
      <p>
        Our website may contain links to external websites, including venture
        partner sites (e.g., Merchanity, Abaad.pk), social media networks
        (LinkedIn, Instagram, Facebook, Twitter), and media platforms (such as
        YouTube). We do not control these third-party platforms and are not
        responsible for their privacy practices. We encourage you to review the
        privacy policies of any external website you visit.
      </p>
    ),
  },
  {
    id: "childrens-privacy",
    title: "Children’s Privacy",
    content: (
      <p>
        The People First website and its venture programs are intended for
        adults, entrepreneurs, and students aged 16 and older. We do not
        knowingly collect or solicit personal information from individuals under
        the age of 16. If we learn that we have inadvertently collected personal
        information from a child under 16 without verified parental consent, we
        will promptly delete that information from our records.
      </p>
    ),
  },
  {
    id: "changes-to-this-privacy-policy",
    title: "Changes to This Privacy Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices, technological developments, or legal requirements.
        When updates are published, the revised effective date at the top of this
        page will be updated. Continued use of our website after such updates
        constitutes acknowledgment and acceptance of the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          If you have questions, concerns, or requests regarding this Privacy
          Policy or our data handling practices, please contact us:
        </p>
        <ul>
          <li>
            <strong>Entity:</strong> {LEGAL_OPERATOR_NAME}
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
          </li>
          <li>
            <strong>Phone / WhatsApp:</strong> +92 306 1113337
          </li>
          <li>
            <strong>Address:</strong> 58-A2 Kickstart, Tipu Road,
            Gulberg III, Lahore, Pakistan
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
