import CustomError from "./CustomError";

describe("Given a class CustomError", () => {
  describe("When instantiated with 200, 'Public Error' and a 'Private error'", () => {
    test("Then it should create an object with the properties statusCode=200, publicMessage='Public error' and privateMessage='Private error'", () => {
      const status = 200;
      const errorMessage = "Public error";
      const privateMessage = "Private error";

      const receivedError = new CustomError(
        status,
        privateMessage,
        errorMessage
      );

      expect(receivedError).toHaveProperty("statusCode", status);
      expect(receivedError).toHaveProperty("message", privateMessage);
      expect(receivedError).toHaveProperty("publicMessage", errorMessage);
    });
  });
});
