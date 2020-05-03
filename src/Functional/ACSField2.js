import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import useGetObject from '../Hooks/useGetObject';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

import {functional_components} from "./index.js"

function ACSField(props) {
  const {object_type:props_object_type, id:props_id, field_name:props_field_name, api_options:props_api_options, data:props_data, component, ...params} = props

  const [mode, setMode] = useState("view");
  let [ready, object_type, id, field_name, api_options, data] = useGetObject(props_object_type, props_id,props_field_name, props_api_options, props_data); 
// XX ?? look at rest of props and see if there are any other API options... what layer to do this in
  function handleViewClick(event) {
      setMode("edit")
  }

  function handleEditSubmit(event) {
      setMode("view")
  }
    
  // Use case - this field has been tagged with "references"
  // which indicates the field is from another object type.
  // Need to modify that the  object_type, field_name to 
  // represent the meta model from the other model and
  // provide the correct data.
  let field_meta = meta.fields(object_type)[field_name]
  if (field_meta && field_meta.references) {
      const references = field_meta.references
      data = data[field_name]
      object_type = field_meta.references
      field_name = field_meta.referenced_field?field_meta.referenced_field:meta.keys(object_type).pretty_key_id
      let referenced_field_meta = meta.fields(object_type)[field_name]
      referenced_field_meta.pretty_name = field_meta.pretty_name // take name from base object
      field_meta = referenced_field_meta
  }
  // props, meta, default
  
  let RenderField  =  meta.getValueByPrecedence("rab_component.field","",field_meta, props)

  let ACSCell = meta.getValueByPrecedence("rab_component.field_wrap","",field_meta, props)

  let component_name = ""
  if (!RenderField) {
    component_name = meta.getValueByPrecedence("rab_component_name.field","RenderACSField",field_meta, props)
     RenderField = functional_components[component_name]
  }
  let wrap_name =""
  if (!ACSCell) {
    wrap_name =meta.getValueByPrecedence("rab_component_name.field_wrap","TableCell",field_meta, props)

    ACSCell = functional_components[wrap_name]
  }

  const onWrapClickProp = meta.getValueByPrecedence("onClick.field_wrap","",field_meta,props)

  function onWrapClick(event) {
    if (onWrapClickProp) {
      onWrapClickProp(data.id, event, object_type)
    }
  }
// state will track a view/edit mode
// Use case
// When user clicks on a field in view mode, it will
// render a one-input form. When use mouse leaves the
// form, the form is submitted and the page returns
// to view mode.  
//  u.a(on_click)
  if (data && ready) {
      if (mode=="view") {
          return (
            <ACSCell {...params} onClick={onWrapClick} data={data} object_type={object_type} field_name={field_name} field_meta={field_meta}>
              <RenderField  {...params} data={data} object_type={object_type} field_name={field_name} field_meta={field_meta}/>
            </ACSCell>
          )
      } else {
          return (<div>edit form</div>)
          // Later - FROM with compoent fieldForm, handleSubmit, data, object_type,
      }
  } else {
      return null
  }
}

export default ACSField;
