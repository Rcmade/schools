import { Button } from "@/components/ui/button";
import Link from "next/link";

const AddSchoolButton = () => {
  return (
 
    <Button className="relative">
      <Link href="/school/add" className="absolute inset-0" />
      Add School
    </Button>
  );
};

export default AddSchoolButton;
