import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as utils from '../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import ObjectList from "./ObjectList.js"
import {ObjectView} from "../Components/Experimental/index.js"
import RenderFieldList from './RenderFieldList.js'
import RenderFieldListList from './RenderFieldListList.js'


import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

function NewDrillDown(props)  {
  // initializations
  const {data, sections} = props
  // effects
  const [selected_id, setSelectedId] = useState(props.selected_id);
  const [object_type, setObjectType] = useState(props.object_type);

  // State control
  if (object_type != props.object_type) {
     handleSelect(null)
     setObjectType(props.object_type)
  }
  // functions
  function handleSelect(new_selected) {
    setSelectedId(new_selected)
  }

  // Render
  return (
  <Grid container>
    <Grid  sm={2} item><div>NewDD
        <RenderFieldListList sections={sections} data={data} object_type={object_type}  onSelect={handleSelect}/>
        </div>
    </Grid><Grid sm={6} item>
        {selected_id && object_type == props.object_type &&
          <ObjectView
              object_type = {object_type}
              selected_id = {selected_id}
              grouping_field_name = {props.grouping_field}
  //            onDataChange = {this.handleDataChange}    XX Later
  //          ??  onMenuChange = {this.props.onMenuChange}  XX Later // this may take care of the object type comparison
            />
        }
     </Grid>
  </Grid>
);
    
}

export default NewDrillDown;
