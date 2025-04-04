// Mock data for testing the influencer profile pages

export interface Campaign {
    id: string
    title: string
    brand: string
    date: string
    performance: string
    image: string
    engagement: string
    reach: string
    description?: string
  }
  
  export interface Influencer {
    id: string
    name: string
    image: string
    tags: string[]
    followers: string
    likes: string
    impressions: string
    bio: string
    location: string
    engagement: string
    languages: string[]
    socialLinks: {
      instagram: string
      twitter: string
      website?: string
      tiktok?: string
      youtube?: string
      linkedin?: string
    }
    pricing?: {
      post: string
      story: string
      video: string
    }
    categories: string[]
    campaigns: Campaign[]
  }
  
  export const mockInfluencers: Influencer[] = [
    {
      id: "dur-e-fishaan",
      name: "Dur-e-Fishaan",
      image: "https://i.pinimg.com/736x/0f/c9/63/0fc96370a4644ee098d412b038cfce00.jpg",
      tags: ["Actress", "Model"],
      followers: "2.2M",
      likes: "1.8M",
      impressions: "500K",
      bio: "Award-winning actress and fashion model with a passion for storytelling through visual arts. Known for authentic content and strong audience engagement.",
      location: "Lahore, Pakistan",
      engagement: "4.2%",
      languages: ["English", "Urdu"],
      categories: ["Fashion", "Lifestyle", "Beauty"],
      socialLinks: {
        instagram: "https://instagram.com/durefishaan",
        twitter: "https://twitter.com/durefishaan",
        website: "https://durefishaan.com",
        tiktok: "https://tiktok.com/@durefishaan",
      },
      pricing: {
        post: "$2,500",
        story: "$1,200",
        video: "$4,000",
      },
      campaigns: [
        {
          id: "c1",
          title: "Summer Fashion Collection",
          brand: "Sapphire",
          date: "June 2023",
          performance: "High engagement",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "6.8%",
          reach: "1.5M",
          description:
            "Promoted the summer collection through a series of styled photoshoots and behind-the-scenes content.",
        },
        {
          id: "c2",
          title: "Beauty Product Launch",
          brand: "L'Oréal",
          date: "March 2023",
          performance: "Exceeded targets",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.2%",
          reach: "1.2M",
          description: "Featured new skincare line with tutorial videos and before/after results.",
        },
        {
          id: "c3",
          title: "Luxury Fragrance",
          brand: "Dior",
          date: "December 2022",
          performance: "High conversion",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "4.9%",
          reach: "980K",
          description: "Holiday campaign featuring limited edition fragrances.",
        },
      ],
    },
    {
      id: "irfan-junejo",
      name: "Irfan Junejo",
      image: "https://i.pinimg.com/736x/af/8e/c4/af8ec4d803efdfe7c4f00e2846d65a2b.jpg",
      tags: ["Photographer", "Businessman"],
      followers: "5.2M",
      likes: "10.8M",
      impressions: "1500K",
      bio: "Content creator and photographer specializing in travel and lifestyle content. Known for authentic storytelling and high-quality visuals.",
      location: "Karachi, Pakistan",
      engagement: "3.8%",
      languages: ["English", "Urdu"],
      categories: ["Travel", "Technology", "Lifestyle"],
      socialLinks: {
        instagram: "https://instagram.com/irfanjunejo",
        twitter: "https://twitter.com/irfanjunejo",
        website: "https://irfanjunejo.com",
        youtube: "https://youtube.com/irfanjunejo",
      },
      pricing: {
        post: "$3,500",
        story: "$1,800",
        video: "$6,000",
      },
      campaigns: [
        {
          id: "c4",
          title: "Travel Vlog Series",
          brand: "Emirates",
          date: "July 2023",
          performance: "Viral content",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "7.2%",
          reach: "3.8M",
          description: "Created a 5-part travel series exploring hidden gems in the UAE.",
        },
        {
          id: "c5",
          title: "Camera Launch",
          brand: "Sony",
          date: "May 2023",
          performance: "High conversion",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.5%",
          reach: "2.1M",
          description: "Featured the new Sony Alpha camera with sample photography and technical reviews.",
        },
        {
          id: "c6",
          title: "Adventure Gear",
          brand: "North Face",
          date: "February 2023",
          performance: "Above average",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "4.3%",
          reach: "1.7M",
          description: "Showcased outdoor gear during a mountain expedition.",
        },
      ],
    },
    {
      id: "hamza-bhatti",
      name: "Hamza Bhatti",
      image: "https://i.pinimg.com/736x/01/e5/ec/01e5ecf5d53e3d73dbda7e1c63a91a14.jpg",
      tags: ["Content Creator", "Model"],
      followers: "1.2M",
      likes: "11.8M",
      impressions: "100L",
      bio: "Digital content creator focusing on lifestyle, fashion, and fitness. Known for creative visual storytelling and authentic brand partnerships.",
      location: "Islamabad, Pakistan",
      engagement: "5.1%",
      languages: ["English", "Urdu", "Punjabi"],
      categories: ["Fitness", "Fashion", "Lifestyle"],
      socialLinks: {
        instagram: "https://instagram.com/hamzabhatti",
        twitter: "https://twitter.com/hamzabhatti",
        tiktok: "https://tiktok.com/@hamzabhatti",
      },
      pricing: {
        post: "$1,800",
        story: "$900",
        video: "$3,200",
      },
      campaigns: [
        {
          id: "c7",
          title: "Fitness Challenge",
          brand: "Under Armour",
          date: "August 2023",
          performance: "High engagement",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "6.3%",
          reach: "950K",
          description: "30-day fitness challenge with daily workout routines and nutrition tips.",
        },
        {
          id: "c8",
          title: "Streetwear Collection",
          brand: "Adidas",
          date: "April 2023",
          performance: "Strong ROI",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.7%",
          reach: "880K",
          description: "Urban photoshoot featuring the latest streetwear styles.",
        },
      ],
    },
    {
      id: "peter-mackinon",
      name: "Peter Mackinon",
      image: "https://i.pinimg.com/736x/16/be/dd/16beddce254919cf799705b9941e9359.jpg",
      tags: ["Photographer", "Model"],
      followers: "1.2M",
      likes: "5.8M",
      impressions: "900K",
      bio: "Professional photographer and creative director specializing in landscape and portrait photography. Educator and workshop leader.",
      location: "Toronto, Canada",
      engagement: "4.8%",
      languages: ["English", "French"],
      categories: ["Photography", "Travel", "Technology"],
      socialLinks: {
        instagram: "https://instagram.com/petermackinon",
        twitter: "https://twitter.com/petermackinon",
        website: "https://petermackinon.com",
        youtube: "https://youtube.com/petermackinon",
      },
      pricing: {
        post: "$3,200",
        story: "$1,500",
        video: "$5,500",
      },
      campaigns: [
        {
          id: "c9",
          title: "Photography Masterclass",
          brand: "Adobe",
          date: "September 2023",
          performance: "High conversion",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "7.1%",
          reach: "980K",
          description: "Series of tutorial videos showcasing Adobe Lightroom techniques.",
        },
        {
          id: "c10",
          title: "Travel Photography",
          brand: "National Geographic",
          date: "June 2023",
          performance: "Award winning",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "8.2%",
          reach: "1.1M",
          description: "Documentary-style content featuring remote locations and wildlife photography.",
        },
        {
          id: "c11",
          title: "Camera Accessories",
          brand: "Peak Design",
          date: "March 2023",
          performance: "High ROI",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.9%",
          reach: "870K",
          description: "Product reviews and field tests of photography gear and accessories.",
        },
      ],
    },
    {
      id: "saad-gondal",
      name: "Saad Gondal",
      image: "https://i.pinimg.com/736x/a6/cc/0a/a6cc0a9b88145eb67a9239d6cfa10590.jpg",
      tags: ["Entrepreneur", "Model"],
      followers: "10.1M",
      likes: "1.8M",
      impressions: "500K",
      bio: "Serial entrepreneur and business coach sharing insights on startups, digital marketing, and personal development.",
      location: "Dubai, UAE",
      engagement: "3.5%",
      languages: ["English", "Urdu", "Arabic"],
      categories: ["Business", "Technology", "Motivation"],
      socialLinks: {
        instagram: "https://instagram.com/saadgondal",
        twitter: "https://twitter.com/saadgondal",
        website: "https://saadgondal.com",
        linkedin: "https://linkedin.com/in/saadgondal",
      },
      pricing: {
        post: "$4,500",
        story: "$2,200",
        video: "$7,500",
      },
      campaigns: [
        {
          id: "c12",
          title: "Business Masterclass",
          brand: "Udemy",
          date: "October 2023",
          performance: "High enrollment",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "4.8%",
          reach: "2.3M",
          description: "Online course promotion with testimonials and preview content.",
        },
        {
          id: "c13",
          title: "Productivity Tools",
          brand: "Monday.com",
          date: "July 2023",
          performance: "Strong conversion",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "3.9%",
          reach: "1.8M",
          description: "Tutorial series on project management and team productivity.",
        },
      ],
    },
    {
      id: "muhammad-abdullah",
      name: "Muhammad Abdullah",
      image: "https://i.pinimg.com/736x/e2/39/31/e239317d8fa2b8704beaa834dd1a73b4.jpg",
      tags: ["Photographer", "Model"],
      followers: "12M",
      likes: "18M",
      impressions: "10M",
      bio: "Visual storyteller specializing in portrait and street photography. Known for capturing authentic moments and urban landscapes.",
      location: "Lahore, Pakistan",
      engagement: "4.7%",
      languages: ["English", "Urdu"],
      categories: ["Photography", "Art", "Urban"],
      socialLinks: {
        instagram: "https://instagram.com/muhammadabdullah",
        twitter: "https://twitter.com/muhammadabdullah",
        website: "https://muhammadabdullah.com",
      },
      pricing: {
        post: "$5,000",
        story: "$2,500",
        video: "$8,000",
      },
      campaigns: [
        {
          id: "c14",
          title: "Urban Photography",
          brand: "Fujifilm",
          date: "November 2023",
          performance: "Featured in gallery",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "6.2%",
          reach: "3.5M",
          description: "Street photography series showcasing camera capabilities in low light conditions.",
        },
        {
          id: "c15",
          title: "Portrait Series",
          brand: "Profoto",
          date: "August 2023",
          performance: "Award winning",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.8%",
          reach: "2.8M",
          description: "Professional lighting techniques demonstrated through portrait photography.",
        },
        {
          id: "c16",
          title: "Photography Workshop",
          brand: "Canon",
          date: "May 2023",
          performance: "Sold out event",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "7.1%",
          reach: "2.2M",
          description: "Live workshop promotion and behind-the-scenes content.",
        },
      ],
    },
    {
      id: "harvey-specter",
      name: "Harvey Specter",
      image: "https://i.pinimg.com/736x/40/7c/06/407c0684509f7ac9dfc3e3ad8cfb1bb5.jpg",
      tags: ["Closer", "Model"],
      followers: "21.2M",
      likes: "11.8M",
      impressions: "12M",
      bio: "Business strategist and motivational speaker. Sharing insights on leadership, negotiation, and professional success.",
      location: "New York, USA",
      engagement: "5.3%",
      languages: ["English"],
      categories: ["Business", "Lifestyle", "Motivation"],
      socialLinks: {
        instagram: "https://instagram.com/harveyspecter",
        twitter: "https://twitter.com/harveyspecter",
        website: "https://harveyspecter.com",
        linkedin: "https://linkedin.com/in/harveyspecter",
      },
      pricing: {
        post: "$8,000",
        story: "$4,000",
        video: "$12,000",
      },
      campaigns: [
        {
          id: "c17",
          title: "Luxury Watches",
          brand: "Rolex",
          date: "December 2023",
          performance: "Premium engagement",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "6.7%",
          reach: "5.8M",
          description: "Lifestyle content featuring luxury timepieces in professional settings.",
        },
        {
          id: "c18",
          title: "Business Attire",
          brand: "Tom Ford",
          date: "September 2023",
          performance: "High conversion",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.9%",
          reach: "4.2M",
          description: "Professional styling and formal wear showcase.",
        },
        {
          id: "c19",
          title: "Leadership Summit",
          brand: "Harvard Business School",
          date: "June 2023",
          performance: "Sold out event",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "7.2%",
          reach: "3.9M",
          description: "Keynote speaker promotion and event highlights.",
        },
      ],
    },
    {
      id: "rachel-zane",
      name: "Rachel Zane",
      image: "https://i.pinimg.com/736x/eb/cf/f4/ebcff47f4ba02839e074ecdad26854ec.jpg",
      tags: ["Actress", "Model"],
      followers: "20.2M",
      likes: "11.8M",
      impressions: "500K",
      bio: "Actress, fashion icon, and philanthropist. Passionate about sustainable fashion and women empowerment initiatives.",
      location: "Los Angeles, USA",
      engagement: "4.9%",
      languages: ["English", "French"],
      categories: ["Fashion", "Lifestyle", "Philanthropy"],
      socialLinks: {
        instagram: "https://instagram.com/rachelzane",
        twitter: "https://twitter.com/rachelzane",
        website: "https://rachelzane.com",
      },
      pricing: {
        post: "$7,500",
        story: "$3,800",
        video: "$11,000",
      },
      campaigns: [
        {
          id: "c20",
          title: "Sustainable Fashion",
          brand: "Stella McCartney",
          date: "November 2023",
          performance: "High impact",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "6.3%",
          reach: "4.7M",
          description: "Eco-friendly fashion line promotion with focus on sustainable materials.",
        },
        {
          id: "c21",
          title: "Luxury Skincare",
          brand: "La Mer",
          date: "August 2023",
          performance: "Premium engagement",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "5.8%",
          reach: "3.9M",
          description: "Skincare routine featuring luxury products and application techniques.",
        },
        {
          id: "c22",
          title: "Women Empowerment",
          brand: "UN Women",
          date: "March 2023",
          performance: "High awareness",
          image: "/placeholder.svg?height=200&width=300",
          engagement: "7.5%",
          reach: "5.2M",
          description: "Charity campaign raising awareness for women's education in developing countries.",
        },
      ],
    },
  ]
  
  // Helper function to get an influencer by ID
  export function getInfluencerById(id: string): Influencer | undefined {
    return mockInfluencers.find((influencer) => influencer.id === id)
  }
  
  // Helper function to get all influencers
  export function getAllInfluencers(): Influencer[] {
    return mockInfluencers
  }
  
  // Helper function to get filtered influencers
  export function getFilteredInfluencers(category: string): Influencer[] {
    if (category === "trending") {
      return mockInfluencers
    }
  
    return mockInfluencers.filter((influencer) =>
      influencer.categories.some((cat) => cat.toLowerCase() === category.toLowerCase()),
    )
  }
  