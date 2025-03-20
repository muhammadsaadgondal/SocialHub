export interface UserProfile {
    person: Person
    influencer?: Influencer
    campaignManager?: CampaignManager
  }
  
  
  export interface Person {
    id: string
    username: string
    email: string
    profilePicture?: string
    passwordHash: string
    status: "ACTIVE" | "BLOCKED" | "DELETED"
    lastLogin?: Date
    isActive: boolean
    accountType: "INFLUENCER" | "CAMPAIGN_MANAGER" 
    thirdPartyAuth?: {
      google?: boolean
      facebook?: boolean
      twitter?: boolean
      linkedin?: boolean
    }
    createdAt: Date
    updatedAt: Date
    chats: string[]
    accountId?: string
    blocked: boolean
    verified: boolean
  }

  
  
export interface Influencer {
    id: string
    niche: string
    interests: string[]
    socialMediaProfiles: SocialMediaProfile[]
    registeredConflicts: string[]
    metrics: InfluencerMetrics
    personId: string
    activeCampaignIds: string[]
    pastCampaignIds: string[]
    submittedProposals: string[] 
  }
  
  export interface SocialMediaProfile {
    platform: string
    handle: string
    url: string
    followers: number
  }
  
  export interface InfluencerMetrics {
    followers: number
    engagementRate: number
    reach: number
    averageLikes: number
    conversionRate: number
  }
  
  export interface CampaignManager {
    id: string
    associatedCompany: string
    interests: string[]
    level: string
    pinnedInfluencers: PinnedInfluencer[]
    registeredConflicts: string[]
    personId: string
    activeCampaignIds: string[]
    pastCampaignIds: string[]
  }
  
  export interface PinnedInfluencer {
    id: string
    name: string
    niche: string
    followers: number
  }
  export interface Campaign {
    id: string
    progress: number
    images: string[]
    productLink: string
    deadline: string
    budget: any // Budget object
    status: "DRAFT" | "ACTIVE" | "COMPLETED" | "CANCELLED"
    createdAt: Date
    updatedAt: Date
  
    // Embedded documents
    details?: any // CampaignDetail
    deliverableContent?: any // DeliverableContent
  
    // References
    linkedPostIds: string[]
    activeInfluencerIds: string[]
    pastInfluencerIds: string[]
    activeManagerIds: string[]
    pastManagerIds: string[]
    activeSupervisorIds: string[]
    pastSupervisorIds: string[]
  }  



  // Social account types
export type SocialPlatform = "facebook" | "instagram" | "linkedin"

export interface SocialAccount {
  id: string
  platform: SocialPlatform
  username: string
  connected: boolean
  lastUpdated: string
}

// Analytics types
export interface MetricCard {
  title: string
  value: string
  change: string
  trend: "up" | "down" | "neutral"
}

export interface PlatformMetrics {
  followers: string
  engagement: string
  posts: string
  reach: string
}

export interface PerformanceData {
  name: string
  value: number
}

export interface AudienceDemographic {
  ageGroups: { range: string; percentage: number }[]
  gender: { male: number; female: number; other: number }
}

export interface TopContent {
  id: string
  title: string
  likes: number
  comments: number
  shares: number
  date: string
}

export interface PlatformAnalyticsData {
  metrics: PlatformMetrics
  postPerformance: PerformanceData[]
  topContent: TopContent[]
  demographics: AudienceDemographic
}

export interface OverviewAnalytics {
  metrics: {
    followers: MetricCard
    engagement: MetricCard
    shares: MetricCard
    impressions: MetricCard
  }
  audienceGrowth: {
    name: string
    facebook: number
    instagram: number
    linkedin: number
  }[]
}

export interface SocialDashboardState {
  accounts: SocialAccount[]
  analytics: {
    overview: OverviewAnalytics | null
    platforms: {
      facebook: PlatformAnalyticsData | null
      instagram: PlatformAnalyticsData | null
      linkedin: PlatformAnalyticsData | null
    }
  }
  ui: {
    loading: {
      accounts: boolean
      analytics: boolean
    }
    error: string | null
    selectedPlatform: SocialPlatform | "all"
  }
}

