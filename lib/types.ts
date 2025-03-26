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


  export type SocialPlatform = "facebook" | "instagram" | "linkedin" | "tiktok" | "youtube"

  export interface SocialAccount {
    id: string
    platform: SocialPlatform
    username: string
    followers?: number
    posts?: number
    engagementRate?: number
    lastUpdated: string
  }
  
  export interface MetricCard {
    title: string
    value: string
    trend: "up" | "down"
    change: string
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
      twitter: number
      youtube: number
    }[]
  }
  
  export interface PlatformAnalyticsData {
    metrics: {
      followers: string
      engagement: string
      posts: string
      reach: string
    }
    postPerformance: {
      name: string
      value: number
    }[]
    topContent: {
      id: string
      title: string
      likes: number
      comments: number
    }[]
    demographics: {
      ageGroups: {
        range: string
        percentage: number
      }[]
      gender: {
        male: number
        female: number
      }
    }
  }
  
  