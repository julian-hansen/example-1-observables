import { Component, Input, OnInit } from '@angular/core';
import { Client } from 'src/app/class/Client';

@Component({
  selector: 'app-client-view',
  templateUrl: './client-view.component.html',
  styleUrls: ['./client-view.component.scss']
})
export class ClientViewComponent implements OnInit {
@Input() client:Client | null = null
@Input() title = ''
  constructor() { }

  ngOnInit(): void {
  }

}
