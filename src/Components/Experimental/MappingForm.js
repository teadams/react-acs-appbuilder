import React, { Component, Fragment} from 'react';
import { FormGroup, FormControlLabel, Checkbox, Typography, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper } from '@material-ui/core';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import * as data from '../../Utils/data.js';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';



class MappingForm extends React.Component {
  constructor(props) {
    super(props);           
    // props are:
    // open
    // object_type, 
    // mapping_field_name - name of field that will provide the mapping_object_type and mapping_provided_field
    //     mapping_column is the side of the mapping that is known
    //    In the field meta for mapping_object_type,  there should be 2 fields with map_field:true.  
    //    mapping_provided_field will be one of then. The other will be selected in this UI.
    // mapping_field_value - the id of object_type and also value in mapping_provided_field
    // mapping_field_pretty_name - the pretty name of the known side of the mapping for UIs
      this.state = {
          other_mapped_data: []
    } 

      this.handleClose = this.handleClose.bind(this);
      this.handleChange = this.handleChange.bind(this);

    }

  handleChange = unmapped_field_id => event => {
    const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;
    const mapping_field = meta.field(object_type, mapping_field_name);
    const mapping_object_type = mapping_field.mapping;
    const mapped_field_name = mapping_field.mapped_field;
    const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
    const other_mapped_table = unmapped_field.references; 

    //  alert ('mapped keys is ' + JSON.stringify(meta.keys(other_mapped_table)))
//    const key_id = meta.keys(other_mapped_table).key_id;
  //  alert ('unampped_field_id  '+ unmapped_field_id)

    if (event.target.checked) {
      var data_object = Object();
      data_object[unmapped_field.name] = unmapped_field_id;
      data_object[mapped_field_name] = mapping_field_value;
      var urltext = '/api/v1/'+ mapping_object_type ;
      axios({
              method: 'post',
              url: urltext,
              data: { data_object }
          }).then (result => {
          //  alert("result of insert is " + JSON.stringify(result.data))
      
              var inserted_id = result.data.rows[0][meta.keys(mapping_object_type).key_id]
        //  alert('inserted id is' + inserted_id)
          
    //        alert ("handle change for unmapped id " + unmapped_field+ " " + true)
            let newState = this.state;
            newState.formValues[unmapped_field_id] = true;
            newState.formMapIds[unmapped_field_id] = inserted_id
            this.setState({newState  });
          }).catch(error => {
            alert ('error is ' + error.message)
      });
    } else {
        const id = event.target.id;
    //    alert ('id is ' +event.target.id)
        var urltext = '/api/v1/' + mapping_object_type + '/' + id;
      axios({
          method: 'delete',
          url: urltext,
        }).then (result => {
  //        alert ("handle change for unmapped id " + unmapped_field+ " " + true)
          let newState = this.state   
          newState.formValues[unmapped_field_id] = false
          this.setState({newState});
        }).catch(error => {
          alert ('error is ' + error.message)
    });

    }
};

  handleClose(event) {
  //    alert ("mapping handle close")
      this.props.onClose(this.props.mapping_field_name);
  };

  componentDidMount() {
  //  alert ("component did mount")
    const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;
    const mapping_field = meta.field(object_type, mapping_field_name);
    const mapping_object_type = mapping_field.mapping;
    const mapped_field_name = mapping_field.mapped_field;
    const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
    const other_mapped_table = unmapped_field.references;  
    //  alert ('mapped keys is ' + JSON.stringify(meta.keys(other_mapped_table)))
    const key_id = meta.keys(other_mapped_table).key_id;
    //  alert ('key is id ' + key_id)

// REWORD WITH IMMUTABILITY
    var options = {}
    options.key_type = "key_id"
  //  alert ('before get data ')

    data.getData (other_mapped_table, options, (other_mapped_data, error) => { 
          if (error) {
              alert ('error retrieving data ' + error.message)
          }
  //        alert ('return from get data')
//          alert ('other mapped data' + JSON.stringify(other_mapped_data))
          let mapped_data_state = this.state;

          mapped_data_state.formValues = {}
          mapped_data_state.formMapIds  ={}
          other_mapped_data.map(row => {
            mapped_data_state.formValues[row[key_id]] = false;
          })
          mapped_data_state.other_mapped_data = other_mapped_data;
          mapped_data_state.load_mapping_info = true
//alert ('setting new state ' + JSON.stringify(new_state))
          this.setState(mapped_data_state)
    }) 
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
      const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;
      const mapping_field = meta.field(object_type, mapping_field_name);
      const mapping_object_type = mapping_field.mapping;
      const mapped_field_name = mapping_field.mapped_field;
      const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)

      if (this.state.other_mapped_data && this.state.load_mapping_info) {
        var options = {}
        options.filter_field = mapped_field_name
        options.filter_id = this.props.mapping_field_value;
        options.key_type = "key_id"
  //      options[mapped_field_name] = this.props.mapping_field_value
//alert ('unmapped field is ' + JSON.stringify(unmapped_field.name))
//alert ('state is ' + JSON.stringify(this.state))
        data.getData (mapping_object_type, options, (mapping_info, error) => { 
    //      alert ('mapping info is ' + JSON.stringify(mapping_info))
// REWORK TO MAKE IMMUTABLE
              var new_state = this.state;
              new_state.load_mapping_info = false
              new_state.mapping_info = mapping_info;
              if (mapping_info) {
                mapping_info.map(info => {
                    new_state.formValues[info[unmapped_field.name]] = true
                    new_state.formMapIds[info[unmapped_field.name]] = info[meta.keys(mapping_object_type).key_id]
              })
             } 
              this.setState(new_state)
        }) 
      }
  }  

  convertDerived(derived_pattern, row) {
    function derivedMatch(match, p1, offset, string) {
       return (row[p1])
    }

    return (derived_pattern.replace(/{(.*?)}/ig, derivedMatch));

  }


  render () {
    const { open, object_type, mapping_field_name, mapping_field_value, mapping_field_pretty_name, ...other } = this.props;

    const mapping_field = meta.field(object_type, mapping_field_name);
    const mapping_object_type = mapping_field.mapping;
    const mapped_field_name = mapping_field.mapped_field;
    const unmapped_field = meta.unmapped_field(mapping_object_type, mapped_field_name)
    const other_mapped_table = unmapped_field.references;
    const other_mapped_keys = meta.keys(other_mapped_table)
    const other_mapped_pretty_field = meta.field(other_mapped_table, other_mapped_keys.pretty_key_id)
    const other_mapped_pretty_derived = other_mapped_pretty_field.derived

  //  alert ('other mapped keys is ' +JSON.stringify(other_mapped_keys)
    var grouping_column = ""
    var current_grouping = ""
    var grouping_text = ""
//alert ('other mapped table is ' + other_mapped_table)
    if (mapping_field.grouping_field_name) {
      grouping_column =  meta.grouping_column_info(other_mapped_table, mapping_field.grouping_field_name)[0]
    } 
  // alert ('grouping column is ' + grouping_column)
    if (!open) {
      return "";
    }

    return (
  
      <Dialog open={this.props.open}  onClose={this.handleClose}  aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{mapping_field.pretty_name}: {mapping_field_pretty_name}</DialogTitle>
          <DialogContent>
            <DialogContentText>          </DialogContentText>       
            <Grid container>
          {this.state.other_mapped_data && 
            this.state.other_mapped_data.map(row => {
              let label = other_mapped_pretty_derived?this.convertDerived(other_mapped_pretty_derived, row):row[other_mapped_keys.pretty_key_id]
              if(grouping_column && row[grouping_column] !== current_grouping) {
                grouping_text = row[grouping_column]
                current_grouping = row[grouping_column] 
              } else {
                  grouping_text = ""
              }
                
                return (
                        <Fragment>
                        {grouping_text &&
                          <Grid item sm={12}><br/>
                          <Typography variant="title">{grouping_text}</Typography>
                          </Grid>
                        }
                        <Grid item sm={4}>
                       <FormControlLabel style={{marginLeft:10}}
                         control={
                           <Checkbox
                             checked={this.state.formValues[row[other_mapped_keys.key_id]]}
                             onChange={this.handleChange(row[other_mapped_keys.key_id])}
                             value={row[other_mapped_keys.key_id]}
                            id = {this.state.formMapIds[row[other_mapped_keys.key_id]]}
                           />
                         }
                         label={label}
                       /></Grid>
                      </Fragment>)
            }
          )
        }
          
          </Grid>  
          </DialogContent>
      
            <DialogActions>
                 <Button onClick={this.handleClose} color="primary">
                   Close
                 </Button>
            </DialogActions>
          </Dialog>
   )}
}


export default MappingForm;
