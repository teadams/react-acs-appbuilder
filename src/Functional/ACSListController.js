import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';

import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';

// Responsible 
// chosing model, component
// storing state of forms?
// Decided the mode?
import useGetObjectList from '../Hooks/useGetObjectList';
import useGetModel from '../Hooks/useGetModel';
import RenderACSList from './RenderACSList.js'
import ACSRowController from './ACSRowController.js'

import * as control from "../Utils/control.js"
import rab_component_models from '../Models/HealthMe/component.js'

function RABTableHeaders(props) {
   const {object_type, data, rab_component_model, ...list_params} = props
    let {field_list} = props
   const field_models =  useGetModel("fields")
   if (!field_models) {return null}
   const field_model = field_models[object_type]

  // XX 3 places
   if (!props.field_list) {
       if (object_type) {
         field_list = Object.keys(field_model)
       } else {
         field_list = Object.keys(data)
       }
   }
   const fields_to_splice = ["creation_user", "creation_date", "last_updated_date", "core_subsite", "full_name", "thumbnail"]
   fields_to_splice.forEach(field => {
     if (field_list.indexOf(field)>0) {
       field_list.splice(field_list.indexOf(field),1)
     }
   })
  return (field_list.map(field=>{
        return(<TableCell>{field_model[field].pretty_name}</TableCell>)
    }))
}
// Documentation - see comments in ACSRowController
function ACSListController(input_props) {
  // do not merge expensive, known unnecessary things
  const {data:input_props_data, target_menu_name, ...merging_props} = input_props
  const object_models =  useGetModel("object_types")
  const object_model = object_models?object_models[input_props.object_type]:{}
  function RABList(list_props) {
    const {data, rab_component_model, ...list_params} = list_props
    return (
      data.map(row => {
          return (<ACSRowController {...list_params} data={row} rab_component_model={rab_component_model}/>)
      })
    )
  }
  // XX BUG. will change the original 
  // Fix is to make RABList in the library and 
  // put it in the base. (which is actually the )
  // same effect so it's not "really" a a bug
  let list_component_model = rab_component_models.list
  list_component_model.list.components.list = RABList
  list_component_model.list.components.list_header = RABTableHeaders
  list_component_model.list.names.list_header_wrap = "TableHead" 

  const rab_component_model = control.getFinalModel("list", {...merging_props}, object_model, rab_component_models.list )
  const list_model = rab_component_model.list
  const list_components = list_model.components
  const massaged_props = list_model.props
  const {list_wrap, body_wrap, list} = list_components
  //u.aa("l-w, b-w,l", list_wrap, body_wrap, list)
    // XX thinking about the role of field list/field tags in lazy loading, lazy reference loading
  const {object_type:props_object_type, api_options:props_api_options={}, field_list=""} = massaged_props
  // important to use input_props.data as it is an array and useGetObjectList
  // see changes to an array's reference as a change
  let [object_type, api_options, data] = useGetObjectList(massaged_props.object_type, massaged_props.api_options, input_props.data); 
  if (!data || (object_type && !object_model)) return null
  return  (
    <RenderACSList {...list_model.props}  object_type={object_type} field_list={field_list}  data={data} api_options={api_options} rab_component_model={rab_component_model} />
  )
  
}

export default ACSListController;