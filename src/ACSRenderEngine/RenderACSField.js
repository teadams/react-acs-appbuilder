import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment, useContext,  useState, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, TableCell } from '@material-ui/core';
import useGetModel from '../Hooks/useGetModel';
import {ACSTextField, ACSField, ACSImage} from "../ACSLibrary";
import UIContext from '../Template/UIContext.js';


const ACSVoid = (props) => {
  return <Fragment/>
}

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
  let {col_span} = props

  if (Tag) {
    return (<Tag onClick={props.onClick} colSpan={col_span} style={style} className={css_class}>{props.children}</Tag>)
  } else {
    return (<Fragment>{props.children}</Fragment>)
  }
}

const popup_origin = {
    anchorOrigin:{vertical: 'top',
    horizontal: 'center',
    },
    transformOrigin:{
      vertical: 'bottom',
      horizontal: 'center',
    }}

function RenderACSField(props) {


  const popup = useContext(UIContext).popup   

  if (props.data === undefined) {
      return null
  }
  let {api_options, components:discard_components, ...params} = props
  const {data, row_data, object_type, data_field,  field_name, form_field_name, components={},
        mode="view", form="true", formValues, autoFocus, onSubmit, onBlur, onChange, 
        more_detail, toggleMoreDetail, click_to_edit, field_model, referred_by_object_type} = props

  // these come froprops.m rab_component_model props

  const {field_tag="div", field_pre_text, field_post_text, field_css_class, field_style,  //field
        label=false, pretty_name, label_tag="", label_pre_text, label_post_text, label_style, label_css_class, //label
        hide_if_empty, wrap_css_class, wrap_style={display:"flex", flexDirection:"row"},  wrap_tag="",
        with_thumbnail, thumbnail_size="small"} = props  //wrap
    let {col_span=1} = props




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

  if (label && col_span > 1) {
    col_span = 2*col_span -1
  }
  let {field_wrap:FieldWrap=Fragment, field:Field=ACSTextField} = components 


  let show_thumbnail = false
  if (with_thumbnail && data[with_thumbnail]) {
      show_thumbnail = true
  }



  if (mode !== "edit" && mode !== "create") {
    if (hide_if_empty && !data[data_field]) {
       FieldWrap = ACSVoid
    }

    const handleClickToEditSubmit = (event) => {
        popup.close()
    }

    const TestPop = (props) => {

        return (<Fragment>
          <div style={{margin:"20px"}}>
          <ACSField onSubmit={handleClickToEditSubmit} object_type={object_type} field_name={field_name} 
          data={data} field_mode="edit" field_form={true}/>
          </div>
        </Fragment>)
    }

    const handleFieldClick = (event) => {
        popup.setOrigin(popup_origin)
        popup.open(event,TestPop)
    }

    if (referred_by_object_type === "nwn_project_need") {
      params={}
      params.object_type = referred_by_object_type
      params.api_options = {}
      params.api_options.filter_field= field_model.referred_by_field
      params.api_options.filter_id = data[field_model.referred_to_field]
      if (field_model.referred_by_field === "core_subsite") {
        params.api_options.subsite_id = data[field_model.referred_to_field]
      }
    }

    return (<Fragment>
      <FieldWrap  onClick={handleFieldClick} key={field_name+"_wrap1"}   field_name={field_name}   col_span={col_span}>
          <Tag Tag={wrap_tag} class={wrap_css_class} style={wrap_style}>
            {label && 
            <Tag Tag={label_tag} class={label_css_class} style={label_style}>
                {label_pre_text}{pretty_name}{label_post_text}
            </Tag>}
            <Tag Tag={field_tag} col_span={col_span} style={field_style} class={field_css_class}>
                {!show_thumbnail?
                    <Fragment>
                      {field_pre_text}<Field {...params}  key={field_name+"field"}/>{field_post_text}
                    </Fragment>
                  :<div style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                    <ACSImage image_object={data[with_thumbnail]} size={thumbnail_size}/>            
                    <div style={{paddingLeft:3}}>{field_pre_text}<Field {...params}  key={field_name+"field"}/>{field_post_text}</div>
                  </div>
              }

            </Tag>
          </Tag>
      </FieldWrap></Fragment>
    )
  
  } else {
    return ( 
      <FormWrap mode={mode} form={form} onSubmit={props.onSubmit}>
        <FieldWrap key={field_name+"_wrap1"}   field_name={field_name}   col_span={col_span}>
            <Tag Tag={wrap_tag} class={wrap_css_class} style={wrap_style}>
              <Tag Tag={label_tag} class={label_css_class} style={label_style}>
                  {label_pre_text}{pretty_name}{label_post_text}
              </Tag>
              <Tag  Tag={field_tag} col_span={col_span} style={field_style} class={field_css_class}>
                <Field {...params}  key={field_name+"field"}/>
              </Tag>
            </Tag>
        </FieldWrap>
      </FormWrap>
    )
  }

}

export default RenderACSField;
