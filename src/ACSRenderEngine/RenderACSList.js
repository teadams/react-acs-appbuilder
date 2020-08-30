import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as u from '../Utils/utils.js';

import { withStyles, makeStyles } from '@material-ui/core/styles';
import {DelayedAuth} from '../Modules/User/index.js';


import React, { Component, Fragment,  useRef, useState, useContext, useEffect} from 'react';
import { FormControl, FormLabel, FormGroup, FormControlLabel, Chseckbox, Typography, Chip, Grid, MenuItem, TextField, TableContainer, TableHead, TableCell, TableRow, Dialog, DialogTitle, DialogContent, Divider,DialogContentText, DialogActions, TablePagination, Button, Paper, Avatar, TableBody, Table } from '@material-ui/core';

function RenderACSList(props) {
  const {data, mode,rab_component_model, field_models,total_width_units,  object_type, list_form_params, onSubmit} = props
  const {pagination=false,  ...params} = props
  const {header_wrap:HeaderWrap, header:Header, list_wrap:ListWrap, list_header_wrap:ListHeaderWrap, list_header:ListHeader, body_wrap:BodyWrap, list:RABList, footer_wrap:FooterWrap, footer:Footer,
  list_container:ListContainer, list_pagination:ListPagination} = rab_component_model.list.components 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [num_add, setNumAdd] = useState(props.num_add)

  const handleChangePage = (event, newPage) => {
     setPage(newPage);
   };

  const handleAddRow= (event) => {
        setNumAdd(num_add+1)
  }
 
  const handleChangeRowsPerPage = (event) => {
     setRowsPerPage(parseInt(event.target.value, 10));
     setPage(0);
  };
  let show_list = true
    if (data ) {
      const count = data.length
      params.num_add = num_add
      if (pagination && data.length > 0) {
        const paginated_data =  data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) 
        params.data=paginated_data
      }
      if (pagination && data.length === 0) {
        show_list = false
      }
      
      let table_width = total_width_units * 20
      if (table_width > 100) {table_width = 100}
      table_width = table_width.toString()+"%"
      return ( 
        <Fragment>
          <HeaderWrap {...params}>
           <Header {...params} action_props={rab_component_model.row.props} />
          </HeaderWrap>
          {show_list && 
            <Fragment> 
            <ListContainer component={Paper} {...params} {...params.list_container} width={table_width}>
            <ListWrap size="tiny" {...params}  >
              <ListHeaderWrap {...params}>
                <ListHeader {...params}/>
              </ListHeaderWrap> 
              <BodyWrap {...params}>
                 <RABList  {...params} list_form_params={list_form_params}/>
              </BodyWrap>
             </ListWrap>
          {["list_edit","list_create"].includes(mode) && 
            <DialogActions>
              <DelayedAuth  object_type={object_type} auth_action="edit" color="primary">
                <Button onClick={handleAddRow}>Add Row</Button>
                <Button onClick={onSubmit}>save</Button>
              </DelayedAuth>
              {props.onClose && <Button onClick={props.onClose} color="primary">
                Close
              </Button>}
            </DialogActions> 
          }

          {pagination &&<ListPagination
             rowsPerPageOptions={[10, 20, 30]}
             component="div"
             count={count}
             rowsPerPage={rowsPerPage}
             page={page}
             onChangePage={handleChangePage}
             onChangeRowsPerPage={handleChangeRowsPerPage}
           />}
           </ListContainer>

            </Fragment>
          }

        </Fragment>

    )
    } else {
        return <div/>
    }
}

export default RenderACSList;
