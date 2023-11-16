import { Button, Link as MuiLink } from "@mui/material";
import React from "react";

const Link = ({
  LinkComponent = MuiLink,
  href,
  text,
  label,
  newTab = true,
  className,
  ...props
}) => {
  return (
    <LinkComponent
      href={href}
      target={newTab ? "_blank" : "_self"}
      aria-label={`${label ?? text}${newTab ? ". Opens in new tab" : ""}`}
      className={className}
      {...props}
    >
      {text}
    </LinkComponent>
  );
};

export const ExternalLink = ({
  href,
  label,
  text,
  newTab,
  className,
  ...props
}) => {
  return (
    <Link
      {...{ href, label, text, newTab, className }}
      {...props}
    >
      {text}
    </Link>
  );
};

export const ExternalButtonLink = ({
  href,
  label,
  text,
  newTab,
  className,
  ...props
}) => {
  return (
    <Link
      LinkComponent={Button}
      component={MuiLink}
      {...{ href, label, text, newTab, className }}
      {...props}
    >
      {text}
    </Link>
  );
};
