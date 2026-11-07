/**
 * Everything the site says lives here, so copy can be edited without touching layout code.
 *
 * Lines marked `CONFIRM` are reasonable drafts that still need Shumaisa's real details
 * (tech stacks, exact years, society names). Search this file for CONFIRM before publishing.
 */

export const profile = {
  name: 'Shumaisa Asif',
  first: 'Shumaisa',
  location: 'Rawalpindi, Pakistan',
  email: 'shumaisa2003asif@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shumaisa-asif-', // CONFIRM: copied from the LinkedIn PDF
  github: 'https://github.com/Shumaisa2003asif',
  photo: '/images/shumaisa.webp',
  /** Shown beside the hero name; the asterisk on the name points here. */
  heroNote:
    'Computer science student at COMSATS, System Developer at TAMx, CMO at SaleForgers and a founding member of Mapalz. I build software, and the stories that help people find it.',
}

export const nav = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Journey', href: '#journey' },
  { label: 'Interests', href: '#explore' },
  { label: 'Contact', href: '#contact' },
]

export const roles = [
  {
    org: 'SaleForgers',
    title: 'Chief Marketing Officer',
    period: 'Oct 2026 – now',
    url: 'https://saleforgers.com',
    logo: '/logos/saleforgers.webp',
    summary:
      'Leading marketing direction, brand positioning and growth for a company that builds AI business systems and automation for e-commerce brands.',
  },
  {
    org: 'TAMx Technologies',
    title: 'System Developer',
    period: 'May 2026 – now',
    url: 'https://tamxai.com',
    logo: '/logos/tamx.webp',
    summary:
      'Designing and building web products: responsive interfaces, product workflows, and turning business requirements into working software.',
  },
  {
    org: 'Mapalz',
    title: 'Founding member',
    period: 'Since day one',
    url: 'https://mapalz.com',
    logo: '/logos/mapalz.webp',
    summary:
      'Helping build a unified commerce platform where wholesalers, suppliers, sellers, retailers and customers trade in one place.',
  },
]

export type Project = {
  slug: string
  name: string
  category: string
  year: string
  description: string
  stack: string[]
  contribution: string
  link?: { label: string; href: string }
  preview: 'mapalz' | 'boatmart' | 'plant' | 'ids'
  tone: string // background tint for the preview stage
  caseStudy: { heading: string; body: string }[]
}

export const projects: Project[] = [
  {
    slug: 'mapalz',
    name: 'Mapalz',
    category: 'Commerce platform',
    year: '2025 – now', // CONFIRM
    description:
      'One platform for the whole value chain. Wholesalers run a hub, sellers get multi-channel storefronts, and customers shop it all in one place, with AI store setup, inventory, CRM and ERP built in.',
    stack: ['Wholesaler hub', 'Seller dashboard', 'Customer storefront', 'AI assistant'],
    contribution:
      'Founding member. Shaping the product from the first idea: who it serves, how the three sides connect, and how it should feel to use.',
    link: { label: 'Visit mapalz.com', href: 'https://mapalz.com' },
    preview: 'mapalz',
    tone: '#E9DFD0',
    caseStudy: [
      {
        heading: 'The problem',
        body: 'Commerce in Pakistan is scattered across WhatsApp groups, spreadsheets and half a dozen marketplaces. A wholesaler, the seller who buys from them and the customer at the end of the chain rarely see the same information.',
      },
      {
        heading: 'The idea',
        body: 'Give every participant their own full-screen experience on one shared backbone: a wholesale hub for bulk orders and buyers, a seller dashboard that syncs inventory across channels like Shopify and eBay, and a storefront for customers.',
      },
      {
        heading: 'My part',
        body: 'As a founding member I work on the product direction and the experience across the three sides, from planning flows to reviewing how each screen reads to someone who has never used it.',
      },
    ],
  },
  {
    slug: 'boatmart',
    name: 'BOATMART',
    category: 'Wholesale marketplace',
    year: '2025', // CONFIRM
    description:
      'A digital wholesale marketplace that connects wholesalers, sellers and customers, so stock can move from a warehouse shelf to a doorstep without changing apps.',
    stack: ['React', 'Node.js', 'Express', 'MongoDB'], // CONFIRM
    contribution: 'Mapped the marketplace flows for all three user types, designed the interface and built the frontend.', // CONFIRM
    preview: 'boatmart',
    tone: '#DCE3D6',
    caseStudy: [
      {
        heading: 'The problem',
        body: 'Small sellers buy stock from wholesalers by phone and resell it by hand. Prices, availability and orders live in different places, and nobody can see the whole chain.',
      },
      {
        heading: 'What I built',
        body: 'Three connected roles on one marketplace: wholesalers list bulk inventory, sellers source from them and open storefronts, and customers order from sellers. Orders flow back up the chain automatically.',
      },
      {
        heading: 'What I learned',
        body: 'A marketplace is three products sharing one database. Designing the hand-offs between roles mattered more than any single screen.',
      },
    ],
  },
  {
    slug: 'plant-disease-detection',
    name: 'Plant Disease Detection',
    category: 'Machine learning',
    year: '2024', // CONFIRM
    description:
      'An AI project that looks at a photo of a leaf and identifies the disease on it, using image processing and a trained classifier.',
    stack: ['Python', 'TensorFlow', 'OpenCV', 'NumPy'], // CONFIRM
    contribution: 'Cleaned and augmented the leaf image dataset, trained and evaluated the model, and built the prediction demo.', // CONFIRM
    preview: 'plant',
    tone: '#E3E6D3',
    caseStudy: [
      {
        heading: 'The problem',
        body: 'Farmers often notice a disease only after it has spread. A quick photo-based check could flag it while it is still one leaf.',
      },
      {
        heading: 'Approach',
        body: 'Leaf photos are resized, normalised and augmented, then passed to a convolutional neural network that predicts the disease class along with a confidence score.',
      },
      {
        heading: 'What I learned',
        body: 'Most of the accuracy came from the data, not the model: balancing classes and removing near-duplicate images mattered more than adding layers.',
      },
    ],
  },
  {
    slug: 'intrusion-detection-system',
    name: 'Intrusion Detection System',
    category: 'Network security',
    year: '2024', // CONFIRM
    description:
      'A system that watches network traffic and flags activity that looks suspicious, like scans, floods and unusual connection patterns.',
    stack: ['Python', 'scikit-learn', 'Pandas', 'NSL-KDD'], // CONFIRM
    contribution: 'Engineered features from raw traffic records, compared detection models and tuned them to reduce false alarms.', // CONFIRM
    preview: 'ids',
    tone: '#E4DDE8',
    caseStudy: [
      {
        heading: 'The problem',
        body: 'Networks see thousands of connections a minute. Rules catch known attacks, but new patterns slip through, and too many false alarms get ignored.',
      },
      {
        heading: 'Approach',
        body: 'Each connection becomes a row of features: duration, protocol, bytes sent, failed logins and more. Classifiers learn what normal looks like and flag what does not.',
      },
      {
        heading: 'What I learned',
        body: 'A detector is only useful if people trust it. Precision mattered as much as recall, so every model was judged on the false alarms it raised too.',
      },
    ],
  },
]

export const journey = [
  {
    year: '2023',
    title: 'Computer science at COMSATS',
    body: 'Started a BS in Computer Science at COMSATS University Islamabad. Code stopped being a subject and became a material to make things with.',
  },
  {
    year: '2023',
    title: 'Exploring in every direction',
    body: 'Design tools in one tab, Python notebooks in the other. Small experiments with interfaces, image processing and the web.',
  },
  {
    year: '2024',
    title: 'Student societies', // CONFIRM: add society names
    body: 'Got involved with student societies on campus: organising events, designing for them and learning how to lead a team to a deadline.',
  },
  {
    year: '2024',
    title: 'Projects that taught me the most',
    body: 'Plant disease detection and an intrusion detection system: one about seeing, one about noticing what does not belong.',
  },
  {
    year: '2025',
    title: 'BOATMART, then Mapalz', // CONFIRM year
    body: 'A wholesale marketplace project turned into something bigger. I joined Mapalz as a founding member to build unified commerce for real businesses.',
  },
  {
    year: '2026',
    title: 'System Developer at TAMx',
    body: 'Joined TAMx Technologies in May, designing and building web products and digital platforms for clients.',
  },
  {
    year: '2026',
    title: 'CMO at SaleForgers',
    body: 'Took on marketing leadership in October: brand, campaigns and growth for an AI business-systems company.',
  },
  {
    year: '2027',
    title: 'Graduating',
    body: 'Finishing the degree in January, with a few products already out in the world.',
  },
]

export const explorations = [
  {
    key: 'ai',
    title: 'Artificial intelligence',
    body: 'Models that see and decide: image classification, anomaly detection and tools built on language models.',
  },
  {
    key: 'software',
    title: 'Software development',
    body: 'Web apps end to end, from the data model to the last hover state.',
  },
  {
    key: 'ux',
    title: 'UI/UX and digital experiences',
    body: 'Interfaces that feel obvious the first time you use them, and calm the hundredth time.',
  },
  {
    key: 'product',
    title: 'Product development',
    body: 'Turning a fuzzy idea into a scoped first version that real people can try.',
  },
  {
    key: 'creative',
    title: 'Creative technology',
    body: 'Code as a creative medium: motion, generated images and interactive stories, like the clouds at the top of this page.',
  },
  {
    key: 'business',
    title: 'Entrepreneurship',
    body: 'Mapalz and SaleForgers taught me that how people find a product matters as much as how it is built.',
  },
] as const
