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
  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.getData();
  }

  getData() {
    const data = localStorage.getItem('listData');
    if (data) {
      this.data = JSON.parse(data);
      return;
    }
    this.http.get('http://jivoxdevuploads.s3.amazonaws.com/eam-dev/files/44939/Rule%20JSON.json').pipe(
      catchError(e => {
        return e;
      }),
      tap(response => {
        if (response && response['data']) {
          const resData = JSON.stringify(response['data']);
          localStorage.setItem('listData', resData);
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
    this.selectedData = this.gridApi.getSelectedNodes();
    if(this.selectedData){
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
}
