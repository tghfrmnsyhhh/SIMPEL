import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e3f2ff",
      100: "#b3d8ff",
      200: "#81bcff",
      300: "#4fa0ff",
      400: "#1d85ff",
      500: "#006be6",
      600: "#0054b4",
      700: "#003d82",
      800: "#00264f",
      900: "#00101f",
    },
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins",
  },
  styles: {
    global: {
      body: {
        bg: "gray.50",
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        rounded: "xl",
        fontWeight: "bold",
      },
      variants: {
        solid: {
          bg: "brand.500",
          color: "white",
          _hover: { bg: "brand.600" },
        },
      },
    },
  },
});

export default theme;
