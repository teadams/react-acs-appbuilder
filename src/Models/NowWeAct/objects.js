const metadata_object_types = {
  nwn_project_type: 
    { pretty_name:"Project Type", pretty_plural:"Project Types", all_subsites:true},
  nwn_project: 
    { pretty_name:"Project", pretty_plural:"Projects", extends_object:"core_subsite", auth_action_privs:"users_can_create" },
  nwn_project_need: 
    { pretty_name:"Project Need", pretty_plural:"Project Needs"},
  nwn_project_video:
    { pretty_name:"Project Video", pretty_plural:"Project Videos"},
  nwn_project_document: 
    { pretty_name:"Project Document", pretty_plural:"Project Documents"},
  nwn_project_message:
    { pretty_name:"Project Message", pretty_plural:"Project Messages", auth_action_privs:"users_can_create"},
  nwn_project_volunteer:
    { pretty_name:"Project Volunteer", pretty_plural:"Project Volunteers", extends_object:"core_subsite_role", auth_action_privs:"users_can_create"},
  nwn_project_post:
    {pretty_name:"Project Post", pretty_plural:"Project Posts", create_priv:"User"}
}


export default metadata_object_types
