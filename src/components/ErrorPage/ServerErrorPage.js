import React from "react";
import { string } from "prop-types";
import ErrorPage from "./ErrorPage";
import { styled } from "@mui/material";

const propTypes = {
  /** String communicating the primary problem. Default to "Whoops, you broke the internet" for 5xx, "Not found" otherwise */
  message: string,
  /** HTTP status code (404, 503, etc) */
  status: string,
  /** URL to application support, should the user wish to contact the support desk */
  supportHref: string
};

const ServerErrorPage = styled(({ message, status, supportHref, className }) => {
  // Define some fallback messages if none provided
  if (!message) {
    if (status?.toString().startsWith("5")) {
      message = "Whoops, looks like you broke the internet 😬";
    } else {
      message = "Page not found";
    }
  }

  return (
    <ErrorPage
      title={message}
      subtitle={status}
      supportHref={supportHref}
      className={className}
    />
  );
})({})
ServerErrorPage.propTypes = propTypes;

export default ServerErrorPage;
