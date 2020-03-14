import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, combineAll } from 'rxjs/operators';
import { AgGridAngular } from 'ag-grid-angular';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any[] = [];
  private gridApi;
  private gridColumnApi;
  @ViewChild('agGrid', { static: false }) agGrid: AgGridAngular;

  columnDefs = [
    {headerName: 'ID', field: 'id',resizable: true,width:400,rowDrag: true  },
    {headerName: 'Rule Name', field: 'ruleName', resizable: true,width:400},
    {headerName: 'clone', field: 'isClone',width:200, resizable: true}
];
  enableBtns: boolean;
  selectedData: any;
  selectedIndex: number;
  upButtonDisabled = false;
  downButtonDisabled = false;
  showLoader =false;
  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.getData();
  }

  getData() {
    this.showLoader = true
   // const data = localStorage.getItem('listData');
    // if (data) {
    //   this.data = JSON.parse(data);
    //   return;
    // }
    this.http.get('http://jivoxdevuploads.s3.amazonaws.com/eam-dev/files/44939/Rule%20JSON.json').pipe(
      catchError(e => {
        this.showLoader = false
        alert('something went wrong!')
        return e;
      }),
      tap(response => {
        this.showLoader = false
        if (response && response['data']) {
          // const resData = JSON.stringify(response['data']);
          // localStorage.setItem('listData', resData);
          this.data = response['data']
        }
      })
    ).subscribe();
  }

  
  deleteRow() {
    if(this.checkSelected()) {
      this.gridApi.updateRowData({ remove: [this.selectedData[0].data] });
      alert('row deleted successfully');
      this.enableBtns = false;
    }
     
  }
  rowSelected(e){
    this.upButtonDisabled = this.downButtonDisabled =  false;
    this.selectedData = this.gridApi.getSelectedNodes();
    if(this.selectedData && this.selectedData.length){
      if(this.selectedData[0].rowIndex === 0) {
        this.upButtonDisabled = true;
      }
      if(this.selectedData[0].rowIndex === this.data.length -1) {
        this.downButtonDisabled = true;
      }
      this.enableBtns = true;
    }
  }
  onReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
  }
  clone(){
    if(this.checkSelected()) {
      const newObj = {...this.selectedData[0].data,isClone:true}
      this.gridApi.updateRowData({ add: [newObj],
      addIndex : this.selectedData[0].rowIndex + 1 });
    }
  }
  checkSelected(){
    if(!(this.selectedData && this.selectedData.length)) {
      alert('Select a row to perform this operation');
      return false;
    }
    return true;

  }
  moveInArray(arr, fromIndex, toIndex) {
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
  }

  moveUpDown(type) {
    if(this.checkSelected()) {
      if(type === 'down' && this.downButtonDisabled){
        return;
      }
      if(type === 'up' && this.upButtonDisabled){
        return;
      }
    
    const rowIndex = this.selectedData[0].rowIndex;
    const toIndex = type === 'down' ? rowIndex + 1 : rowIndex - 1;
   
       const newStore = this.data.slice();
        this.moveInArray(newStore, rowIndex, toIndex);
        this.data = newStore;
        this.gridApi.setRowData(newStore);
        this.selectedData = [];
        this.gridApi.clearFocusedCell();
    }
  }
  
}
