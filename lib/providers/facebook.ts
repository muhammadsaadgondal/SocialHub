export const facebookConfig = {
    clientId: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    authorization: {
      params: {
        scope: "public_profile,email,pages_show_list",
      },
    },
  };
  
  export const fetchFacebookData = async (accessToken: string) => {
    const response = await fetch(`https://graph.facebook.com/v18.0/me?fields=id,name,email&access_token=${accessToken}`);
    const data = await response.json();
    return data;
  };