import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment} from 'react';
import * as meta from './Utils/meta.js'
import * as log from './Utils/log.js'
import * as u from './Utils/utils.js'
import * as control from './Utils/control.js'
import useGetModel from "./Hooks/useGetModel.js"

function Body(props) {
  const {selected_menu} = props
  const menu_model =  useGetModel("menus")
  const app_params =  useGetModel("app_params")
  if (!selected_menu  ) {return null}
  let selected_menu_model = menu_model.menu_items[selected_menu]

  let BodyComponent = control.componentByName(selected_menu_model.menu_component_name)
//u.a("bdoy comp", BodyComponent)
  const { ...rest} = selected_menu_model

  return (<div style={{margin:10}}> < BodyComponent {...rest}/></div>)  
}

export default Body
