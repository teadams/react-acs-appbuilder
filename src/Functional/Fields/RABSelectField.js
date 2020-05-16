import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';

// <TextField    
//   InputLabelProps={{shrink:true}}
//   name={.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}

function RABSelectField(props) {
  const {mode, data, field_name, formdata, formValues,  onChange, autoFocus} = props
  switch (mode) {
    case "text", "view":
      return data?data:" SELECST "
      break 
    case "edit":
    case "create":
      return (
          <TextField 
            autoFocus={autoFocus}
            name={field_name} 
            value={formValues[props.field_name]}
            onChange={onChange}/>
        )
      break
    case "csv":
      return '"'+data+'""'
      break
    default:
      return data
  }
}

export default RABSelectField;
