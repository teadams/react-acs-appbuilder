const metadata_menus = {
  app_menu: [
  {index:"0", label: "RawObject", component:"FieldList",
                 field_name:"first_name",
                 field_list:["first_name", "last_name"],
                data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
   },
  {index:"1", label: "APIObject", component:"FieldList",
                    object_type:"core_user", id:6
    },
  // {index:"2", label: "APIObject", component:"Object",
  //                    object_type:"core_user", id:2
  //    },
  // {index:"3", label: "APIObject", component:"Object",
  //                     object_type:"core_role", id:1
  //     },
  //     // expect TracyOne
  // {index:"4", label: "RawField", component:"Field", 
  //                field_name:"first_name",
  //                field_list:["first_name", "last_name"],
  //                sections: {first_section: 
  //                {field_list:["first_name", "last_name",],name:"Section one"},
  //                sectond_section: 
  //                {field_list:["mom_first", "mom_last"],name:"Section one"}
  //               },
  //     data:{first_name:"TracyOne", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
  //  },
  //   // expect TracyTWO
  //  {index:"5", label: "RawField2", component:"Field",
  //               field_name:"first_name",
  //               field_list:["first_name", "last_name"],
  //               sections: {first_section: 
  //               {field_list:["first_name", "last_name",],name:"Section one"},
  //               sectond_section: 
  //               {field_list:["mom_first", "mom_last"],name:"Section one"}
  //              }, object_type:"core_user", id:"3",
  //    data:{first_name:"TracyTWO", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
//  },
    // expect John
 //  {index:"6", label: "APIField1",  component:"Field",
 //               field_name:"first_name",
 //               object_type:"core_user", id:"2",
 //  },
 //  // expect Michael
 //  {index:"7", label: "APIField2", component:"Field",
 //               field_name:"first_name",
 //               object_type:"core_user", id:"3",
 //  },
 //    // expect Office Administrator
 //  {index:"8", label: "APIField3", component:"Field",
 //               field_name:"name",
 //               object_type:"core_role", id:"2",
 //  },
 //  {index:"9", label: "RawListListList", component:"RenderFieldListList",
 //               field_name:"first_name",
 //               field_list:["first_name", "last_name"],
 //               sections: {first_section: 
 //               {field_list:["first_name", "last_name",],name:"Section one"},
 //               sectond_section: 
 //               {field_list:["mom_first", "mom_last"],name:"Section one"}
 //              }, 
 //    data:{first_name:"Tracy", last_name:"Adams", mom_first:"Jane", mom_last:"Belmont"}
 // }
],
  hamburger: [
    {index:"1", label: "Roles by Privilege", object_type: "core_role", component:"FDrillDown", grouping_field:"privilege"},
    {index:"2", label: "Site Administrators", object_type: "core_subsite", component:"DrillDown"}
  ]
} 

export default metadata_menus;