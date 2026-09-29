import type { Metadata } from "next";
import LegalPageLayout, {
  LEGAL_CONTACT_EMAIL,
  LEGAL_OPERATOR_NAME,
  type LegalSection,
} from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookies Policy",
  description: "Information about how we use cookies and similar technologies.",
  alternates: {
    canonical: "/cookies",
  },
};

const sections: LegalSection[] = [
  {
    id: "what-cookies-are",
    title: "What Cookies Are",
    content: (
      <p>
        Cookies are small text files placed on your device (computer, tablet, or
        mobile phone) when you visit websites. They are widely used by website
        operators to make websites function efficiently, provide secure browsing
        environments, and deliver basic site functionality. Similar technologies
        include local storage, session storage, and web beacons.
      </p>
    ),
  },
  {
    id: "how-this-website-may-use-cookies",
    title: "How This Website Uses Cookies",
    content: (
      <>
        <p>
          The People First website is engineered with a privacy-by-design
          architecture. We do not use cookies to track your activity across
          unrelated third-party websites, nor do we sell or disclose browsing
          habits to third-party advertisers or data brokers.
        </p>
        <p>
          We only deploy cookies and local storage mechanisms that are strictly
          necessary to deliver the site&rsquo;s core features, protect against
          cross-site request forgery (CSRF), and ensure optimal edge delivery
          performance.
        </p>
      </>
    ),
  },
  {
    id: "essential-cookies",
    title: "Essential Cookies",
    content: (
      <>
        <p>
          Essential cookies and storage tokens are technically indispensable for
          the website to operate securely and reliably:
        </p>
        <ul>
          <li>
            <strong>Edge Routing &amp; Security:</strong> Distributed edge
            tokens (e.g., Vercel edge infrastructure) used to balance traffic,
            mitigate Distributed Denial of Service (DDoS) threats, and ensure
            consistent routing.
          </li>
          <li>
            <strong>CSRF &amp; Form Security:</strong> Security tokens
            associated with our Django API inquiry forms to protect against
            unauthorized submissions and cross-site request forgery.
          </li>
          <li>
            <strong>Session &amp; Navigation State:</strong> Ephemeral browser
            state used to manage modal visibility (e.g., the contact modal) and
            ensure smooth transitions without unintended page reloads.
          </li>
        </ul>
        <p>
          Because these technical cookies are necessary to deliver the website
          and maintain its security, they cannot be switched off in our
          systems without impairing core functionality.
        </p>
      </>
    ),
  },
  {
    id: "preference-cookies",
    title: "Preference Cookies",
    content: (
      <p>
        Preference technologies allow the website to remember user interface
        choices, such as your browser&rsquo;s preferred color scheme or
        reduced-motion accessibility preferences (which our site respects
        automatically via CSS media queries). We do not store persistent
        tracking cookies for these preferences.
      </p>
    ),
  },
  {
    id: "analytics-cookies",
    title: "Analytics Cookies",
    content: (
      <p>
        We prioritize visitor privacy. If aggregate performance measurement is
        enabled, we utilize privacy-preserving, cookieless telemetry that
        measures overall site health, page load speeds, and error rates without
        collecting personally identifiable information (PII) or tracking
        individuals across web domains.
      </p>
    ),
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Cookies",
    content: (
      <>
        <p>
          Our website may feature links to external platforms, such as YouTube
          podcast episodes, venture partner websites (Merchanity, Abaad.pk,
          Kissan Veer), and social media channels (LinkedIn, Instagram, Facebook,
          Twitter).
        </p>
        <p>
          When you follow these external links or interact with embedded
          multimedia, those third parties may set their own cookies or local
          storage according to their independent privacy policies. People First
          does not control these third-party technologies, and we encourage you
          to review their respective cookie notices.
        </p>
      </>
    ),
  },
  {
    id: "managing-cookies-through-the-browser",
    title: "Managing Cookies Through the Browser",
    content: (
      <>
        <p>
          Most web browsers allow you to manage, block, or delete cookies
          through their settings. You can configure your browser to refuse all
          cookies, alert you when a cookie is placed, or delete existing cookies:
        </p>
        <ul>
          <li>
            <strong>Google Chrome:</strong> Settings &gt; Privacy and Security
            &gt; Cookies and other site data
          </li>
          <li>
            <strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp;
            Security &gt; Cookies and Site Data
          </li>
          <li>
            <strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Manage
            Website Data
          </li>
          <li>
            <strong>Microsoft Edge:</strong> Settings &gt; Cookies and site
            permissions
          </li>
        </ul>
        <p>
          Please note that disabling strictly necessary cookies may affect the
          availability or proper display of certain interactive features on our
          website.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-the-cookie-policy",
    title: "Changes to the Cookie Policy",
    content: (
      <p>
        We may update this Cookie Policy periodically to reflect changes in our
        technology, legal requirements, or operational practices. Any updates
        will be posted directly to this page with an updated effective date.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>
          If you have questions about our use of cookies or similar
          technologies, please contact us:
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

export default function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      summary="What cookies are, the technologies confirmed in the current website, and the production details that still need verification."
      currentPath="/cookies"
      sections={sections}
    />
  );
}
