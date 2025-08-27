import {
  ChevronDown,
  LogOut01,
  LogIn01,
  LogIn02,
  User01,
} from "@untitledui/icons";
import { Button } from "./base/buttons/button";
import { Dropdown } from "./base/dropdown/dropdown";
import useAuthStore from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";

export const AccountDropdown = () => {
  const { logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  return (
    <Dropdown.Root>
      <Button className="group" color="secondary" iconTrailing={ChevronDown}>
        <User01 />
      </Button>

      <Dropdown.Popover>
        <Dropdown.Menu>
          {isAuthenticated ?
          (
            <Dropdown.Section>
            <Dropdown.Item icon={User01}>
              <Link to="/account">View profile</Link>
            </Dropdown.Item>
          </Dropdown.Section>
          )
          :
          (
            <Dropdown.Section>
            <Dropdown.Item icon={LogIn02}>
              <Link to="/login">login</Link>
            </Dropdown.Item>
             <Dropdown.Item icon={LogIn01}>
              <Link to="/signup">Sign up</Link>
            </Dropdown.Item>
          </Dropdown.Section>
          )
          }
          
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
