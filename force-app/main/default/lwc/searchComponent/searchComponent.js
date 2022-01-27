import { LightningElement, api, track } from 'lwc';
const DELAY = 300;
export default class SearchComponent extends LightningElement {

    @api labely = 'Currency';
    @api iconName = 'standard:currency';
    @api labelName;
    @api placeholder = 'Search';
    @api 
    get values() {
        return this.scopedValues;
    }
    set values(value) {
        var v = JSON.parse(value);
        console.log(v.values);
        this.scopedValues = v.values;
    }
    @api searchFields = ['value'];
    @api displayFields = ['value']; // only up to 3 values

    @track error;

    scopedValues;
    searchTerm;
    delayTimeout;

    searchRecords;
    hasRecords = false;
    selectedRecord;
    objectLabel;
    isLoading = false;

    field;
    field1;
    field2;

    ICON_URL = '/apexpages/slds/latest/assets/icons/{0}-sprite/svg/symbols.svg#{1}';

    connectedCallback(){
        
        let icons           = this.iconName.split(':');
        this.ICON_URL       = this.ICON_URL.replace('{0}',icons[0]);
        this.ICON_URL       = this.ICON_URL.replace('{1}',icons[1]);
        this.objectLabel = this.labely;
        let fieldList = this.displayFields;
        
        if(fieldList.length > 1){
            this.field  = fieldList[0].trim();
            this.field1 = fieldList[1].trim();
        }
        if(fieldList.length > 2){
            this.field2 = fieldList[2].trim();
        }
        
    }

    handleInputChange(event){
        window.clearTimeout(this.delayTimeout);
        const searchKey = event.target.value;
        //this.isLoading = true;
        this.delayTimeout = setTimeout(() => {
            if(searchKey.length >= 1){

                this.searchRecords = this.scopedValues.filter(item => {
                    //check all searchable fields
                    for(const field of this.searchFields) {
                        if(item[field].toLowerCase().includes(searchKey.toLowerCase())) {
                            return true;
                        }
                    }
                    //return false if nothing left the function yet
                    return false;
                }).map(item => {
                    var ret = item;
                    ret.FIELD1 = item[this.field];
                    ret.FIELD2 = item[this.field1];
                    if(this.field2) {
                        ret.FIELD3 = item[this.field2];
                    } else {
                        ret.FIELD3 = '';
                    }
                    return ret;
                });
                this.hasRecords = this.searchRecords.length > 0;
            }
        }, DELAY);
    }

    handleSelect(event){
        
        let recordId = event.currentTarget.dataset.recordId;
        
        let selectRecord = this.searchRecords.find((item) => {
            return item.Id == recordId;
        });
        this.selectedRecord = selectRecord;
        
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                data : {
                    record          : selectRecord,
                    recordId        : recordId,
                    deleting : false
                }
            }
        });
        this.dispatchEvent(selectedEvent);
    }

    handleClose(){
        var deletingRecord = this.selectedRecord;
        var recId = this.selectedRecord.Id;
        this.hasRecords = false;
        const selectedEvent = new CustomEvent('lookup', {
            bubbles    : true,
            composed   : true,
            cancelable : true,
            detail: {  
                data : {
                    record : deletingRecord,
                    recordId : recId,
                    deleting: true
                }
            }
        });
        this.dispatchEvent(selectedEvent);
        this.selectedRecord = undefined;
        this.searchRecords  = undefined;
    }

    titleCase(string) {
        var sentence = string.toLowerCase().split(" ");
        for(var i = 0; i< sentence.length; i++){
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence;
    }
}