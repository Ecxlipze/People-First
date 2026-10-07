import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, GraduationCap, Cpu, PackageCheck, Sun, HandCoins, ChartNoAxesCombined, Handshake, Tractor, Sprout, ClipboardList, Users, TrendingUp } from "lucide-react";
import SideNav from "@/app/components/SideNav";
import SiteFooter from "@/app/components/SiteFooter";
import ContactTrigger from "@/app/contact/ContactTrigger";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kissan Veer",
  description: "26 years of field experience. Building Pakistan’s agricultural future with technology, trust, and transparency.",
  alternates: { canonical: "/kissan-veer" },
};

const services = [
  { icon: GraduationCap, title: "Grassroots Training & Skill Building", body: "Hands-on programs that equip growers with modern cultivation, post-harvest preservation, and value-addition techniques." },
  { icon: Cpu, title: "Smart Guidance & AI", body: "Practical, timely intelligence on crop cycles, input timing, and precision farming." },
  { icon: PackageCheck, title: "Direct Input Alignment", body: "Working directly with manufacturers to supply authentic, high-quality inputs at significantly lower costs." },
  { icon: Sun, title: "Clean Energy Transition", body: "Directing farms toward renewable energy to eliminate unsustainable fuel and electricity expenses." },
  { icon: HandCoins, title: "Urban–Rural Investment Bridge", body: "Connecting city consumers and micro-investors directly with village farms, helping rural households access affordable, healthy organic food while funding local crop cycles." },
  { icon: ChartNoAxesCombined, title: "Economic Gateways & Financial Freedom", body: "Linking growers to our broader ecosystem economic pathways so every individual, regardless of age or skill, can generate income aligned with their abilities." },
  { icon: Handshake, title: "Ending Dependence on Middlemen", body: "Empowering farmers to stand on their own financial feet, enabling them to store, process, and export their produce on their own terms rather than selling at distressed prices." },
];
const steps = [
  { icon: Tractor, label: "Farmer" },
  { icon: Sprout, label: "Kissan Veer Platform" },
  { icon: ClipboardList, label: "Inputs & Guidance" },
  { icon: Users, label: "Markets & Investors" },
  { icon: TrendingUp, label: "Growth & Prosperity" },
];

export default function KissanVeerPage() {
  return (
    <>
      <SideNav tone="light" />
      <div className={styles.page}>
        <main>
          <section className={styles.hero}>
            <Image src="/images/kissan-veer/hero-farmland.png" alt="" fill sizes="100vw" preload className={styles.heroImage} />
            <div className={styles.heroCopy}>
              <h1>26 Years of <span>Field Experience.</span><br /><small>A Lifetime of <span>Purpose.</span></small></h1>
              <p>From a classroom to the fields, from challenges to change — building Pakistan’s agricultural future with technology, trust, and transparency.</p>
            </div>
          </section>

          <div className={styles.content}>
            <section className={styles.story} aria-label="Our farming roots">
              <div>
                <blockquote>For 26 years, I haven’t looked at agriculture from a classroom,<br /> I lived it in the fields.</blockquote>
                <p>Born into a farming family and working our inherited land from day one, I experienced the deep, practical challenges of Pakistan’s agricultural landscape firsthand.</p>
                <p>I saw hard-working growers trapped in a fragmented system: farming without reliable guidance on crop cycles, victimized by fake or overpriced inputs, crushed by skyrocketing energy bills, and trapped in debt cycles with traditional middlemen (arthis) because they lacked the capital to store, value-add, or market their own yield.</p>
              </div>
              <Image src="/images/kissan-veer/farmer-illustration.png" alt="Illustration of a farmer ploughing the land with oxen" width={341} height={220} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 30vw, 75vw" className={styles.farmer} />
            </section>

            <div className={styles.panels}>
              <section className={`${styles.panel} ${styles.services}`} aria-label="How Kissan Veer supports growers">
                {services.map(({ icon: Icon, title, body }) => (
                  <article key={title} className={styles.service}>
                    <span className={styles.serviceIcon}><Icon size={24} strokeWidth={1.2} aria-hidden /></span>
                    <div><h2>{title}</h2><p>{body}</p></div>
                  </article>
                ))}
              </section>

              <section className={styles.dashboard} aria-label="Crop intelligence preview">
                <div className={`${styles.panel} ${styles.crop}`}>
                  <div className={styles.panelHeading}><h2>Crop Intelligence Dashboard</h2><span className={styles.badge}>Sample data</span></div>
                  <div className={styles.cropBody}>
                    <Image src="/images/kissan-veer/crop-map.png" alt="Illustrative aerial field map highlighting a crop plot" width={598} height={173} sizes="(min-width: 1024px) 31vw, (min-width: 640px) 65vw, 90vw" className={styles.map} />
                    <div className={styles.health}>
                      <h3>Field Health Score</h3>
                      <div className={styles.gauge}><strong>82</strong><span>Good</span></div>
                      <dl><div><dt>Moisture</dt><dd>Adequate</dd></div><div><dt>NDVI</dt><dd>0.72</dd></div></dl>
                    </div>
                  </div>
                </div>

                <div className={styles.insights}>
                  <article className={`${styles.panel} ${styles.advisory}`}>
                    <div className={styles.advisoryCopy}><h2>AI Advisory</h2><p>Wheat – Irrigation</p><h3>Irrigation required in</h3><p>3–4 days</p>
                      <ContactTrigger href="/contact" className={styles.action} aria-label="Ask about crop advisory">View Advisory <ArrowRight size={13} aria-hidden /></ContactTrigger>
                    </div>
                    <Image src="/images/kissan-veer/ai-plant.png" alt="" width={175} height={162} sizes="(min-width: 1024px) 11vw, 35vw" className={styles.plant} />
                  </article>
                  <article className={`${styles.panel} ${styles.market}`}>
                    <div><h2>Market Insights</h2><p>Wheat Price Trend</p><strong className={styles.trend}>↑ 6.4%</strong><p>vs last week</p>
                      <ContactTrigger href="/contact" className={styles.action} aria-label="Ask about market insights">View Market <ArrowRight size={13} aria-hidden /></ContactTrigger>
                    </div>
                    <svg viewBox="0 0 180 135" role="img" aria-label="Illustrative wheat price trend rising over time" className={styles.chart}>
                      <defs><linearGradient id="market-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#30e4f0" stopOpacity=".4" /><stop offset="1" stopColor="#30e4f0" stopOpacity="0" /></linearGradient></defs>
                      {[25, 50, 75, 100].map(y => <path key={y} d={`M12 ${y}H172`} stroke="#32565b" strokeWidth=".7" />)}
                      {[12, 52, 92, 132, 172].map(x => <path key={x} d={`M${x} 10V110`} stroke="#32565b" strokeWidth=".7" />)}
                      <path d="M12 63Q28 110 42 69T72 40T99 57T124 43T146 30T172 12V110H12Z" fill="url(#market-fill)" />
                      <path d="M12 63Q28 110 42 69T72 40T99 57T124 43T146 30T172 12" fill="none" stroke="#52e3ec" strokeWidth="2.5" />
                      <path d="M12 10V110H172" fill="none" stroke="#71ccd5" />
                      <g fill="#b1e1e6" fontSize="7"><text x="12" y="125">Jan 15</text><text x="57" y="125">Jan 18</text><text x="105" y="125">Jan 20</text><text x="150" y="125">Jan 23</text></g>
                    </svg>
                  </article>
                </div>

                <div className={`${styles.panel} ${styles.ecosystem}`}>
                  <h2>Our Ecosystem Flow</h2>
                  <ol>{steps.map(({ icon: Icon, label }, index) => <li key={label}>
                    <span className={styles.stepIcon}><Icon size={27} strokeWidth={1} aria-hidden /></span>
                    <span>{label}</span>
                    {index < steps.length - 1 && <ArrowRight className={styles.stepArrow} size={23} aria-hidden />}
                  </li>)}</ol>
                </div>
              </section>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
