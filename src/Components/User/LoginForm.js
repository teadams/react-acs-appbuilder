import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';

import React, {Fragment} from 'react';
import {Grid, Paper, Typography, Divider, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button, Tabs, Tab } from '@material-ui/core';
import {MappingForm} from "../Experimental/index.js"
import ACSField from "../../Functional/ACSField2.js"
import RABTextField from "../../Functional/Fields/RABTextField.js"

import * as data from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as u from '../../Utils/utils.js';

import useGetModel from "../../Hooks/useGetModel.js"

import update from 'immutability-helper';
import AuthContext from './AuthContext';
import {CreateForm} from "../Layouts/index.js";


class LoginForm extends React.Component {
  constructor(props) {
    super(props);              
    this.state = {
      formValues: {},
      activeTab: 0
    }   
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.handleCreateSubmit = this.handleCreateSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleTabChange = this.handleTabChange.bind(this);
  }

  handleTabChange(event, index) {
    this.setState({activeTab: index})
  }

  handleCreateSubmit(event) {
      const core_user_object_meta = useGetModel("object_types","core_user")
      if (this.state.formValues.credential != this.state.formValues.credential_confirm) {
          alert ("password and password confirm do not match")
      } else {
        data.createAccount( this.state.formValues,  (result, error) => { 
          if (error) {
              alert ("there has been an error")
          } else { 
            var inserted_id = result[core_user_object_meta.key_id] 
            this.setState({ formValues: update(this.state.formValues,{
                        id: {$set: inserted_id}
                        })},
                        this.context.login(this.state.formValues)
            )  ;
          }
      })
    }
  }

  handleLoginSubmit(event) {
    let data_object = {}
    data_object.email = this.state.formValues["email"]
    data_object.credential = this.state.formValues["credential"]

    data.login ( data_object,  (user_data, error) => {
        if (!user_data.email_match) {
            alert ('email not found')
        } else if (!user_data.password_match) {
            alert ("password is not correct")
        } else {
          this.context.login(user_data)
          this.handleClose()
        }
    })
    // update context

  }

  handleClose(event) {
      this.props.handleClose(event)
  }

  handleChange (event)  {
    event.persist();
    let value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    this.setState({ formTouched:true, formValues: update(this.state.formValues,{
          [event.target.name]: {$set: value}
      }) 
    });
  }

  render() {
  return   (
    <Dialog fullWidth={true}  open={this.props.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
    <Tabs 
      onChange={this.handleTabChange} 
      value={this.state.activeTab} 
      indicatorColor="primary"
      textColor="primary"
      >
      <Tab label="Login" />
      <Tab label="Create Account" />
    </Tabs>
    {this.state.activeTab == 0 &&
      <Fragment>
        <DialogTitle id="form-dialog-login">Login</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
           <form onSubmit={this.handleLoginSubmit}>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                  <ACSField
                  object_type = "core_user"
                  field_name = "email"  
                  field_mode="edit"
                  field_display="name_value"
                  field_form={false}
                  value={this.state.formValues["email"]}
                  data={this.state.formValues}
                  formValues={this.state.formValues}
                  disableUnderline={false}
                  handleFormChange={this.handleChange}
                  id = "email"
                  autoFocus={true}
                  key="email" key_id="email"
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item style={{padding:10}} sm={12}>
                <ACSField
                object_type = "core_credential"
                field_name = "credential"  
                field_mode="edit"
                field_display="name_value"
                field_form={false} 
                data={this.state.formValues}
                formValues={this.state.formValues}
                disableUnderline={false}
                handleFormChange={this.handleChange}
                id = "credential"
                autoFocus={false}            
                key="credential" key_id="credential"
              /> 
                </Grid>
              </Grid>
            </form>
        </DialogContent>
        <DialogActions>
            <Button onClick={this.handleLoginSubmit} color="primary">
                 Submit
            </Button>
            <Button onClick={this.handleClose} color="primary">
                  Cancel
            </Button>
        </DialogActions>
      </Fragment>
      }
      {this.state.activeTab == 1 &&
          <Fragment>
            <DialogTitle id="form-dialog-create-account">Create Account</DialogTitle>
            <DialogContent>
              <DialogContentText></DialogContentText>
              <form onSubmit={this.handleCreateSubmit}>
              <Grid container>
                <Grid item style={{padding:10}} sm={6}>
                    <ACSField object_type = "core_user"
                      field_name = "first_name"  
                      mode="create"
                      data_object={this.state.formValues}
                      disableUnderline={false}
                      onChange={this.handleChange}
                      id = "first_name"
                    /> 
                </Grid>
                <Grid item style={{padding:10}} sm={6}>
                    <ACSField object_type = "core_user"
                      field_name = "last_name"  
                      mode="create"
                      data_object={this.state.formValues}
                      disableUnderline={false}
                      onChange={this.handleChange}
                      id = "last_name"
                    /> 
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={{padding:10}} sm={12}>
                  <ACSField object_type = "core_user"
                    field_name = "email"  
                    mode="create"
                    data_object={this.state.formValues}
                    disableUnderline={false}
                    onChange={this.handleChange}
                    id = "email"
                  /> 
                </Grid>
              </Grid>
              <Grid container>
                <Grid item style={{padding:10}} sm={6}>
                 <ACSField object_type = "core_credential"
                    field_name = "credential"  
                    mode="create"
                    data_object={this.state.formValues}
                    disableUnderline={false}
                    onChange={this.handleChange}
                    id = "password"
                  /> 
                </Grid>
                <Grid item style={{padding:10}} sm={6}>
                  <ACSField object_type = "core_credential"
                  field_name = "credential_confirm"  
                  mode="create"
                  data_object={this.state.formValues}
                  disableUnderline={false}
                  onChange={this.handleChange}
                  id = "password_confirm"
                  />
                </Grid>
              </Grid>
          </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleCreateSubmit} color="primary">
                     Submit
                </Button>
                <Button onClick={this.handleClose} color="primary">
                      Cancel
                </Button>
            </DialogActions>
          </Fragment>
      }
      </Dialog>)
  }
}

LoginForm.contextType = AuthContext;
export default LoginForm;
