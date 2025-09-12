import { currentUser } from "@/action/currentUser";
import { Children } from "@/types";
import { redirect, RedirectType } from "next/navigation";

const layout = async ({ children }: Children) => {
  const user = await currentUser();
  if (user) return redirect("/", RedirectType.replace);
  return (
    <div className="flex justify-center">
      <div className="my-8 max-h-fit w-full max-w-md rounded-lg border p-8 shadow-md">
        {children}
      </div>
    </div>
  );
};

export default layout;
