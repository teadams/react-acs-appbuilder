import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js';
import * as control from '../../Utils/control.js';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import {AuthContext, Auth, LoginForm} from '../../Modules/User/index.js';
import {ACSHeadlessObject} from '../../ACSLibrary';
import {ACSMenuController} from '../../ACSRenderEngine';

import _ from 'lodash/object'

import { Tabs, Tab, Stepper, Step, StepLabel, StepButton, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField
, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';

import UIContext from '../../Template/UIContext';
import useGetModel from '../../Hooks/useGetModel'

const TabMenu = (props) => {
  const {menu_model, items, item_data, onClick, open=true, orientation="horizontal", dialog=false, default_index=0} = props
  const [current_tab, setCurrentTab] = useState(default_index)
  const context = useContext(AuthContext)
  const current_tab_data = item_data[items[current_tab]]
  const {menu_component_name, pretty_name, summary, description, object_type, mode, menu_item_summary_style, menu_item_description_style, id} = current_tab_data

  function handleClose() {
    if (props.onClose) {
      props.onClose()
    } 
 }

  const handleClick = (event, index) => {
    setCurrentTab(index)
    onClick(index)
  };

   const TabComponent = control.componentByName(menu_component_name);

   return (
     <Fragment>
    {(Object.keys(item_data).length > 1 || !menu_model.hide_single_menu) &&
       <Tabs 
          value={current_tab}
          orientation={orientation}
          onChange={handleClick}
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        //  style={tabs_style}
         > 

        {Object.keys(item_data).map ((item,index) => {
               const {pretty_name, summary,description, force_refresh=false} = item_data[item]
               return (<Tab  value={index} key={index}  label={pretty_name} />)
        })}

        </Tabs>
      }
      {summary && <div style={menu_item_summary_style}>{summary}{description && <Fragment>:</Fragment>}</div>}
      {description && <div style={menu_item_description_style}> {description}</div>}

      {["edit","create"].includes(current_tab_data.props.mode) ?
          <TabComponent  onClose={dialog?handleClose:""} row_dialog_center={!dialog} row_delayed_auth={true} object_type={object_type} id={id} row_form={true} form_open={open} {...current_tab_data.props}/>
       :
       <TabComponent  onClose={dialog?handleClose:""}  object_type={object_type} id={id} {...current_tab_data.props}/>}

    
    </Fragment>
     ) 
} 

function ACSTabMenu(props)  {
    return (
    <ACSMenuController {...props}>
        <TabMenu/>
    </ACSMenuController>
    )
}
export default ACSTabMenu;
