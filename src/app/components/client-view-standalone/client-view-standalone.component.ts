import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Client } from 'src/app/class/Client';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-client-view-standalone',
  templateUrl: './client-view-standalone.component.html',
  styleUrls: ['./client-view-standalone.component.scss']
})
export class ClientViewStandaloneComponent implements OnInit, OnDestroy {
@Input() title = ''
  public client:Client = new Client()
  private destroy$: Subject<boolean> = new Subject<boolean>()
  constructor(private svc: ClientService) { }

  ngOnInit(): void {
    console.log('Creating component')
    this.svc.getClientSelector()
    .pipe(
      map((client:Client) => new Client(client.name.toUpperCase() + '_suffix',client.email)),
      takeUntil(this.destroy$)
    )
    .subscribe(client => this.client = client)
  }

  ngOnDestroy(): void {
    console.log('Destroying component')
    this.destroy$.next(true)
    this.destroy$.complete()
  }
}
