const metadata_object_types = {
  core_fields: 
      { pretty_name:"Core Field", pretty_plural:"Core Fields", all_subsites:true, not_in_db:true},
  core_subsite_field:
      { pretty_name:"Core Subsite Field", pretty_plural:"Core Subsite Fields", all_subsites:true, not_in_db:true},
  core_subsite:  
      { pretty_name:"Core Subsite", pretty_plural:"Core Subsites"},
  core_country: {
        pretty_name:"Country", pretty_plural:"Countries", all_subsites:true},
  core_state_province: 
      { pretty_name:"State or Province", pretty_plural:"States/Provinces", all_subsites:true},
  core_user: 
      { pretty_name:"User", pretty_plural:"Users", all_subsites:true},
  core_site_admin: 
      { pretty_name:"Site Admin", pretty_plural:"Site Admins", all_subsites:true},
  core_credential: 
      { pretty_name:"Core Credential", pretty_plural:"Core Credentials", all_subsites:true},
  core_role:  
      { pretty_name:"Role", pretty_plural:"Roles", all_subsites:true},
  core_subsite_role: 
      { pretty_name:"Subsite Role", pretty_plural:"Subsite Roles", all_subsites:true},
  core_context_subsite_map: 
      {pretty_name:"Context to Subsite Link", pretty_plural:"Context to Subsite Links", all_subsites:true}
}


export default  metadata_object_types


