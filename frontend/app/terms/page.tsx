import type { Metadata } from "next";
import LegalPageLayout, {
  LEGAL_CONTACT_EMAIL,
  LEGAL_OPERATOR_NAME,
  type LegalSection,
} from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions governing the use of People First services.",
  alternates: {
    canonical: "/terms",
  },
};

const sections: LegalSection[] = [
  {
    id: "acceptance-of-terms",
    title: "Acceptance of Terms",
    content: (
      <>
        <p>
          These Terms &amp; Conditions govern access to and use of the People
          First website (peoplefirst.pk) and related digital channels operated by{" "}
          {LEGAL_OPERATOR_NAME} (&ldquo;People First&rdquo;, &ldquo;we&rdquo;,
          &ldquo;us&rdquo;, or &ldquo;our&rdquo;), a registered venture builder
          under the Securities and Exchange Commission of Pakistan (SECP).
        </p>
        <p>
          By accessing or using our website, submitting an inquiry, or
          participating in any People First programs, you agree to comply with
          and be bound by these Terms. If you do not agree with these Terms,
          please discontinue use of the website immediately.
        </p>
      </>
    ),
  },
  {
    id: "use-of-the-website",
    title: "Use of the Website",
    content: (
      <p>
        You may use the website to explore our venture ecosystem, access
        editorial insights and podcasts, submit partnership and training
        inquiries, and learn about our collaborative programs. You agree to use
        the website solely for lawful purposes, in compliance with all
        applicable local and international laws, and you warrant that any
        information you provide is accurate, complete, and current.
      </p>
    ),
  },
  {
    id: "permitted-and-prohibited-conduct",
    title: "Permitted and Prohibited Conduct",
    content: (
      <>
        <p>You agree not to use the website to:</p>
        <ul>
          <li>
            Violate any applicable federal, provincial, or international laws,
            including the Prevention of Electronic Crimes Act, 2016 (PECA).
          </li>
          <li>
            Transmit or inject viruses, trojans, worms, ransomware, or other
            technologically harmful code.
          </li>
          <li>
            Attempt to gain unauthorized access to, interfere with, damage, or
            disrupt any part of the website, its hosting infrastructure, or
            connected databases.
          </li>
          <li>
            Employ automated scrapers, data miners, robots, or crawling spiders
            without our express prior written permission.
          </li>
          <li>
            Impersonate People First, its founders, officers, employees, or any
            other individual or entity.
          </li>
          <li>
            Engage in any conduct that restricts, inhibits, or degrades any
            other user&rsquo;s ability to enjoy or interact with the website.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          All content, branding, logos, trademarks, visual artwork, photography,
          audio recordings, podcast productions, editorial insights, and
          proprietary code featured on this website are the exclusive
          intellectual property of {LEGAL_OPERATOR_NAME} or its content
          licensors, protected under the Copyright Ordinance, 1962 of Pakistan
          and international intellectual property treaties.
        </p>
        <p>
          You are granted a limited, revocable, non-exclusive, non-transferable
          license to view, read, and access website materials solely for your
          personal, non-commercial informational use. No part of the website may
          be reproduced, republished, distributed, broadcast, modified, or
          publicly displayed without our prior written consent.
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
          Our website provides contact forms and application channels for
          partnerships, training programs, and venture consultations. By
          submitting an inquiry or proposal, you acknowledge and agree that:
        </p>
        <ul>
          <li>
            Submissions are reviewed by our authorized partnerships, venture
            development, and training teams.
          </li>
          <li>
            Submitting an inquiry, pitch, or application does not create a
            client, partnership, investment, advisory, employment, or
            contractual relationship between you and People First.
          </li>
          <li>
            While we treat submissions with care, general website contact forms
            are not a secure channel for unreleased proprietary trade secrets.
            Do not submit sensitive proprietary inventions or confidential
            business plans without a mutually executed Non-Disclosure Agreement
            (NDA).
          </li>
          <li>
            You represent that you own or have the necessary rights and
            permissions to submit the materials and information you provide.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "third-party-links",
    title: "Third-Party Links",
    content: (
      <p>
        The website contains links to external websites and services, including
        portfolio ventures (such as Merchanity, Abaad.pk, and Kissan Veer),
        social networks, and media platforms. These links are provided solely
        for your convenience and reference. People First does not endorse,
        control, or assume responsibility for the content, privacy practices,
        availability, or accuracy of any third-party websites.
      </p>
    ),
  },
  {
    id: "website-availability",
    title: "Website Availability",
    content: (
      <p>
        We strive to ensure continuous and reliable access to the website.
        However, the site is provided on an &ldquo;as is&rdquo; and &ldquo;as
        available&rdquo; basis. We do not warrant that the website will always
        be available, uninterrupted, timely, secure, or bug-free. We reserve the
        right to modify, suspend, or discontinue any feature, content, or
        section of the website at any time without prior notice or liability.
      </p>
    ),
  },
  {
    id: "disclaimer",
    title: "Disclaimer",
    content: (
      <>
        <p>
          All materials, podcasts, articles, and insights published on this
          website are provided for general educational, informational, and
          inspirational purposes only. Nothing on this website constitutes
          financial, investment, legal, tax, or professional business advice.
        </p>
        <p>
          To the fullest extent permitted by applicable law, {LEGAL_OPERATOR_NAME}{" "}
          disclaims all representations and warranties of any kind, whether
          express, statutory, or implied, including but not limited to implied
          warranties of merchantability, fitness for a particular purpose,
          non-infringement, and freedom from computer viruses or security
          defects.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <>
        <p>
          To the maximum extent permitted by applicable law under the
          jurisdiction of the Islamic Republic of Pakistan, in no event shall{" "}
          {LEGAL_OPERATOR_NAME}, its directors, officers, employees, partners,
          affiliates, or agents be liable for any indirect, consequential,
          incidental, special, exemplary, or punitive damages, including loss of
          profits, revenue, data, goodwill, or business opportunity, arising out
          of or in connection with your access to, use of, or inability to use
          the website or any content provided herein.
        </p>
        <p>
          In all cases, our total cumulative liability arising out of or related
          to these Terms or the website shall not exceed PKR 10,000 or the amount
          you paid directly to us (if any) in the preceding 12 months, whichever
          is lesser.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-the-terms",
    title: "Changes to the Terms",
    content: (
      <p>
        We reserve the right to revise, update, or replace these Terms &amp;
        Conditions at our discretion. Any revisions will become effective
        immediately upon posting to this page, and the effective date will be
        updated accordingly. Your continued use of the website following the
        posting of any changes constitutes your binding acceptance of those
        changes.
      </p>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law",
    content: (
      <>
        <p>
          These Terms &amp; Conditions, and any disputes or claims arising out of
          or in connection with them, shall be governed by and construed in
          accordance with the laws of the Islamic Republic of Pakistan.
        </p>
        <p>
          In the event of any dispute, controversy, or claim arising out of or
          relating to these Terms, the parties shall first attempt in good faith
          to resolve the dispute amicably within thirty (30) days. If the
          dispute cannot be settled amicably, it shall be subject to the
          exclusive jurisdiction of the competent courts in Lahore, Pakistan.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>Questions about these Terms should be directed to:</p>
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
            <strong>Registered Office:</strong> 27 Sohail Block, Jamil Park,
            Multan Road, Lahore, Pakistan
          </li>
          <li>
            <strong>Operational Studio:</strong> 58A2 Kickstart, Tipu Road,
            Gulberg III, Lahore, Pakistan
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
