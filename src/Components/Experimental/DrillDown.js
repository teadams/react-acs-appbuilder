import React, { Component, Fragment} from 'react';

//import React from 'react';
//import { Button } from 'material-ui';
import {TextField, Paper, Button, Grid, ListItem, List,  Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import {SelectField, CreateForm, CrudTable} from "../Layouts/index.js";
import {ViewForm} from "./index.js";
 

class DrillDown extends React.Component {

  constructor(props) {
        super(props);
        log.val('drill down constructor')
        this.state = {
            drill_data: [],
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

    if (nextProps.object_type !== prevState.props_object_type)  {
      var new_state = {}
      new_state.drill_data =[]
      new_state.refresh_drill = true
      new_state.props_object_type = nextProps.object_type
      return new_state
    } else {
      return null
    }
  }  
  handleClick = (id, pretty_name) => {
    this.setState ({
        selected_id: id,
        create_object_form: false,
        manage_object_type: ""
    })
  }
  // TODO - NAME?
   handleDataChange = (value, inserted_id) => {
    //  alert ("in drill data change")
      const selected_id = inserted_id?inserted_id:this.state.selected_id
      this.setState({ create_object_form: false, refresh_drill: true, selected_id:selected_id});
   };
  
  loadDrill()  {
    log.val('drill down load drill. grouping_field_name', grouping_field_name)
    const grouping_field_name = this.props.grouping_field_name
    var options = {}
     //alert ('grouping field is ' + grouping_field_name)
    if (grouping_field_name) {
      //  alert ('creating order by')
        const grouping_field = meta.field(this.props.object_type, grouping_field_name)
        if (grouping_field.references) {
          const grouping_object_type = grouping_field.references
          const grouping_keys = meta.keys(grouping_object_type)
      //    alert ('groupting object type and keys' + grouping_object_type + ' ' + JSON.stringify(grouping_keys))
          const order_by = grouping_field_name +'_'+grouping_keys.pretty_key_id
        //  alert ('order by is ' + JSON.stringify(order_by))
          options.order_by = order_by
        } else {
          options.order_by = this.props.object_type + "." +grouping_field_name
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
        log.val("drill down did update")
      if (this.state.refresh_drill) {
        this.loadDrill();
      }
  }

  render()  {
        log.val ('drill down render')

    const object_attributes = meta.object(this.props.object_type);
      const object_fields = meta.fields(this.props.object_type);
      const keys = meta.keys(this.props.object_type);
    //  alert ("groping field is " + this.props.grouping_field_name)
      const grouping_field_name = this.props.grouping_field_name;
      var grouping_column = ""
      var current_grouping = ""
      var grouping_object_type = ""
      //alert ('grouping field name' + grouping_field_name)
      if (grouping_field_name) {
          const grouping_column_info = meta.grouping_column_info(this.props.object_type, grouping_field_name)
        // alert ("grouping column info " +grouping_column_info)
          grouping_column =  grouping_column_info[0]
          grouping_object_type = grouping_column_info[1]
      }
    //  alert ('grouping column is ' + grouping_column)
//      alert (JSON.stringify(meta.section_fields (this.props.object_type,"")))
  //    log.val("start of drill render")
      return (
        <Grid container spacing={8} >
        <Grid item sm={2}>
          <Paper style={{minHeight:600, padding:10}}>
            <Typography variant="headline" gutterBottom>
              {object_attributes.pretty_plural} 
            </Typography>
            <List component="nav">
              {this.state.drill_data && this.state.drill_data.map(row => {    
                log.val('looping around drilld ata', row)
                if (grouping_field_name) {
                    var grouping_value = row[grouping_column]? row[grouping_column].toString():"None"
                  if (current_grouping != grouping_value) {
                      current_grouping = grouping_value
                        log.val("under grouping field name", row)
                      return(<Fragment key={row[keys.key_id]}>
                            <Typography style={{marginLeft:10}} align="left" variant="title">{grouping_value}</Typography>
                            <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                              {(row[keys.key_id] === this.state.selected_id) ?
                                <Typography color='primary' variant='title'>{row[keys.pretty_key_id]} </Typography>
                                : <Typography variant="body2"> {row[keys.pretty_key_id]}</Typography>
                              }
                              </ListItem>
             </Fragment>
                            )
                  } else {
                      log.val('in the else of grouping field')
                    return(<ListItem key={row[keys.key_id]}  dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}> 
                      {(row[keys.key_id] === this.state.selected_id) ?
                        <Typography color='primary' variant='title'>{row[keys.pretty_key_id]} </Typography>
                        : <Typography variant="body2"> {row[keys.pretty_key_id]}</Typography>
                      }
                      </ListItem>)
                  }
                } else {
                  log.val('in the second else')
                  return (
                  <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                    {(row[keys.key_id] === this.state.selected_id) ?
                      <Typography color='primary' variant='headline'>{row["service_category_name"]} </Typography>
                      : <Typography>{row[keys.pretty_key_id]}</Typography>
                    }
                    </ListItem> )
                }
              })}
            </List>
            <Button  style={{marginBottom:10}} variant='outlined' size="small" color ="primary" onClick={()=> {this.setState({create_object_form: this.props.object_type, selected_id:""})}}>
                    Create {object_attributes.pretty_name}
            </Button>
            {grouping_object_type && 
              <Button  variant='outlined' size="small" color ="primary" onClick={()=> {this.setState({manage_object_type: grouping_object_type, selected_id:""})}}>
                      Manage   {meta.object(grouping_object_type).pretty_plural}
            </Button>    
            }
          </Paper>
        </Grid >
        <Grid item sm={10}>
          <Paper id = "pretty_key" style={{minHeight:600, padding:10}}>
            {this.state.create_object_form  &&
              <CreateForm
                object_type={this.props.object_type}
                object_fields={object_fields}
                object_attributes={object_attributes}
                open="true"
                sections={this.props.create_form_sections}
                 onClose={this.handleDataChange}
             />
            }
            { this.state.selected_id  &&
              <ViewForm 
                  object_type = {this.props.object_type}
                  selected_id = {this.state.selected_id}
                  grouping_field_name = {this.props.grouping_field_name}
                  onDataChange = {this.handleDataChange}
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
