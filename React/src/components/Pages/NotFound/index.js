/* eslint-disable max-len */
// == Import npm
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';

// == Import components
import {
  Grid,
  Paper,
  Typography,
  Box,
  IconButton,
} from '@material-ui/core';
import HomeRoundedIcon from '@material-ui/icons/HomeRounded';

// == Import styles
import notFoundStyles from './notFoundStyles';
import './notFound.scss';

// == Composant
const NotFound = () => {
  const classes = notFoundStyles();
  return (
    <Grid container className={classes.notFoundWrapper}>
      <Paper className={classes.clouds} elevation={0}>
        <Box className="x1">
          <Box className="cloud" />
        </Box>
        <Box className="x2">
          <Box className="cloud" />
        </Box>
        <Box className="x3">
          <Box className="cloud" />
        </Box>
        <Box className="x4">
          <Box className="cloud" />
        </Box>
        <Box className="x5">
          <Box className="cloud" />
        </Box>
      </Paper>
      <Paper className={classes.error} elevation={0}>
        <Box className="notfound">
          <span>4</span>
          <span>0</span>
          <span>4</span>
        </Box>
        <Paper className={classes.notFoundContent} elevation={0} square>
          <Typography variant="h4" align="center" color="textSecondary" component="p" gutterBottom>
            La page demandée est introuvable
          </Typography>
          <Typography variant="body1" align="center" color="textSecondary" component="p">
            Vous pouvez rester contempler ce beau paysage ou bien retourner à la page d'acceuil en passant par la petite maison ...
          </Typography>
          <IconButton component={RouterLink} to="/">
            <HomeRoundedIcon className={classes.homeIcon} />
          </IconButton>
        </Paper>
      </Paper>
    </Grid>
  );
};

// == Export
export default NotFound;
