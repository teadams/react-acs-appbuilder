//import {React, Fragment} from 'react';
import React, { Component, Fragment} from 'react';
import { Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import {SelectField, EditButton} from "../Layouts/index.js";
import {MappingForm, Field} from "./index.js"
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

class ViewForm extends React.Component {

  constructor(props) {
    super(props);           

  // props
  // object_type
  // selected_id
  // grouping_field_name
  // onDataChange

    this.state = {
        item_data: "",
        pretty_name_edit: false,
        props_object_type: '',
        formValues: {},
        formChanged: {},
        formUnderlined:{}
    }  
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleMappingOpen = this.handleMappingOpen.bind(this);
    this.handleMappingClose = this.handleMappingClose.bind(this);
    this.renderField = this.renderField.bind(this);
    this.loadData = this.loadData.bind(this);
  } 


  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.object_type && nextProps.object_type != prevState.props_object_type) {
      const refreshed_state =    {
              item_data: "",
              pretty_name_edit: false,
              props_object_type: nextProps.object_type,
              formValues: {},
              formChanged: {},
              formUnderlined: {}
          }  
      return refreshed_state
    }
    return null
  }

  loadData() {
//    window.scrollTo(0,0)
//alert ('load data in view')
    data.getData (this.props.object_type, {id:this.props.selected_id}, (item_data, error) => { 
          // set completed new state
          var new_state = this.state;
          new_state.item_data = item_data;
          new_state.pretty_name_edit = false;
          meta.fields(this.props.object_type).map(field => {
            if (!field.mapping) {
              new_state.formValues[field.name] = (item_data[field.name] !== null)?item_data[field.name]:""
              new_state.formChanged[field.name] = false
              new_state.formUnderlined[field.name] =  (item_data[field.name]===null || item_data[field.name===""])?true:false
            } else {
              this.loadMappedData(field.name)
            }
          })
//              alert ('view state in load data ' +JSON.stringify(new_state.formValues))
              this.setState(new_state)
          })   
  }

  loadMappedData(field_name) {
//    alert ('loading mapping data')
    const { object_type } = this.props;
    const field = meta.field(object_type,field_name);
  //  alert ('loading mapped data for ' + field_name)
    var options = {}
    options.filter_field = field.mapped_field;
    options.filter_id = this.props.selected_id;
    options.key_type = "key_id";
    data.getData(field.mapping, options, (mapped_data, error) => { 
    //  alert ("mapped data is " + JSON.stringify(mapped_data))
      let formValues  = update(this.state.formValues,{
                  [field_name]: {$set: mapped_data}
                  })
    //  alert ('mapped state is ' + formValues[field_name].length)
      this.setState({formValues:formValues})
    })
  }

  componentDidMount() {
  //   alert ("view data mount")
      this.loadData();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
  //    alert ("view data update")
      if (prevProps.selected_id !== this.props.selected_id || 
          prevProps.object_type !== this.props.object_type) {
          this.loadData();
      }
  }  

  handleMappingOpen(field_name) {
    this.setState({mapping_open:true, mapping_field_name:field_name})
  } 

  handleMappingClose = field_name => {
      this.loadMappedData(field_name)
      this.setState({mapping_open:false});
  }

  
  handleChange (field_name, value)  {
      // TODO make( ummutable
  //    alert("in handle change of parent " + field_name)
      var new_formValues =this.state.formValues
      new_formValues[field_name] = value;
      //alert ("form values is " + JSON.stringify(new_formValues))
      //alert ('handle change ' + name)
      this.setState({formValues:new_formValues});
  }


// BELIEVE this will move donw a leve
  handleSubmit(field_name) {
    //  alert ('in parent submit for ' + field_name)
      const object_type = this.props.object_type;
      const pretty_field_name = meta.keys(object_type).pretty_key_id;
     if (field_name == this.props.grouping_field_name || 
         field_name == pretty_field_name || 
         meta.field(object_type, pretty_field_name).derived) {
        // if the pretty field name is derived, we will update the drill down at
        // every data change. (if this prove inefficient, we'll have to track which fields contribute to the
        // derived fields). Made engineering choice to streamline this for now.
              this.props.onDataChange();
      }
  }

  
  renderField(field) {
    const keys = meta.keys(this.props.object_type);
    const grid_col = field.grid_col?field.grid_col:4
    const width= grid_col * 75
    if (field.name != keys.key_id && field.name != keys.pretty_key_id) {
      return (
      <Grid key={field.name} item style={{padding:10, boxBorder:"border-box"}} sm={grid_col}>
        <Field object_type = {this.props.object_type} 
          field_name = {field.name}  
          data_object={this.state.formValues}
          mode="form"
          onChange={this.handleChange}
          onSubmit={this.handleSubmit}
          onMappingClick={this.handleMappingOpen}
          id = {this.props.selected_id}
        /> 
      </Grid>)
    } else {
        return null
    }  
  }

  render () {
  //  alert ('in render')
    const object_attributes = meta.object(this.props.object_type);
    const object_fields = meta.fields(this.props.object_type);
    const keys = meta.keys(this.props.object_type);
    const id = this.state.formValues[meta.keys(this.props.object_type).key_id]
    const pretty_name_field_name = meta.pretty_name_column(this.props.object_type)
    const pretty_name_field_derived = meta.field(this.props.object_type,pretty_name_field_name).derived
  //  alert ("pretty name derived" + pretty_name_field_derived)    
    const sections = meta.sections(this.props.object_type);
    //alert ('form values in render View ' + JSON.stringify(this.state.formValues))

  //  alert ('render with selected id ' + this.props.selected_id)
    return (
      <Fragment>
        {this.state.mapping_open &&
        <MappingForm 
          open={this.state.mapping_open}
          onClose={this.handleMappingClose}
          object_type={this.props.object_type}
          mapping_field_name = {this.state.mapping_field_name}
          mapping_field_value = {id}
          mapping_field_pretty_name ={this.state.formValues[pretty_name_field_name]}
        />}

        {this.state.pretty_name_edit  ? 
        <form onSubmit={this.handleSubmit(pretty_name_field_name)}
        id={id+'-'+this.state.item_data[keys.pretty_key_id]}>
        <TextField    
        margin="normal"
        name={keys.pretty_key_id}
        type="text"
        value=  {this.state.formValues[pretty_name_field_name]}
        onChange={this.handleChange(pretty_name_field_name)}
        onBlur={this.handleSubmit(pretty_name_field_name)}
        />
        </form>
          : (pretty_name_field_derived)? <Typography  style= {{textTransform:"capitalize"}}        variant="headline" gutterBottom>pretty_name_field_derived</Typography>
          : <Typography  style= {{textTransform:"capitalize"}}  onClick={()=>{this.setState({pretty_name_edit:true})}} variant="headline" gutterBottom>{this.state.formValues[pretty_name_field_name]} </Typography>
        }
        <Grid container  alignContent='flex-start'  justify="flex-start" wrap="wrap" >
        {this.state.item_data && !sections && object_fields.map(field => {
          return (this.renderField(field))
      })}
        {this.state.item_data && sections && sections.map(section => {
        return (
          <Grid item style={{padding:10}} sm={12}>
          <Paper style={{boxSizing:"border-box", padding:10, height:"100%"}}>  
          <Grid container  alignContent='flex-start'  justify="flex-start"  wrap="wrap" >
            {section.title &&
                <Grid item sm={12}>
                  <Typography variant="title" > {section.title} </Typography>
                  <Divider style={{marginBottom:10}}/>
                </Grid>
            }
            {section.text && 
                  <Grid item style={{padding:10}} sm={12}>
                    {section.text}
                  </Grid>
            }
            
                {meta.section_fields(this.props.object_type, section.name).map(field=>{
                      return (this.renderField(field))
                })
              }
              
            </Grid>
          </Paper>
          </Grid>)  
        })}    
        </Grid>        
      </Fragment>
    )
  } 
}


export default ViewForm;

