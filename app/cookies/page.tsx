import type { Metadata } from "next";
import LegalPageLayout, {
  LegalPlaceholder,
  type LegalSection,
} from "@/app/components/LegalPageLayout";

export const metadata: Metadata = {
  title: "Cookie Policy — People First",
  description:
    "Read the current People First cookie position, including what was and was not confirmed from the website application.",
};

const sections: LegalSection[] = [
  {
    id: "what-cookies-are",
    title: "What Cookies Are",
    content: (
      <p>
        Cookies are small text files that a website or related service can store
        on a device. They can support functions such as remembering choices,
        keeping a service secure, measuring use, or maintaining a session.
        Similar technologies can include local storage, pixels, and other device
        identifiers.
      </p>
    ),
  },
  {
    id: "how-this-website-may-use-cookies",
    title: "How This Website May Use Cookies",
    content: (
      <>
        <p>
          The current People First application was inspected for cookie-setting
          code and common analytics, advertising, tracking, and embedded-media
          integrations. None were identified in the active application.
        </p>
        <p>
          The production hosting configuration and any behavior introduced
          outside this repository still need to be confirmed:
          {" "}
          <LegalPlaceholder>
            [Production hosting and domain-level cookie audit required]
          </LegalPlaceholder>
          . This policy must be updated before optional cookies or similar
          technologies are introduced.
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
          No application-level essential cookie is currently defined in the
          project. The website has no user account, login session, shopping
          basket, or cookie-based preference mechanism in the code reviewed.
        </p>
        <p>
          If the hosting platform or future security features set an essential
          cookie, its purpose, provider, duration, and scope must be added here
          after verification rather than assumed.
        </p>
      </>
    ),
  },
  {
    id: "preference-cookies",
    title: "Preference Cookies",
    content: (
      <p>
        No preference cookie or local-storage preference was identified in the
        current application. If the website later remembers language, display,
        accessibility, or consent choices, those technologies and their
        durations must be documented here.
      </p>
    ),
  },
  {
    id: "analytics-cookies",
    title: "Analytics Cookies",
    content: (
      <p>
        No analytics library, analytics tag, or analytics cookie was confirmed
        in the active People First application. This policy does not name an
        analytics vendor because the project does not establish one.
        {" "}
        <LegalPlaceholder>
          [Confirm whether production analytics exists outside the repository]
        </LegalPlaceholder>
      </p>
    ),
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Cookies",
    content: (
      <>
        <p>
          No embedded video, social widget, advertising tag, payment tool, or
          other confirmed third-party component was found setting cookies within
          the active website.
        </p>
        <p>
          The website does contain ordinary links to external social-media and
          venture websites. Selecting one takes you away from People First; the
          destination may use cookies under its own policy. An ordinary external
          link does not itself confirm that the third party sets a cookie on the
          People First website.
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
          Most browsers let you review, block, or delete cookies through their
          privacy or site-data settings. Browser controls vary by product and
          version, so consult the help documentation for the browser you use.
        </p>
        <p>
          Blocking essential cookies can affect website features if such
          features are introduced in the future. No separate People First cookie
          preference centre is currently implemented in the application.
        </p>
      </>
    ),
  },
  {
    id: "changes-to-the-cookie-policy",
    title: "Changes to the Cookie Policy",
    content: (
      <p>
        This policy should be reviewed whenever cookies, analytics, embeds,
        hosting behavior, or related website services change. The effective date
        at the top of this page should be updated when a revised policy is
        published.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <>
        <p>Questions about cookies or similar technologies should be sent to:</p>
        <ul>
          <li>
            <LegalPlaceholder>[Company legal name required]</LegalPlaceholder>
          </li>
          <li>
            <LegalPlaceholder>[Contact email required]</LegalPlaceholder>
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
