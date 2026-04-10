export const PARTNER_SERVICES = [
    {
        label: "Coaching",
        value: "coaching",
        description: "Professional training sessions, drills, and skill development."
    },
    {
        label: "Facility Management",
        value: "facility",
        description: "Venue operations, court bookings, and sports center management."
    },
    {
        label: "Equipment Supply",
        value: "equipment",
        description: "Providing gear, shuttlecocks, rackets, and sports apparel."
    },
    {
        label: "Event Management",
        value: "event",
        description: "Organizing tournaments, camps, and corporate sports events."
    },
    {
        label: "Refereeing & Officiating",
        value: "refereeing",
        description: "Certified match officiating and tournament supervision."
    },
    {
        label: "Sports Physiotherapy",
        value: "physiotherapy",
        description: "Injury rehabilitation and sports-specific recovery services."
    },
    {
        label: "Marketing & Sponsorship",
        value: "marketing",
        description: "Brand promotion, athlete management, and event sponsorship."
    }
]

export const SERVICE_PRODUCTS = {
    coaching: [
        { id: "p1", name: "Personal Coaching (1 Hour)", price: 1200, category: "Individual", description: "One-on-one session with a certified professional." },
        { id: "p2", name: "Group Training (Monthly)", price: 4500, category: "Batch", description: "Regular group practice sessions (3 days/week)." },
        { id: "p3", name: "Foundational Drills Workshop", price: 800, category: "Workshop", description: "Single intensive session focused on footwork and basics." }
    ],
    facility: [
        { id: "p4", name: "Wooden Court Booking (Peak)", price: 600, category: "Rental", description: "Premium wooden court rental per hour during rush hours." },
        { id: "p5", name: "Synthetic Court Booking", price: 450, category: "Rental", description: "Standard synthetic court rental per hour." },
        { id: "p6", name: "Venues Monthly Pass", price: 3000, category: "Subscription", description: "Unlimited court access during non-peak hours." }
    ],
    equipment: [
        { id: "p7", name: "Pro Graphite Racket", price: 5500, category: "Gear", description: "High-tension lightweight graphite racket for advanced players." },
        { id: "p8", name: "Aerosensa-40 Shuttlecocks", price: 1800, category: "Consumable", description: "Tube of 12 premium goose feather shuttlecocks." },
        { id: "p9", name: "Pro Grip (Pack of 3)", price: 450, category: "Accessory", description: "Ant-slip high absorption overgrips." }
    ],
    event: [
        { id: "p10", name: "Corporate Tournament Pass", price: 15000, category: "Event", description: "Complete tournament organization for corporate teams." },
        { id: "p11", name: "Weekend Summer Camp", price: 2500, category: "Camp", description: "2-day intensive training camp for kids." }
    ],
    refereeing: [
        { id: "p12", name: "BWF Certified Umpire (Daily)", price: 3500, category: "Service", description: "Daily fee for certified match officiating." },
        { id: "p13", name: "Line Judge Service (Tournament)", price: 1200, category: "Service", description: "Standard officiating service per court day." }
    ],
    physiotherapy: [
        { id: "p14", name: "Post-Match Recovery Session", price: 1500, category: "Medical", description: "45-minute deep tissue massage and recovery drills." },
        { id: "p15", name: "Injury Assessment", price: 800, category: "Medical", description: "Consultation and diagnostic for sports-related pain." }
    ],
    marketing: [
        { id: "p16", name: "Social Media Promotion", price: 5000, category: "Marketing", description: "Featured post across all network handles for 1 week." },
        { id: "p17", name: "Player Management (Quarterly)", price: 12000, category: "Management", description: "Sponsorship and brand management for emerging talent." }
    ]
}
