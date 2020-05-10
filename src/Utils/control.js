import * as u from './utils.js'
import rab_component_models from '../Models/HealthMe/component.js'
import _ from 'lodash/object'
// building the library of dynamic componetns
import React, {Component,Fragment} from 'react';
import ObjectView from "../RABComponents/ObjectView.js"
import NavMenu from "../RABComponents/NavMenu.js"
import DrillDown from "../RABComponents/DrillDown.js"
import FieldView from "../RABComponents/FieldView.js"
import TreeMenu from "../RABComponents/TreeMenu.js"
import Text from "../RABComponents/Text.js"
import ObjectTypeView from "../RABComponents/ObjectTypeView.js"
import Debug from '../Debug.js'
import ACSField from '../Functional/ACSField2.js'
import ACSRowController from '../Functional/ACSRowController.js'
import ACSListController from '../Functional/ACSListController.js'
import {Tab, Tabs, Menu, MenuItem, MenuList,List,ListItem,ListItemAvatar,ListItemIcon,ListItemSecondaryAction,ListItemText,ListSubheader,Table,TableBody,TableCell,TableContainer,TableFooter,TableHead,TablePagination,TableRow,} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

// precedence: low to high
// shell, default_component_for_layer (handled in getFinal Model)
// component_nodel_name (many), compoent_model (many) (Passed as component model, final step will be the model to name override)
// input_props_component_name input_props_component (passed as input_props, model to name is done before mereg)
// props (for that level) - done as a second merge just at that level's props
export function getFinalModel(level, input_props={}, level_model={}, ...component_models) {
  // XXBIG - component model names should take precedence over 
  // level models, etc.  needs determinModelComponents applied
  let final_model = _.merge({},
                            rab_component_models.shell,
                            rab_component_models[level],  
                            determineModelComponents(level, buildComponentModel(level_model)),
                            ...component_models,
                            determineModelComponents(level, buildComponentModel(input_props))
                            )
  

  // only want a shallow merge! 
  // state managment is dependent on the references of api_options, field_list, f
  // and other arrays/objects not changing
  final_model[level].props = Object.assign(final_model[level].props, input_props)
  // XX ? should we do all levels or just this one, performance?
  determineModelComponents(level,final_model)

  return final_model

}

function buildComponentModel(params, show) {
/// XXBIG - items need completed
    // precedence low to high - component by name, component itself, named parameters
  return   _.merge({},     
      rab_component_models[params.rab_component_model_namme], params.rab_component_model,
      { list:{names:{list:params.list_component},
              components:{},
              props:{}},
        row:{names:{}, components:{},props:{}},
        field:{names:{field:params.field_component},
              components:{}, props:{onFieldClick:params.onFieldClick,
                     click_to_edit:params.field_click_to_edit}}
      })
}

function determineModelComponents(level, model) {
  if (!model) {return null}
  Object.keys(model[level].names).forEach(name =>{
    if (model[level].names[name] && !model[level].components[name]) {
      model[level].components[name] = componentByName(model[level].names[name])
    }
    model[level].names[name] = undefined  
  })
  return model
}

export function componentByName(name) {
  const component = componentPicker(name)
    
  return component
  
}

function componentPicker(name) {
  if (!name) {alert (name);return Fragment}
  switch (name) {
    case "ObjectView": return ObjectView
    case "Text": return Text;
    case "NavMenu": return NavMenu;
    case "DrillDown": return DrillDown;
    case "FieldView": return FieldView;
    case "TreeMenu": return TreeMenu;
    case "ObjectTypeView": return ObjectTypeView;
    case "Debug": return Debug;
    case "ACSField": return ACSField;
    case "ACSRowController": return ACSRowController;
    case "ACSListController": return ACSListController;
    case "Tab": return Tab;
    case "Tabs": return Tabs;
    case "Menu": return Menu;
    case "MenuItem": return MenuItem;
    case "MenuList": return MenuList;
    case "List": return List;
    case "ListItem": return ListItem;
    case "ListItemAvatar": return ListItemAvatar; 
    case "ListItemIcon": return ListItemIcon;
    case "ListItemSecondaryAction": return ListItemSecondaryAction; 
    case "ListItemText": return ListItemText;
    case "ListSubheader": return ListSubheader; 
    case "Table": return Table; 
    case "TableBody": return TableBody; 
    case "TableCell": return TableCell; 
    case "TableContainer": return TableContainer;
    case "TableFooter": return TableFooter; 
    case "TableHead": return TableHead;
    case "TablePagination": return TablePagination; 
    case "TableRow": return TableRow; 
    case "TreeItem": return TreeItem; 
    case "TreeView": return TreeView;
    case "Fragment": return Fragment;
    case "AvatarUser":  return Text;
    default:  { 
      alert("Menu Model Issues - no component for " + name) 
      return Fragment;
    }
  }
}

