const metadata_menus = {
  app_menu: [
    {index:"0", label: "Map", object_type: "nwn_project", component:"GoogleMap", title:"Projects Across the World", text:"Click on a pin to learn more about a project", object_type:"nwn_project"},
    {index:"1", label: "Help Out", object_type: "nwn_project_volunter",  object_type:"nwn_project_volunteer"},
    {index:"2", label: "Projects", object_type:"nwn_project", component:"DrillDown"},
    {index:"3", label: "Learning Library", component:"Text", text:"Zac and Jesse will teach you what you need", title:"Learning Library"}, 
    {index:"4", label: "My Messages", component:"ProjectMessages",  object_type:"nwn_project_message"}, 
    {index:"5", label: "One Project",  object_type:"nwn_project", component:"ProjectView", project_id:1},
    {index:"6", label: "Volunteer",  object_type:"nwn_project", component:"Volunteer", project_id:2},
 ],
  hamburger: [
      {index:"0", label: "Projects", object_type: "nwn_project", component:"DrillDown"},
      {index:"1", label: "Users", object_type: "core_user", component:"DrillDown" },
      {index:"2", label: "Countries", object_type: "core_country"},
      {index:"3", label: "States", object_type: "core_state_province"},
      {index:"4", label: "Project Types", object_type: "nwn_project_type", component:"DrillDown"},
      {index:"5", label: "Role Types", object_type: "nwn_role_type"},
      {index:"6", label: "Needs", object_type: "nwn_project_need"},
      {index:"7", label: "Video", object_type: "nwn_project_video"},
      {index:"8", label: "Documents", object_type:"nwn_project_document"},
      {index:"9", label: "Volunteers", object_type:"nwn_project_volunteer"},
      {index:"10", filter_field:"nwn_project", label: "Messages", object_type:"nwn_project_message"},
      {index:"11", label: "Announcements", object_type:"nwn_project_post", component:"DrillDown"},
      {index:"11", label: "Site Wide Adminsitrators", object_type:"core_site_admin", component:"DrillDown"},
    ]
} 

export default metadata_menus;