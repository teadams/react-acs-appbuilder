import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import useGetModel from "../Hooks/useGetModel.js"
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {  BrowserRouter as Router,  Switch,  Route,  Link,  Redirect, useHistory } from "react-router-dom";

import {AppBar,Toolbar, Typography, IconButton, Button, Paper, Tabs, Tab, Drawer, Divider,List, Menu, MenuItem, ListItem, ListItemText} from '@material-ui/core';
import rab_component_models from '../Models/HealthMe/component.js'
import * as control from '../Utils/control.js'

function TabMenu(props)  {
  const {selected_menu, menu_type, orientation, ...params} = props
  const history = useHistory({});
  const value = selected_menu
  let menu_model =  useGetModel("menu")
  if (!menu_model) {return null}

  const field_list=
      menu_model.menus[menu_type]?menu_model.menus[menu_type]:
                                  Object.keys(menu_model.menu_items)
  const TabsComponent = ((props) => {
    const {data, field_list} = props
    const [value, setValue] = React.useState(props.value);

    function handleOnChange(event,new_value) {
      window.scrollTo(0,0)
      setValue(new_value)
      let path = `/foo/${new_value}`
      history.push(path);
      if (props.onChange) {
          props.onChange(new_value)
      }
    }
    return (<Tabs 
       value={value}
       orientation={orientation}
       onChange={handleOnChange}
       indicatorColor="primary"
       textColor="primary"
       variant="scrollable"
       scrollButtons="auto"
       centered
      > 
      {field_list.map(key => {
        const menu_item=data[key]
        if (!menu_item) { alert ("no menu for " +key)}
        return (<Tab value={key} label={menu_item.label}/>)
      })}
    </Tabs>)
  })

  const rab_component_model_name=""
  const rab_component_model = {
          list:{component_names:{list_wrap:"Fragment", body_wrap:"Fragment"},
                components:{list_body_wrap:TabsComponent}
              },
          row:{component_names:{row_wrap:"Fragment", row:"Fragment"}},
          field:{component_names:{field_wrap:"Fragment", field:"Fragment"}},
    }
  const api_options = {foo:1, bar:2}

  return <ACSListController  rab_component_model={rab_component_model} rab_component_model_name={rab_component_model_name} field_list={field_list} data={menu_model.menu_items} value={value} api_options={api_options}/>
}

export default TabMenu;