import {Component, OnDestroy, OnInit} from '@angular/core';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { ClientService } from './services/client.service';
import { map, takeUntil} from 'rxjs/operators'
import { Client } from './class/Client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy{
  public destroy$: Subject<boolean> = new Subject()
  public client$: Observable<Client> = of(new Client())
  public subClient$: Observable<Client> = of(new Client())
  public subscribedClient : Client | null = new Client()
  public name: string = ''
  public email: string = ''
  public showMe = false
  public sub: Subscription | null = null
  
  constructor(private svc: ClientService) {}

  ngOnInit(): void {
    this.client$ = this.svc.getClientSelector()
    this.subClient$ = this.svc.getSubjectClientSelector()
  
    //this.sub = this.svc.getClientSelector().subscribe(client => console.log({client}))
    
    this.sub = this.svc.getClientSelector()
    .subscribe((client:Client) => this.subscribedClient = client)

  }

  killSub() {
    if (this.sub){
      this.sub.unsubscribe()
      this.subscribedClient = null
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
    this.destroy$.complete()
  }

  updateClient() {
    this.svc.setClient({name: this.name, email: this.email})
  }
}
