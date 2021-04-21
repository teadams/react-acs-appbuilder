import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment, useState, useContext} from 'react';
import {Grid,  Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {ACSObjectView, ACSEditButton, ACSField, ACSText, ACSTabMenu, ACSObjectType} from '../../ACSLibrary'

import * as api from '../../Utils/data.js';
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"
import useForm from "../../Hooks/useForm.js"
import useGenerateFieldList from "../../Hooks/useGenerateFieldList.js"

import AuthContext from '../../Modules/User/AuthContext';

function AddMemberForm(props) {
  const {data, core_subsite, id} = props

  function handleAddRoleSubmit(event) {
      handleClose(event)
  }

  let field_list = useGenerateFieldList("core_subsite_role", "", data, "create", true)

  let options={}
  options.path = "auth/create-subsite-role"
  options.field_list = field_list
  let {formAttributes, lastTouched, handleFormChange, handleFormSubmit} = useForm("core_subsite_role", "", data, handleAddRoleSubmit, "create", true, options)

  function handleClose(event) {
      if (props.onClose) {
        props.onClose(event)
      }
  }

  function handleSearchForEmail(event) {
      // search for email 

      // save the Role and the status

      // if email exist, show the second page with the information filled
  }


  return   (
           <form onSubmit={handleSearchForEmail}>
            <Grid container>
            <Grid item style={{padding:10}} sm={12}>
                <ACSField
                object_type = "core_subsite_role"
                field_name = "core_user"  
                mode="create"
                field_display="name_value"
                label_width="15%"
                formAttributes={formAttributes}
                handleFormChange={handleFormChange}
                autoFocus={true}
              />
            </Grid>
              <Grid item style={{padding:10}} sm={12}>
                  <ACSField
                  object_type = "core_subsite_role"
                  field_name = "core_role"  
                  mode="create"
                  field_display="name_value"
                  label_width="15%"
                  formAttributes={formAttributes}
                  handleFormChange={handleFormChange}
                />
              </Grid>
              <Grid item style={{padding:10}} sm={12}>
                <ACSField
                object_type = "core_subsite_role"
                field_name = "status"  
                mode="create"
                label_width="15%"
                field_display="name_value"
                form={false} 
                formAttributes={formAttributes}
                handleFormChange={handleFormChange}
              /> 
                </Grid>
            </Grid>
        <DialogActions>
            <Button onClick={handleSearchForEmail} color="primary">
                 Submit
            </Button>
            <Button onClick={handleClose} color="primary">
                  Cancel
            </Button>
        </DialogActions>    
        </form>
    )
  
}

export default AddMemberForm;
