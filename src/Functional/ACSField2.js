import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import _ from 'lodash/object'

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

import RenderACSField from './RenderACSField.js'

import useGetObject from '../Hooks/useGetObject';
import useGetModel from '../Hooks/useGetModel';

import * as control from "../Utils/control.js"
import rab_component_models from '../Models/HealthMe/component.js'


function ACSField(input_props) {
  const [mode, setMode] = useState("view");
  const field_models =  useGetModel("fields")
  let field_model = field_models?field_models[input_props.object_type][input_props.field_name]:{}

  const {object_type:input_object_type, field_name:input_field_name,...merging_props} = input_props

  // Use case - this field has been tagged with "references"
  // which indicates the field is from another object type.
  // Need to modify that the  object_type, field_name to 
  // represent the meta model from the other model and
  // provide the correct data.
  let final_data_target = ""
  let final_model_object_type = input_object_type
  let final_field_name = input_field_name
  if (field_model && field_model.references) {
      // manipulate field_model and object_type to be from references
      const references = field_model.references
      final_data_target = input_props.field_name
      final_model_object_type = field_model.references
      // XX server side
      const referenced_field_name = field_model.referenced_field?field_model.referenced_field:meta.keys(final_model_object_type).pretty_key_id 
      let referenced_field_model = field_models?field_models[final_model_object_type][referenced_field_name]:{}
      referenced_field_model = _.merge({},referenced_field_model)
      referenced_field_model.pretty_name = field_model.pretty_name // take name from original field
      field_model = referenced_field_model
      final_field_name = referenced_field_name
  }

  merging_props.object_type = final_model_object_type
  merging_props.field_name = final_field_name
  const rab_component_model = control.getFinalModel("field", {...merging_props}, field_model, rab_component_models.field)

  const field_component_model = rab_component_model.field
  const massaged_props = field_component_model.props

  const {object_type:props_object_type, id:props_id, field_name:props_field_name, api_options:props_api_options, data:props_data, component, ...params} = massaged_props
  let [ready, object_type, id, field_name, api_options, data] = useGetObject(props_object_type, props_id,props_field_name, props_api_options, props_data); 

  if (!data || (object_type && !field_model)) return null
  // if data is in a referenced field

  data = final_data_target?data[final_data_target]:data



// XX ?? look at rest of props and see if there are any other API options... what layer to do this in
  function handleViewClick(event) {
      setMode("edit")
  }

  function handleEditSubmit(event) {
      setMode("view")
  }

  function handleFieldClick(event, id, type, field_name, field_data) {
      if (rab_component_model.field.props.onFieldClick) {
          rab_component_model.field.props.onFieldClick(event,id,type,field_name,field_data)
      }
  }
    
// Determine the mode
// state will track a view/edit mode
// Use case
// When user clicks on a field in view mode, it will
// render a one-input form. When use mouse leaves the
// form, the form is submitted and the page returns
// to view mode.  

return (
    <RenderACSField {...field_component_model.props}  data={data} 
    onFieldClick ={handleFieldClick}
    object_type={object_type} field_name={field_name} field_model={field_model} rab_component_model={rab_component_model}/>
  )
}

export default ACSField;
