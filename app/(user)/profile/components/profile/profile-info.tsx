import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileInfoProps {
  profile: any; // Replace `any` with your proper user type if available
}

export default function ProfileInfo({ profile }: ProfileInfoProps) {
  return (
    <Card className="shadow-sm border">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoItem label="Email" value={profile?.email} />
        <InfoItem label="Account Type">
          {profile?.accountType && (
            <Badge variant="outline" className="bg-gray-900 text-white">
              {profile.accountType}
            </Badge>
          )}
        </InfoItem>
        <InfoItem
          label="Niche"
          value={profile?.niche}
          isHighlighted={!profile?.niche}
        />
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Interests</h3>
          {profile?.interests && profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-red-500">No interests specified</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface InfoItemProps {
  label: string;
  value?: string;
  children?: React.ReactNode;
  isHighlighted?: boolean;
}

function InfoItem({
  label,
  value,
  children,
  isHighlighted = false,
}: InfoItemProps) {
  return (
    <div className="space-y-1">
      <h3 className="text-sm font-medium">{label}</h3>
      {children || (
        <p className={`text-sm ${isHighlighted ? "text-red-500" : ""}`}>
          {value || "Not specified"}
        </p>
      )}
    </div>
  );
}
