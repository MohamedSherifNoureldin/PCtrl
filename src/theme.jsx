import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

const new_theme = createTheme({
    palette: {
        mode: 'dark',
      primary: {
        main: '#42a5f5',
      },
      background: {
        default: '#111111',
        paper: '#212121',
      },
      secondary: {
        main: '#bbdefb',
      },
    },
    typography: {
      fontFamily: 'Open Sans',
      h1: {
        fontFamily: 'Ubuntu Mono',
      },
      h2: {
        fontFamily: 'Ubuntu Mono',
      },
      h3: {
        fontFamily: 'Ubuntu Mono',
      },
      h4: {
        fontFamily: 'Ubuntu Mono',
      },
      h6: {
        fontFamily: 'Ubuntu Mono',
      },
      h5: {
        fontFamily: 'Ubuntu Mono',
      },
      subtitle1: {
        fontFamily: 'Ubuntu Mono',
      },
      subtitle2: {
        fontFamily: 'Ubuntu Mono',
      },
      button: {
        fontFamily: 'Ubuntu Mono',
        fontWeight: 900,
      },
      overline: {
        fontFamily: 'Ubuntu Mono',
      },
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: 'none'
                }
            }
        }
    }
  });

export default new_theme;