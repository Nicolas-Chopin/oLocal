import axios from 'axios';

import {
  GET_REGIONS_DATA,
  saveRegionsData,
  GET_CATEGORIES_DATA,
  saveCategoriesData,
  GET_SEARCH_HOME_RESULTS,
  setSnackbar,
  redirect,
} from '../actions/home';
import { saveSearchHomeData } from '../actions/shopkeepers';

const homeMiddleware = (store) => (next) => (action) => {
  switch (action.type) {
    case GET_REGIONS_DATA:
      axios.get(`${process.env.URL_API}/api/regions`)
        .then((response) => {
          // console.log('success regions : ', response.data);
          store.dispatch(saveRegionsData(response.data));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(error);
        });

      next(action);
      break;

    case GET_CATEGORIES_DATA:
      axios.get(`${process.env.URL_API}/api/categories`)
        .then((response) => {
          // console.log('success categories : ', response.data);
          store.dispatch(saveCategoriesData(response.data));
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(error);
        });

      next(action);
      break;

    case GET_SEARCH_HOME_RESULTS: {
      const { region, category } = store.getState().home;
      axios({
        method: 'post',
        url: `${process.env.URL_API}/api/shopkeepers`,
        data: {
          region: region.id,
          category: category.id,
        },
      })
        .then((response) => {
          // console.log('success search : ', response.data);
          const results = response.data;
          // Save data & redirect if search match results else display Alert
          if (results.length > 0) {
            store.dispatch(saveSearchHomeData(results, region, category));
            store.dispatch(redirect('/liste-commercants'));
          }
          else {
            store.dispatch(setSnackbar('info', 'La recherche n\'a retourné aucun résultat'));
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.warn(error);
          store.dispatch(setSnackbar('error', 'Echec de la recherche'));
        })
        .finally(() => {
        });

      next(action);
      break;
    }

    default:
      next(action);
  }
};

export default homeMiddleware;
