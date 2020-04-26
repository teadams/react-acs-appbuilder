import React from 'react';
import Debug from '../Debug.js'
import ObjectList  from './ObjectList.js';
import DrillDown  from './DrillDown.js';
import Field from './Field.js'
import FieldList from './FieldList.js'

import RenderField from './RenderField.js'
import RenderFieldList from './RenderFieldList.js'
import RenderFieldListList from './RenderFieldListList.js'
import NewDrillDown from './NewDrillDown.js'
import AvatarUser from './AvatarUser.js'

const FieldMemo = React.memo(Field)

const functional_components = {
        ObjectList:ObjectList,
        FDrillDown:DrillDown,
        Debug:Debug,
        Field:Field,
        FieldMemo:FieldMemo,
        FieldList:FieldList,
        RenderField:RenderField,
        RenderFieldList:RenderFieldList,
        RenderFieldListList:RenderFieldListList,
        NewDrillDown:NewDrillDown,
        AvatarUser:AvatarUser,
}


export {
functional_components
}