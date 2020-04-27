import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as a from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ACSFieldSet from './ACSFieldSet.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function RenderACSList(props) {

  const {object_type, field_list, data, api_options, list_component, ...params} = props
    if (data) {
      return ( <Fragment>
          {data.map(row => {
          return <ACSFieldSet  object_type={props.object_type} id={data.id} field_list={props.field_list} data={row} api_options={props.api_options} {...params}/>
          })}
        </Fragment>)
    } else {
        return <div/>
    }
}

export default RenderACSList;
