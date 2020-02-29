//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography,  Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar, List, ListItem, ListItemText } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import { Image} from "../index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';
import 'typeface-roboto'

class ProjectMessage extends React.Component {

  constructor(props) {
    super(props);    
    this.state = {
      bodyOpen: false,
    }
    this.handleBodyOpen = this.handleBodyOpen.bind(this);     
    this.handleBodyClose = this.handleBodyClose.bind(this);  
  } 


  handleBodyOpen = event => {
      this.setState({bodyOpen:true})
      if (!this.props.row.read_p) {
        this.markRead();
        this.props.onRead(this.props.index)
      }
  }

  handleBodyClose = event => {
      this.setState({bodyOpen:false})
  }


  markRead() {
    var options = {}
    options.id = this.props.row.id
    options.read_p = true;
    data.putData("nwn_project_message", options, (data, error) => { 
        // UPDATE THE PARENT
    })
  }  

  


  render () {
      return (<Fragment>
              <ListItem>
                <ListItemText>
                  <Grid direction="horizonal" container>
                  <Grid item style={{width:100}}>{this.props.row.creation_date}</Grid><Grid item style={{paddingLeft:20, width:300}}>   
                  {this.props.row.from_user_first_name} {this.props.row.from_user_last_name} 
                  </Grid>
                  <Grid  item style={{paddingLeft:20}}>
                  {this.props.row.read_p &&
                  <Button color="secondary" onClick={this.handleBodyOpen} >{this.props.row.subject}</Button>}
                  {!this.props.row.read_p &&
                  <Button color="primary" onClick={this.handleBodyOpen}><b>{this.props.row.subject}</b></Button>}
                  </Grid></Grid>
                  </ListItemText>
              </ListItem>
              <Dialog fullWidth={true} open={this.state.bodyOpen} onClose={this.handleBodyClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Message</DialogTitle>
                  <DialogContent>
                    <DialogContentText>{this.props.row.body}</DialogContentText>
                  </DialogContent>
                  <DialogActions>
                  <Button onClick={this.handleBodyClose} color="primary">
                    Close
                  </Button>
                </DialogActions>
                </Dialog>
              </Fragment>
        )
    } 
}

export default ProjectMessage;

