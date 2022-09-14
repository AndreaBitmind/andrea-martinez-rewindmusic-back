import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { createToken, hashCompare } from "./auth";
import { CustomJwtPayload } from "../interfaces/CustomJwtPayload";

describe("Given a function hashcompare", () => {
  describe("When is called", () => {
    test("Then it should call the method compare from bcrypt", async () => {
      const text = "123456";
      const hash = "a12b3c4d";

      const bcryptTest = jest.fn().mockResolvedValue("test");
      (bcrypt.compare as jest.Mock) = bcryptTest;

      await hashCompare(text, hash);

      expect(bcryptTest).toHaveBeenCalledWith(text, hash);
    });
  });
});

describe("Given a function createToken", () => {
  describe("When is called", () => {
    test("Then it should call the method sign", async () => {
      const secretWord = process.env.SECRET;
      const payload: CustomJwtPayload = {
        id: "id",
        userName: "user",
      };

      const mockSign = jest.fn();
      jwt.sign = mockSign;

      await createToken(payload);

      expect(mockSign).toHaveBeenCalledWith(payload, secretWord);
    });
  });
});
