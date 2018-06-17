//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent ,DialogContentText, DialogActions, Button } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField} from "../Layouts/index.js";



function getData (object_type, options, callback)   {
  var urltext = '/api/v1/' + object_type;
  if (options.id) {
    urltext += '/'+options.id
  }
  axios({
   method: 'get',
   url: urltext,
 }).then(results => {
      callback(results.data,"");
  }).catch(error => {
    log.val('in catch error', error.message)
    callback('', error);
  })
}


class ViewForm extends React.Component {

  constructor(props) {
    super(props);           

    this.state = {
        item_data: "",
        pretty_name_edit: false,
        props_object_type: ''
    }  
    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleDBUpdate = this.handleDBUpdate.bind(this);
  } 

  static getDerivedStateFromProps(nextProps, prevState) {
    // in order for our dynamically managed form elements to be controlled,
    // we need initialized them with values set in the state.  Otherwise
    // we get "you are changing uncontrolled components to controlled" warnings
    if (nextProps.object_type && nextProps.object_type != prevState.props_object_type) {
      var new_state = {};
      new_state.props_object_type = nextProps.object_type;
      meta.fields(nextProps.object_type).map(field => {
            // We choose to stare each form value in the state with field name
            // pre-pended by "form"
            //  a) No chance of name collision with other state variables
            //  b) We avoid complications with storing objects in the state.
            //     (because javascript passes objects by reference, it takes
            //      work/resources to avoid changing the state directly)
              new_state["form_" + field.name] = "";
            // Keep track of this field has changed since last db update
              new_state["form_changed_" + field.name] = false
              new_state["form_underlined_" + field.name] = false
      })
    // alert ('new state is ' + JSON.stringify(new_state))
      return new_state
    }
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  //  alert('DID UPDATE update and form values is ' + JSON.stringify(formValues))
      if (prevProps.selected_id !== this.props.selected_id) {
        getData (this.props.object_type, {id:this.props.selected_id}, (item_data, error) => { 
              var new_state = {};
              new_state.item_data = item_data;
              meta.fields(this.props.object_type).map(field => {
                new_state["form_" + field.name] = (item_data[field.name] !== null)?item_data[field.name]:""
                new_state["form_changed_" + field.name] = false
                new_state["form_underlined_" + field.name] =  (item_data[field.name]===null || item_data[field.name===""])?true:false
              })
              this.setState(new_state)
        }) 
      }
  }  

  handleChange = name => event => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      var new_state = {}
      new_state["form_"+name] = value;
      new_state["form_changed_" +name ] = true
      //alert ('handle change ' + name)
      this.setState(new_state);
  }

  handleFocus = event => {
      var new_state = {}
      new_state["form_underlined_" +event.target.id ] = true
      this.setState(new_state);
  }

  handleSubmit = name => event => {
      event.preventDefault();
      if (this.state["form_changed_"+name]) {
        this.handleDBUpdate(name);
      } else {
          var new_state={};
          new_state.pretty_name_edit = false;
          new_state["form_underlined_" + name ] = false;
          this.setState(new_state);
      }
  }
  
  handleDBUpdate(field_name) {
      const object_type = this.props.object_type;
      var data_object = Object();
      data_object[field_name] = this.state["form_"+field_name];
      const id = this.state["form_"+meta.keys(object_type).key_id]
      var urltext = '/api/v1/'+ object_type +'/'+ id ;
      axios({
              method: 'put',
              url: urltext,
              data: { data_object }
      }).then (result => {
                var new_state={};
                new_state.pretty_name_edit = false;
                new_state["form_changed_"+field_name] = false;
                new_state["form_underlined_" + field_name ] = false;
                this.setState(new_state);
            }).catch(error => {
              alert ('error is ' + error.message)
      });
  }

  render () {
    const object_attributes = meta.object(this.props.object_type);
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state["form_"+meta.keys(this.props.object_type).key_id]
    const pretty_name_field = meta.pretty_name_column(this.props.object_type)

    return (
      <Fragment>
      {this.state.pretty_name_edit ? 
        <form onSubmit={this.handleSubmit(pretty_name_field)}
        id={id+'-'+this.state.item_data[keys.pretty_key_id]}>
        <TextField    
        margin="normal"
        name={keys.pretty_key_id}
        type="text"
        value=  {this.state["form_"+pretty_name_field]}
        onChange={this.handleChange(pretty_name_field)}
        onBlur={this.handleSubmit(pretty_name_field)}
        />
      </form>
          : <Typography onClick={()=>{this.setState({pretty_name_edit:true})}} variant="headline" gutterBottom>{this.state["form_" + pretty_name_field]} </Typography>} 

      <Grid container  sm={12}>
      {this.state.item_data && object_fields.map(field => {
          if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
            var disable_underline = !this.state["form_underlined_" + field.name]

            if (field.valid_values || field.references || field.data_type === "boolean" || (field.data_type === "integer" && field.input_type !== "text" || field.input_type === "color_picker")) {
              return (
                <Grid item sm={6}>
                  <form onSubmit={this.handleSubmit(field.name)}  id={id+'-'+field.name}>
                    <SelectField 
                       key={field.name}           
                       object_type={field.references}
                       valid_values={field.valid_values}
                       shrink="true"
                       field={field}
                       disableUnderline = {disable_underline}
                       helperText={field.helper_text}
                       form_object_type={this.props.object_type}
                       label={field.pretty_name}
                       value= {this.state["form_"+field.name]}
                       open="true"
                       onBlur={this.handleSubmit(field.name)}
                       onChange={this.handleChange(field.name)}
                       style={{width:200}}/> 
                  </form>
                </Grid>
            )  
        } else {
          return (
              <Grid item sm={6}>
                <form onSubmit={this.handleSubmit(field.name)}  id={id+'-'+field.name}>
                      <TextField    
                      margin="normal"
                      InputProps={{disableUnderline:disable_underline}}
                      InputLabelProps={{shrink:true}}
                      name={field.name}
                      label={field.pretty_name}
                      type="text"
                      helperText={field.helper_text}
                      value=  {this.state["form_"+field.name]}
                      onFocus={this.handleFocus}
                      onChange={this.handleChange(field.name)}
                      onBlur={this.handleSubmit(field.name)}
                     />
                </form>
              </Grid>
          )
        }    
    }
    })}
  </Grid>
  </Fragment>
)}
}


export default ViewForm;

