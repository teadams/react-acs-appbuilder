import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import {functional_components} from "./index.js"

function Field(props) {
  const {object_type, field_name, id, db_options} = props
  const data = useGetObject(object_type, id, {}, props.data); 
  const RenderField = functional_components[props.field_component?props.field_component:"RenderField"]

  if (data) {
      return (<RenderField data={data} field_name={field_name}/>)
  } else {
      return null
  }
}

export default Field;
