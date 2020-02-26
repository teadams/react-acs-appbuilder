//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import { Image} from "../index.js"
import { ProjectMessage} from "./index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';
import 'typeface-roboto'
import {AuthContext, LoginForm} from '../index.js';


class ProjectMessages extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        data: [],
    }  
    this.loadData = this.loadData.bind(this);
  } 

  componentDidMount() {
  //   alert ("view data mount")
      this.loadData();
  }
  
  componentDidUpdate(prevProps, prevState, snapshot) {
  //    alert ("view data update")
      if (prevProps.id !== this.props.id || 
          prevProps.object_type !== this.props.object_type) {
          this.loadData();
      }
  } 

  loadData() {
    var options = {}
    options.filter_field = "to_user";
    options.filter_id = this.context.user.id
    options.key_type = "key_id";
    data.getData("nwn_project_message", options, (data, error) => { 
        let updated_state = [];
        updated_state.data = data;
        this.setState(updated_state)
      })
  }

  render () {
      return (
      <Fragment>
      <Grid container spacing='32' direction='column'>
      <Grid item>
      <Typography variant="title">Your Messages</Typography>
      </Grid>
      <Grid>
      <List>
      <ListItem>
        <ListItemText>
          <Grid direction="horizonal" container>
          <Grid item style={{width:100}}><b>Creation Date</b></Grid><Grid item style={{paddingLeft:20, width:300}}>   
          <b>From</b>
          </Grid>
          <Grid item style={{paddingLeft:20}}>
          <b>Subject</b>
          </Grid></Grid>
          </ListItemText>
      </ListItem>
      {this.state.data.map(row=>{
          //alert ('row is ' + JSON.stringify(row))  
          return(
              <ProjectMessage row={row}/>
            )   
      })}
      </List>
      </Grid>
      </Grid>
      </Fragment>  
  )}
}

ProjectMessages.contextType = AuthContext;
export default ProjectMessages;

