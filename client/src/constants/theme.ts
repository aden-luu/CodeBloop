import { extendTheme } from '@chakra-ui/react';

export const customColors = {
  brand: {
    50: '#EFF6E0',
    100: '#AEC3B0',
    200: '#598392',
    300: '#124559',
    400: '#06212C',
    500: '#01161E',
    600: '#010F15',
  },
};

const theme = extendTheme({
  colors: customColors,
  styles: {
    global: {
      body: {
        bg: 'brand.400',
        color: 'brand.50',
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        bg: 'brand.300',
        color: 'brand.50',
        _hover: {
          bg: 'brand.200',
        },
      },
      variants: {
        solid: {
          bg: 'brand.300',
          color: 'brand.50',
          _hover: {
            bg: 'brand.200',
          },
        },
        outline: {
          borderColor: 'brand.300',
          color: 'brand.300',
          bg: 'brand.50',
          _hover: {
            bg: 'brand.200',
            color: 'brand.50',
            borderColor: 'brand.200',
          },
        },
      },
      defaultProps: {
        variant: 'solid',
      },
    },
    Text: {
      baseStyle: {
        color: 'brand.50',
        fontSize: 'md',
      },
      variants: {
        primary: {
          color: 'brand.50',
        },
        secondary: {
          color: 'brand.100',
        },
        highlight: {
          color: 'brand.300',
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Heading: {
      baseStyle: {
        color: 'brand.50',
        fontSize: 'lg',
      },
      variants: {
        primary: {
          color: 'brand.50',
        },
        secondary: {
          color: 'brand.100',
        },
        highlight: {
          color: 'brand.300',
        },
      },
      defaultProps: {
        variant: 'primary',
      },
    },
    Link: {
      baseStyle: {
        color: 'brand.100',
        _hover: {
          color: 'brand.50',
          textDecoration: 'underline',
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          bg: 'brand.300',
          color: 'brand.50',
          borderColor: 'brand.200',
          _placeholder: {
            color: 'brand.100',
          },
        },
      },
      variants: {
        outline: {
          field: {
            border: '2px solid',
            borderColor: 'brand.200',
            _hover: {
              borderColor: 'brand.100',
            },
            _focus: {
              borderColor: 'brand.50',
              boxShadow: '0 0 0 1px #EFF6E0',
            },
          },
        },
        filled: {
          field: {
            bg: 'brand.200',
            _hover: {
              bg: 'brand.300',
            },
            _focus: {
              bg: 'brand.50',
              color: 'brand.400',
            },
          },
        },
        flushed: {
          field: {
            borderBottom: '2px solid',
            borderColor: 'brand.200',
            borderRadius: 0,
            _focus: {
              borderColor: 'brand.50',
              boxShadow: '0 1px 0 0 #EFF6E0',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
  },
});

export default theme;
