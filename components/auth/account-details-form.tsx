"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from "lucide-react"
import type { SignUpUserData } from "./signup-form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Define the base schema for all account types
const baseDetailsSchema = z.object({
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  phone: z.string().optional(),
  website: z
    .string()
    .url({
      message: "Please enter a valid URL.",
    })
    .optional()
    .or(z.literal("")),

  // Terms and privacy policy acceptance
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms and privacy policy." }),
  }),
})

// Define additional fields for influencers
const influencerSchema = baseDetailsSchema.extend({
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  contentCategories: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
})

// Define additional fields for campaign managers
const campaignManagerSchema = baseDetailsSchema.extend({
  associatedCompany: z.string().min(2, {
    message: "Company name must be at least 2 characters.",
  }),
  interests: z.array(z.string()).optional(),
  level: z.string().optional(),
})

// Define additional fields for supervisors
const supervisorSchema = baseDetailsSchema.extend({
  department: z.string().min(2, {
    message: "Department must be at least 2 characters.",
  }),
  position: z.string().min(2, {
    message: "Position must be at least 2 characters.",
  }),
})

// Define additional fields for regular persons
const personSchema = baseDetailsSchema.extend({
  interests: z.array(z.string()).optional(),
  occupation: z.string().optional(),
})

// Content categories for influencers
const contentCategories = [
  { id: "fashion", label: "Fashion" },
  { id: "beauty", label: "Beauty" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "food", label: "Food & Cooking" },
  { id: "fitness", label: "Fitness & Health" },
  { id: "tech", label: "Technology" },
  { id: "gaming", label: "Gaming" },
  { id: "business", label: "Business & Finance" },
  { id: "education", label: "Education" },
  { id: "entertainment", label: "Entertainment" },
]

// Interest categories for persons and other account types
const interestCategories = [
  { id: "technology", label: "Technology" },
  { id: "arts", label: "Arts & Culture" },
  { id: "sports", label: "Sports" },
  { id: "music", label: "Music" },
  { id: "travel", label: "Travel" },
  { id: "food", label: "Food & Dining" },
  { id: "health", label: "Health & Wellness" },
  { id: "education", label: "Education" },
  { id: "science", label: "Science" },
  { id: "fashion", label: "Fashion" },
]

// Level options for campaign managers
const levelOptions = [
  { id: "AMATEUR", label: "Amateur" },
  { id: "INTERMEDIATE", label: "Intermediate" },
  { id: "PROFESSIONAL", label: "Professional" },
];

interface AccountDetailsFormProps {
  accountType: "ADMIN" | "INFLUENCER" | "CAMPAIGN_MANAGER" | "SUPERVISOR" | "PERSON"
  onSubmit: (data: Partial<SignUpUserData>) => Promise<void>
}

export function AccountDetailsForm({ accountType, onSubmit }: AccountDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Determine which schema to use based on account type
  let formSchema: any
  switch (accountType) {
    case "INFLUENCER":
      formSchema = influencerSchema
      break
    case "CAMPAIGN_MANAGER":
      formSchema = campaignManagerSchema
      break
    case "SUPERVISOR":
      formSchema = supervisorSchema
      break
    case "PERSON":
      formSchema = personSchema
      break
    default:
      formSchema = baseDetailsSchema
  }

  // Initialize form with the appropriate schema
  const form = useForm<any>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      fullName: "",
      phone: "",
      website: "",
      acceptTerms: false,

      // Influencer fields
      instagram: "",
      facebook: "",
      contentCategories: [],
      interests: [],

      // Campaign Manager fields
      associatedCompany: "",
      level: "INTERMEDIATE",

      // Supervisor fields
      department: "",
      position: "",

      // Person fields
      occupation: "",
    },
  })

  // Handle form submission
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true)
    try {
      // Transform form data to match the expected structure for createUser function
      const formattedData: Partial<SignUpUserData> = {
        username: data.username,
        fullName: data.fullName,
        phone: data.phone,
        website: data.website,
        status: "ACTIVE", // Default status for new users
      }

      // Add role-specific data
      if (accountType === "INFLUENCER") {
        // Format social media profiles
        const socialMediaProfiles = []

        if (data.instagram) {
          socialMediaProfiles.push({
            platform: "instagram",
            handle: data.instagram,
            url: `https://instagram.com/${data.instagram}`,
            followers: 0, // Default value, can be updated later
          })
        }

        if (data.facebook) {
          socialMediaProfiles.push({
            platform: "facebook",
            handle: data.facebook,
            url: `https://facebook.com/${data.facebook}`,
            followers: 0,
          })
        }

        formattedData.socialMediaProfiles = socialMediaProfiles
        formattedData.niche = data.contentCategories?.[0] || "" // Primary niche
        formattedData.interests = data.interests || []
      }

      // Add campaign manager data
      if (accountType === "CAMPAIGN_MANAGER") {
        formattedData.associatedCompany = data.associatedCompany
        formattedData.level = data.level || "INTERMEDIATE"
        formattedData.interests = data.interests || []
      }

      await onSubmit(formattedData)
    } catch (error) {
      console.error("Error submitting account details:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Helper function to get the second tab label based on account type
  const getSecondTabLabel = () => {
    switch (accountType) {
      case "INFLUENCER":
        return "Social Media"
      case "CAMPAIGN_MANAGER":
        return "Company Details"
      case "SUPERVISOR":
        return "Work Details"
      case "PERSON":
        return "Personal Details"
      default:
        return "Additional Info"
    }
  }

  // Render the appropriate form based on account type
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="additional">{getSecondTabLabel()}</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab - Common for all account types */}
          <TabsContent value="basic" className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
                  </FormControl>
                  <FormDescription>Your unique username that others will see</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>Your full name or display name</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            {accountType === "SUPERVISOR" ? (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="+1 (555) 123-4567" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}


            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormDescription>Your personal or business website</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>

          {/* Social Media Tab - For Influencers */}
          {accountType === "INFLUENCER" && (
            <TabsContent value="additional" className="space-y-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="instagram"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormDescription>Your Instagram username (without @)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="facebook"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="username" {...field} />
                      </FormControl>
                      <FormDescription>Your Facebook username</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contentCategories"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Content Categories</FormLabel>
                      <FormDescription>Select the categories that best describe your content</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {contentCategories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="contentCategories"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      return checked
                                        ? field.onChange([...current, category.id])
                                        : field.onChange(current.filter((value: string) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{category.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Interests</FormLabel>
                      <FormDescription>Select your personal areas of interest</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {interestCategories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      return checked
                                        ? field.onChange([...current, category.id])
                                        : field.onChange(current.filter((value: string) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{category.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          )}

          {/* Campaign Manager Tab */}
          {accountType === "CAMPAIGN_MANAGER" && (
            <TabsContent value="additional" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="associatedCompany"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Associated Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Your Company" {...field} />
                    </FormControl>
                    <FormDescription>The name of your company or organization</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Experience Level</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your experience level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {levelOptions.map((option) => (
                          <SelectItem key={option.id} value={option.id}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Your level of experience in campaign management</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Interests</FormLabel>
                      <FormDescription>Select your areas of interest or industries you work with</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {interestCategories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      return checked
                                        ? field.onChange([...current, category.id])
                                        : field.onChange(current.filter((value: string) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{category.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          )}

          {/* Supervisor Tab */}
          {accountType === "SUPERVISOR" && (
            <TabsContent value="additional" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Horizon tech, OperationX" {...field} />
                    </FormControl>
                    <FormDescription>The department you supervise</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Senior Manager, Director" {...field} />
                    </FormControl>
                    <FormDescription>Your position or title</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          )}

          {/* Person Tab */}
          {accountType === "PERSON" && (
            <TabsContent value="additional" className="space-y-4 pt-4">
              <FormField
                control={form.control}
                name="occupation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Occupation</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Software Developer, Teacher" {...field} />
                    </FormControl>
                    <FormDescription>Your current occupation or profession</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="interests"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel>Interests</FormLabel>
                      <FormDescription>Select your areas of interest</FormDescription>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {interestCategories.map((category) => (
                        <FormField
                          key={category.id}
                          control={form.control}
                          name="interests"
                          render={({ field }) => {
                            return (
                              <FormItem key={category.id} className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                      const current = field.value || []
                                      return checked
                                        ? field.onChange([...current, category.id])
                                        : field.onChange(current.filter((value: string) => value !== category.id))
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">{category.label}</FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>
          )}
        </Tabs>

        {/* Terms and Conditions - Common for all account types */}
        <FormField
          control={form.control}
          name="acceptTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I accept the terms of service and privacy policy</FormLabel>
                <FormDescription>
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-primary hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </FormDescription>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full  bg-purple-600 hover:bg-purple-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Complete Sign Up"
          )}
        </Button>
      </form>
    </Form>
  )
}