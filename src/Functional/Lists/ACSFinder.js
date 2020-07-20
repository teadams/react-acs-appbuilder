import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as u from '../../Utils/utils.js'
import * as meta from '../../Utils/meta.js';
import * as api from '../../Utils/data.js';
import { withStyles } from '@material-ui/core/styles';
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react';
import ACSObjectTypeView from "../../Functional/Lists/ACSObjectTypeView.js"
import useForm from '../../Hooks/useForm';
import useGetObject  from '../../Hooks/useGetObject';
import ACSRowController from '../../Functional/ACSRowController.js'
import RABSelectField from '../../Functional/Fields/RABSelectField.js'
import ACSField from '../../Functional/ACSField2.js'
import ObjectView from '../../RABComponents/ObjectView.js'
import ACSFilters from "../../Functional/Filters/ACSFilters.js"

import NWAProjectSummary from '../../Components/NowWeAct/NWAProjectSummary.js'
import { FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox, Typography, Chip, Grid, MenuItem, TextField, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, Button, Paper, Avatar } from '@material-ui/core';
import {Link, Container, Box, Card, TableHead, TableContainer, Table, TableBody, TableRow, TableCell} from '@material-ui/core';
import useGetModel from '../../Hooks/useGetModel.js'

const styles = theme => ({
drawerHeader: {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  ...theme.mixins.toolbar,
},
});

const box_style = { 
  padding:10,
  backgroundColor:"lightGray",
  borderColor:"darkGray",
  borderWidth:"thin",
  borderStyle:"solid",
  display:"inline"
}


function ACSFinder(props) {
  //XX could get default select field by object type from proc?
  const {UpperLeftNavagationComponent, data, object_type="core_subsite"} = props
  const [form_values, setFormValues]= useState({
    core_subsite:"_none_",
    nwn_project_type:"_none_",
    core_role:"_none_",
    core_country:"US",
    core_state_province:"_none_",
    zip_code:"",
  })
  const [form_touched, setFormTouched] = useState(false)
  const [subsite_data, setSubsiteData] = useState(props)
  const [show_details, setShowDetails] = useState(false)
  const [active_data, setActiveData] = useState("")
  //const [api_options, setApiOptions] = useState("")
  const subsite_info_fields= ["summary", "leader", "description", "address"]

  function handleSubsiteDetailsClose(event) {
      setActiveData("")
  }
  function SubsiteMoreInfo (props) {
      function handleSetActiveData(event) {
        setActiveData(props.data)
      }
      return (<Link name={props.data} onClick={handleSetActiveData}>Details</Link>)
  }
  
  const field_models = {core_subsite:{
                        more:{pretty_name:"More",
                          rab_component_model:{field:{components:{field:SubsiteMoreInfo}}}
                          }
                        }}

  function loadData(api_options="") {
    api.getData(object_type, api_options, (api_data, error) => {
      setSubsiteData(api_data)
    })
  }


  const handleFilterChange = (api_options) => {
      loadData(api_options)
  }
  
  return (
    <Fragment>
      {active_data && <Dialog fullWidth={true} open={true}  onClose={handleSubsiteDetailsClose}>
        <DialogContent>
              <NWAProjectSummary data={active_data} field_list={subsite_info_fields} object_type="core_subsite" mode="view" num_columns={1}  />
              <DialogActions>
                <Button onClick={handleSubsiteDetailsClose} color="primary">Close</Button>
              </DialogActions>  
        </DialogContent>
      </Dialog>}
      <div  style={{ display:"block"}}>
      <UpperLeftNavagationComponent/>
      </div>
      <div style={{paddingLeft:20, paddingRight:40, paddingTop:10,  display:'flex', width:'100%'}}>       
        <div style={{display:'inline', width:'30%'}}>
          <ACSFilters filters={props.filters} label_direction="row" label_variant="subtitle1" onChange={handleFilterChange}/>
        </div>
        <div style={{width:"70%"}}>
          {form_touched && subsite_data !== "" && subsite_data.length ===0 &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
            There are no results that meet your criteria.
          </Card>
          }
          {subsite_data.length ===1 &&
          <Card variant="outlined" style={{padding:30,backgroundColor:"#DDDDDD"}}>
          <NWAProjectSummary data={subsite_data[0]} field_list={subsite_info_fields} object_type="core_subsite" mode="view" num_columns={1}  />
          </Card>}
          {subsite_data.length >1 &&
            <ACSObjectTypeView data={subsite_data} field_click_to_edit={false} rab_component_model={{list:{names:{header_wrap:"RABVoid"}}}} field_models={field_models} field_list={["more", "name","summary","address"]} object_type="core_subsite" mode="view" num_columns={1}  />
          }
         </div>
     </div>
  
  </Fragment>)
}


//export default withStyles(styles, { withTheme: true })(VolunteerNew);
export default ACSFinder;

