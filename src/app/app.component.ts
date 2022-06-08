import {Component, OnDestroy, OnInit} from '@angular/core';
import { interval, Observable, ObservedValueOf, of, Subject, Subscription } from 'rxjs';
import { ClientService } from './services/client.service';
import { concatMap, delay, map, mergeMap, switchMap, take, takeUntil} from 'rxjs/operators'
import { Client } from './class/Client';
import { FormControl, FormGroup } from '@angular/forms';

const data = [
  {color: 'Blue', msg: 'You selected blue as your favourite colour'},
  {color: 'Red' , msg: 'Do you really like red that much'},
  {color: 'Green', msg: 'The colour of trees, nice!'},
  {color: 'White', msg : 'White are you talking about?'}
]

const getMessage = (colour:string) : Observable<string | null> => {
  const result = data.find(item => item.color == colour)

  if (result) {
    return of(result.msg)
  }

  return of(null)
}

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
  public message$: Observable<string | null> = of(null)
  public otherMessage: string | null = ''

  public name: string = ''
  public email = ''
  public options = ["Red", "Blue", "Green", "White"];
  
  public showMe = false
  public sub: Subscription | null = null
  
  public fg = new FormGroup({
    options: new FormControl(''),
    firstname: new FormControl('')
  });

  constructor(private svc: ClientService) {}

  get optionsCtrl() : FormControl {
    return this.fg.get('options') as FormControl
  }

  get nametrl() : FormControl {
    return this.fg.get('firstname') as FormControl
  }

  ngOnInit(): void {

    this.nametrl.patchValue('Matthew')

    this.client$ = this.svc.getClientSelector()
    this.subClient$ = this.svc.getSubjectClientSelector()
    //this.sub = this.svc.getClientSelector().subscribe(client => console.log({client}))
    
    this.sub = this.svc.getClientSelector()
    .subscribe((client:Client) => this.subscribedClient = client)

    const source = of(2000, 1000);
    // map value from source into inner observable, when complete emit result and move to next
    const example = source.pipe(
      concatMap(val => of(`Delayed by: ${val}ms`).pipe(delay(val)))
    );
    //output: With concatMap: Delayed by: 2000ms, With concatMap: Delayed by: 1000ms
    const subscribe = example.subscribe(val =>
      console.log(`With concatMap: ${val}`)
    );
    
    /*the non-switchmap way */
    this.optionsCtrl.valueChanges
    .pipe (
      takeUntil(this.destroy$)
    ).subscribe(val => {
      getMessage(val)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe(val => this.otherMessage = val)
    })

    /* Using switchmap */
    this.message$ = this.optionsCtrl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      switchMap(val => getMessage(val))
    )
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
