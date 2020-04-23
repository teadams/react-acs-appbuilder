import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import useObjectListGet from '../Hooks/useObjectListGet';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


function ObjectList(props) {
  const object_list_data = useObjectListGet(props.object_type);
  return (<Fragment>
  <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}>
      {object_list_data && object_list_data.map(object => {  
          return <TreeItem nodeId={object.id} label={object.name} />
      })}  
  </TreeView>
  </Fragment>
  );
}


export default ObjectList;
