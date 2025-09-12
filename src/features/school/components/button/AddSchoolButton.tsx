import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import Link from "next/link";

const AddSchoolButton = () => {
  const user = useCurrentUser();

  if (!user) return null;
  return (
    <Button className="relative">
      <Link href="/school/add" className="absolute inset-0" />
      Add School
    </Button>
  );
};

export default AddSchoolButton;
