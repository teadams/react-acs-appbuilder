import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import _ from 'lodash/object'

import rab_component_models from '../Models/HealthMe/component.js'

import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';
import FieldView from './FieldView.js'
import {functional_components} from "../Functional/index.js"
import ACSField from '../Functional/ACSField2.js'
import RenderACSField from '../Functional/RenderACSField.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSRowController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {Tab, Tabs, Menu, MenuItem, Paper, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,Typography} from '@material-ui/core';
import useGetModel from "../Hooks/useGetModel.js"
 
function ObjectView(props)  {
u.a("object view", props)
  const field_models = useGetModel("fields","",true)
  const menu_model =  useGetModel("menus","",true)
  const model = meta.getByPrecedence({filter_field:"id"}, props, menu_model.menu_items[props.menu_name])
  const {object_type, filter_field, num_columns, form_open=props.row_form, ...params} = model
  let api_options = {}
  api_options.filter_id = props[filter_field]
  api_options.filter_field = filter_field

  function handleFormClose() {
    if (props.onClose) {
      props.onClose()
    }
  }
  return ( <ACSRowController {...params} form_open={form_open} onClose={handleFormClose} object_type={object_type}  api_options={api_options} num_columns={num_columns}  />
          )
}
export default ObjectView;
