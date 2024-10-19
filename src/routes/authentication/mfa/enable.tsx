import {
  createFileRoute,
  useNavigate,
  useSearch,
} from "@tanstack/react-router";
import { z } from "zod";

function Enable() {
  const { to } = useSearch({
    from: "/authentication/mfa/enable",
  });
  const navigate = useNavigate();

  return <div>Hello /authentication/mfa/enable!</div>;
}

export const Route = createFileRoute("/authentication/mfa/enable")({
  component: Enable,
  validateSearch: z.object({ to: z.string() }),
});
