import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { IPageInfo } from 'ngx-virtual-scroller';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  data: any[] = [];

  constructor(private http: HttpClient) {
  }
  ngOnInit() {
    this.getData();
    console.log('saleem', this.data);
  }

  getData() {
    const data = localStorage.getItem('listData');
    if (data) {
      this.data = JSON.parse(data);
      return;
    }
    // console.log('data', data);
    this.http.get('http://jivoxdevuploads.s3.amazonaws.com/eam-dev/files/44939/Rule%20JSON.json').pipe(
      catchError(e => {
        return e;
      }),
      tap(response => {
        if (response && response['data']) {
          const resData = JSON.stringify(response['data']);
          localStorage.setItem('listData', data);
        }
      })
    ).subscribe();
  }

  fetchMore(event: IPageInfo) {
    console.log(event)
    if (event.endIndex === this.data.length - 1) {
      console.log('hello');
    }
  }
  trackByFn(index, item) {
    return index; // or item.id
  }
  moveUp(e, i) {
    console.log(i)
  }
  clone(item, i) {
    this.data.unshift(item)
  }
}
