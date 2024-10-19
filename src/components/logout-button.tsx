import { postApiAuthenticationLogout } from "@/api-client";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";
import { Label } from "./ui/label";

export default function LogoutButton() {
  const navigate = useNavigate();

  const logout = async () => {
    const { error, response } = await postApiAuthenticationLogout();

    if (error)
      return toast.error(response.statusText, {
        description: error.message,
        duration: 2000,
      });
    else return navigate({ to: "/authentication/login", search: { to: "/" } });
  };

  return (
    <Link to="/" onClick={() => logout()}>
      <LogOutIcon className="size-4" />
      <Label>Logout</Label>
    </Link>
  );
}
