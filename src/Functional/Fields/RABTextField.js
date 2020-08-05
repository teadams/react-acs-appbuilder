import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../Utils/utils.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import {Link, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import ACSImage from './ACSImage.js'
import ACSListController from '../ACSListController.js'
import * as meta from '../../Utils/meta.js';


function RABTextField(props) {
  const {mode, row_data,  data, object_type, data_field, field_name, form_field_name=props.field_name, field_model={}, formdata, formValues, disable_underline=false, onChange, autoFocus, fullWidth=true, image_size="small", model_valid_values, valid_values,  db_data_field, required, select_display_field=data_field} = props
if ( object_type === "nwn_project" || object_type === "core_subsite" && (field_name === "core_address_country")) {
//  u.a(field_name,model_valid_values, valid_values)
}

  let {with_thumbnail="", with_url="", more_detail=false, toggleMoreDetail} = props

  // XX field model passed due to referenced change. May 
  // be done server side later
  let field_value
  if (data) {
    field_value = data[field_model.data_field?field_model.data_field:field_name]
  }

  if (!field_value && (field_value === null || field_value === undefined)) {
      field_value =" "
  }

  const field_length = field_value.length 
  let more_link = ""
  let less_link = ""
  let more_link_cutoff = field_model.more_link_cutoff?field_model.more_link_cutoff:""
  if (mode === "list") {
    more_link_cutoff = field_model.more_link_list_cutoff?field_model.more_link_list_cutoff:more_link_cutoff
  }
  if (toggleMoreDetail && more_link_cutoff && field_value.length > more_link_cutoff) {
    if (!more_detail) {
      field_value = field_value.substr(0, more_link_cutoff)
      more_link = <Link key="more_link" id="more_link" name="more_link" onClick={toggleMoreDetail}>(...more)</Link>
    } else {
      more_link = <Link key="more_link" id="more_link" name="more_link" onClick={toggleMoreDetail}>(...less)</Link>
    }
  }

// dependency, api_filters (in field 
// force select (if not default, pick first one

// Add any




  function selectItems(valid_values, trace) {

    // XX todo Any option, calling field for display ( like full name), tree vuew
      if (!valid_values) {
        return null
      }

      return (
        valid_values.map ((value, index) => {
          return (<MenuItem key={index}  value={value[db_data_field]}>{value[select_display_field]}</MenuItem>)
//            return(
//              <MenuItem key={index}  value={row[select_key_field]}>{padding(row.tree_depth)}{field_component({data:row, field_name:select_display_field, mode:"text"})}</MenuItem>
              //)
          })
      )
  }

  function handleSelectChange(event) {
    const value=event.target.value
    let row
    for (row of valid_values) {
        if (row[db_data_field] === value) {
          event.target.selected_data = row
          break
        }
    }
    if (props.onChange) {
      props.onChange(event)
    }
  }


  switch (mode) {
    case "edit":
    case "create":
    case "filter":
      const multiline = field_model.multiline?true:false
      const rows = field_model.multiline?field_model.multiline:1

      if (model_valid_values) {
        let value = formValues[form_field_name]

        if ( !value && valid_values) {
    
            value = valid_values[0][db_data_field]
        }
  
        return (    <Select
              id={form_field_name}
              key={form_field_name}
              name={form_field_name}
              value={value}
              autoFocus={autoFocus}
              onBlur={props.onFieldBlur}
              fullWidth={fullWidth}
              disableUnderline = {disable_underline}
              onChange={handleSelectChange}>
              {selectItems(valid_values)}
            </Select>)
      } else {
        return (
          <TextField 
            autoFocus={autoFocus}
            name={form_field_name} 
            key={form_field_name}
            fullWidth={fullWidth}
            multiline={multiline}
            rows={rows}
            InputProps={{disableUnderline:disable_underline}}
            disabled={field_model.prevent_edit}
            type={field_model.input_type}
            onBlur={props.onFieldBlur}
            value={formValues[form_field_name]}
            onChange={onChange}/>
        )
      }
      break
    case "csv":
      return '"'+field_value+'""'
      break
    case "text":
      return field_value
    default:
          return <Fragment>{field_value}{more_link}</Fragment>
  }
}

export default RABTextField;
