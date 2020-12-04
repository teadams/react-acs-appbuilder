// Copyright Teadams Holding Company 2019
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../Utils/meta.js';
import {ACSTabMenu} from '../../ACSLibrary'
import AuthContext from '../../Modules/User/AuthContext';

function Membership(props) {
  const {id} = props
  const context = useContext(AuthContext)
  if (id && id !=context.context_id && id !== "context") {
    context.setContextId(id)
    return null
  }
  return "GROUP MEMBERSHIP"
}

export default Membership