import { createTheme } from '@material-ui/core/styles';

export const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: {
      light: '#88dbf4',
      main: '#1A83F7',
      dark: '#0075F6',
      contrastText: '#fff',
    },
    secondary: {
      light: '#e2e4e5',
      main: '#a4a4a4',
      dark: '#676767',
      contrastText: '#fff',
    },
    text: {
      primary: 'rgba(33,33,33,.9)',
      secondary: '#676767',
      disabled: '#e2e4e5',
      hint: '#e2e4e5',
    },
  },
  overrides: {
    MuiInput: {
      root: {
        marginTop: '14px !important',
      },
      input: {
        background: 'none !important',
        margin: '0 !important',
        padding: '7px 0 7px 0 !important',
        fontSize: '16px !important',
      },
      inputMultiline: {
        padding: '0 !important',
      },
      underline: {
        ':before': {
          borderColor: '#06baec !important',
        },
        ':after': {
          borderColor: '#06baec !important',
        },
        '&:hover:not($disabled):before': {
          borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important',
        },
      },
    },
    MuiInputBase: {
      input: {
        height: 'initial',
      },
    },
    MuiSelect: {
      select: {
        padding: '7px 32px 7px 0 !important',
      },
    },
    MuiInputLabel: {
      root: {
        top: 'initial !important',
        bottom: '0',
        color: '#a4a4a4 !important',
        fontSize: '14px !important',
        transform: 'translate(0, -12px) scale(1) !important',
        zIndex: '1',
        '&.label-for-multiline': {
          top: '0 !important',
          bottom: 'initial',
          transform: 'translate(0, 24px) scale(1) !important',
        },
        '&$error': {
          top: '33px !important',
          bottom: 'initial',
          color: '#f44336 !important',
        },
      },
      shrink: {
        transform: 'translate(0, -26px) scale(.85) !important',

        '&.label-for-multiline': {
          transform: 'translate(0, 1.5px) scale(.85) !important',
        },
      },
    },
    MuiCheckbox: {
      root: {
        '&$checked': {
          color: '#1A83F7 !important',
        },
      },
    },
    MuiTableRow: {
      root: {
        '&$selected': {
          background: '#e7faff !important',
        },
      },
    },
    MuiListItemIcon: {
      root: {
        marginRight: '3px !important',
      },
    },
    MuiListItemText: {
      root: {
        padding: '0 10px !important',
      },
    },
    MuiAppBar: {
      root: {
        background: 'none !important',
        boxShadow: 'none !important',
      },
    },
    MuiTabs: {
      scrollable: {
        overflowX: 'auto !important',
      },
    },
    MuiLinearProgress: {
      root: {
        height: '3px',
      },
    },
    MuiFab: {
      root: {
        backgroundColor: '#fff',
        color: '#06baec',
        '&:hover': {
          backgroundColor: '#fafafa',
        },
      },
    },
    MuiIconButton: {
      root: {
        color: '#000',
        '&:hover': {
          opacity: '.8',
        },
      },
    },
    MuiTooltip: {
      popper: {
        zIndex: '9999',
        opacity: '1',
      },
      tooltip: {
        backgroundColor: '#fff',
        color: '#676767',
        fontFamily: 'Roboto, Arial, sans-serif',
        fontSize: '11px',
        fontWeight: '400',
        textAlign: 'center',
        lineHeight: '16px',
        boxShadow: '0 0 4px 0 rgba(0,0,0,.2)',
        borderRadius: '2px',
      },
      /* tooltipFonction: {
                background: 'linear-gradient(-224deg, #4c98f3 0%, #06baec 100%)',
                color: '#fff',
                fontSize: '14px',
                lineHeight: '20px',
                boxShadow: '0 0 10px 0 rgba(0,0,0,.2)',
                padding: '20px',
            },
            tooltipProperties: {
                fontSize: '14px',
                lineHeight: '20px',
                boxShadow: '0 0 10px 0 rgba(0,0,0,.2)',
            }, */
    },
    MuiChip: {
      root: {
        '&.group-tag': {
          height: '24px !important',
          borderRadius: '4px! important',
        },
      },
      label: {
        fontWeight: 500,
      },
      avatar: {
        '&.group-tag': {
          height: '24px !important',
          borderRadius: '4px !important',
          backgroundImage: 'linear-gradient(to left,#4c98f3,#06baec)',
          color: '#fff',
          fontWeight: 500,
          textTransform: 'uppercase',
          fontSize: '12px',
          '&.project, &.collection': {
            backgroundImage: 'inherit',
          },
          '&.project': {
            backgroundColor: '#0043ce', // Azure
          },
          '&.collection': {
            backgroundColor: '#f96e3a', // Mandarine
          },
        },
      },
    },
    MuiModal: {
      root: {
        zIndex: 3001,
      },
    },
  },
  props: {
    MuiIconButton: {
      disableRipple: true,
    },
  },
});
