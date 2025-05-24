import { UserController } from "../../src/controllers/user.controller";
import { UserService } from "../../src/services/user.service";

export function makeSutForUserController() {
  const userController = new UserController();
  const userServiceMock = (userController as any)
    .userService as jest.Mocked<UserService>;

  jest.clearAllMocks();
  
  return { userController, userServiceMock };
}
