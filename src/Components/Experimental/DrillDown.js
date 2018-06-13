import React from 'react';
//import { Button } from 'material-ui';
import {TextField, Paper, Button, Grid, ListItem, List, Typography} from '@material-ui/core'
import * as log from '../../Utils/log.js'
import * as meta from '../../Utils/meta.js';
import axios from 'axios';


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


class DrillDown extends React.Component {

  constructor(props) {
        super(props);
        //selected pretty_name is for user experince
        // we can show the pretty name until the rest of the data loads
        this.state = {
            drill_data: [],
            item_data: "",
            selected_id: '',
            props_object_type: ''
        }  
        this.handleClick = this.handleClick.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
      })
    // alert ('new state is ' + JSON.stringify(new_state))
      return new_state
    }
    return null
  }

  handleClick = (id, pretty_name) => {
    this.setState ({
        selected_id: id
    })
  }

  componentDidMount() {
      getData (this.props.object_type, "", (drill_data, error) => {
              this.setState({ drill_data: drill_data
      })})
} 

  componentDidUpdate(prevProps, prevState, snapshot) {
  //  alert('DID UPDATE update and form values is ' + JSON.stringify(formValues))
      if (prevState.selected_id !== this.state.selected_id) {

        getData (this.props.object_type, {id:this.state.selected_id}, (item_data, error) => { 
          //  alert('updated item valuse' + JSON.stringify(item_data) ); 
              var new_state = {};
              new_state.item_data = item_data;
              meta.fields(this.props.object_type).map(field => {
        //        alert (' form and value ' + formValues[field.name] + ' value ' + item_data[field.name])
                new_state["form_" + field.name] = item_data[field.name]?item_data[field.name]:"";
                new_state["form_changed_" + field.name] = false
              })
//              alert ("updated form values in did update" + JSON.stringify(formValues))
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

      this.setState(new_state);
  }


  handleSubmit = event => {
      event.preventDefault(); 
//      alert ('event is id' + event.target.id + ' key ' + event.target.key  + ' value ' + event.target.value)
      this.handleDBUpdate(event);
  }
  
  handleDBUpdate(event) {
        const object_type = this.props.object_type;
        const field_name = event.target.id;
        if (this.state["form_changed_"+field_name]) {
            var data_object = Object();
            data_object[field_name] = this.state["form_"+field_name];
            const id = this.state["form_"+meta.keys(object_type).key_id]
            var urltext = '/api/v1/'+ object_type +'/'+ id ;
        //    alert ('about to update')
            axios({
              method: 'put',
              url: urltext,
              data: { data_object }
            }).then (result => {
              var new_state={};
              new_state["form_changed_"+field_name] = false;
              this.setState(new_state);
            });
      }
  }
  

  render()  {
      const object_attributes = meta.object(this.props.object_type);
      const object_fields = meta.fields(this.props.object_type);
      const keys = meta.keys(this.props.object_type);
      //alert ('fields' + JSON.stringify(object_fields));
    //  alert ('item data is ' + JSON.stringify(this.state.item_data))
    //alert ("form values in render " + JSON.stringify(this.state.formValues))
    //    alert ("item data is " + JSON.stringify(this.state.item_data))
      
//      alert ('item data is ' + JSON.stringify(this.state.item_data.length))
      return (
        <Grid container spacing="8" sm={12}>
        <Grid item sm={2}>
        <Paper style={{minHeight:600, padding:10}}>
        <Typography variant="headline" gutterBottom>
            {object_attributes.pretty_plural} 
        </Typography>
          <List component="nav">
          {this.state.drill_data && this.state.drill_data.map(row => {    
          return (
            <ListItem dense button onClick={() => this.handleClick(row[keys.key_id], row[keys.pretty_key_id])}>
                {(row[keys.key_id] === this.state.selected_id) ?
                    <Typography color='primary' variant='headline'> {row[keys.pretty_key_id]}</Typography>
                  : row[keys.pretty_key_id]
                }
            </ListItem> )
          })}

          </List>
          </Paper>
        </Grid >
        <Grid item sm={10}>
        <Paper style={{minHeight:600, padding:10}}>
          <Typography variant="headline" gutterBottom>
              {this.state.item_data[keys.pretty_key_id]} 
          </Typography>
        
          <Grid container  sm={12} >
            {this.state.item_data && object_fields.map(field => {
//alert ('looping around field')
                if (field.name != keys.key_id && field.name != keys.pretty_key_id) {


              //    alert('item keys field and row ' + JSON.stringify(keys) + '   ' +JSON.stringify(field) + ' ' + JSON.stringify(this.state.item_data))
          //      alert ('field and form is ' + field.name + ' ' + JSON.stringify(this.state.formValues))
                  return (<Grid item sm={6}>
                      <form onSubmit={this.handleSubmit} id={field.name}>
                      <TextField    
                      margin="normal"
                      id={field.name}
                      key={field.name}
                      label={field.pretty_name}
                      type="text"
                      helperText={field.helper_text}
                      value=  {this.state["form_"+field.name]}
                    //  value={this.state.formValues[field.name]}
//                       value={this.state.formValues?this.state.formValues[field.name]:""}
//                      style={{width:200, marginRight:20, marginBottom:20}}
                      onChange={this.handleChange(field.name)}
                      onBlur={this.handleSubmit}
                     />
                    </form>

                    </Grid>
                      )  
                }  
              })}
            </Grid>
            </Paper>

        </Grid>
      </Grid>
    
     )
   }
}

export default DrillDown;
//export default withStyles(styles)(MenuLink);
