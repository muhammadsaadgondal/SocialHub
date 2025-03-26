import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
  Plus,
} from "lucide-react";

interface SocialMediaProps {
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export default function SocialMedia({ socialLinks = [] }: SocialMediaProps) {
  const getIconForPlatform = (platform: string) => {
    const iconProps = { className: "h-5 w-5 mr-2" };

    switch (platform.toLowerCase()) {
      case "twitter":
        return <Twitter {...iconProps} />;
      case "instagram":
        return <Instagram {...iconProps} />;
      case "facebook":
        return <Facebook {...iconProps} />;
      case "linkedin":
        return <Linkedin {...iconProps} />;
      case "youtube":
        return <Youtube {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  return (
    <Card className="shadow-sm border">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-lg font-semibold">Social Media</CardTitle>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        {socialLinks.length > 0 ? (
          <ul className="space-y-3">
            {socialLinks.map((link, index) => (
              <li key={index}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-sm text-blue-600 hover:underline"
                >
                  {getIconForPlatform(link.platform)}
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">
            No social media links added yet.
          </p>
        )}
      </CardContent>
    </Card>
  );
}