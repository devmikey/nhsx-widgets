import { Component, Prop } from '@stencil/core';


@Component({
  tag: 'nhsx-eol',
  styleUrl: 'nhsx-eol.scss',
  shadow: true
})
export class NhsxEol {
   /*
    test url = 
    https://data.developer.nhs.uk/ccri-fhir/STU3/QuestionnaireResponse?patient=1184&questionnaire=https%3A%2F%2Ffhir.nhs.uk%2FSTU3%2FQuestionnaire%2FCareConnect-EOLC-1&_include=*&_count=100&_format=application/json+fhir
    nhs = 9658220142
    kewn
  */

   @Prop() questionnaire: any;
   sections: Array<string> = ['CPR','ATP','PREF','PRO','DOC','LPA','FUN','DIS','CON','EOL'];

   items: Array<any> = new Array();
   
   toggleState: object = {};
   hideLinkId: boolean = true;

  componentWillLoad() {
    this.buildItems();
  }

  componentWillUpdate() {
    this.buildItems();
  }



   /* helper functions */

   buildItems(){
    /* build up list in correct order */
    if (this.items.length>0) return;
    if (this.sections == null) return;
    if (this.questionnaire == null) return;

      for (var u=0;u<this.sections.length;u++) {
        for (var i=0;i<this.questionnaire.entry[0].resource.item.length;i++) {
          var linkId = this.questionnaire.entry[0].resource.item[i].linkId;
          /* add any undefined link sections to the end*/
          if (!this.sections.includes(linkId)) {
            this.sections.push(linkId);
          }  
          if (this.sections[u]==this.questionnaire.entry[0].resource.item[i].linkId) {     
             this.items.push(this.questionnaire.entry[0].resource.item[i])
             this.toggleState[this.sections[u]]="inactive"; 
          }
        }
      }

   }

   getEntry(resourceType, id){
    let entry = this.questionnaire.entry.filter(o => (o.resource.resourceType == resourceType) && (o.resource.id == id));
    if (entry.length == 1 ) {
        return entry[0]
    }
    else return null;
  }

  getAnswer(answer){
   if (answer.valueString) {
      return answer.valueString;
    }
    if (answer.valueReference) {
      return this.ReferenceTable(answer.valueReference.reference);
    }

    if (answer.valueDateTime) {
      return this.getDate(answer.valueDateTime);
    }

    if (answer.valueCoding) {
      return answer.valueCoding.display;
    }

    if (answer.valueInteger) {
      return answer.valueInteger;
    }
    return "";
  }

  classType(answer){
    if (answer.valueString) {
      return "valueString"
    }
    if (answer.valueReference) {
      return "valueReference"
    }

    if (answer.valueDateTime) {
      return "valueDateTime"
    }

    if (answer.valueCoding) {
      return "valueCoding"
    }

    if (answer.valueInteger) {
      return "valueInteger"
    }
    return "";
  }


  getLinkId(item){
    if (this.hideLinkId) return item.text + ": "
    else return item.text+" ("+item.linkId+")";
  }

  getDate(tDate){
    if (tDate == undefined) return '';
    let year = tDate.substring(0, 4);
    let month = tDate.substring(5, 7);
    let day = tDate.substring(8, 10);
    return day+"/"+month+"/"+year;
  }

   /* rendering functions*/

  Observation(resource){
    return(
      <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Date</th>
            <th class="nhsuk-table__header">Observation</th>
            <th class="nhsuk-table__header">Status</th>
            <th class="nhsuk-table__header">Value</th>
          </tr>
          </thead>
          <tbody>
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{this.getDate(resource.effectiveDateTime)}</td>
              <td class="nhsuk-table__cell">{resource.code.coding[0].display}</td>
              <td class="nhsuk-table__cell">{resource.status}</td>
              <td class="nhsuk-table__cell">{resource.valueQuantity.value}</td>
            </tr>
          </tbody>
      </table>
    )
  }

  Consent(resource){
    return(
      <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Date</th>
            <th class="nhsuk-table__header">Purpose</th>
            <th class="nhsuk-table__header">Actors</th>
            <th class="nhsuk-table__header">Status</th>
          </tr>
          </thead>
          <tbody>
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{this.getDate(resource.dateTime)}</td>
              <td class="nhsuk-table__cell">{resource.purpose[0].display}</td>
              <td class="nhsuk-table__cell">{resource.actor[0].reference.display}</td>
              <td class="nhsuk-table__cell">{resource.status}</td>
            </tr>
          </tbody>
      </table>
    )
  }

  ClinicalImpression(resource){
    return(
     <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Date</th>
            <th class="nhsuk-table__header">Prognosis</th>
          </tr>
          </thead>
          <tbody>
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{this.getDate(resource.date)}</td>
              <td class="nhsuk-table__cell">{resource.prognosisCodeableConcept[0].coding[0].display}</td>
            </tr>
          </tbody>
      </table>
    )
  }

  Procedure(resource){
    return(
      <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Procedure</th>
            <th class="nhsuk-table__header">Status</th>
            <th class="nhsuk-table__header">Performed</th>
          </tr>
          </thead>
          <tbody>
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{resource.code.coding[0].display}</td>
              <td class="nhsuk-table__cell">{resource.status}</td>
              <td class="nhsuk-table__cell"></td>
            </tr>         
          </tbody>
      </table>
    )
  }

  CarePlan(resource){
    return(
      <div class="CarePlan">
        <table class="nhsuk-table">
          <thead class="nhsuk-table__head">
            <tr class="nhsuk-table__row">
              <th class="nhsuk-table__header">Category</th>
              <th class="nhsuk-table__header">Status</th>
              <th class="nhsuk-table__header">Intent</th>
              <th class="nhsuk-table__header">Start</th>
              <th class="nhsuk-table__header">End</th>
            </tr>
            </thead>
            <tbody>
              <tr class="nhsuk-table__row">
                <td class="nhsuk-table__cell">{resource.category[0].coding[0].display}</td>
                <td class="nhsuk-table__cell">{resource.status}</td>
                <td class="nhsuk-table__cell">{resource.intent}</td>
                <td class="nhsuk-table__cell">{resource.period? this.getDate(resource.period.start):''}</td>
                <td class="nhsuk-table__cell">{resource.period? this.getDate(resource.period.end):''}</td>
              </tr>         
            </tbody>
        </table>
        {this.CarePlanDetail(resource)}
      </div>
    )
  }

  CarePlanDetail(resource){

    return (
      <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Activity</th>
            <th class="nhsuk-table__header">Description</th>
            <th class="nhsuk-table__header">Status</th>
          </tr>
          </thead>
          <tbody>
            {resource.activity ? resource.activity.map((activity) =>
              <tr class="nhsuk-table__row">    
                <td>{activity.detail.code ? activity.detail.code.coding[0].display:''}</td>
                
                <td>{activity.detail.description ? activity.detail.description:''}</td>
                <td>{activity.detail.status ? activity.detail.status:''}</td>
              </tr>
            ):''}         
          </tbody>
      </table> 
    )
  }

  Condition(resource){
    return(
     <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Onset</th>
            <th class="nhsuk-table__header">Condition</th>
            <th class="nhsuk-table__header">Cinical Status</th>
            <th class="nhsuk-table__header">Asserted</th>
          </tr>
          </thead>
          <tbody>
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{this.getDate(resource.onsetDateTime)}</td>
              <td class="nhsuk-table__cell">{resource.code.coding[0].display}</td>
              <td class="nhsuk-table__cell">{resource.clinicalStatus}</td>
              <td class="nhsuk-table__cell">{resource.asserter? resource.asserter.display:''}</td>
            </tr>          
          </tbody>
      </table>
    )
  }

  Flag(resource){
    return(
      <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Flag</th>
            <th class="nhsuk-table__header">Status</th>
            <th class="nhsuk-table__header">Start</th>
            <th class="nhsuk-table__header">End</th>
          </tr>
          </thead>
          <tbody class="nhsuk-table__body">
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{resource.code.coding[0].display}</td>
              <td class="nhsuk-table__cell">{resource.status}</td>
              <td class="nhsuk-table__cell">{resource.period? this.getDate(resource.period.start):''}</td>
              <td class="nhsuk-table__cell">{resource.period? this.getDate(resource.period.end):''}</td>
            </tr>
          </tbody>
      </table>
    )
  }


  RelatedPerson(resource){
    return(
     <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Person</th>
            <th class="nhsuk-table__header">Relationship</th>
            <th class="nhsuk-table__header">DOB</th>
            <th class="nhsuk-table__header">Contact</th>
          </tr>
          </thead>
          <tbody class="nhsuk-table__body">
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{resource.name[0].family +', ' +resource.name[0].given + ' ('+resource.name[0].prefix[0]+')' }</td>
              <td class="nhsuk-table__cell">{resource.relationship.coding[0].display}</td>
              <td class="nhsuk-table__cell"></td>
              <td class="nhsuk-table__cell"></td>
            </tr>
          </tbody>
      </table>
    )
  }

  Practitioner(resource){
    return(
      <table class="nhsuk-table">
        <thead class="nhsuk-table__head">
          <tr class="nhsuk-table__row">
            <th class="nhsuk-table__header">Practitioner</th>
            <th class="nhsuk-table__header">Identifier</th>
            <th class="nhsuk-table__header">Contact</th>
          </tr>
          </thead>
          <tbody class="nhsuk-table__body">
            <tr class="nhsuk-table__row">
              <td class="nhsuk-table__cell">{resource.name[0].family +', ' +resource.name[0].given + ' ('+resource.name[0].prefix[0]+')' }</td>
              <td class="nhsuk-table__cell">{resource.identifier[0].value}</td>
              <td class="nhsuk-table__cell"></td>
            </tr>
          </tbody>
      </table>
    )
  }

  ReferenceTable(reference){
    // look up resource
    // need to split reference into the resource type and the id
    let refs = reference.split('/');
    let entry = this.getEntry(refs[0], refs[1]);
   
    if (entry == null) return "";

    if (entry.resource.resourceType=="Flag") return this.Flag(entry.resource)
    else if (entry.resource.resourceType=="Observation") return this.Observation(entry.resource)
    else if (entry.resource.resourceType=="Consent") return this.Consent(entry.resource)
    else if (entry.resource.resourceType=="ClinicalImpression") return this.ClinicalImpression(entry.resource)
    else if (entry.resource.resourceType=="Procedure") return this.Procedure(entry.resource)
    else if (entry.resource.resourceType=="Condition") return this.Condition(entry.resource)
    else if (entry.resource.resourceType=="CarePlan") return this.CarePlan(entry.resource)
    else if (entry.resource.resourceType=="RelatedPerson") return this.RelatedPerson(entry.resource)
    else if (entry.resource.resourceType=="Practitioner") return this.Practitioner(entry.resource)
    else return entry.resource.resourceType;
   
  }

  QuestionnaireItemAnswer(item){
    return(
      <div class="answer">       
        <span class="eol-linkId">{item.linkId ? this.getLinkId(item):''}</span> 
        {item.answer ? item.answer.map((answer) =>
          <span class={this.classType(answer)}>
            {this.getAnswer(answer)}
          </span>
        ):''}
      </div>
    )
  }

Heading(item){
 return (
  <div class="question-text">
     {item.linkId&&item.item ? <div class="question-text-missing">Missing Header - {" (" + item.linkId+")"}</div>:''} 
     {item.answer ? this.QuestionnaireItemAnswer(item): ''}
  </div>
 )
}
  
QuestionnaireItem(items){

    return(
        <div class="question">
          {items.map((item) =>
            <div class="question-item">
              {item.linkId&&item.item ? this.Heading(item):''} 
              {item.answer ? this.QuestionnaireItemAnswer(item): this.QuestionnaireItem(item.item)}
            </div>
          )}
        </div>
    )
  }

  QuestionnaireSections(items){
    return(
        <div class="questionnaire-sections">
          {items.map((item) =>
            <details open class="nhsuk-details">
              <summary class="nhsuk-details__summary">
                  <span class="nhsuk-details__summary-text"> {item.text}</span>
               </summary>
              <div class="nhsuk-details__text">
                {item.item ? this.QuestionnaireItem(item.item):''}
                {item.linkId&&item.answer ? this.Heading(item):''}
              </div>
            </details>
          )}
        </div>
    )
  }

  render() {
   
    if (this.sections==undefined) return;
    if (this.questionnaire==undefined) return;

    return (
      <div>{this.QuestionnaireSections(this.items)}</div>
    )

  }


}