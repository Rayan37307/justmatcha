import {
  LogOut01,
  LogIn01,
  LogIn02,
  User01,
} from "@untitledui/icons";
import { Dropdown } from "./base/dropdown/dropdown";
import useAuthStore from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Button as AriaButton } from "react-aria-components"; // 👈 import it here

export const AccountDropdown = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <Dropdown.Root>
      {/* ✅ Trigger button */}
      <AriaButton className="text-green-800 flex items-center justify-center cursor-pointer rounded-md">
        <User01 className="size-5" />
      </AriaButton>

      <Dropdown.Popover>
        <Dropdown.Menu>
          {isAuthenticated ? (
            <Dropdown.Section>
              <Dropdown.Item icon={User01}>
                <Link to="/account">View profile</Link>
              </Dropdown.Item>
            </Dropdown.Section>
          ) : (
            <Dropdown.Section>
              <Dropdown.Item icon={LogIn02}>
                <Link to="/login">Login</Link>
              </Dropdown.Item>
              <Dropdown.Item icon={LogIn01}>
                <Link to="/signup">Sign up</Link>
              </Dropdown.Item>
            </Dropdown.Section>
          )}

          <Dropdown.Separator />

          <Dropdown.Section>
            {isAuthenticated && (
              <Dropdown.Item
                icon={LogOut01}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
              >
                Log out
              </Dropdown.Item>
            )}
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown.Root>
  );
};
