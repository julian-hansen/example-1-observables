import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Client } from '../class/Client';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
private clientSelector$ = new BehaviorSubject(new Client())
private subjectClientSelector$ = new Subject<Client>()

  constructor() { }

  getClientSelector() : Observable<Client> {
    return this.clientSelector$.asObservable();
  }
  
  getSubjectClientSelector() : Observable<Client> {
    return this.subjectClientSelector$.asObservable()
  }

  setClient(client: Client) {
    this.clientSelector$.next(client)
    this.subjectClientSelector$.next(client)
  }
}
