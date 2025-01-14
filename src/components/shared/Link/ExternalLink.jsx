import React from "react";
import { Button, Link as MuiLink, Stack } from "@mui/material";
import LaunchIcon from "@mui/icons-material/Launch";
import { string, bool, object, node } from "prop-types";

const Link = ({
  LinkComponent = MuiLink,
  href,
  label,
  newTab = true,
  className,
  children,
  ...props
}) => {
  return (
    <LinkComponent
      href={href}
      target={newTab ? "_blank" : "_self"}
      aria-label={`${label ? label : children}${
        newTab ? ", opens in new tab" : ""
      }`}
      className={className}
      {...props}
    >
      {children}
    </LinkComponent>
  );
};

/**
 * A stylized external link configurable as opening in the same tab
 * or a new tab, and shows an icon to indicate the link is external.
 * A11y labels are updated automatically, but can be overridden for
 * cases where e.g. the child component isn't a string (such as EllipsisText).
 *
 * @param {string} href link url
 * @param {string} label a11y label; useful when the child component isn't a string
 * @param {boolean} newTab opens the link in a new tab if true (default).
 * @param {boolean} disableExternalLinkIcon removes the icon displayed after the link text if true.
 * @param {object} ExternalLinkContentsProps props for the ExternalLinkContents component,
 * for example to change the icon or its size.
 * @param {...object} props props for the (MUI) Link component
 *
 */
export const ExternalLink = ({
  href,
  label,
  newTab,
  disableExternalLinkIcon,
  ExternalLinkContentsProps,
  className,
  children,
  ...props
}) => {
  const _label = label ? label : children;

  return (
    <Link
      {...{ href, label: _label, newTab, className }}
      {...props}
    >
      {disableExternalLinkIcon ? (
        children
      ) : (
        <ExternalLinkContents {...ExternalLinkContentsProps}>
          {children}
        </ExternalLinkContents>
      )}
    </Link>
  );
};
ExternalLink.propTypes = {
  href: string,
  label: string,
  newTab: bool,
  disableExternalLinkIcon: bool,
  ExternalLinkContentsProps: object,
  children: node
};

/**
 * An ExternalLink, but styled as a Button.
 *
 * @param {string} href link url
 * @param {string} label a11y label; useful when the child component isn't a string
 * @param {boolean} newTab opens the link in a new tab if true (default).
 * @param {boolean} disableExternalLinkIcon removes the icon displayed after the link text if true.
 * @param {object} ExternalLinkContentsProps props for the ExternalLinkContents component,
 * for example to change the icon or its size.
 * @param {...object} props props for the (MUI) Link component
 *
 */
export const ExternalButtonLink = ({
  href,
  label,
  newTab,
  disableExternalLinkIcon,
  ExternalLinkContentsProps,
  className,
  children,
  ...props
}) => {
  return (
    <ExternalLink
      {...{
        LinkComponent: Button,
        component: MuiLink,
        href,
        label,
        newTab,
        disableExternalLinkIcon,
        ExternalLinkContentsProps,
        className,
        ...props
      }}
    >
      {children}
    </ExternalLink>
  );
};
ExternalButtonLink.propTypes = {
  ...ExternalLink.propTypes
};

/**
 * Text followed by an icon that visually indicates "external link".
 * Used internally by ExternalLink and ExternalButtonLink.
 *
 * @param {object} Icon the MUI icon to use as the end element
 * @param {object} IconProps additional props to pass to the Icon
 * for example to change its color or size.
 * @param {object} children renderable children, can be text or an
 * element such as Typography or EllipsisText.
 *
 */
export const ExternalLinkContents = ({
  Icon = LaunchIcon,
  IconProps,
  children,
  ...props
}) => {
  return (
    <Stack
      flexDirection="row"
      alignItems="center"
      gap={0.5}
      component="span"
      {...props}
    >
      {children}
      <Icon
        fontSize="small"
        {...IconProps}
      />
    </Stack>
  );
};
ExternalLinkContents.propTypes = {
  Icon: object,
  IconProps: object,
  children: node
};
