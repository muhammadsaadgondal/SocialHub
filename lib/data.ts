import type { Person, UserProfile } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

// Function to get all users with optional filtering
export async function getAllUsers(query = "", accountType = ""): Promise<Person[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/person`)

        if (!response.ok) {
            throw new Error(`Error fetching users: ${response.statusText}`)
        }

        const users: Person[] = await response.json().then(data => data.data)

        // Filter users based on query and account type on the client side
        // In a production app, you might want to add query params to your API
        return users.filter((user) => {
            const matchesQuery = query
                ? user.username.toLowerCase().includes(query.toLowerCase()) ||
                user.email.toLowerCase().includes(query.toLowerCase())
                : true

            const matchesType = accountType && accountType !== "ALL" ? user.accountType === accountType : true

            return matchesQuery && matchesType
        })
    } catch (error) {
        console.error("Failed to fetch users:", error)
        return []
    }
}

// Function to get a single user profile by ID
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
        // Fetch the person data
        const personResponse = await fetch(`${API_BASE_URL}/admin/person/${userId}`)

        if (!personResponse.ok) {
            throw new Error(`Error fetching person: ${personResponse.statusText}`)
        }

        const person: Person = await personResponse.json().then(data => data.data)
        // console.log(person);

        // Initialize the user profile with the person data
        const userProfile: UserProfile = { person }

        // Fetch role-specific data based on account type
        switch (person.accountType) {

            case "INFLUENCER":
                const influencerResponse = await fetch(`${API_BASE_URL}/admin/influencer/${person.id}`)
                if (influencerResponse.ok) {
                    const temp = await influencerResponse.json();
                    userProfile.influencer = temp.data.data;
                    console.log(temp);
                }
                // console.log("OUT HERE");
                // console.log(influencerResponse);

                break


            case "CAMPAIGN_MANAGER":
                const managerResponse = await fetch(`${API_BASE_URL}/admin/campaignManager/${person.id}`)
                if (managerResponse.ok) {
                    userProfile.campaignManager = await managerResponse.json()
                }
                break

        }
        // console.log(userProfile);

        return userProfile
    } catch (error) {
        console.error("Failed to fetch user profile:", error)
        return null
    }
}

// Function to create a new user
export async function createUser(userData: any): Promise<any> {
    try {
        // First create the person

        console.log(userData)
        const personResponse = await fetch(`${API_BASE_URL}/admin/person`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: userData.username,
                email: userData.email,
                passwordHash: userData.passwordHash, // Now included from the form
                profilePicture: userData.profilePicture,
                status: userData.status,
                accountType: userData.accountType,
                isActive: userData.isActive,
                verified: userData.verified,
                // Add other person fields as needed
            }),
        })

        if (!personResponse.ok) {
            throw new Error(`Error creating person: ${personResponse.statusText}`)
        }

        const person = await personResponse.json()

        console.log(person);
        // Then create the role-specific record
        let roleResponse
        switch (userData.accountType) {
            case "ADMIN":
                roleResponse = await fetch(`${API_BASE_URL}/admin/admin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId: person.data.id,
                        phoneNumber: userData.phoneNumber,
                        guidelines: userData.guidelines,
                    }),
                })
                break

            case "INFLUENCER":
                roleResponse = await fetch(`${API_BASE_URL}/admin/influencer`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId: person.data.id,
                        niche: userData.niche,
                        interests: userData.interests,
                        metrics: { followers: 0, engagementRate: 0 }
                    }),
                })
                break

            case "CAMPAIGN_MANAGER":
                roleResponse = await fetch(`${API_BASE_URL}/admin/campaignManager`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId: person.data.id,
                        associatedCompany: userData.associatedCompany,
                        interests: userData.interests,
                        level: userData.level,
                        // Add other campaign manager fields as needed
                    }),
                })
                break

            case "SUPERVISOR":
                console.log("SENT", userData);

                roleResponse = await fetch(`${API_BASE_URL}/admin/supervisor`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId: person.data.id,
                        companyName: userData.companyName,
                        level: userData.level,
                        storeLinks: userData.storeLinks,
                        // Add other supervisor fields as needed
                    }),
                })
                break
        }

        if (roleResponse && !roleResponse.ok) {
            // If role creation fails, we should ideally delete the person we just created
            // to avoid orphaned records
            await fetch(`${API_BASE_URL}/admin/person/${person.id}`, {
                method: "DELETE",
            })

            throw new Error(`Error creating role: ${roleResponse.statusText}`)
        }

        return person
    } catch (error) {
        console.error("Failed to create user:", error)
        throw error
    }
}

// Function to update an existing user
export async function updateUser(userId: string, userData: any): Promise<any> {
    try {
        // Prepare the person update data
        const personUpdateData: any = {
            username: userData.username,
            email: userData.email,
            profilePicture: userData.profilePicture,
            status: userData.status,
            accountType: userData.accountType,
            isActive: userData.isActive,
            verified: userData.verified,
        }

        // Only include passwordHash if it was provided
        if (userData.passwordHash) {
            personUpdateData.passwordHash = userData.passwordHash
        }

        // First update the person
        const personResponse = await fetch(`${API_BASE_URL}/admin/person/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(personUpdateData),
        })

        if (!personResponse.ok) {
            throw new Error(`Error updating person: ${personResponse.statusText}`)
        }

        const person = await personResponse.json()

        // Then update the role-specific record
        let roleResponse
        switch (userData.accountType) {
            case "ADMIN":
                roleResponse = await fetch(`${API_BASE_URL}/admin/admin/person/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId:userId,
                        phoneNumber: userData.phoneNumber,
                        guidelines: userData.guidelines,
                    }),
                })
                break

            case "INFLUENCER":
                roleResponse = await fetch(`${API_BASE_URL}/admin/influencer/person/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId:userId,
                        niche: userData.niche,
                        interests: userData.interests,
                        // Add other influencer fields as needed
                    }),
                })
                break

            case "CAMPAIGN_MANAGER":
                roleResponse = await fetch(`${API_BASE_URL}/admin/campaignManager/person/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId:userId,
                        associatedCompany: userData.associatedCompany,
                        interests: userData.interests,
                        level: userData.level,
                        // Add other campaign manager fields as needed
                    }),
                })
                break

            case "SUPERVISOR":
                roleResponse = await fetch(`${API_BASE_URL}/admin/supervisor/person/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        personId:userId,
                        companyName: userData.companyName,
                        level: userData.level,
                        storeLinks: userData.storeLinks,
                        // Add other supervisor fields as needed
                    }),
                })
                break
        }

        if (roleResponse && !roleResponse.ok) {
            throw new Error(`Error updating role: ${roleResponse.statusText}`)
        }

        return person
    } catch (error) {
        console.error("Failed to update user:", error)
        throw error
    }
}

// Function to delete a user
export async function deleteUser(userId: string): Promise<void> {
    try {
        // Get the user to determine their role
        const userResponse = await fetch(`${API_BASE_URL}/admin/person/${userId}`)

        if (!userResponse.ok) {
            throw new Error(`Error fetching user: ${userResponse.statusText}`)
        }

        const user = await userResponse.json()

        // Delete the role-specific record first
        let roleResponse
        switch (user.accountType) {
            case "ADMIN":
                roleResponse = await fetch(`${API_BASE_URL}/admin/admin/${userId}`, {
                    method: "DELETE",
                })
                break

            case "INFLUENCER":
                roleResponse = await fetch(`${API_BASE_URL}/admin/influencer/${userId}`, {
                    method: "DELETE",
                })
                break

            case "CAMPAIGN_MANAGER":
                roleResponse = await fetch(`${API_BASE_URL}/admin/campaignManager/${userId}`, {
                    method: "DELETE",
                })
                break

            case "SUPERVISOR":
                roleResponse = await fetch(`${API_BASE_URL}/admin/supervisor/${userId}`, {
                    method: "DELETE",
                })
                break
        }

        if (roleResponse && !roleResponse.ok) {
            throw new Error(`Error deleting role: ${roleResponse.statusText}`)
        }

        // Then delete the person
        const personResponse = await fetch(`${API_BASE_URL}/admin/person/${userId}`, {
            method: "DELETE",
        })

        if (!personResponse.ok) {
            throw new Error(`Error deleting person: ${personResponse.statusText}`)
        }
    } catch (error) {
        console.error("Failed to delete user:", error)
        throw error
    }
}

