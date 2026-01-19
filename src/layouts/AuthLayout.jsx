import { Flex } from "@chakra-ui/react";

const AuthLayout = ({ children }) => {
  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      {children}
    </Flex>
  );
};

export default AuthLayout;
