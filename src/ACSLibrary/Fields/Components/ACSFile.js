import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../../../Utils/utils.js';
import * as control from '../../../Utils/control.js';

import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { OutlinedInput, FormControl, FormHelperText, Input, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Select, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell,InputLabel } from '@material-ui/core';
import * as meta from '../../../Utils/meta.js';
import useGetModel from '../../../Hooks/useGetModel.js'

function get_file_url (file_object) {
    if (!file_object) {return null}
    const file_base = (process.env.NODE_ENV ==="production")? "https://storage.googleapis.com/acs_full_stack/":"/"
    if (file_object && file_object.path && file_object.name) {
      return (file_base  + file_object.path +"/"+ file_object.name)
    } else {
      return ""
    }     
}


function ACSFile(props) {
  const {mode, data, row_data, prevent_edit, image_size="tiny", image_size_list="tiny", field_name, field_models, pretty_key, pretty_name, data_field, formdata, object_type, formValues, disable_underline=false, onChange, autoFocus, avatar, fullWidth=true, custom_width, custom_height, data_type, components, img_style, list_img_style, display_field=props.field_name, references_field, form_field_name=props.field_name, field_model={},
  variant="outlined", required, helperText, placeholder
} = props
const object_type_model = useGetModel("object_types")[object_type]

  let field_value = data[data_field]
  if (field_value && Object.keys(field_value).length>0) {
      field_value = JSON.parse(field_value)
  }

  const file_url =get_file_url(field_value)


  let letters = ""

  if (!field_value && data_type === "image") {
    const pretty_key = object_type_model.pretty_key_id

    const pretty_field_meta = field_models[object_type][pretty_key]
    const pretty_comp_name = pretty_field_meta.field_component
    const field_component = control.componentByName(pretty_comp_name?pretty_comp_name:"RABTextField")
    let pretty_name_text = ""
    if (data[pretty_key]) {
      pretty_name_text  = field_component({data:data, field_name:pretty_key, mode:"text"})
    }

    let word = ""
    if (pretty_name_text) {
      for (word of pretty_name_text.split(" ")) {
        letters += word.charAt(0)
      }
    }
  }
switch (mode) {
    case "edit":
    case "create":
      let file_exists = false 
      let file_src, file_name
      if (formValues && Object.keys(formValues).length>0 &&formValues[form_field_name]) {
        file_exists = true
        file_src = URL.createObjectURL(formValues[form_field_name])
        file_name = formValues[form_field_name].name
      }
      const border_style= {
        borderColor:"rgba(0, 0, 0, 0.24)",
        borderStyle: "solid",
        borderWidth: "1px",
        display:"flex",
        flexDirection:"column",
        padding:"10px",
        height:"100%",
        lineHeight:"1.1876em"
      }
      return (<Fragment>
        <div>
        {field_model.summary &&  <div style={{marginBottom:"5px"}}>{field_model.summary}</div>}
          <div style={border_style}>
            {file_name && <div>
            <Fragment>Filename: {file_name}</Fragment>
            </div>}
            <div style={{paddingLeft:"10px"}}>
               <label htmlFor={form_field_name}>
                {helperText} <br/>
                 <Button style={{marginTop:"10px"}} color="primary" variant="outlined" component="span">
                   Upload {pretty_name}
                 </Button>
                
               </label>    
               <input
                 style={{ display: "none" }}
                 id={form_field_name}
                 name={form_field_name}
                 key={form_field_name}
                 type="file"
                 onChange={onChange}
               />
            </div>
            </div>
          </div>
        </Fragment>
        )
      break
    case "csv":
      return '"'+ field_value.name+" - " + file_url +'""'
      break
    case "list":

        return (field_value.name + " + " + file_url)
      break;
    default:
      
      return (field_value.name + " + " + file_url)

      // text, view, list
  }
}

export default ACSFile;
