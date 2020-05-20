import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSListController from '../ACSListController.js'
import rab_component_models from '../../Models/HealthMe/component.js'
import * as meta from '../../Utils/meta.js';


// <TextField    
//   InputLabelProps={{shrink:true}}
//   name={.name}
//   label={field.pretty_name}
//   disabled={options.disabled?options.disabled:true}
//   type="text"
//   helperText={field.helper_text}
//   value=  {this.getDisplayView(object_type,field,prefix)}
//  style={{width:"90%"}}

// Make the loop a Function
// Call from top  
// Put in the child
// Get correct query
// add levels
function formTreeData(data, tree_depth=0) {
  let tree_data = []
  data.map(row => {
      row.tree_depth = tree_depth
      tree_data.push(row)
      if (row.children && row.children.length >0) {
          tree_depth +=1
          tree_data = tree_data.concat(formTreeData(row.children, tree_depth))
      }
  })
  return tree_data
}

function padding(num) {
  let i;  
  let padding = ""
  for (i = 0; i < num; i++) {
    padding = padding + ".."
  }  
  return <Fragment>{padding}</Fragment>
}

function selectItems(data, select_key_field, select_display_field) {
    data=formTreeData(data)
    return (
      data.map ((row, index) => {
        return(
          <MenuItem key={index} value={row[select_key_field]}>{padding(row.tree_depth)}{row[select_display_field]}</MenuItem>
          )
        })
    )
}

function RABSelectList(props) {
  return (<Fragment>
    <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      name={props.select_form_name}
      value={props.value}
      autoFocus={props.autoFocus}
      onBlur={props.onSubmit}
      style={props.style}
      onChange={props.onChange}>  
      {props.data && selectItems(props.data,props.select_key_field,props.select_display_field)}
    </Select>
    </Fragment>)
}

function RABSelectField(props) {
  const {mode, data, field_name, formValues, onSubmit, onFieldBlur,  onChange, autoFocus, object_type, field_model={}, value="", display_value=" ", style, api_options} = props
  // 2 use cases:
  // 1. Called from a create/edit form (formValues is present)
  //   View will show field_display_value takend from data object.
  //   Edit/create uses controlled values from formValues
  
  // 2. Called directly 
  //     dispaly_value is display_value, value is value

  const form_field_name = formValues?field_model.formValues_name:meta.keys(object_type).key_id

  const field_value = formValues?formValues[form_field_name]:value
  const field_display_value = data?data[field_name]:display_value
  // precedence: props, field_model, keys
  let {select_key_field = field_model.select_key_field, select_display_field = field_model.select_display_field} = props 
  
  select_key_field = select_key_field?select_key_field:meta.keys(object_type).key_id
  select_display_field = select_display_field?select_display_field:meta.keys(object_type).pretty_key_id

  // XX - make a "select" in the library
  let rab_component_model = rab_component_models.shell
  rab_component_model.list.components.list_wrap = RABSelectList
  rab_component_model.list.names.header = "RABVoid"
  switch (mode) {
    case "text", "view":
      return field_display_value?field_display_value:" "
      break   
    case "edit":
    case "create":
      return (<ACSListController object_type={object_type} api_options={api_options} rab_component_model={rab_component_model} list_select_form_name={form_field_name} list_onSubmit={onSubmit} list_field_value={field_value} list_onChange={onChange} list_select_key_field={select_key_field} list_style={style} list_select_display_field={select_display_field} list_autoFocus={autoFocus} />)
      break
    case "csv":
      return '"'+field_display_value+'""'
      break
    default:
      return field_display_value
  }
}

export default RABSelectField;
