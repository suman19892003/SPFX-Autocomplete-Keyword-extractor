import * as React from 'react';
import styles from './Autocomplete.module.scss';
import { IAutocompleteProps } from './IAutocompleteProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListItemPicker } from '@pnp/spfx-controls-react/lib/listItemPicker';  
//import {  PrimaryButton } from 'office-ui-fabric-react';
import { SPHttpClient, SPHttpClientResponse, SPHttpClientConfiguration } from '@microsoft/sp-http';
import { TextField,Label,PrimaryButton } from 'office-ui-fabric-react/lib';

const keyword_extractor = require("keyword-extractor");

import keyword from 'keyword-extractor'

export interface IControlsState {    
  selectedValues:any[]; 
  allListItems:[],
  allUserTypedColl:any[]
  FormDescription:string,
  wordExtracted:boolean
} 

export default class Autocomplete extends React.Component<IAutocompleteProps, IControlsState> {
  
  constructor(props: IAutocompleteProps, state: IControlsState) {        
    super(props);        
    this.state = {
      selectedValues:[],
      allListItems:[],
      allUserTypedColl:[],
      FormDescription:'',
      wordExtracted:false,
    };
    this._onChange=this._onChange.bind(this);        
  }

  componentDidMount(){
    const itemColl:any= [];
    this.GetRequestDetails().then(res=>{
      res.map(item=>{
        itemColl.push(item.Title)
      })
      this.setState({allListItems:itemColl});
    })
  }

  private _onChange(event){
    event.preventDefault();
    this.setState({FormDescription: event.target.value});
    debugger;
    let extraction_result =
    keyword.extract(event.target.value,{
    //keyword_extractor.extract(sentence,{
        //language:"english",
        //remove_digits: true,
        //return_changed_case:false,
        //remove_duplicates: false
    });
    this.setState({allUserTypedColl:extraction_result}); 
    console.log(extraction_result);
    debugger;
  }

  getArraysIntersection(a1,a2){
    return  a1.filter(function(n) { return a2.indexOf(n) !== -1;});
  }

  getUserTypedColl(){
    //const sentence =
      //"President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."
    //  Extract the keywords
    let extraction_result =
    keyword.extract(this.state.FormDescription,{
    //keyword_extractor.extract(sentence,{
        //language:"english",
        //remove_digits: true,
        //return_changed_case:false,
        //remove_duplicates: false
    });
    this.setState({allUserTypedColl:extraction_result}); 
    console.log(extraction_result);
    debugger;
  }

  private onSelectedItem = (data: { key: string; name: string }[]) :void=>{  
    this.setState({selectedValues:data});  
  }

  private submitClicked = ():void => {  
    alert(JSON.stringify(this.state.selectedValues))   ;  
  }

  public sendQuery = ():void => {  
    //var intersectingColors=this.getArraysIntersection(this.state.allListItems, this.state.allUserTypedColl); //["red", "blue"]
    //this.getUserTypedColl();
    debugger;
    let allUser=this.state.allUserTypedColl;
    let allListItem:any=this.state.allListItems;
    //var array3 = allListItem.filter(function(obj) { return allUser.indexOf(obj) == -1; });
    var array3=allUser.filter(item1 => allListItem.find(item2 => item1 === item2))
    alert("Selected Keywords are : "+JSON.stringify(array3))
    debugger;
  }

  

  public GetRequestDetails(){
    debugger;
    return new Promise<any[]>((resolve,reject)=>{
      let apiUrl = "https://rehman365.sharepoint.com/sites/ICICIUniverse20/_api/web/Lists/getbytitle('Autocomplete')/items";
      let httpClient: SPHttpClient = this.props.context.spHttpClient;  
         httpClient.get(apiUrl, SPHttpClient.configurations.v1).then(response => {
          debugger;
           response.json().then(responseJson => {
            debugger;
            resolve(responseJson.value);         
              },(error:any[])=>{
                  console.log(error);
                  reject('Error Occured');
              });
          })
      })
  }
  
  public render(): React.ReactElement<IAutocompleteProps> {

    
//alert(extraction_result);
//alert(JSON.stringify(extraction_result));

// {extraction_result.map(item=>{
// debugger
//   <p>{item}</p>
// })}

debugger;

console.log(this.state)

    return (  
      <div className={ styles.autocomplete }> 
      <h2>Let's get your query solved.</h2>
      <Label> Post your product or process related queries here.</Label>
      <Label>A subject matter expert will attend your query soon.</Label><br/>
        <Label> Product Category</Label>
        {/* %7B194c0f55-8c8b-40bb-a513-1483611f0cf5%7D */}
        <ListItemPicker listId='194c0f55-8c8b-40bb-a513-1483611f0cf5'  
          columnInternalName='Title'  
          keyColumnInternalName='Id'  
          itemLimit={1}  
          onSelectedItem={this.onSelectedItem}  
          context={this.props.context}   
          suggestionsHeaderText = "Please select product"  
          />

          <TextField
              label="Describe Your Query"
              id="txtDescription"
              required={false}
              multiline={true}
              value={this.state.FormDescription}
              name='FormDescription'
              onChange={this._onChange}
              />  

          
        <br></br> 
        {/* <PrimaryButton text="Submit" onClick={this.submitClicked}  /> */}
        <PrimaryButton text="Send Query" onClick={this.sendQuery}  />
      </div>  
    );  
  }
}