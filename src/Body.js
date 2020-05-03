import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import {dynamic_components} from "./dynamic-components"
import {AuthToggleLink, AuthContext, AuthProvider} from './Components/User';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import * as u from './Utils/utils.js'
import useGetModel from "./Hooks/useGetModel.js"

import axios from 'axios';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  useParams } from "react-router-dom";

function Body(props) {
  const {  selected_menu,selected_menu_type} = props

  let menu_model =  useGetModel("menu")
  if (!menu_model || !selected_menu || !selected_menu_type) {return null}
  menu_model = menu_model[selected_menu_type][selected_menu]
  u.a(menu_model)

  const menu_component_name = meta.getValueByPrecedence("rab_component_name.menu", "ACSField", menu_model)
  let BodyComponent = dynamic_components[menu_component_name]
  if (typeof(BodyComponent) != "function") {
    alert("Menu Model Issues - no component for " + menu_component_name)
  }
  const { ...rest} = menu_model
  return ( < BodyComponent {...rest}/>)  
}

export default Body
