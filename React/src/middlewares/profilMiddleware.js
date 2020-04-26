import axios from 'axios';

import {
  FETCH_USER,
  GET_PROFIL,
  GET_PROFIL_PAGE,
  GET_USER_DATA,
  SET_LOGO_PICTURE_ERROR,
  UPDATE_USER_DATA,
  DELETE_USER_ACCOUNT,
  clearUserData,
  getUserData,
  saveUser,
  saveUserData,
  getCatalog,
  getSuppliersByRegion,
} from '../actions/profil';
import { setLogout } from '../actions/authentication';
import { redirect, setSnackbar } from '../actions/home';

// == Import API server config
const server = require('../api.config.json');

const profilMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case FETCH_USER: {
      axios({
        method: 'post',
        url: `${server.url}:${server.port}/api/login_id`,
        data: {
          username: action.username,
        },
      })
        .then((response) => {
          // console.log('success user : ', response.data);
          // Success => save userId and userRole token in LocalStorage
          const { id, userRole } = response.data;
          localStorage.setItem('userId', id);
          localStorage.setItem('userRole', userRole);
          store.dispatch(saveUser(id, userRole));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(error);
        });
      next(action);
      break;
    }

    case GET_PROFIL: {
      const { userRole } = store.getState().profil;
      switch (userRole[0]) {
        case 'ROLE_SHOPKEEPER':
          store.dispatch(redirect('/commercant/profil/informations'));
          next(action);
          break;

        case 'ROLE_ADMIN':
          // store.dispatch(redirect(`${server.url}:${server.port}/admin`));
          next(action);
          break;

        default:
          next(action);
      }
      next(action);
      break;
    }

    case GET_PROFIL_PAGE: {
      const { userRole } = store.getState().profil;
      switch (userRole[0]) {
        case 'ROLE_SHOPKEEPER':
          store.dispatch(redirect('/commercant/profil/page'));
          next(action);
          break;
        default:
          next(action);
      }
      next(action);
      break;
    }

    case GET_USER_DATA: {
      const { userId, userRole } = store.getState().profil;
      switch (userRole[0]) {
        case 'ROLE_SHOPKEEPER':
          axios({
            method: 'post',
            url: `${server.url}:${server.port}/api/shopkeepers/${userId}`,
            data: {
              id: userId,
            },
          })
            .then((response) => {
              // console.log('success userData : ', response.data);
              store.dispatch(saveUserData(response.data));
              store.dispatch(getCatalog());
              store.dispatch(getSuppliersByRegion());
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.warn(error);
              store.dispatch(setSnackbar('error', 'Erreur interne : Echec récupération des données utilisateur'));
            });

          next(action);
          break;
        default:
          next(action);
      }
      next(action);
      break;
    }

    case SET_LOGO_PICTURE_ERROR:
      store.dispatch(setSnackbar('error', action.errorMsg));
      next(action);
      break;

    case UPDATE_USER_DATA: {
      const { userId, userRole } = store.getState().profil;
      const token = localStorage.getItem('token');
      switch (userRole[0]) {
        case 'ROLE_SHOPKEEPER': {
          const {
            email,
            contact,
            firstname,
            lastname,
            password,
            companyDescription,
            phone,
            website,
            logoPicture,
          } = store.getState().profil.userData;
          axios({
            method: 'post',
            url: `${server.url}:${server.port}/api/shopkeepers/${userId}/edit`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
              id: userId,
              email,
              contact,
              firstname,
              lastname,
              password,
              companyDescription,
              phone,
              website,
              logoPicture,
            },
          })
            .then((response) => {
              console.log('success update userData : ', response.data);
              store.dispatch(setSnackbar('success', 'Vos modification sont enregistrées'));
              store.dispatch(getUserData());
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.warn(error);
              store.dispatch(setSnackbar('error', 'Erreur interne : Echec enregistrement des informations'));
            });

          next(action);
          break;
        }
        default:
          next(action);
      }
      next(action);
      break;
    }

    case DELETE_USER_ACCOUNT: {
      const { userId, userRole } = store.getState().profil;
      const token = localStorage.getItem('token');
      switch (userRole[0]) {
        case 'ROLE_SHOPKEEPER': {
          axios({
            method: 'delete',
            url: `${server.url}:${server.port}/api/shopkeepers/${userId}/delete`,
            headers: { Authorization: `Bearer ${token}` },
            data: {
              id: userId,
            },
          })
            .then((response) => {
              console.log('success delete userAccount : ', response.data);
              store.dispatch(setLogout());
              store.dispatch(clearUserData());
              store.dispatch(redirect('/'));
              store.dispatch(setSnackbar('info', 'Votre compte à bien été supprimé'));
            })
            .catch((error) => {
              // eslint-disable-next-line no-console
              console.warn(error);
              store.dispatch(setSnackbar('error', 'Erreur interne : Echec suppression du compte utilisateur'));
            });

          next(action);
          break;
        }
        default:
          next(action);
      }
      next(action);
      break;
    }

    default:
      next(action);
  }
};

export default profilMiddleware;
