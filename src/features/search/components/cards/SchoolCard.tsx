import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import { SearchSchoolResponseType } from "../../hooks/useSearchSchool";

export default function SchoolCard({
  school,
}: {
  school: SearchSchoolResponseType["data"][number];
}) {
  const feesText =
    typeof school.feesMin === "number" && typeof school.feesMax === "number"
      ? `₹${school.feesMin.toLocaleString()} – ₹${school.feesMax.toLocaleString()}`
      : typeof school.feesMin === "number"
      ? `From ₹${school.feesMin.toLocaleString()}`
      : typeof school.feesMax === "number"
      ? `Up to ₹${school.feesMax.toLocaleString()}`
      : "—";

  return (
    <Card className="overflow-hidden pt-0 pb-2">
      <CardHeader className="p-2">
        <Image
          src={school?.image || "/placeholder.png"}
          width={320}
          height={320}
          alt={`${school.name} campus`}
          className=" object-contain rounded-2xl  m-auto"
        />
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-medium text-pretty">{school.name}</h3>
            <p className="text-xs text-muted-foreground">
              {school.address ? `${school.address}, ` : ""}
              {school.city}
              {school.state ? `, ${school.state}` : ""}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          {!!school.board && (
            <Badge variant="outline" className="uppercase">
              {school.board}
            </Badge>
          )}
          {!!school.medium && (
            <Badge variant="secondary">{school.medium}</Badge>
          )}
          {!!school.type && <Badge>{school.type}</Badge>}
        </div>

        <div className="text-sm">
          Fees: <span className="font-medium">{feesText}</span>
        </div>
      </CardContent>
    </Card>
  );
}
