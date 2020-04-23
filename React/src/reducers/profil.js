import {
  SET_ACTIVE_PAGE,
  SAVE_USER,
  SAVE_USER_DATA,
  SET_LOGO_PICTURE,
  SET_PROFIL_FIELD_VALUE,
  SET_FIELD_ERROR,
  SET_REGION,
  GET_CATALOG,
  CLEAR_USER_DATA,
} from '../actions/profil';

// == Import API config for pictures base URL
const server = require('src/api.config.json');

const initialState = {
  // Display Loader
  loaderUser: true,
  loaderProfil: true,
  loaderProfilPage: true,
  // Current active page in profil
  activePage: 'Informations',
  // API User Data
  userId: null,
  userRole: [],
  userData: {},
  logoPicture: '',
  fieldError: true,
  catalog: [],
};

const profilReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.newValue,
      };

    case SAVE_USER:
      return {
        ...state,
        userId: action.id,
        userRole: action.userRole,
        loaderUser: false,
      };

    case GET_CATALOG: {
      const catalog = state.userData.catalogs.map((item) => (
        {
          catalogId: item.id,
          categoryId: item.product.category.id,
          category: item.product.category.name,
          product: item.product.name,
          supplierId: item.localSupplier.id,
          supplier: item.localSupplier.name,
          city: item.localSupplier.city,
          postalCode: item.localSupplier.postalCode,
        }
      ));
      return {
        ...state,
        catalog,
        loaderProfilPage: false,
      };
    }

    case SAVE_USER_DATA:
      return {
        ...state,
        userData: {
          ...action.userData,
          password: '',
        },
        logoPicture: `${server.url}:${server.port}${action.userData.logoPicture}`,
        loaderProfil: false,
        loaderProfilPage: false,
      };

    case SET_LOGO_PICTURE:
      return {
        ...state,
        userData: {
          ...state.userData,
          logoPicture: action.newLogoPicture,
        },
        logoPicture: action.newLogoPicture,
      };

    case SET_PROFIL_FIELD_VALUE: {
      if (action.name === 'email') {
        const emailValue = action.value;
        if (emailValue === '') {
          return {
            ...state,
            fieldError: true,
            userData: {
              ...state.userData,
              email: emailValue,
            },
          };
        }
      }

      return {
        ...state,
        fieldError: false,
        userData: {
          ...state.userData,
          [action.name]: action.value,
        },
      };
    }

    case SET_REGION:
      return {
        ...state,
        region: action.value,
      };

    case SET_FIELD_ERROR:
      return {
        ...state,
        fieldError: action.value,
      };

    case CLEAR_USER_DATA:
      return {
        ...state,
        userId: null,
        userRole: [],
        userData: {},
        logoPicture: '',
        fieldError: true,
        catalog: [],
        activePage: 'Informations',
        loaderProfil: true,
        loaderProfilPage: true,
      };

    default: return state;
  }
};

export default profilReducer;
