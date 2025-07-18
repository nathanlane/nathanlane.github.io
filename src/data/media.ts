export interface MediaItem {
  title: string;
  outlet: string;
  date: string;
  type:
    | "interview"
    | "podcast"
    | "video"
    | "article"
    | "press"
    | "talk"
    | "panel";
  link: string;
  description?: string;
}

export const mediaData: Record<number, MediaItem[]> = {
  2025: [
    {
      title: "A New Hope for Europe's Ailing Economies: the Military",
      outlet: "Wall Street Journal",
      date: "2025-03-13",
      type: "article",
      link: "https://www.wsj.com/world/europe/europe-military-defense-spending-increase-economy-a297d1bc",
      description:
        "Economists say the region's planned defense buildup might be exactly what its economy needs, despite some sizable hurdles",
    },
    {
      title: "Of Tariffs and Industrial Policy",
      outlet: "Cato Institute Regulation Magazine",
      date: "2025-06-01", // Summer 2025 issue
      type: "article",
      link: "https://www.cato.org/regulation/summer-2025/tariffs-industrial-policy",
      description:
        "Analysis of how tariffs aren't the only policy tool Donald Trump wants to use to shape the US economy, including his attraction to industrial policy through subsidies, regulation, and government interventions",
    },
    {
      title:
        "Rich country playbook: Why developed nations win, while Kazakhstan gets left behind",
      outlet: "Kursiv Research",
      date: "2025-06-27",
      type: "article",
      link: "https://kz.kursiv.media/en/2025-06-27/engk-yeri-rich-why-developed-nations-win-while-kazakhstan-gets-left-behind/",
      description:
        "Analysis referencing research by Réka Juhász, Nathan Lane, Emily Oehlsen and Veronica Perez on measuring industrial policy through text-based data analysis",
    },
    {
      title: "The New Age of Industrial Policy",
      outlet: "The Daily Brief by Zerodha",
      date: "2025-07-03",
      type: "podcast",
      link: "https://podcasts.apple.com/in/podcast/another-fintech-giant-is-going-public/id1754694834?i=1000715526556",
      description:
        "Podcast discussion featuring Nathan Lane's research alongside papers from the IMF and RAND Corporation on industrial policy (segment starts at 12:21)",
    },
    {
      title: "The market implications of industrial subsidies",
      outlet: "CEPR VoxEU",
      date: "2025-07-07",
      type: "article",
      link: "https://cepr.org/voxeu/columns/market-implications-industrial-subsidies",
      description:
        "Econometric study finding that industrial subsidies increase firms' market shares but have no or negative impacts on investment rates and productivity growth",
    },
    {
      title:
        "India's Industrial Policies: Rejecting the Old Status Quo and Creating the New",
      outlet: "Council on Foreign Relations",
      date: "2025-02-11",
      type: "article",
      link: "https://www.cfr.org/article/indias-industrial-policies-rejecting-old-status-quo-and-creating-new",
      description:
        "Analysis of India's industrial policies including PLIs, tariffs, and domestic content requirements, citing 'The New Economics of Industrial Policy' by Juhász, Lane, and Rodrik",
    },
    {
      title:
        "The promise and pitfalls of production subsidies as industrial policy",
      outlet: "World Bank Development Talk",
      date: "2025-01-22",
      type: "article",
      link: "https://blogs.worldbank.org/en/developmenttalk/the-promise-and-pitfalls-of-production-subsidies-as-industrial-p",
      description:
        "World Bank blog post by Gaurav Nayyar discussing how tax holidays in Korea during the 1970s, combined with duty-free access to intermediate inputs, resulted in export gains and downstream industry expansion (Lane 2022)",
    },
    {
      title: "Industrial policies: new evidence for the UK",
      outlet: "UK Government",
      date: "2025-04-09",
      type: "article",
      link: "https://www.gov.uk/government/publications/industrial-policies-new-evidence-for-the-uk/industrial-policies-new-evidence-for-the-uk",
      description:
        "UK Government research and analysis publication citing Nathan Lane's work on industrial policy evidence and effectiveness",
    },
    {
      title: "NextGenerationEU works",
      outlet: "Klement on Investing",
      date: "2025-02-26",
      type: "article",
      link: "https://klementoninvesting.substack.com/p/nextgenerationeu-works",
      description:
        "Joachim Klement recommends recent overview by Réka Juhász and Nathan Lane on what makes industrial policy powerful and how to design good industrial policy",
    },
  ],
  2024: [
    {
      title: "New measures reveal a growing industrial policy divide",
      outlet: "VoxDev",
      date: "2024-12-01",
      type: "article",
      link: "https://voxdev.org/topic/methods-measurement/new-measures-reveal-growing-industrial-policy-divide",
      description:
        "Industrial policy insights highlighting challenges for developing countries",
    },
    {
      title: "How to tell good industrial policy from bad",
      outlet: "Financial Times",
      date: "2024-05-04",
      type: "article",
      link: "https://www.ft.com/content/ef12d3a7-fbe6-4794-870d-53cd6ad1f4e8",
      description:
        "Coverage of research showing industrial policy must focus on services, not just manufacturing",
    },
    {
      title:
        "Assessing India's Production-linked Incentives: A Case for Realignment of Objectives",
      outlet: "Economic & Political Weekly",
      date: "2024-12-07",
      type: "article",
      link: "https://www.epw.in/journal/2024/49/commentary/assessing-indias-production-linked-incentives.html",
      description:
        "Analysis of India's PLI scheme design flaws and recommendations for realignment to better support domestic manufacturing",
    },
    {
      title:
        "Interview with Nathan Lane by Srijana Mitra Das (India: Economic Times)",
      outlet: "Economic Times",
      date: "2024-05-16",
      type: "interview",
      link: "https://economictimes.indiatimes.com/news/et-evoke/we-are-witnessing-the-return-of-industrial-policy-now-unlike-the-past-this-is-shaped-by-a-globalised-world-climate-change-and-ai/articleshow/110185675.cms",
      description:
        "Interview with Nathan Lane by Srijana Mitra Das discussing the modern return of industrial policy in the context of globalization, climate change, and artificial intelligence",
    },
    {
      title: "Taking stock of recent evidence on industrial policy",
      outlet: "Harvard Kennedy School",
      date: "2024-06-09",
      type: "panel",
      link: "https://www.hks.harvard.edu/centers/wiener/programs/economy/our-work/reimagining-economy-blog/taking-stock-recent-evidence",
      description:
        "Panel discussion at HKS with Nathan Lane, Myrto Kalouptsidi, and Rohit Lamba, moderated by Dani Rodrik, on the evolution and effectiveness of industrial policy",
    },
    {
      title: "A New Economics of Industrial Policy",
      outlet: "IMF Finance & Development Magazine",
      date: "2024-06-01",
      type: "article",
      link: "https://www.imf.org/en/Publications/fandd/issues/2024/06/A-New-Economics-of-Industrial-Policy-Reka-Juhasz-and-Nathan-Lane",
      description: "Feature article on modern industrial policy research",
    },
    {
      title: "Global Perspective on Semiconductor Industrial Policy",
      outlet: "NBER Digest",
      date: "2024-10-01",
      type: "article",
      link: "https://www.nber.org/digest/202410/global-perspective-industrial-policy-and-semiconductor-industry",
      description: "Summary of research on global semiconductor policies",
    },
    {
      title: "United Nations Industrial Development Report 2024",
      outlet: "UNIDO",
      date: "2024-06-01",
      type: "article",
      link: "https://www.unido.org/sites/default/files/unido-publications/2024-06/Industrial%20Development%20Report%202024.pdf",
      description:
        "Global Industrial Policy: Measurement and Results - increased interest reflected in real data",
    },
    {
      title: "Mer inhemsk produktion gör världen fattigare",
      outlet: "Världen Om",
      date: "2024-03-12",
      type: "article",
      link: "https://varldenom.com/specialrapport/mer-inhemsk-produktion-gor-varlden-fattigare/",
      description:
        "Swedish article on how industrial policy and protectionism can threaten world trade without making Western economies safer",
    },
    {
      title: "Dani Rodrik: doing industrial policy right",
      outlet: "Financial Times",
      date: "2024-01-15",
      type: "article",
      link: "https://www.ft.com/content/34872d9a-3587-4b27-a01d-2905f8e23408",
      description: "Feature on new research by Juhász, Lane, and Rodrik",
    },
    {
      title: "Not a 'side dish': New industrial policy and competition",
      outlet: "CEPR VoxEU",
      date: "2024-04-05",
      type: "article",
      link: "https://cepr.org/voxeu/columns/not-side-dish-new-industrial-policy-and-competition",
      description:
        "Cristina Caffarra and Nathan Lane discuss how new industrial policy and competition interact, arguing industrial policy is not merely a side consideration",
    },
    {
      title: "US industrial policy with Professor Nathan Lane",
      outlet: "The Ballpark Podcast - LSE",
      date: "2024-07-01",
      type: "podcast",
      link: "https://blogs.lse.ac.uk/usappblog/2024/09/02/us-industrial-policy-with-professor-nathan-lane-the-ballpark-podcast/",
      description:
        "Nathan Lane discusses US industrial policy on The Ballpark Podcast from LSE's US Centre",
    },
  ],
  2023: [
    {
      title: "The False Promise of Green Jobs",
      outlet: "The Economist",
      date: "2023-11-14",
      type: "press",
      link: "https://www.economist.com/finance-and-economics/2023/11/14/the-false-promise-of-green-jobs",
      description:
        "Commentary on new economics of industrial policy and green transition",
    },
    {
      title:
        "A few economists are starting to take industrial policy seriously",
      outlet: "Noahpinion",
      date: "2023-10-04",
      type: "article",
      link: "https://www.noahpinion.blog/p/a-few-economists-are-starting-to",
      description:
        "Noah Smith discusses the Industrial Policy Group led by Réka Juhász and Nathan Lane, who've compiled reviews of past research and are making the case that industrial policy is a worthy topic of study",
    },
    {
      title: "This Part of Bidenomics Needs More Economics",
      outlet: "Wall Street Journal",
      date: "2023-07-12",
      type: "article",
      link: "https://www.wsj.com/articles/this-part-of-bidenomics-needs-more-economics-2cea1641",
      description:
        "Greg Ip discusses how Réka Juhász and Nathan Lane founded the Industrial Policy Group to conduct empirical research and compiled a database of industrial policy actions from 2009-2020",
    },
    {
      title: "South Korea's controversial industrial policy",
      outlet: "Trade Talks",
      date: "2023-07-23",
      type: "podcast",
      link: "https://tradetalkspodcast.com/podcast/189-south-koreas-controversial-industrial-policy/",
      description:
        "Nathan Lane discusses South Korea's industrial policy with Chad Bown on Trade Talks podcast episode 189",
    },
    {
      title: "Bottom-Up Bidenomics",
      outlet: "Time Magazine",
      date: "2023-10-16",
      type: "article",
      link: "https://time.com/6324411/bottom-up-bidenomics/",
      description:
        "Analysis of Bidenomics approach to industrial policy and economic development",
    },
    {
      title: "Does Japan's Economy Prove That Neoliberalism Lost?",
      outlet: "Foreign Policy",
      date: "2023-09-14",
      type: "article",
      link: "https://foreignpolicy.com/2023/09/14/japan-economy-neoliberalism-east-asia-washington-consensus-imf/",
      description:
        "Features Nathan Lane discussing the empirical turn in economics and exploring industrial policy despite ideological resistance",
    },
    {
      title:
        "The Biden Administration Can Learn From The States—Industrial Policy Doesn't Work",
      outlet: "Forbes",
      date: "2023-08-16",
      type: "article",
      link: "https://www.forbes.com/sites/adammillsap/2023/08/16/the-biden-administration-can-learn-from-the-states-industrial-policy-doesnt-work/",
      description:
        "Adam Millsap's critique of industrial policy effectiveness based on state-level experiences",
    },
    {
      title: "Economics Must Catch Up On Industrial Policy",
      outlet: "ProMarket",
      date: "2023-03-14",
      type: "article",
      link: "https://www.promarket.org/2023/03/14/economics-must-catch-up-on-industrial-policy/",
      description:
        "Op-ed by Réka Juhász and Nathan Lane on industrial policy research",
    },
    {
      title: "A Flight Plan That Fails",
      outlet: "Boston Review",
      date: "2023-03-01",
      type: "article",
      link: "https://www.bostonreview.net/forum_response/a-flight-plan-that-fails/",
      description: "Nathan Lane's op-ed on industrial policy vision",
    },
    {
      title: "The Who, What, When, and How of Industrial Policy",
      outlet: "STEG CEPR Podcasts",
      date: "2023-03-08",
      type: "podcast",
      link: "https://steg.cepr.org/podcasts/who-what-when-and-how-industrial-policy-nathan-lane",
      description:
        "Nathan Lane discusses industrial policy on CEPR's Conversations on Transformation series, narrated by Tim Phillips",
    },
    {
      title:
        "Governments across the world are discovering 'homeland economics'",
      outlet: "The Economist",
      date: "2023-10-02",
      type: "article",
      link: "https://www.economist.com/special-report/2023/10/02/governments-across-the-world-are-discovering-homeland-economics",
      description:
        "Special report by Callum Williams arguing that introducing industrial policy is a big mistake",
    },
  ],
};
