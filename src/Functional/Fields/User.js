import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js'
import * as data from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import ACSImage from "./ACSImage.js"

function User(props) {
  const {data, field_name,display, mode="view", size="tiny", ...params} = props
  if (data) {
    const first_name = data.first_name?data.first_name:""
    const last_name = data.last_name?data.last_name:""
    const thumbnail = data.thumbnail?data.thumbnail:""
    switch (mode) {
      case "text":
        return (first_name + " " + last_name)
        break;
      default:  
        if (thumbnail) {  
          return (<div style={{display:"flex"}}> <ACSImage image_object={thumbnail} fix="width" size={size}/>&nbsp; {first_name} {last_name}</div>)
        } else {
          const letters = first_name.charAt(0)+last_name.charAt(0)
          return (<div style={{display:"flex"}}><ACSImage letters={letters}  fix="width" size={size}/>&nbsp;
          {first_name} {last_name}</div>)
        }
    }
  }
}

export default User;
