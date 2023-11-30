import React from "react";
import { Button, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { string, object, node } from "prop-types";

/**
 * An accessible link for pages within the application; an MUI Link with
 * the capabilities of a React Router Link.
 *
 * @param {string} label a11y label; useful if the child component isn't a string.
 * @param {string} to location to route to
 * @param {...object} props additional React Router and MUI Link props
 * @param {object} children renderable children, can be a string or a
 * component such as Typography or EllipsisText
 *
 */
export const InternalLink = ({ label, to, children, ...props }) => {
  return (
    <Link
      component={RouterLink}
      to={to}
      aria-label={label ? label : children}
      {...props}
    >
      {children}
    </Link>
  );
};
InternalLink.propTypes = {
  label: string,
  to: string,
  props: object,
  children: node
};

/**
 * An InternalLink stylized as a Button.
 *
 * @param {string} label a11y label; useful if the child component isn't a string.
 * @param {string} to location to route to
 * @param {...object} props additional React Router and MUI Button props
 * @param {object} children renderable children, can be a string or a
 * component such as Typography or EllipsisText
 *
 */
export const InternalButtonLink = ({ children, label, to, ...props }) => {
  return (
    <Button
      component={RouterLink}
      to={to}
      aria-label={label ? label : children}
      {...props}
    >
      {children}
    </Button>
  );
};
InternalButtonLink.propTypes = {
  ...InternalLink.propTypes
};
