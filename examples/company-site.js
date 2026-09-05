import { AlpineComponent, afetch } from "../dist/app.mjs"

const defaultSiteConfig = {
    sectionOrder: [
        "header",
        "features",
        "technologies",
        "team",
        "projects",
        "partnerships",
        "partners",
        "successCases",
        "contact",
        "footer",
    ],
    api: {
        siteConfigEndpoint: "./mock/site-config.json",
        highlightsEndpoint: "./mock/company-highlights.json",
        contactEndpoint: "./mock/contact-response.json",
    },
    sections: {
        header: {
            companyName: "Static Company",
            logoText: "SC",
            motto: "We build reliable web platforms for modern businesses",
            links: [
                { label: "About", href: "#features" },
                { label: "Team", href: "#team" },
                { label: "Projects", href: "#projects" },
                { label: "Contact", href: "#contact" },
            ],
            meetingButtonText: "Schedule a meeting",
            meetingUrl: "mailto:hello@staticcompany.example",
        },
        features: {
            title: "What we provide",
            subtitle: "Configurable services your future admin panel can manage",
            items: [
                {
                    title: "Static Site Architecture",
                    description: "Fast, SEO-friendly, maintainable website architecture for growing teams.",
                },
                {
                    title: "REST Integrations",
                    description: "Client-side REST integration with graceful loading, fallback and response handling.",
                },
                {
                    title: "Content Configuration",
                    description: "Section-level content models ready to be driven by an admin panel API.",
                },
                {
                    title: "Design System Adoption",
                    description: "Reusable layout blocks aligned with Bootstrap styles and brand consistency.",
                },
            ],
        },
        technologies: {
            title: "Technology focus",
            filters: ["All", "Frontend", "Backend", "Cloud", "Data"],
            tags: [
                { label: "Alpine.js", group: "Frontend" },
                { label: "Bootstrap", group: "Frontend" },
                { label: "Node.js", group: "Backend" },
                { label: "Express", group: "Backend" },
                { label: "Azure", group: "Cloud" },
                { label: "AWS", group: "Cloud" },
                { label: "PostgreSQL", group: "Data" },
                { label: "Redis", group: "Data" },
                { label: "OpenAPI", group: "Backend" },
                { label: "GitHub Actions", group: "Cloud" },
            ],
        },
        team: {
            title: "Our team",
            members: [
                {
                    name: "Marta Greene",
                    avatar: "MG",
                    position: "Lead Engineer",
                    description: "Leads platform architecture and frontend reliability initiatives.",
                    experienceYears: 11,
                    projectsCount: 27,
                },
                {
                    name: "Daniel Park",
                    avatar: "DP",
                    position: "Solutions Architect",
                    description: "Designs API-first solutions with cloud deployment strategy.",
                    experienceYears: 9,
                    projectsCount: 21,
                },
                {
                    name: "Ivy Morrison",
                    avatar: "IM",
                    position: "Product Designer",
                    description: "Shapes user journeys and design systems for enterprise products.",
                    experienceYears: 8,
                    projectsCount: 19,
                },
                {
                    name: "Noah Carter",
                    avatar: "NC",
                    position: "Delivery Manager",
                    description: "Coordinates delivery flow and project execution for partner teams.",
                    experienceYears: 10,
                    projectsCount: 33,
                },
            ],
        },
        projects: {
            title: "Project highlights",
            items: [
                {
                    type: "E-commerce",
                    title: "Marketplace Revamp",
                    description: "Replatformed storefront with headless APIs and improved checkout conversion.",
                    image: "https://picsum.photos/seed/marketplace/3840/2160",
                },
                {
                    type: "SaaS",
                    title: "Analytics Workspace",
                    description: "Built a configurable analytics dashboard for multi-tenant data monitoring.",
                    image: "https://picsum.photos/seed/analytics/3840/2160",
                },
                {
                    type: "Enterprise",
                    title: "Partner Portal",
                    description: "Delivered a partner collaboration portal integrated with legacy systems.",
                    image: "https://picsum.photos/seed/partner/3840/2160",
                },
            ],
        },
        partnerships: {
            title: "Partnership opportunities",
            items: [
                { title: "Technology Partner", description: "Co-build integrations and shared product accelerators." },
                { title: "Implementation Partner", description: "Deliver projects together with clear responsibility scopes." },
                { title: "Referral Partner", description: "Mutual referrals with transparent lead sharing and handoff." },
                { title: "Reseller Partner", description: "Bundle and resell capabilities to your existing client base." },
            ],
        },
        partners: {
            title: "Trusted by partners",
            items: [
                { name: "BlueNova" },
                { name: "Vertex Labs" },
                { name: "Cloudbees Co" },
                { name: "NorthBridge" },
                { name: "Atlas Digital" },
            ],
        },
        successCases: {
            title: "Success cases",
            items: [
                { title: "Retail modernization", description: "Reduced page load time by 48% and increased conversion by 17%." },
                { title: "B2B onboarding", description: "Cut partner onboarding from 10 days to 48 hours with guided workflows." },
                { title: "Support automation", description: "Introduced automation and reduced first response time by 37%." },
            ],
            highlights: [
                { label: "Delivered projects", value: 120 },
                { label: "Partner organizations", value: 45 },
                { label: "Avg. satisfaction", value: "4.9/5" },
            ],
        },
        contact: {
            title: "Feedback & contact",
            subtitle: "Send us your goals and we will get back within one business day.",
            successMessage: "Thanks! Your request has been recorded.",
        },
        footer: {
            copyright: "© 2026 Static Company. All rights reserved.",
            links: [
                { label: "Privacy", href: "#" },
                { label: "Terms", href: "#" },
                { label: "Careers", href: "#" },
            ],
        },
    },
};

function cloneData(data)
{
    return JSON.parse(JSON.stringify(data));
}

export class companySite extends AlpineComponent {

    static $tag = "company-site"

    site = cloneData(defaultSiteConfig)
    sectionOrder = [...defaultSiteConfig.sectionOrder]
    technologyFilter = "All"
    activeTheme = "light"
    loadingConfig = true
    loadingHighlights = false
    highlightsStatus = ""
    contactForm = { name: "", email: "", message: "" }
    contactStatus = ""
    contactStatusType = "secondary"
    // debug instrumentation removed
    carouselIndex = 0

    get filteredTechnologies() {
        const tags = this.site?.sections?.technologies?.tags || [];
        if (this.technologyFilter == "All") return tags;
        return tags.filter((tag) => tag.group == this.technologyFilter);
    }

    setSectionOrder(order) {
        if (!Array.isArray(order) || !order.length) return;
        this.sectionOrder = order.filter((name) => !!this.site?.sections?.[name]);
    }

    setTheme(theme) {
        this.activeTheme = theme == "dark" ? "dark" : "light";
        document.documentElement.setAttribute("data-bs-theme", this.activeTheme);
        localStorage.setItem("company-theme", this.activeTheme);
    }

    toggleTheme() {
        this.setTheme(this.activeTheme == "light" ? "dark" : "light");
    }

    async onCreate()
    {
        this.restoreTheme();
        await this.loadSiteConfig();
        this.loadHighlights();
    }

    restoreTheme()
    {
        const storedTheme = localStorage.getItem("company-theme");
        this.setTheme(storedTheme || this.activeTheme);
    }

    async loadSiteConfig()
    {
        this.loadingConfig = true;
        const endpoint = this.site?.api?.siteConfigEndpoint;
        const { ok, data } = await afetch(endpoint);

        if (ok && data?.sections && data?.sectionOrder) {
            this.site = data;
            this.setSectionOrder(data.sectionOrder);
            // reset carousel index when new config loads
            this.carouselIndex = 0;
        } else {
            this.site = cloneData(defaultSiteConfig);
            this.setSectionOrder(this.site.sectionOrder);
        }
        this.loadingConfig = false;
    }

    async loadHighlights()
    {
        this.loadingHighlights = true;
        this.highlightsStatus = "Loading latest company highlights...";

        const endpoint = this.site?.api?.highlightsEndpoint;
        const { ok, data } = await afetch(endpoint);

        if (ok && Array.isArray(data?.highlights)) {
            this.site.sections.successCases.highlights = data.highlights;
            this.highlightsStatus = "Highlights loaded from REST endpoint.";
        } else {
            this.highlightsStatus = "Using mock highlights data (API unavailable).";
        }
        this.loadingHighlights = false;
    }

    async submitContact()
    {
        this.contactStatus = "Submitting...";
        this.contactStatusType = "secondary";

        const endpoint = this.site?.api?.contactEndpoint;
        const payload = {
            ...this.contactForm,
            sentAt: new Date().toISOString(),
        };

        const useStaticJsonResponse = /\.json($|\?)/.test(endpoint || "");
        const { ok, data } = useStaticJsonResponse ?
            await afetch(endpoint) :
            await afetch(endpoint, {
                method: "POST",
                body: payload,
            });

        if (ok) {
            this.contactStatus = data?.message || this.site?.sections?.contact?.successMessage || "Request submitted successfully.";
            this.contactStatusType = "success";
            this.contactForm = { name: "", email: "", message: "" };
        } else {
            this.contactStatus = "Backend endpoint is not available, mock submission saved locally.";
            this.contactStatusType = "warning";
        }
    }

    carouselPrev()
    {
        // navigate previous
        const items = this.site?.sections?.projects?.items || [];
        if (!items.length) return;
        const newIdx = (this.carouselIndex - 1 + items.length) % items.length;
        // update reactive index
        this.carouselIndex = newIdx;
    }

    carouselNext()
    {
        // navigate next
        const items = this.site?.sections?.projects?.items || [];
        if (!items.length) return;
        const newIdx = (this.carouselIndex + 1) % items.length;
        // update reactive index
        this.carouselIndex = newIdx;
    }
}
