import { ErrorPage } from "./ErrorPage";

export const ServerErrorPage = ({ message, status, supportHref }) => {
  // Define some fallback messages if none provided
  if (!message) {
    if (status?.toString().startsWith("5")) {
      message = "Whoops, looks like you broke the internet!";
    } else {
      message = "Page not found";
    }
  }

  return (
    <ErrorPage
      title={message}
      subtitle={status}
      supportHref={supportHref}
    />
  );
};
