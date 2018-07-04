import React, { Component, Fragment} from 'react';

//import React from 'react';
//import { Button } from 'material-ui';
import {TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import update from 'immutability-helper';

import {SelectField, CreateForm, CrudTable, ButtonCreate, ButtonExpandMore, ButtonExpandLess} from "../Layouts/index.js";
import {ObjectView, Field} from "./index.js";
 

class DrillDown extends React.Component {

  constructor(props) {
        super(props);
        log.val('drill down constructor')
        //props
        // object_type
        // grouping_field_name  - field_name in object type to use for grouping the left hand columns. default is not grouping 
        // create_form_sections - When create form is open, which sections to display. Default is calls 
        // expand_contract - If true, use expand/contract buttons.  Default is false.
        // manage_object_types - comma separated list of object_types that will have a manage button
  
        this.state = {
            drill_data: [],
            expanded:{},
            selected_id: '',
            create_object_form: false,
            manage_object_type: "",
            props_object_type: this.props.object_type
        }  
        this.handleClick = this.handleClick.bind(this);
        this.handleDataChange = this.handleDataChange.bind(this);
        this.loadDrill = this.loadDrill.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {

    if (nextProps.object_type !== prevState.props_object_type  ||
        nextProps.selected_id !== prevState.props_selected_id
      )  {

      var new_state = {}
      new_state.drill_data =[]
      new_state.expanded = {},
      new_state.refresh_drill = true
      new_state.selected_id = nextProps.selected_id    
      new_state.props_object_type = nextProps.object_type
      new_state.props_selected_id = nextProps.select_id
      return new_state
    } else {
      return null
    }
  }  

  handleClick = (id, pretty_name) => {
    window.scrollTo(0,0)
    this.setState ({
        selected_id: id,
        create_object_form: false,
        manage_object_type: ""
    })
  }

   handleDataChange = (value, inserted_id, field_name) => {
    //  alert ("in drill data change")
      const selected_id = inserted_id?inserted_id:this.state.selected_id;  
      const { object_type, grouping_field_name } = this.props;
      const pretty_field_name = meta.keys(this.props.object_type).pretty_key_id;
      // Fields who influence the display values of grouping_field_name and 
      // pretty_field_name (considers  derived)
      const contributing_fields = meta.get_contributing_field_names(object_type, pretty_field_name).concat(meta.get_contributing_field_names(object_type, grouping_field_name));
      if (inserted_id || contributing_fields.indexOf(field_name) >=0 || meta.field(this.props.object_type,field_name).field_object_type) {
             this.setState({ create_object_form: false, 
                             refresh_drill: true, 
                             selected_id:selected_id});
      } else {
          this.setState({ create_object_form: false});
      }
   };
  
  loadDrill()  {
    log.val('drill down load drill. grouping_field_name', grouping_field_name)
    const grouping_field_name = this.props.grouping_field_name
    var options = {}
  
    if (grouping_field_name) {
      //  figure out the appropriate order by if we are grouping
        const grouping_field = meta.field(this.props.object_type, grouping_field_name)
        if (grouping_field.references) {
          const grouping_object_type = grouping_field.references
          const grouping_keys = meta.keys(grouping_object_type)
      //    alert ('groupting object type and keys' + grouping_object_type + ' ' + JSON.stringify(grouping_keys))
          const order_by = grouping_field_name +'_'+grouping_keys.pretty_key_id + ' ,' + this.props.object_type + "." + meta.keys(this.props.object_type).pretty_key_id
        //  alert ('order by is ' + JSON.stringify(order_by))
          options.order_by = order_by
        } else {
          options.order_by = this.props.object_type + "." +grouping_field_name + ' ,' + this.props.object_type + "." + meta.keys(this.props.object_type).pretty_key_id
        }
   }

    data.getData (this.props.object_type, options, (drill_data, error) => {
            this.setState({ drill_data: drill_data, refresh_drill: false
    })})
  }

  componentDidMount() {
      log.val('drill down did mount')
      this.loadDrill();
  } 

  componentDidUpdate(prevProps, prevState, snapshot) {
      if (this.state.refresh_drill) {
        this.loadDrill();
      }
  }

  toggle_expand(grouping, value) {
      this.setState({expanded:update(this.state.expanded, {$toggle:[grouping]})})
  }

  render()  {
      const object_attributes = meta.object(this.props.object_type);
// TODO - create form should not need object fields as prop
      const object_fields = meta.fields(this.props.object_type);
      const keys = meta.keys(this.props.object_type);
      const expand_contract = this.props.expand_contract?this.props.expand_contract:false
    //  alert ("groping field is " + this.props.grouping_field_name)
      const grouping_field_name = this.props.grouping_field_name;
      let current_grouping = ""
      return (
        <Grid container spacing={8} >
        <Grid item sm={2}>
          <Paper style={{minHeight:600, padding:10}}>
            <div>
            <Typography variant="headline" gutterBottom>
              {object_attributes.pretty_plural} 
            <ButtonCreate  float="right" onClick={()=> {this.setState({create_object_form: this.props.object_type, selected_id:""})}}/>
            </Typography>
            </div>
            <List component="nav">
              {this.state.drill_data && this.state.drill_data.map(row => {
                  const variant = (row[keys.key_id] === this.state.selected_id)?"title":"body2"    
                  const color = (row[keys.key_id] === this.state.selected_id)?"primary":""    
                  let group_header = ""
                  if (grouping_field_name) {
                    let grouping_value = meta.get_display_value(this.props.object_type, grouping_field_name, row)

                    grouping_value = grouping_value?grouping_value.toString():"None"
                    if (current_grouping != grouping_value) {
                      current_grouping = grouping_value
                      group_header = <Typography style={{marginLeft:5,marginBottom:5}} align="left" variant="subheading"> <Field object_type={this.props.object_type} field_name={grouping_field_name} data_object={row} mode="text"/> 
                          {expand_contract  &&
                          (!this.state.expanded[current_grouping]? 
                          <ButtonExpandMore  float="right" onClick={()=> {
                                this.toggle_expand(grouping_value, true)
                          }}/>
                          :
                            <ButtonExpandLess  float="right" onClick={()=> {
                                this.toggle_expand(grouping_value, false)
                            }}/>
                          )}
                      </Typography>;
                  }}

                if (!expand_contract || this.state.expanded[current_grouping]) {
                //        alert('current row is ' + row[keys.key_id])
                        return(<Fragment>{group_header}
                        <ListItem key={row[keys.key_id]}  dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}> 
                          <Typography color={color} variant={variant}>
                            <Field object_type = {this.props.object_type} 
                              field_name = {keys.pretty_key_id}  
                              data_object={row}
                              mode="view"
                            /> 
                          </Typography>
                        </ListItem>
                        </Fragment>)
                  } else {
                    return(<Fragment>{group_header}</Fragment>)
                  }
              })}
            </List>

            {this.props.manage_object_types && 
              this.props.manage_object_types.split(",").map(manage_type => {
                return (<Button  style={{marginBottom:10, marginTop:10, width:'100%'}}variant='outlined' size="small" color ="primary" onClick={()=>
                {window.scrollTo(0,0);
                this.setState({manage_object_type: manage_type, selected_id:""})}}>
                        Manage   {meta.object(manage_type).pretty_plural}
                </Button>)  
                })}
          </Paper>
          </Grid >

        <Grid item sm={10}>
          <Paper id = "pretty_key" style={{minHeight:600, padding:10}}>
            {this.state.create_object_form  &&
              <CreateForm
                object_type={this.props.object_type}
                open="true"
                sections={this.props.create_form_sections}
                onClose={this.handleDataChange}
             />
            }
            { this.state.selected_id  &&
              <ObjectView
                  object_type = {this.props.object_type}
                  selected_id = {this.state.selected_id}
                  grouping_field_name = {this.props.grouping_field_name}
                  onDataChange = {this.handleDataChange}
                  onMenuChange = {this.props.OnMenuChange}
              />}
            {this.state.manage_object_type  &&
              <CrudTable object_type={this.state.manage_object_type}
              object_attributes={meta.object(this.state.manage_object_type)}
              object_fields={meta.fields(this.state.manage_object_type)}
              onDataChange= {this.handleDataChange}
              />
            }
          </Paper>
        </Grid>
        </Grid>  
     )
   }
}

export default DrillDown;
//export default withStyles(styles)(MenuLink);
