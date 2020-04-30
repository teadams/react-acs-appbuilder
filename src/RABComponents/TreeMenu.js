import 'react-app-polyfill/ie9';
import 'react-app-polyfill/stable';
import { makeStyles } from '@material-ui/core/styles';
import * as log from '../Utils/log.js'
import * as meta from '../Utils/meta.js'
import * as data from '../Utils/data.js';
import * as u from '../Utils/utils.js';
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import React, { Component, Fragment,  useState, useContext, useEffect} from 'react'
import FieldView from './FieldView.js'
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import TreeItem from '@material-ui/lab/TreeItem';


//<Fragment>
// // Header Component
//     <TreeView
//         defaultCollapseIcon={<ExpandMoreIcon />}
//         defaultExpandIcon={<ChevronRightIcon />}
//         expanded={expanded}
//         selected={selected}
//         onNodeToggle={handleToggle}
//         onNodeSelect={handleSelect}
//         >
//         {tree_data && <RenderTree nodes={tree_data}/>}  
//     </TreeView>
//     </Fragment>

function TreeMenu(props)  {
  const {object_type, ...params} = props
  const field_list = [meta.keys(object_type).pretty_key_id]

  //                  {Array.isArray(node.children)&& node.children.length > 0 && <RenderTree nodes={node.children}/>}

  function RenderTreeItem(props) {
    const {data} = props
    let label = FieldView({object_type:props.object_type, data:props.data, field_name:"full_name", display:"text"})
    return (
      <TreeItem key={data.id} nodeId={data.id} label={label}/>
    )
  }

  const component = {field_wrap:RenderTreeItem}

  return (
     <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
  //         expanded={expanded}
  //         selected={selected}
  //         onNodeToggle={handleToggle}
  //         onNodeSelect={handleSelect}
          >
          <ACSListController {...params}  component={component} object_type={props.object_type}  field_list={field_list}/>
    </TreeView>)
}

export default TreeMenu;