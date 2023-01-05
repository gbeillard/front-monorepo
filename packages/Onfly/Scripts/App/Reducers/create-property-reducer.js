import * as types from '../Actions/create-property-actions';
import * as PropertyApi from '../Api/PropertyApi.js';

export const initialState = {
  OpenModal: false,
  Domains: [],
  Units: [],
  DataTypes: [],
  EditTypes: [],
  ParameterTypes: [],
  api: {
    sendPropertyRequest: {
      pending: false,
      success: false,
      error: undefined,
    },
  },
};

const createPropertyReducer = function (state, action) {
  if (typeof state === 'undefined') {
    return initialState;
  }

  switch (action.type) {
    case types.OPEN_MODAL_CREATE_PROPERTY:
      return { ...state, OpenModal: true };

    case types.CLOSE_MODAL_CREATE_PROPERTY:
      return initialState;

    case types.LOAD_PROPERTY:
      // Get Domains
      PropertyApi.getPropertyDomains(action.temporaryToken, action.language);
      // Get Units
      PropertyApi.getPropertyUnits(action.temporaryToken, action.language);
      // Get Edit types
      PropertyApi.getPropertyEditTypes(action.temporaryToken, action.language);
      // Get Data types
      PropertyApi.getPropertyDataTypes(action.temporaryToken, action.language);
      // Get Parameter types
      PropertyApi.getPropertyParameterTypes(action.temporaryToken, action.language);
      return state;

    case types.LOAD_PROPERTY_DOMAINS:
      return { ...state, Domains: action.data };

    case types.LOAD_PROPERTY_UNITS:
      return { ...state, Units: action.data };

    case types.LOAD_PROPERTY_DATA_TYPES:
      return { ...state, DataTypes: action.data };

    case types.LOAD_PROPERTY_EDIT_TYPES:
      return { ...state, EditTypes: action.data };

    case types.LOAD_PROPERTY_PARAMETER_TYPES:
      return { ...state, ParameterTypes: action.data };

    case types.SEND_PROPERTY_REQUEST:
      return {
        ...state,
        api: {
          sendPropertyRequest: {
            pending: true,
            success: false,
            error: undefined,
          },
        },
      };
    case types.SEND_PROPERTY_REQUEST_SUCCESS:
      return {
        ...state,
        api: {
          sendPropertyRequest: {
            pending: false,
            success: true,
            error: undefined,
          },
        },
      };
    case types.SEND_PROPERTY_REQUEST_ERROR:
      return {
        ...state,
        api: {
          sendPropertyRequest: {
            pending: false,
            success: false,
            error: action.error,
          },
        },
      };
    default:
      return state;
  }
};

export default createPropertyReducer;
