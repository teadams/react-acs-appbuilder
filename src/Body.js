import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, { Component, Fragment, useContext} from 'react';
import * as meta from './Utils/meta.js'
import * as u from './Utils/utils.js'
import * as control from './Utils/control.js'
import useGetModel from "./Hooks/useGetModel.js"
import AuthContext from './Components/User/AuthContext';

function shieldObject(object) {
  // ensure object exists
  // Clone with a new pointer so that it does not 
  // modify upsteam
  // XX Later expand to be able to do deep shield
  if (!object) {
      return {}
  } else {
      return Object.assign({},object) 
  }

}

function Body(props) {
  const {selected_menu, object_type, id} = props
  u.a(selected_menu,object_type,id)

  const menu_model =  useGetModel("menus")
  const app_params =  useGetModel("app_params")
  const context = useContext(AuthContext)

  if (!selected_menu  ) {return null}
  let selected_menu_model = menu_model.menu_items[selected_menu]
  selected_menu_model.api_options = shieldObject(selected_menu_model.api_options)
  let BodyComponent = control.componentByName(selected_menu_model.menu_component_name)
//u.a("bdoy comp", BodyComponent)
  if (selected_menu_model.with_context) {
    selected_menu_model.api_options.filter_field = "core_subsite"
    if (context.context_id) {
      selected_menu_model.api_options.filter_id = context.context_id
    } 
  }

  const { ...rest} = selected_menu_model

  return (<div id="tall" style={{display:"table", marginTop:5}}>< BodyComponent {...rest}/></div>)  
}

export default Body
