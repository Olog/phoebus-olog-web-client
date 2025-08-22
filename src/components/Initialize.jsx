import customization from "config/customization";
import { ologApi } from "api/ologApi";

const Initialize = ({ children }) => {
  // attempt to fetch current user if logged in
  ologApi.endpoints.getUser.useQuery({
    pollingInterval: customization.defaultSearchFrequency
  });

  return <>{children}</>;
};

export default Initialize;
