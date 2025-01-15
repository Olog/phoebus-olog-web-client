import { ServerErrorPage } from "components/shared/error";

export default function NotFoundView({ message, status, homeHref }) {
  return (
    <ServerErrorPage
      status={status}
      message={message}
      homeHref={homeHref}
    />
  );
}
