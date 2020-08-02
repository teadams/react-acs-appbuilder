import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';
import useGetModel from '../Hooks/useGetModel';
import {ACSTextField} from "../ACSLibrary";


const FormWrap =(props) => {
  // objects are always created at the row level
  // filters always use the filter component 
  if (props.form && (props.mode === "edit")) {
    return (<form onSubmit={props.onSubmit}>
      {props.children}
    </form>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

const Tag = (props) => {
  const {Tag, style, css_class} = props
  if (Tag) {
    return (<Tag style={style} class={css_class}>{props.children}</Tag>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

function RenderACSField(props) {

  if (!props.data) {return null}

  const {api_options, components:discard_components, ...params} = props
  const {data, row_data, object_type, data_field,  field_name, form_field_name, components, 
        mode="view", form="true", formValues, autoFocus, onSubmit, onBlur, onChange, 
        more_detail, toggleMoreDetail} = props

  // these come from rab_component_model props
  const {pre_text, post_text, css_class, style, 
        tag, tag_style, tag_css_class,
        label=false, pretty_name, label_pre_text, label_post_text=":", label_style, label_css_class,
        wrap_css_class, wrap_style={display:"flex", flexDirection:"column",},
        col_span=1} = props
  // everything regarding field presentation will be in field_model
  function handleFieldClick(event) {
    if (props.onFieldClick && event.target.name !== "more_link") {
       props.onFieldClick(event, data.id, "field", field_name, row_data, data)
    }
  }

  function handleMouseOver(event) {
    if (props.onMouseOver) {
        props.onMouseOver(event, data.id, "field", field_name, row_data, data)
    }
  }

  const {field_wrap:FieldWrap, field:Field=ACSTextField} = components 

  if (mode !== "edit") {
    return (
      <FieldWrap key={field_name+"_wrap1"}   field_name={field_name}   col_span={col_span}>
      <div class={wrap_css_class} style={wrap_style}>
          {label && 
          <div class={label_css_class} style={label_style}>
              {label_pre_text}{pretty_name}{label_post_text}
          </div>}
          <div class={css_class} style={style}>
            <Tag Tag={tag} style={tag_style} class={tag_css_class}>
                {pre_text}<Field {...params}  key={field_name+"field"}/>{post_text}
            </Tag>
          </div>
      </div>
      </FieldWrap>
    )
  

} else {
    return ( 
      <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
        <Field {...params} key={field_name+"field"}/>
      </FormWrap>
    )
  }

}

export default RenderACSField;
