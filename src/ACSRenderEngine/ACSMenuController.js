import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../Utils/utils.js';
import * as meta from '../Utils/meta.js'
import * as api from '../Utils/data.js'
import _ from 'lodash/object'
import * as auth from '../Utils/auth.js'

import useGetModel from '../Hooks/useGetModel'
import {AuthContext} from '../Modules/User/index.js';
import {useHistory } from "react-router-dom";

import React, { Component, Fragment,  useRef, useState, useContext, useEffect} from 'react';
import * as control from "../Utils/control.js"


const ACSMenuController = (props) => { 
  const {menu_type, selected_menu, object_type, field_name, open, onClose, id,  ...params} = props
  const menu_models = useGetModel("menus")
  const menu_model = menu_models.menus[menu_type]
  const context = useContext(AuthContext);
  const history = useHistory({});

  const {items:discard_items, ...menu_model_rest} = menu_model
  let items= [...menu_model.items]
  let hidden_item = ""
  if (selected_menu && items.indexOf(selected_menu) === -1) {
    hidden_item = selected_menu
    items.push(selected_menu)
  }
  let item_data = {}
  let default_index = 0
  let final_items = []

  items.forEach((item,index) => {
    // add authentication, expand based on item
    // expand out items like subsites
    const menu_item = _.merge({},menu_models.menu_items[item])
    if (!menu_item) { alert ("no menu for " + item)}
    if (item === hidden_item) {
        menu_item.hidden  = true
    }
    const auth_scope = menu_item.auth_scope
    const auth_priv = menu_item.auth_priv
    const authorized = auth.authorized({context_id:context.context_id, user:context.user}, auth_scope, auth_priv)
    if (!authorized) {return}
    menu_item.key = item
    menu_item.index = index
    if (!menu_item.props) {
        menu_item.props = {}
    }
    if (!menu_item.props.api_options) {
        menu_item.props.api_options ={}
    }
    if (!menu_item.props.api_options.filter_field) {
      menu_item.props.api_options.filter_field =[]
    }
    if (!menu_item.props.api_options.filter_id) {
      menu_item.props.api_options.filter_id =[]
    }
    if (menu_item.with_context && context.context_id) { 
      if (menu_item.object_type !== "core_subsite" || !id) {
        menu_item.props.api_options.filter_field.push("core_subsite")
        menu_item.props.api_options.filter_id.push(context.context_id) 
      }  else if (menu_item.object_type === "core_subsite" && id) {
        menu_item.props.api_options.filter_field.push("core_subsite")
        menu_item.props.api_options.filter_id.push(id) 
      }
    }
    if (id) {
      menu_item.id = id
    }
    if (context && context.context_id && menu_item.object_type === "core_subsite" && !menu_item.id && !id) {
        menu_item.id = context.context_id
    }
    if (context && context.user.id && menu_item.object_type === "core_user" && !menu_item.id && !id) {
        menu_item.id = context.user.id
    }
    if (menu_item.pretty_name === "_context_name") {
        menu_item.pretty_name = context.subsite.name
    }
    if (menu_model.default_item === item) {
        default_index = index
    }
    item_data[item] = menu_item
    final_items.push(item)
  })

  let default_menu = final_items[0]
  if (selected_menu) {
    default_menu = selected_menu
  }
  if (selected_menu && final_items.indexOf(selected_menu) !== -1) {
      default_index = final_items.indexOf(selected_menu)      
  }

  const handleClick = ((index) => {
    window.scrollTo(0,0)
    const clicked_item =  item_data[final_items[index]]
    let path = final_items[index]
    if (clicked_item.link) {
      path = clicked_item.link  
    }
    history.push(path);
  })
  // handle change
  return (
    <Fragment>
    {React.cloneElement(props.children, {onClick:handleClick, default_index:default_index, menu_model:menu_model, items:final_items, item_data:item_data, default_menu:default_menu, ...props, ...menu_model_rest })}
    </Fragment>
  )

}

export default ACSMenuController