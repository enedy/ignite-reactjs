import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { validateUserPermissions } from "../utils/validateUserPermissions";

type UseEnableParams = {
  permissions?: string[];
  roles?: string[];
};

export function useEnable({ permissions, roles }: UseEnableParams) {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (!isAuthenticated) {
    return false;
  }
  
  const userHasValidPermissions = validateUserPermissions({
    user,
    permissions, 
    roles 
  })

  return userHasValidPermissions;
}