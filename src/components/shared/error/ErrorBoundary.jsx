import { Button, styled } from "@mui/material";
import ErrorPage from "./ErrorPage";
import { useCallback } from "react";
import { useEffectOnMount } from "src/hooks/useMountEffects";
import { ErrorBoundary, useErrorBoundary } from "react-error-boundary";
import theme from "config/theme";

function ReturnHomeButton({ resetErrorBoundary }) {
  return (
    <Button
      variant="contained"
      onClick={resetErrorBoundary}
      aria-label="Reload Page and navigate home"
    >
      Return to Home
    </Button>
  );
}

/**
 * ErrorBoundary calls resetErrorBoundary prop of this component
 * @param {string} error error message
 * @param {string} supportHref app support link
 * @param {string} resetErrorBoundary callback for reseting error boundary
 * @param {string} error error object raised by the application
 * @returns
 */
function AwSnap({ error, supportHref, resetErrorBoundary }) {
  console.error("AwSnap", error);

  return (
    <ErrorPage
      title="Whoops! Something went wrong"
      titleProps={{ component: "h1", variant: "h2" }}
      details={error.stack}
      supportHref={supportHref}
      // Navigation etc features don't work after error boundary has been breached
      // So we must override the secondary action with a button that resets the boundary
      SecondaryActionComponent={
        <ReturnHomeButton resetErrorBoundary={resetErrorBoundary} />
      }
    />
  );
}

function WindowErrorRedirect({ children }) {
  const { showBoundary } = useErrorBoundary();
  const onError = useCallback(
    (event) => {
      showBoundary(event.error ?? event.reason);
    },
    [showBoundary]
  );

  useEffectOnMount(() => {
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onError);
    return function cleanup() {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onError);
    };
  });

  return children;
}

export const AppErrorBoundary = styled(({ children, supportHref }) => {
  const onReset = () => {
    window.location.href = "/";
  };

  return (
    <ErrorBoundary
      FallbackComponent={({ resetErrorBoundary, error }) => (
        <AwSnap
          supportHref={supportHref}
          resetErrorBoundary={resetErrorBoundary}
          error={error}
        />
      )}
      onReset={onReset}
    >
      <WindowErrorRedirect>{children}</WindowErrorRedirect>
    </ErrorBoundary>
  );
})(theme);
