import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';

import useGetObjectList from '../Hooks/useGetObjectList';
import useGetModel from '../Hooks/useGetModel';


import * as control from "../Utils/control.js"
import rab_component_models from '../Models/HealthMe/component.js'

// Documentation - see comments in ACSRowController
function ACSListController(input_props) {
  // do not merge expensive, known unnecessary things
  const {data:input_props_data, target_menu_name, ...merging_props} = input_props
  const object_models =  useGetModel("object_types")
  const object_model = object_models?[input_props.object_type]:{}
  const rab_component_model = control.getFinalModel("list", {...merging_props}, object_model, rab_component_models.list )
  const list_model = rab_component_model.list
  const list_components = list_model.components
  const massaged_props = list_model.props

  const {body_wrap} = list_model.components

    // XX thinking about the role of field list/field tags in lazy loading, lazy reference loading
  const {object_type:props_object_type, api_options:props_api_options={}, field_list="", field_tags} = massaged_props

  // important to use input_props.data as it is an array and useGetObjectList
  // see changes to an array's reference as a change
  let [object_type, api_options, data] = useGetObjectList(massaged_props.object_type, massaged_props.api_options, input_props.data); 
  if (!data || (object_type && !object_model)) return null

  const RenderACSList  =  list_components.list
  const ACSList = list_components.list_wrap
  const ACSListBody = list_components.list_body_wrap

  return  (
  <ACSList>
    <ACSListBody {...list_model.props} object_type={object_type} field_list={field_list} field_tags={field_tags}  data={data} api_options={api_options}  rab_component_model={rab_component_model}>
        <RenderACSList {...list_model.props}  object_type={object_type} field_list={field_list}  data={data} api_options={api_options} rab_component_model={rab_component_model} />
    </ACSListBody>
  </ACSList>)
  
}

export default ACSListController;