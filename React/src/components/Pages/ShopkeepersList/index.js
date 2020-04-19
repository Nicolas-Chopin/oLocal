// == Import npm
import React from 'react';
import PropTypes from 'prop-types';
import EllipsisText from 'react-ellipsis-text';
import { Link as RouterLink, Redirect } from 'react-router-dom';

// == Import components
import {
  Grid,
  Paper,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Chip,
  Button,
  IconButton,
} from '@material-ui/core';
import BusinessIcon from '@material-ui/icons/Business';
import LocationSearchingRoundedIcon from '@material-ui/icons/LocationSearchingRounded';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

// == Import assets & styles
import shopkeepersListStyles from './shopkeepersListStyles';

// == Import API config for pictures base URL
const server = require('src/api.config.json');

// == Composant
const ShopkeepersList = ({
  currentCategory,
  currentRegion,
  searchResults,
}) => {
  // console.log(currentCategory, currentRegion, searchResults);
  const classes = shopkeepersListStyles();
  const nbResults = searchResults.length;

  return (
    <>
      {nbResults === 0 && (
        <Redirect to="/" push />
      )}
      <Grid container className={classes.shopkeepersListWrapper}>
        <Paper className={classes.shopkeepersListContent} elevation={2}>
          <div className={classes.shopkeepersListNav}>
            <IconButton edge="start" color="primary" component={RouterLink} to="/">
              <ArrowBackIcon fontSize="large" color="action" />
            </IconButton>
            <Chip
              color="secondary"
              icon={<LocationSearchingRoundedIcon />}
              label={nbResults === 1 ? `${nbResults} Résultat` : `${nbResults} Résultats`}
            />
          </div>
          <Typography variant="h4" component="h1" className={classes.shopkeepersListTitle} gutterBottom>
            Liste des commerçants de la région <span>{currentRegion.name}</span> <br />
            <Typography variant="h5" component="strong" className={classes.shopkeepersListSubtitle} gutterBottom>
              proposants des produits de la catégorie <span>{currentCategory.name}</span>
            </Typography>
          </Typography>
          <ul>
            {searchResults.map((item) => (
              <Card key={item.id} className={classes.cardWrapper} elevation={3} component="li">
                <CardMedia
                  className={classes.cardImg}
                  image={`${server.url}:${server.port}${item.logoPicture}`}
                  title={`Image de présentation de ${item.companyName}`}
                />
                <CardContent className={classes.cardContent}>
                  <Typography gutterBottom variant="h6" component="h2" className={classes.cardTitle}>
                    {item.companyName}
                    <Chip
                      variant="outlined"
                      color="primary"
                      component="em"
                      icon={<BusinessIcon />}
                      label={`${item.postalCode} - ${item.city}`}
                      className={classes.cardSubtitle}
                    />
                  </Typography>
                  <Typography variant="body2" color="textSecondary" component="p" className={classes.cardDescription}>
                    <EllipsisText
                      text={item.companyDescription}
                      length={400}
                    />
                  </Typography>
                  <Button
                    className={classes.cardLink}
                    variant="contained"
                    size="small"
                    color="primary"
                    component={RouterLink}
                    to={`/commercant/${item.id}`}
                  >
                    Voir plus
                  </Button>
                </CardContent>
              </Card>
            ))}
          </ul>
        </Paper>
      </Grid>
    </>
  );
};

ShopkeepersList.propTypes = {
  searchResults: PropTypes.array.isRequired,
  currentCategory: PropTypes.object.isRequired,
  currentRegion: PropTypes.object.isRequired,
};

// == Export
export default ShopkeepersList;
